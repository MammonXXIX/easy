import { Book, Library, SquarePen, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../ui/button"

const ButtonProfile = () => {
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
        <DropdownMenuItem><User/> Profile</DropdownMenuItem>
        <DropdownMenuItem><Library /> Library</DropdownMenuItem>
        <DropdownMenuItem><Book /> Stories</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const HomeLayout = ({ children }: {children: React.ReactNode}) => {
  return (
    <div className="w-screen">
      <div className="px-4 py-2 flex justify-between items-center">
        <h1 className="text-4xl">EASY</h1>
        <div className="flex items-center space-x-4">
          <Button variant={"ghost"}><SquarePen /> Write</Button>
          <ButtonProfile /> 
        </div> 
      </div> 
      {children}
    </div>
  )
}

export default HomeLayout

