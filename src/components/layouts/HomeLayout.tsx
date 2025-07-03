import { NotepadText, Search } from "lucide-react"
import { Button } from "../ui/button"
import { useRouter } from "next/router"
import { trpc } from "@/utils/trpc"
import Link from "next/link"
import { ProfileButton } from "../shared/ProfileButton"
import { useEffect, useState } from "react"
import { Input } from "../ui/input"
import { Spinner } from "../ui/spinner"
import { DateFormatter } from "@/utils/DateFormatter"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Separator } from "@radix-ui/react-dropdown-menu"

const SearchButton = () => {
  const [searchTerm, setSearchTerm] = useState("")

  const { data, refetch, isFetching } = trpc.post.searchPosts.useQuery({ search: searchTerm }, { enabled: false })

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (searchTerm) refetch() 
    }, 500)

    return () => clearTimeout(timeOut)
  }, [searchTerm])

  return (
    <div className="relative ">
      <div className="min-w-128 relative flex items-center">
        <Search className="w-4 h-4 absolute left-2 transform" />
        <Input 
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 border-2 border-muted focus-visible:ring-0" 
        />
      </div>

      {isFetching && (
        <div className="bg-primary-foreground absolute top-full right-0 left-0 z-50 mt-2 h-[20rem] rounded p-2 flex justify-center">
          <Spinner />
        </div>
      )}

      {
        data && (
          <div className="bg-primary-foreground absolute top-full right-0 left-0 z-50 mt-2 rounded p-4 flex flex-col gap-4">
            {
              data.posts.length >= 1 && (
                <div className="flex flex-col gap-4">
                  <h1 className="pb-2 border-b-2">Posts</h1>
                  {
                    data.posts.map((post) => (
                      <Link href={`/read/${post.id}`} key={post.id}>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage src={post.user.imageUrl} />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">By {post.user.firstName}</span> 
                          </div> 
                          <h1 className="font-bold text-sm line-clamp-2">{post.title}</h1> 
                        </div> 
                      </Link>
                    ))
                  }
                </div>
              )
            }
            {
              data.topics.length >= 1 && (
                <div className="flex flex-col gap-4">
                  <h1 className="pb-2 border-b-2">Topics</h1>
                    {
                      data.topics.map((topic) => (
                        <Link href={``} key={topic.id}>
                          <div className="flex gap-2">
                            <NotepadText />
                            <h1>{topic.name}</h1>
                          </div>
                        </Link>
                      ))
                    }
                </div>
              )
            }
            {
              data.users.length >= 1 && (
                <div className="flex flex-col gap-4">
                  <h1 className="pb-2 border-b-2">Users</h1>
                    {
                      data.users.map((user) => (
                        <Link href={``} key={user.id}>
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage src={user.imageUrl} />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <h1>{user.firstName}</h1>
                          </div>
                        </Link>
                      ))
                    }
                </div>
              )
            }
          </div>
        )
      }
    </div>
  )
}

const HomeLayout = ({ children }: {children: React.ReactNode}) => {
  const router = useRouter()

  const { mutate: createPost } = trpc.post.createPost.useMutation({
    onSuccess: async (data) => {
      router.push(`/write/${data.id}`)
    }
  })

  return (
    <div className="flex flex-col">
      <div className="px-4 py-2 fixed top-0 left-0 right-0 flex justify-between items-center bg-background z-50 shadow-lg shadow-white/10">
        <div className="flex items-center space-x-6">
          <Link href="/" className="font-bold text-3xl">EASY</Link>
          <SearchButton />
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="link" onClick={() => createPost()}>Write</Button>
          <ProfileButton /> 
        </div> 
      </div>
      <div>
        {children}
      </div> 
    </div>
  )
}

export default HomeLayout

