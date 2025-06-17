import { Book, Library, LogOut, Search, SquarePen } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../ui/button"
import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/router"
import { trpc } from "@/utils/trpc"
import Link from "next/link"

const ProfileButton = () => {
  const { signOut } = useClerk()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem><Library /> Library</DropdownMenuItem>
        <DropdownMenuItem><Book /> Stories</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ redirectUrl: "/authentication/sign-in" })}>
          <LogOut /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

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
      if (!data) return
      router.push(`/write/${data.id}`)
    }
  })

  return (
    <div className="w-screen">
      <div className="px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link href="/">EASY</Link>
          <SearchButton />
        </div>
        <div className="flex items-center space-x-4">
          <Button variant={"ghost"} onClick={() => createPost()}><SquarePen /> Write</Button>
          <ProfileButton /> 
        </div> 
      </div> 
      {children}
    </div>
  )
}

export default HomeLayout

