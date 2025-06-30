import { trpc } from "@/utils/trpc"
import { Badge } from "../ui/badge"
import { DateFormatter } from "@/utils/DateFormatter"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import Link from "next/link"

type PostCardProps = {
  id: string
  title: string
  createdAt: Date
  firstName: string
  imageUrl: string
}

const PostCard = ({ id, title, createdAt, firstName, imageUrl }: PostCardProps) => {
  return (
    <Link href={`/read/${id}`}>
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
  const { data: posts, isLoading: isLoadingPosts } = trpc.post.getRecommendedPosts.useQuery()
  const { data: topics, isLoading: isLoadingTopics } = trpc.topic.getTopics.useQuery() 

  return (
    <div className="w-full max-w-7xl h-screen m-auto pt-16 p-4 flex items-center">
      <div className="min-w-0 h-full px-4 py-4 flex-1 overflow-y-auto md:px-16">
        {children}
      </div>
      <div className="w-96 h-full p-4 border-l-2 overflow-y-auto space-y-4 hidden lg:block">

        {
          !isLoadingPosts && (
            <div className="flex flex-col gap-3">
              <h1 className="font-medium">Easy Picks</h1>
              <div className="flex flex-col gap-2">
              {
                posts && posts.map((post) => (
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
          )
        } 

        {
          !isLoadingTopics && (
            <div className="flex flex-col gap-3">
              <h1 className="font-medium">Recommended Topics</h1>
              <div className="flex flex-wrap gap-2">
              { 
                topics && topics.map((topic) => (
                  <Badge key={topic.id} className="p-2">
                    {topic.name}
                  </Badge>
                )) 
              }
            </div>
            <Link href={``} className="text-xs text-muted-foreground hover:underline">See More Topics</Link>
          </div> 
          )
        } 

      </div> 
    </div>
  )
}

export default RightSideBar
