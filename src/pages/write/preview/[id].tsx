import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { DateFormatter } from "@/utils/DateFormatter"
import { trpc } from "@/utils/trpc"
import { skipToken } from "@tanstack/react-query"
import { Calendar, Earth, EarthLock, Home, Pencil } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { toast } from "sonner"

const PreviewPage = () => {
  const router = useRouter()
  const { id } = router.query

  const postId = typeof id === "string" ? id : Array.isArray(id) ? id[0] : null

  const trpcUtils = trpc.useUtils()

  const { data: post } = trpc.post.getUserPost.useQuery(postId ? { id: postId } : skipToken)
  const { mutate: updatePostStatus } = trpc.post.updatePostStatus.useMutation({
    onSuccess: async () => {
      toast("Successfully Update Status Post")
      await trpcUtils.post.getUserPost.invalidate()
    }
  })

  const handlePublishPostStatus = () => {
    if (!postId) return
    updatePostStatus({ id: postId, isToPublish: true })
  }

  const handlePrivatePostStatus = () => {
    if (!postId) return
    updatePostStatus({ id: postId, isToPrivate: true })
  } 

  return (
    <div className="flex justify-center">
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

      <div className="fixed left-5 top-5 flex">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={`/`} className="p-4 rounded-full bg-muted">
              <Home size={16} />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Home</TooltipContent>
        </Tooltip> 
      </div>

      <div className="fixed right-5 bottom-5 flex flex-col gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
          {
            post?.status !== "PUBLISH" ? (
              <span onClick={handlePublishPostStatus} className="p-4 rounded-full bg-muted">
                <Earth size={16} className="text-green-500" /> 
              </span>
            ) : (
              <span onClick={handlePrivatePostStatus} className="p-4 rounded-full bg-muted">
                <EarthLock size={16} className="text-red-500" /> 
              </span>
            )
          }
          </TooltipTrigger>
          <TooltipContent>{post?.status !== "PUBLISH" ? "Publish Post" : "Private Post"}</TooltipContent>
        </Tooltip> 
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={`/write/${postId}`} className="p-4 rounded-full bg-muted">
              <Pencil size={16} />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip> 
      </div> 
    </div>
  )
}

export default PreviewPage
