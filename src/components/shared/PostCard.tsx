import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import Link from "next/link"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { Bookmark, CircleMinus, Ellipsis } from "lucide-react"
import { DateFormatter } from "@/utils/DateFormatter"

type PostCardProps = {
  id: string,
  title: string,
  description: string,
  postImageUrl: string,
  createdAt: Date,
  firstName: string,
  userImageUrl: string,
  isSaved: boolean,
  onToggle: (input: { id: string }) => void
}

export const PostCard = ({ id, title, description, postImageUrl, createdAt, firstName, userImageUrl, isSaved, onToggle }: PostCardProps) => {  
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
                <span onClick={() => onToggle({ id })}>
                  {
                    isSaved
                      ? <Bookmark size={20} fill="#00B76F" strokeWidth={0} />
                      : <Bookmark size={20} />
                  }
                </span>
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
