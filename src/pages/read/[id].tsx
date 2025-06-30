import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from "@/server/trpc/routers/_app";
import { createInnerTRPCContext } from "@/server/trpc/trpc";
import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import HomeLayout from "@/components/layouts/HomeLayout";
import superjson from "superjson"
import { trpc } from "@/utils/trpc";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";
import { DateFormatter } from "@/utils/DateFormatter";
import Image from "next/image";

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking"
  }
}

export async function getStaticProps(context: GetStaticPropsContext<{ id: string }>) {
  const { params } = context

  if (!params) return { notFound: true }

  const id = params.id as string 

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null }),
    transformer: superjson
  })

  await helpers.post.getUserPostPublic.prefetch({ id })

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id
    },
    revalidate: 60
  }
}

const ReadPage: NextPageWithLayout<InferGetStaticPropsType<typeof getStaticProps>> = ({ id }) => {
  const { data: post } = trpc.post.getUserPostPublic.useQuery({ id })

  return (
    <div className="mt-16 flex justify-center">
      {post && (
        <div className="max-w-4xl flex flex-col">
          <div className="p-4 space-y-4">
            <h1 className="font-bold text-4xl">{post.title}</h1>
            <p className="text-sm">{post.description}</p>

            <div className="flex items-center gap-4">
              <Avatar className="size-15">
                <AvatarImage src={post.user.imageUrl} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <h1 className="font-bold text-sm">By {post.user.firstName}</h1>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-4" />
                  {DateFormatter(post.updatedAt)}
                </span>
              </div>
            </div>

            {
              post.imageUrl && (
                <div className="w-full h-[20rem] relative">
                  <Image src={post.imageUrl} alt="Image" fill priority className="object-cover rounded" />
                </div> 
              )
            } 

            <div dangerouslySetInnerHTML={{__html: post.content}} className="max-w-none prose dark:prose-invert dark:text-white tiptap" />
          </div>
        </div>
      )}

    </div>
  )
}

ReadPage.getLayout = (page: ReactElement) => { return <HomeLayout>{page}</HomeLayout> }
export default ReadPage
