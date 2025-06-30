import { createTRPCNext } from "@trpc/next";
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from "../server/trpc/routers/_app"
import superjson from 'superjson';

function getBaseUrl() {
  if (typeof window !== "undefined") return ""
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  if (process.env.RENDER_INTERNAL_HOSTNAME)  return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({ 
  config() {
    return {
      links: [
        httpBatchLink({
          transformer: superjson,
          url: `${getBaseUrl()}/api/trpc`,
          async headers() {
            return {}
          }
        })
      ]
    }
  },
  ssr: false,
  transformer: superjson
})
