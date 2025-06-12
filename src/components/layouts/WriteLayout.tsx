import { Book, Library, LogOut, Search, SquarePen } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../ui/button"
import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/router"
import { Badge } from "../ui/badge"

const ProfileButton = () => {
  const { signOut } = useClerk()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
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

const WriteLayout = ({ children }: {children: React.ReactNode}) => {
  const router = useRouter()

  return (
    <div className="w-screen">
      <div className="px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <h1 className="text-4xl">EASY</h1>
          <Badge>Draft</Badge>
          <h1 className="text-sm text-muted-foreground">Saving...</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button size="sm" className="text-white bg-green-500" disabled>
            Publish
          </Button>
          <ProfileButton /> 
        </div> 
      </div> 
      {children}
    </div>
  )
}

export default WriteLayout

