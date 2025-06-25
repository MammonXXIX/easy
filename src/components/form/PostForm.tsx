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
  const form = useFormContext<PostFormSchema>()

  const { id } = router.query
  const postId = typeof id === "string" ? id : Array.isArray(id) ? id[0] : null

  const trpcUtils = trpc.useUtils()

  const { data: responseGetTopics } = trpc.topic.getTopics.useQuery()
  const { mutate: deleteTopicOnPost } = trpc.topic.deleteTopicOnPost.useMutation({
    onSuccess: async () => {
      await trpcUtils.topic.getTopicOnPost.invalidate()
    }
  })
  const { mutateAsync: createSupabaseSignedUploadUrl } = trpc.post.createSupabaseSignedUploadUrl.useMutation() 
  
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

  const handleDeleteTopicOnPost = (topicId: string) => {
    if (!postId || !topicId) return

    deleteTopicOnPost({ postId, topicId })
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
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                {
                  currentTopics && currentTopics.map((topic) => (
                    <Badge key={topic}>
                      {responseGetTopics && responseGetTopics.find((t) => t.id === topic)?.name}
                      <span onClick={() => handleDeleteTopicOnPost(topic)} className="p-1">
                        <X size={16} />
                      </span>
                    </Badge> 
                  ))
                }
              </div>
              <FormItem> 
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" role="combobox" className="justify-between">
                        Select Topic
                        <ChevronsUpDown />
                      </Button>
                    </FormControl> 
                  </PopoverTrigger>
                  <PopoverContent className="p-0 max-w-4xl w-screen">
                    <Command>
                      <CommandInput placeholder="Search Topic At Least 3 Characters" />
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
                                  const newTopics = isTopicsExists ? currentTopics.filter((id) => id !== topic.id) : [...currentTopics, topic.id]
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
                <FormMessage />
              </FormItem>
            </div>
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
                className="border-2 border-muted focus-visible:ring-0" 
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
                className="border-2 border-muted focus-visible:ring-0" 
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
