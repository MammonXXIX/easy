import { protectedProcedure, router } from '../trpc'

export const postRouter = router({
  getPosts: protectedProcedure 
    .query(async ({ ctx }) => {
      const { prisma } = ctx

      const posts = await prisma.post.findMany()

      return posts
    })
})
