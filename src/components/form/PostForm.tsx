import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PostFormSchema } from "@/forms/post"
import { ImageIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import Tiptap from "../tiptap/Tiptap"

type PostFormProps = {
  onSubmit: (values: PostFormSchema) => void
}

const PostForm = ({ onSubmit }: PostFormProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const form = useFormContext<PostFormSchema>()
  
  const handleImageOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const file = e.target.files[0]
    
    setImageUrl(URL.createObjectURL(file))
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="w-2xl h-64 flex justify-center items-center border-4 border-dashed border-muted-foreground">
        <Input id="image" type="file" onChange={handleImageOnChange} className="hidden"/>
        <Label htmlFor="image" className="w-full h-full relative">
          {
            !imageUrl ? (
              <div className="w-full h-full flex flex-col justify-center items-center">
                <ImageIcon size={64} className="text-muted-foreground"/>
                <h1 className="text-sm text-muted-foreground">Upload Here</h1>
              </div>
            ) : (
              <Image src={imageUrl} alt="Image Preview" fill className="object-cover" />
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
              <Input {...field} placeholder="Your Title Here..." />
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
              <Input {...field} placeholder="Your Description Here..." />
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
