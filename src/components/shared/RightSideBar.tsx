import { trpc } from "@/utils/trpc"
import { Badge } from "../ui/badge"
import { DateFormatter } from "@/utils/DateFormatter"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import Link from "next/link"

type PostCardProps = {
  id: string
  title: string
  createdAt: string
  firstName: string
  imageUrl: string
}

const PostCard = ({ id, title, createdAt, firstName, imageUrl }: PostCardProps) => {
  return (
    <Link href={`/`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={imageUrl} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">By {firstName}</span> 
        </div> 
        <h1 className="font-bold text-sm line-clamp-1">{title}</h1>
        <span className="text-sm text-muted-foreground">{DateFormatter(createdAt)}</span>
      </div> 
    </Link>
  )
}

const RightSideBar = ({ children }: { children: React.ReactNode }) => {
  const { data: responseTopic } = trpc.topic.getTopics.useQuery()
  const { data: responseEasyPicksPosts } = trpc.post.getEasyPicksPosts.useQuery()

  return (
    <div className="w-8xl h-screen p-4 flex items-center">
      <div className="h-full px-16 py-4 flex-1 overflow-y-auto">
        {children}
      </div>
      <div className="w-96 h-full p-4 border-l-2 overflow-y-auto space-y-4 hidden lg:block">

        <div className="flex flex-col gap-3">
          <h1 className="font-medium">Easy Picks</h1>
          <div className="flex flex-col gap-2">
            {
              responseEasyPicksPosts && responseEasyPicksPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  id={post.id} 
                  title={post.title} 
                  createdAt={post.createdAt} 
                  firstName={post.user.firstName} 
                  imageUrl={post.user.imageUrl} 
                />
              ))
            }
          </div>
          <Link href={``} className="text-xs text-muted-foreground hover:underline">See The Full List</Link>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="font-medium">Recommended Topics</h1>
          <div className="flex flex-wrap gap-2">
            { 
              responseTopic && responseTopic.map((topic) => (
                <Badge key={topic.id} className="p-2">
                  {topic.name}
                </Badge>
              )) 
            }
          </div>
          <Link href={``} className="text-xs text-muted-foreground hover:underline">See More Topics</Link>
        </div> 

      </div> 
    </div>
  )
}

export default RightSideBar
