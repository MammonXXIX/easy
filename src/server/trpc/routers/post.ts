import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'
import { TRPCError } from '@trpc/server'
import { supabaseClient } from '../../supabase/admin'
import { Bucket } from '@/server/supabase/bucket'
import { PostStatus } from '@prisma/client'
import { isOwner } from '../middlewares/isOwner'

export const postRouter = router({
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
          user: { select: { firstName: true } } 
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
        where: { status: input.status, userId: session.userId }
      })
    }),

  getUsersPosts: protectedProcedure.query(async ({ ctx }) => {
    const { prisma }  = ctx

    return await prisma.post.findMany({
      where: { status: "PUBLISH" },
      include: {
        user: { 
          select: { firstName: true, imageUrl: true } 
        }
      },
      orderBy: { createdAt: "asc" }
    })
  }),

  getEasyPicksPosts: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx

    return await prisma.post.findMany({
      where: { status: "PUBLISH" },
      include: {
        user: { 
          select: { firstName: true, imageUrl: true } 
        }
      },
      take: 3
    })
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
          }
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
      })
})
