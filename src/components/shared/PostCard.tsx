type PostCardProps = {
  user?: {
    firstName: string
    imageUrl: string
  }
  id: string
  title?: string
  description?: string
  imageUrl?: string
}

export const PostCard = ({ user, id, title, description, imageUrl }: PostCardProps) => {
  return (
    <div className="flex flex-col">
      {
        user && <div>
          
        </div>
      }
      {
        title && imageUrl
      }
    </div>
  )
}
