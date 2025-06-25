import { getAuth } from "@clerk/nextjs/server"
import { initTRPC, TRPCError } from "@trpc/server"
import { prisma } from "./prisma"
import { CreateNextContextOptions } from "@trpc/server/adapters/next"

interface CreateContextOptions {
  session: ReturnType<typeof getAuth>
}

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return { session: opts.session, prisma }
}

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req } = opts

  const session = getAuth(req)

  return createInnerTRPCContext({ session })
}

const t = initTRPC.context<typeof createTRPCContext>().create()

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(async ({ctx, next}) => {
  if (!ctx.session.userId) throw new TRPCError({ code: "UNAUTHORIZED" })

  return next({
    ctx: { session: {...ctx.session} }
  })
})
export const middleware = t.middleware

