import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DateFormatter } from "@/utils/DateFormatter"
import { trpc } from "@/utils/trpc"
import { skipToken } from "@tanstack/react-query"
import { Calendar, Earth, EarthLock, Pencil } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { toast } from "sonner"

const PreviewPage = () => {
  const router = useRouter()
  const { id } = router.query

  const postId = typeof id === "string" ? id : Array.isArray(id) ? id[0] : null

  const { data: responsePost } = trpc.post.getUserPost.useQuery(postId ? { id: postId } : skipToken)
  const { mutate: updatePostStatus } = trpc.post.updatePostStatus.useMutation({
    onSuccess: () => {
      toast("Successfully Update Status Post")
      router.reload()
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
      {responsePost && (
        <div className="max-w-4xl flex flex-col">
          <div className="p-4 space-y-4">
            <h1 className="font-bold text-4xl">{responsePost.title}</h1>
            <p className="text-sm">{responsePost.description}</p>

            <div className="flex items-center gap-4">
              <Avatar className="size-15">
                <AvatarImage src="" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <h1 className="font-bold text-sm">By {responsePost.user.firstName}</h1>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-4" />
                  {DateFormatter(responsePost.updatedAt)}
                </span>
              </div>
            </div>

            {
              responsePost.imageUrl && (
                <div className="w-full h-[20rem] relative">
                  <Image src={responsePost.imageUrl} alt="Image" fill priority className="object-cover rounded" />
                </div> 
              )
            } 

            <div dangerouslySetInnerHTML={{__html: responsePost.content}} className="max-w-none prose dark:prose-invert tiptap" />
          </div>
        </div>
      )}

      <div className="fixed right-10 bottom-10 flex flex-col gap-2">
        {
          responsePost && responsePost.status !== "PUBLISH" ? (
            <span onClick={handlePublishPostStatus} className="p-4 rounded-full bg-muted">
              <Earth size={16} className="text-green-500" /> 
            </span>
          ) : (
            <span onClick={handlePrivatePostStatus} className="p-4 rounded-full bg-muted">
              <EarthLock size={16} className="text-red-500" /> 
            </span>
          )
        } 
        <Link href={`/write/${postId}`} className="p-4 rounded-full bg-muted">
          <Pencil size={16} />
        </Link>
      </div> 
    </div>
  )
}

export default PreviewPage
