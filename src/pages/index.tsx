import { NextPageWithLayout } from "./_app";
import { ReactElement } from "react";
import HomeLayout from "@/components/layouts/HomeLayout";
import RightSideBar from "@/components/shared/RightSideBar";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { trpc } from "@/utils/trpc";
import Image from "next/image";
import { DateFormatter } from "@/utils/DateFormatter";

type PostCardProps = {
  id: string,
  title: string,
  description: string,
  postImageUrl: string,
  createdAt: string,
  firstName: string,
  userImageUrl: string,
}

const PostCard = ({ id, title, description, postImageUrl, createdAt, firstName, userImageUrl }: PostCardProps) => {
  return (
    <Link href={`/`} className="py-4 border-b-2">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={userImageUrl} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">By {firstName}</span> 
        </div>
        <div className="flex gap-8">
          <div className="flex flex-1 flex-col justify-between gap-2">
            <div>
              <h1 className="font-bold text-xl line-clamp-1">{title}</h1>
              <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">{DateFormatter(createdAt)}</span>
            </div> 
          </div>
          {
            postImageUrl && (
              <div className="relative w-32 h-32 flex">
                <Image src={postImageUrl} alt="Image Preview" fill className="rounded object-cover" />
              </div>
            ) 
          }
        </div> 
      </div>
    </Link>
  )
}

const HomePage: NextPageWithLayout = () => {
  const { data: responseUsersPosts } = trpc.post.getUsersPosts.useQuery()

  return (
    <RightSideBar>
      <div className="flex flex-col gap-4">
        {
          responseUsersPosts && responseUsersPosts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              description={post.description}
              postImageUrl={post.imageUrl}
              createdAt={post.createdAt}
              firstName={post.user.firstName}
              userImageUrl={post.user.imageUrl}
            />
          ))
        } 
      </div>
    </RightSideBar>
  )
}


HomePage.getLayout = (page: ReactElement) => { return <HomeLayout>{page}</HomeLayout> }
export default HomePage

