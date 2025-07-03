import { ReactElement } from "react"
import { NextPageWithLayout } from "../_app"
import HomeLayout from "@/components/layouts/HomeLayout"
import RightSideBar from "@/components/shared/RightSideBar"
import { Button } from "@/components/ui/button"
import InfiniteScrollContainer from "@/components/containers/InfiniteScrollContainer"
import { trpc } from "@/utils/trpc"
import { Spinner } from "@/components/ui/spinner"
import { PostCard } from "@/components/shared/PostCard"

const LibraryPage: NextPageWithLayout = () => {
  const trpcUtils = trpc.useUtils()
  
  const { data, isLoading, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.post.getSavedPosts.useInfiniteQuery({}, { getNextPageParam: (lastPage) => lastPage.nextCursor })

  const { mutate: updateSavePost } = trpc.post.updateSavedPost.useMutation({
    onMutate: async ({ id }) => {
      await trpcUtils.post.getSavedPosts.cancel()

      const prevData = trpcUtils.post.getSavedPosts.getInfiniteData()

      trpcUtils.post.getSavedPosts.setInfiniteData({}, (oldData) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.filter((post) => post.id !== id)
          }))
        }
      })

      return { prevData }
    },
    onError: (_err, _variables, context) => {
      if (context?.prevData) {
        trpcUtils.post.getSavedPosts.setInfiniteData({}, context.prevData)
      }
    },
    onSettled: () => {
      trpcUtils.post.getSavedPosts.invalidate()
    },
  }) 

  return (
    <RightSideBar>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl">Your Library</h1>
        <Button onClick={() => {}}>New List</Button>
      </div>
      <div className="mt-4 py-2 flex gap-6 border-b-1">        
        <span className="cursor-pointer">Your Lists</span> 
      </div>
      <div className="mt-8 flex flex-col gap-4">
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
                isSaved={true}
                onToggle={updateSavePost}
              />
            ))
          } 
        </InfiniteScrollContainer>
        { isFetchingNextPage && <Spinner /> }
      </div>
    </RightSideBar>
  )
}

LibraryPage.getLayout = (page: ReactElement) => { return <HomeLayout>{page}</HomeLayout> }
export default LibraryPage
