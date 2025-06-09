import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx

    const users = await prisma.user.findMany()

    return users
  }) 
})
