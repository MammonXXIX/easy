import { Book, ChartColumnBig, Library, LogOut, Sparkle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useClerk } from "@clerk/nextjs"
import { trpc } from "@/utils/trpc"
import Link from "next/link"

export const ProfileButton = () => {
  const { signOut } = useClerk()

  const { data: responseUser } = trpc.user.getUser.useQuery()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          {responseUser && <AvatarImage src={responseUser.imageUrl} />}
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64"> 
        <DropdownMenuItem><Library /> Library</DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/stories">
            <Book /> Stories
          </Link> 
        </DropdownMenuItem>
        <DropdownMenuItem><ChartColumnBig /> Stats</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Refine Recommendations</DropdownMenuItem>
        <DropdownMenuItem>Manage Publications</DropdownMenuItem>
        <DropdownMenuItem>Help</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Become Easy Member <Sparkle className="text-blue-500" /></DropdownMenuItem>
        <DropdownMenuItem>Create Mastodon Account</DropdownMenuItem>
        <DropdownMenuItem>Apply For Author Verification</DropdownMenuItem>
        <DropdownMenuItem>Apply To The Partner Program</DropdownMenuItem>
        <DropdownMenuItem>Gift Membership</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ redirectUrl: "/authentication/sign-in" })}>
          <LogOut /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

