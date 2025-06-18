import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PostFormSchema } from "@/forms/post"
import { Check, ChevronsUpDown, ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import Tiptap from "../tiptap/Tiptap"
import { Textarea } from "../ui/textarea"
import { trpc } from "@/utils/trpc"
import { createSupabaseUploadToSignedUrl } from "@/lib/supabase/client"
import { Bucket } from "@/server/supabase/bucket"
import { useRouter } from "next/router"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { Badge } from "../ui/badge"

type PostFormProps = {
  imageUrl: string
  setImageUrl: (value: string) => void
}

const PostForm = ({ imageUrl, setImageUrl }: PostFormProps) => {
  const router = useRouter() 

  const { id } = router.query
  const postId = typeof id === "string" ? id : Array.isArray(id) ? id[0] : null

  const form = useFormContext<PostFormSchema>()

  const { mutateAsync: createSupabaseSignedUploadUrl } = trpc.post.createSupabaseSignedUploadUrl.useMutation()
  const { data: responseGetTopics } = trpc.post.getTopics.useQuery()
  
  const handleImageOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (files && files.length > 0) {
      const file = files[0]

      if (!file) return
      if (!postId) return

      const { path, token } = await createSupabaseSignedUploadUrl({ id: postId, bucket: Bucket.PostImages })
      const res = await createSupabaseUploadToSignedUrl({ path, token, file, bucket: Bucket.PostImages })

      setImageUrl(res)
      console.log("Uploaded Successfully")
    }
  } 

  return (
    <form className="space-y-4">
      <div className="w-full h-64 flex justify-center items-center">
        <Input id="image" type="file" onChange={handleImageOnChange} className="hidden"/>
        <Label htmlFor="image" className="w-full h-full relative">
          {
            imageUrl ? (
              <Image src={imageUrl} alt="Image" fill priority className="object-cover rounded" /> 
            ) : (
              <div className="w-full h-full flex flex-col justify-center items-center border-4 border-dashed border-muted-foreground">
                <ImageIcon size={64} className="text-muted-foreground"/>
                <h1 className="font-semibold text-muted-foreground">Click To Upload Image</h1>
                <p className="text-sm text-gray-500">Max Size: 5MB • JPG, PNG</p>
              </div>
            )
          }
        </Label>
      </div>

      <FormField
        control={form.control}
        name="topics"
        render={({ field }) => {
          const currentTopics = field.value || []

          return (
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    <div className="space-x-1">
                      {
                        currentTopics.length > 0 ? (
                          currentTopics.map((topic) => (
                            <Badge key={topic}>
                              {responseGetTopics && responseGetTopics.find((t) => t.id === topic)?.name}
                              <X onClick={() => console.log(topic)}/>
                            </Badge>
                          ))
                        ) : (
                          <span>Select Topic</span>
                        )
                      }
                    </div> 
                    <ChevronsUpDown />
                  </Button>
                </FormControl> 
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search Topic" />
                  <CommandList>
                    <CommandEmpty>No Topic Found.</CommandEmpty>
                    <CommandGroup>
                      {
                        responseGetTopics && responseGetTopics.map((topic) => (
                          <CommandItem 
                            key={topic.id} 
                            value={topic.name} 
                            onSelect={() => {
                              const isTopicsExists = currentTopics.includes(topic.id)
                              const newTopics = isTopicsExists
                                ? currentTopics.filter((id) => id !== topic.id)
                                : [...currentTopics, topic.id]

                              form.setValue("topics", newTopics)
                            }}
                          >
                            {topic.name}
                            {currentTopics.includes(topic.id) && <Check className="ml-auto" />}
                          </CommandItem>
                        ))
                      }
                    </CommandGroup>
                  </CommandList>              
                </Command>
              </PopoverContent>
            </Popover>
          )
        }}
      />

      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Your Title Here..." 
                className="h-[5rem] border-none focus-visible:ring-0 resize-none" 
              /> 
            </FormControl>
            <FormMessage />
          </FormItem> 
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Your Description Here..." 
                className="h-[8rem] border-none focus-visible:ring-0 resize-none" 
              />
            </FormControl>
            <FormMessage />
          </FormItem> 
        )} 
      />
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Tiptap value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem> 
        )}
      />
    </form>
  )
}

export default PostForm
