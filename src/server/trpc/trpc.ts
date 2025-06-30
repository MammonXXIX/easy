import { getAuth } from "@clerk/nextjs/server"
import { initTRPC, TRPCError } from "@trpc/server"
import { prisma } from "./prisma"
import { CreateNextContextOptions } from "@trpc/server/adapters/next"
import superjson from "superjson";

interface CreateContextOptions {
  session: ReturnType<typeof getAuth> | null
}

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return { session: opts.session, prisma }
}

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req } = opts

  const session = getAuth(req)

  return createInnerTRPCContext({ session })
}

const t = initTRPC.context<typeof createTRPCContext>().create({ transformer: superjson })

export const router = t.router
export const createCallerFactory = t.createCallerFactory
 
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(async ({ctx, next}) => {
  if (!ctx.session || !ctx.session.userId) throw new TRPCError({ code: "UNAUTHORIZED" })

  return next({
    ctx: { session: {...ctx.session} }
  })
})
export const middleware = t.middleware

