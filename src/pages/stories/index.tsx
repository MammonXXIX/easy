import { ReactElement, useState } from "react"
import { NextPageWithLayout } from "../_app"
import HomeLayout from "@/components/layouts/HomeLayout"
import { Button } from "@/components/ui/button"
import { trpc } from "@/utils/trpc"
import Link from "next/link"
import { DateFormatter } from "@/utils/DateFormatter"
import { EllipsisVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { PostStatus } from "@prisma/client"
import { cn } from "@/lib/utils"
import { CapitalizedString } from "@/utils/StringFormatter"
import RightSideBar from "@/components/shared/RightSideBar"
import { useRouter } from "next/router"

type PostCardProps = {
  id: string
  title?: string
  updatedAt: Date
}

const PostCard = ({ id, title, updatedAt }: PostCardProps) => {
  const trpcUtils = trpc.useUtils()

  const { mutate: deletePost } = trpc.post.deletePost.useMutation({
    onSuccess: async () => {
      await trpcUtils.post.getUserPosts.invalidate()
      toast("Delete Successfully")
    }
  })
  
  return (
    <div className="relative pb-4 border-b-1 space-y-2">
       <Link href={`/write/${id}`}>
        {
          title ? <h1 className="w-128 font-bold line-clamp-1">{title}</h1> : <h1 className="font-bold">Untitled</h1>
        }
        <p className="text-xs text-muted-foreground">Last Edited {DateFormatter(updatedAt)}</p> 
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger className="absolute top-0 right-0"><EllipsisVertical size={16} /></DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link href={`/write/${id}`}>Edit Post</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-500" onClick={() => deletePost({id})}>Delete Post</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

const StoriesPage: NextPageWithLayout = () => {
  const router = useRouter() 
  const [selectedStatus, setSelectedStatus] = useState<PostStatus>("DRAFT")

  const { mutate: createPost } = trpc.post.createPost.useMutation({
    onSuccess: async (data) => {
      router.push(`/write/${data.id}`)
    }
  })
  const { data: posts, isLoading: isLoadingPosts } = trpc.post.getUserPosts.useQuery({ status: selectedStatus })

  return (
    <RightSideBar>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl">Your Stories</h1>
        <Button onClick={() => createPost()}>Write Story</Button>
      </div>
      <div className="mt-4 py-2 flex gap-6 border-b-1">
        {
          (["DRAFT", "PUBLISH", "PRIVATE"] as PostStatus[]).map((status) => (
            <span
              key={status} 
              onClick={() => setSelectedStatus(status)}
              className={cn("cursor-pointer", selectedStatus === status ? "text-primary" : "text-muted-foreground hover:text-primary")}
            >
              {CapitalizedString(status)}
            </span>
          ))
        }
      </div>
      <div className="mt-8 flex flex-col gap-4">
        { isLoadingPosts && <span>Loading...</span> }
        {
          posts && posts.map((post) => (
            <PostCard key={post.id} id={post.id} title={post.title} updatedAt={post.updatedAt} />
          )) 
        }
        { posts && posts.length === 0 && <span>No {CapitalizedString(selectedStatus)} Post Found.</span> }
      </div>
    </RightSideBar>
  )
}


StoriesPage.getLayout = (page: ReactElement) => { return <HomeLayout>{page}</HomeLayout> }
export default StoriesPage
