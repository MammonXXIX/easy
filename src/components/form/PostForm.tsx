import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PostFormSchema } from "@/forms/post"
import { ImageIcon } from "lucide-react"
import Image from "next/image"
import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import Tiptap from "../tiptap/Tiptap"
import { Textarea } from "../ui/textarea"
import { trpc } from "@/utils/trpc"
import { createSupabaseUploadToSignedUrl } from "@/lib/supabase/client"
import { Bucket } from "@/server/supabase/bucket"
import { useRouter } from "next/router"

type PostFormProps = {
  imageUrl: string
  setImageUrl: (value: string) => void
  onSubmit: (values: PostFormSchema) => void
}

const PostForm = ({ imageUrl, setImageUrl, onSubmit }: PostFormProps) => {
  const router = useRouter()
  const { id } = router.query

  const postId = typeof id === "string" ? id : Array.isArray(id) ? id[0] : null

  const form = useFormContext<PostFormSchema>()

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

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <p className="text-sm text-gray-500">Max size: 5MB • JPG, PNG</p>
              </div>
            )
          }
        </Label>
      </div>
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
