import { Search } from "lucide-react"
import { Button } from "../ui/button"
import { useRouter } from "next/router"
import { trpc } from "@/utils/trpc"
import Link from "next/link"
import { ProfileButton } from "../shared/ProfileButton"

const SearchButton = () => {
  return (
    <div className="w-[20rem] px-4 py-2 flex items-center gap-x-4 rounded-xl bg-muted">
      <Search />
      <h1 className="text-sm">Search</h1>
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
          {/** <SearchButton />**/}
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

