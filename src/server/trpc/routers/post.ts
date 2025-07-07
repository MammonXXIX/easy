import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'
import { TRPCError } from '@trpc/server'
import { supabaseClient } from '../../supabase/admin'
import { Bucket } from '@/server/supabase/bucket'
import { PostStatus } from '@prisma/client'
import { isOwner } from '../middlewares/isOwner'

export const postRouter = router({
  getUserPostPublic: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const { session, prisma } = ctx

      const post = await prisma.post.findUnique({
        where: { id: input.id, status: "PUBLISH" },
        include: {
          user: { 
            select: { firstName: true, imageUrl: true } 
          } 
        } 
      })

      if (!post) throw new TRPCError({ code: "NOT_FOUND" })

      const savedPost = await prisma.savedPost.findUnique({
        where: { userId_postId: { userId: session.userId, postId: post.id  } }
      })

      const enrichedPost = { ...post, isSaved: !!savedPost } 

      return enrichedPost
    }), 

  getUserPost: protectedProcedure
    .use(isOwner)
    .input(
      z.object({
        id: z.string()
      }) 
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx

      const post = await prisma.post.findUnique({
        where: { id: input.id },
        include: {
          user: { 
            select: { firstName: true, imageUrl: true } 
          } 
        } 
      }) 

      return post
    }),

  getUserPosts: protectedProcedure
    .input(
      z.object({
        status: z.nativeEnum(PostStatus)
      })
    )
    .query(async ({ ctx, input }) => {
      const { session, prisma } = ctx 

      return await prisma.post.findMany({
        where: { status: input.status, userId: session.userId },
        orderBy: { updatedAt: "desc" }
      })
    }),

  getUsersPosts: protectedProcedure
    .input(
      z.object({
        cursor: z.string().optional(),
        limit: z.number().min(4).max(32).optional().default(8) 
      })
    )
    .query(async ({ ctx, input }) => {
      const { session, prisma }  = ctx

      const posts = await prisma.post.findMany({
        where: { status: "PUBLISH" },
        include: { user: { select: { firstName: true, imageUrl: true } } },
        orderBy: { updatedAt: "desc" },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined
      })

      const postIds = posts.map((post) => post.id)
      const savedPosts = await prisma.savedPost.findMany({
        where: {userId: session.userId, postId: { in: postIds }}
      })
      const savedPostIds = new Set(savedPosts.map((savedPost) => savedPost.postId))

      const enrichedPosts = posts.map((post) => ({ ...post, isSaved: savedPostIds.has(post.id) }))

      const nextCursor = posts.length > input.limit ? posts[input.limit].id : undefined

      return {
        posts: enrichedPosts.slice(0, input.limit),
        nextCursor
      }
    }),

  getRecommendedPosts: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx

    return await prisma.post.findMany({
      where: { status: "PUBLISH" },
      include: {
        user: { 
          select: { firstName: true, imageUrl: true } 
        }
      },
      orderBy: { view: "desc" },
      take: 3
    })
  }),

  searchPosts: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        limit: z.number().min(4).max(32).optional().default(4)
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx

      const posts = await prisma.post.findMany({
        where: {
          title: { 
            contains: input.search || "",
            mode: "insensitive"
          }
        },
        include: {
          user: { 
            select: { firstName: true, imageUrl: true } 
          }
        },
        take: input.limit
      })

      const topics = await prisma.topic.findMany({
        where: {
          name: { 
            contains: input.search || "",
            mode: "insensitive"
          }
        },
        take: input.limit
      })

      const users = await prisma.user.findMany({
        where: {
          firstName: { 
            contains: input.search || "",
            mode: "insensitive"
          }
        },
        take: input.limit
      })

      return {
        posts,
        topics,
        users
      }
    }),

  createPost: protectedProcedure.mutation(async ({ ctx }) => {
    const { session, prisma } = ctx

    const newPost = await prisma.post.create({
      data: {
        title: "",
        description: "",
        content: "",
        view: 0,
        imageUrl: "",
        userId: session.userId
      }
    })

    return newPost
  }),

  createSupabaseSignedUploadUrl: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        bucket: z.nativeEnum(Bucket),
        isContentImage: z.boolean().optional()
      })
    )
    .mutation(async ({ input }) => {
      const uploadPath = input.isContentImage ? `${input.id}/${input.id}-${Date.now()}.jpeg` : `${input.id}-${Date.now()}.jpeg`

      const { data, error } = await supabaseClient.storage.from(input.bucket).createSignedUploadUrl(uploadPath)
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });

      return data;
    }),

  updatePost: protectedProcedure
    .use(isOwner)
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        content: z.string(),
        imageUrl: z.string(),
        topics: z.array(z.string()).optional()
      })
    )
    .mutation(async ({ ctx, input}) => {
      const { prisma } = ctx

      const updatePost = await prisma.post.update({
        where: { id: input.id},
        data: {
          title: input.title,
          description: input.description,
          content: input.content,
          imageUrl: input.imageUrl,
          topics: {
            deleteMany: {},
            create: (input.topics || []).map((topicId) => ({ topic: { connect: { id: topicId } } }))
          }, 
        }
      }) 

      return updatePost
    }),

    updatePostStatus: protectedProcedure
      .use(isOwner)
      .input(
        z.object({
          id: z.string(),
          isToDraft: z.boolean().optional(),
          isToPublish: z.boolean().optional(),
          isToPrivate: z.boolean().optional()
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { prisma } = ctx 

        let newStatus: PostStatus

        if (input.isToDraft) newStatus = PostStatus.DRAFT
        else if (input.isToPublish) newStatus = PostStatus.PUBLISH
        else if (input.isToPrivate) newStatus = PostStatus.PRIVATE
        else throw new TRPCError({ code: "BAD_REQUEST", message: "No Valid Status Update Provided" })

        await prisma.post.update({
          where: { id: input.id },
          data: { status: newStatus }
        })
      }),

    deletePost: protectedProcedure
      .use(isOwner)
      .input(
        z.object({
          id: z.string()
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { prisma } = ctx

        await prisma.post.delete({
          where: { id: input.id}
        })
      }), 

    getSavedPosts: protectedProcedure
      .input(
        z.object({
          cursor: z.object({
            userId: z.string(),
            postId: z.string()
          }).optional(),
          limit: z.number().min(4).max(32).optional().default(8) 
        })
      )
      .query(async ({ ctx, input }) => {
        const { session, prisma }  = ctx

        const posts = await prisma.savedPost.findMany({
          where: { userId: session.userId },
          include: { 
            post: {
              include: { 
                user: { select: { firstName: true, imageUrl: true } }
              }
            } 
          },
          take: input.limit + 1,
          cursor: input.cursor ? { userId_postId: input.cursor } : undefined
        }) 

        const nextCursor = posts.length > input.limit ? { userId: posts[input.limit].userId, postId: posts[input.limit].postId } : undefined

        return {
          posts: posts.slice(0, input.limit).map((savedPost) => ({ ...savedPost.post })),
          nextCursor
        }
      }),


    updateSavedPost: protectedProcedure
      .input(
        z.object({
          id: z.string()
        })
      )
      .mutation(async ({ ctx, input }) => {
        const {session, prisma} = ctx

        const isPostSaved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: { userId: session.userId, postId: input.id }
          }
        })

        if (isPostSaved) {
          return await prisma.savedPost.delete({
            where: {
              userId_postId: { userId: session.userId, postId: input.id }
            }
          })
        } else {
          return await prisma.savedPost.create({
            data: { userId: session.userId, postId: input.id }
          });
        }
      })
})
