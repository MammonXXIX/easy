import { NextPageWithLayout } from "./_app";
import { ReactElement } from "react";
import HomeLayout from "@/components/layouts/HomeLayout";
import RightSideBar from "@/components/shared/RightSideBar";
import { trpc } from "@/utils/trpc";
import { Spinner } from "@/components/ui/spinner";
import InfiniteScrollContainer from "@/components/containers/InfiniteScrollContainer";
import { PostCard } from "@/components/shared/PostCard";

const HomePage: NextPageWithLayout = () => {
  const trpcUtils = trpc.useUtils()

  const { data, isLoading, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.post.getUsersPosts.useInfiniteQuery({}, { getNextPageParam: (lastPage) => lastPage.nextCursor })  
 
  const { mutate: updateSavePost } = trpc.post.updateSavedPost.useMutation({
    onMutate: async ({ id }) => {
      await trpcUtils.post.getUsersPosts.cancel()

      const prevData = trpcUtils.post.getUsersPosts.getInfiniteData()

      trpcUtils.post.getUsersPosts.setInfiniteData({}, (oldData) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) => post.id === id ? { ...post, isSaved: !post.isSaved } : post)
          }))
        }
      })

      return { prevData }
    },
    onError: (_err, _variables, context) => {
      if (context?.prevData) {
        trpcUtils.post.getUsersPosts.setInfiniteData({}, context.prevData)
      }
    },
    onSettled: () => {
      trpcUtils.post.getUsersPosts.invalidate()
    },
  }) 

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
              onToggle={updateSavePost}
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

