import { ThemeProvider } from "@/providers/ThemeProvider";
import "@/styles/globals.css";
import { trpc } from "@/utils/trpc";
import { ClerkProvider } from "@clerk/nextjs";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { Poppins } from 'next/font/google';
import { ReactElement, ReactNode } from "react";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "500", "700"] })

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
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <div className={`${poppins.className}`}>
          {getLayout(<Component {...pageProps} />)}
        </div>
      </ThemeProvider>
    </ClerkProvider>
  )
}

export default trpc.withTRPC(App)
