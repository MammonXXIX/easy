import { z } from "zod";
import { middleware } from "../trpc";
import { TRPCError } from "@trpc/server";

const inputSchema = z.object({ id: z.string() })

export const isOwner = middleware( async ({ ctx, next, getRawInput }) => {
  const { session, prisma } = ctx

  const rawInput = await getRawInput()
  const input = inputSchema.safeParse(rawInput)
  
  if (!input.success) throw new TRPCError({ code: "BAD_REQUEST", message: "Missing Post Id" })

  const { id } = input.data
  const post = await prisma.post.findUnique({ where: { id: id } })

  if (!post) throw new TRPCError({ code: "NOT_FOUND", message: "Post Not Found" })
  if (post.userId !== session.userId) throw new TRPCError({ code: "FORBIDDEN", message: "Access Denied" })

  return next({
    ctx: { ...ctx }
  })
})
