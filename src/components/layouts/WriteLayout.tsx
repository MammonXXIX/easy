import { Book, Library, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../ui/button"
import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/router"
import { Badge } from "../ui/badge"
import Link from "next/link"
import { useSavingStore } from "@/stores/SavingStore"
import { useFormPostStore } from "@/stores/FormPostStore"

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

const WriteLayout = ({ children }: {children: React.ReactNode}) => {
  const router = useRouter()
  const { id } = router.query

  const postId = typeof id === "string" ? id : Array.isArray(id) ? id[0] : null

  const { isSaving } = useSavingStore()
  const { form } = useFormPostStore()

  const handlePreview = async () => {
    if (!form) return

    const isValid = await form.trigger()

    if (isValid) router.push(`/write/preview/${postId}`)
  }

  return (
    <div className="w-screen flex flex-col">
      <div className="px-4 py-2 fixed top-0 left-0 right-0 flex justify-between items-center bg-background z-50 shadow-lg shadow-white/10">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-2xl">EASY</Link>
          <Badge>Draft</Badge>
          <h1 className="text-sm text-muted-foreground">{isSaving && "Saving..."}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="link" size="sm" onClick={handlePreview}>Preview</Button> 
          <ProfileButton /> 
        </div> 
      </div>
      <div className="pt-15">
        {children}
      </div>
    </div>
  )
}

export default WriteLayout

