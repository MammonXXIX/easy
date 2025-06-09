import * as trpcNext from '@trpc/server/adapters/next';

import { appRouter } from "@/server/trpc/routers/_app"
import { createTRPCContext } from '@/server/trpc/trpc';

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext
})
