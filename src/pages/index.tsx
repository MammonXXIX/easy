import { NextPageWithLayout } from "./_app";
import { ReactElement, useState } from "react";
import HomeLayout from "@/components/layouts/HomeLayout";
import RightSideBar from "@/components/shared/RightSideBar";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { trpc } from "@/utils/trpc";
import Image from "next/image";
import { DateFormatter } from "@/utils/DateFormatter";
import { Bookmark, BookMarked, CircleMinus, Ellipsis } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/spinner";
import InfiniteScrollContainer from "@/components/containers/InfiniteScrollContainer";

type PostCardProps = {
  id: string,
  title: string,
  description: string,
  postImageUrl: string,
  createdAt: Date,
  firstName: string,
  userImageUrl: string,
  isSaved: boolean
}

const PostCard = ({ id, title, description, postImageUrl, createdAt, firstName, userImageUrl, isSaved }: PostCardProps) => {
  const [isPostSaved, setIsPostSaved] = useState(isSaved)

  const { mutate: updateSavePost } = trpc.post.updateSavedPost.useMutation({
    
  })

  const handleToggleSave = () => {
    setIsPostSaved((prev) => !prev)
    updateSavePost({ id, isSaved })
  }

  return (
    <div className="py-4 flex flex-col gap-2 border-b-2">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={userImageUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="text-sm text-muted-foreground">By {firstName}</span> 
      </div>
      <div className="flex flex-col gap-8">
        <Link href={`/read/${id}`}>
          <div className="max-h-[8rem] flex justify-between gap-2">
            <div>
              <h1 className="font-bold text-xl line-clamp-2">{title}</h1>
              <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
            </div>
            {
              postImageUrl && (
                <div className="relative min-w-40 min-h-30 flex">
                  <Image src={postImageUrl} alt="Image Preview" fill className="rounded object-cover" />
                </div>
              ) 
            }
          </div>
        </Link> 
        <div className="flex justify-between items-center">
          <div className="flex gap-4 text-muted-foreground">
            <span className="text-sm text-muted-foreground">{DateFormatter(createdAt)}</span>             
          </div> 
          <div className="flex gap-4 text-muted-foreground">
            <Tooltip>
              <TooltipTrigger>
                <span><CircleMinus size={20} /></span>
              </TooltipTrigger>
              <TooltipContent>Show Less Like This</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                { 
                  isPostSaved 
                    ? <span onClick={handleToggleSave} className=""><Bookmark size={20} fill="#00B76F" strokeWidth={0} /></span> 
                    : <span onClick={handleToggleSave}><Bookmark size={20} /></span> 
                } 
              </TooltipTrigger>
              <TooltipContent>Book Mark</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <span><Ellipsis size={20} /></span>
              </TooltipTrigger>
              <TooltipContent>More</TooltipContent>
            </Tooltip>             
          </div> 
        </div> 
      </div> 
    </div>
  )
}

const HomePage: NextPageWithLayout = () => {
  const { data, isLoading, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.post.getUsersPosts.useInfiniteQuery({}, { getNextPageParam: (lastPage) => lastPage.nextCursor })  

  return (
    <RightSideBar>
      { isLoading && <Spinner /> }
      <InfiniteScrollContainer
        onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
        classname="flex flex-col gap-4"
      >
        {
          data && data.pages && data.pages.flatMap((page) => page.posts).map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              description={post.description}
              postImageUrl={post.imageUrl}
              createdAt={post.createdAt}
              firstName={post.user.firstName}
              userImageUrl={post.user.imageUrl}
              isSaved={post.isSaved}
            />
          ))
        } 
      </InfiniteScrollContainer>
      { isFetchingNextPage && <Spinner /> }
    </RightSideBar>
  )
}


HomePage.getLayout = (page: ReactElement) => { return <HomeLayout>{page}</HomeLayout> }
export default HomePage

