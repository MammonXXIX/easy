import { ThemeProvider } from "@/providers/ThemeProvider";
import "@/styles/globals.css";
import { trpc } from "@/utils/trpc";
import { ClerkProvider } from "@clerk/nextjs";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ['latin'] })

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}
 
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <ClerkProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <div className={`${geist.className}`}>
          {getLayout(<Component {...pageProps} />)}
        </div>
      </ThemeProvider>
    </ClerkProvider>
  )
}

export default trpc.withTRPC(App)
