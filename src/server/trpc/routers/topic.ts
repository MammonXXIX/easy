import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

export const topicRouter = router({
  getTopics: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx

    const topics = await prisma.topic.findMany()

    return topics
  }),

  getTopicOnPost: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx

      const topicOnPost = await prisma.topicOnPosts.findMany({
        where: { postId: input.id }
      })

      return topicOnPost
    }),

  deleteTopicOnPost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        topicId: z.string()
      })
    )
    .mutation(async ({ ctx, input}) => {
      const { prisma } = ctx

      return await prisma.topicOnPosts.delete({
        where: {
          postId_topicId: { postId: input.postId, topicId: input.topicId }
        } 
      }) 
    })
})
