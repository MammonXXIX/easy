import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'
import { TRPCError } from '@trpc/server'
import { supabaseClient } from '../../supabase/admin'
import { Bucket } from '@/server/supabase/bucket'

export const postRouter = router({
  getPost: protectedProcedure
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
            select: { firstName: true }
          }
        } 
      })

      return post
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
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        content: z.string(),
        imageUrl: z.string()
      }) 
    )
    .mutation(async ({ ctx, input}) => {
      const { session, prisma } = ctx

      const updatePost = await prisma.post.update({
        where: { id: input.id, userId: session.userId},
        data: {
          title: input.title,
          description: input.description,
          content: input.content,
          imageUrl: input.imageUrl
        }
      })

      return updatePost
    })
})
