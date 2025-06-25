import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const { session, prisma } = ctx

    return await prisma.user.findUnique({
      where: { id: session.userId }
    })
  }) 
})
