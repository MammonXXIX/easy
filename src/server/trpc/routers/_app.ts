import { createCallerFactory, router } from "../trpc";
import { postRouter } from "./post";
import { topicRouter } from "./topic";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  post: postRouter,
  topic: topicRouter
})

export type AppRouter = typeof appRouter
export const createCaller = createCallerFactory(appRouter)
