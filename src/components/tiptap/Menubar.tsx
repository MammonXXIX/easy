import { Editor } from '@tiptap/react';
import { AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon, BoldIcon, Code, Heading1Icon, Heading2Icon, Heading3Icon, ImageIcon, ItalicIcon, List, ListOrdered, RedoIcon, StrikethroughIcon, UndoIcon } from 'lucide-react';
import { Toggle } from '../ui/toggle';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useRouter } from 'next/router';
import { trpc } from '@/utils/trpc';
import { Bucket } from '@/server/supabase/bucket';
import { createSupabaseUploadToSignedUrl } from '@/lib/supabase/client';

const Menubar = ({ editor }: { editor: Editor | null }) => {
  const router = useRouter()
  const { id } = router.query

  const postId = typeof id === "string" ? id : Array.isArray(id) ? id[0] : null

  const { mutateAsync: createSupabaseSignedUploadUrl } = trpc.post.createSupabaseSignedUploadUrl.useMutation()

  if (!editor) return 

  const handleImageOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (files && files.length > 0) {
      const file = files[0]

      if (!file) return
      if (!postId) return
      
      const { path, token } = await createSupabaseSignedUploadUrl({ id: postId, bucket: Bucket.PostContentImages, isContentImage: true })
      const res = await createSupabaseUploadToSignedUrl({ path, token, file, bucket: Bucket.PostContentImages })
      
      editor.chain().focus().setImage({ src: res }).run()
      console.log("Uploaded Successfully")
    } 
  }
  
  return (
    <div className="flex border-b-2 border-muted">
      <Toggle pressed={false} onPressedChange={() => editor.chain().focus().undo().run()}>
        <UndoIcon />
      </Toggle>
      <Toggle pressed={false} onPressedChange={() => editor.chain().focus().redo().run()}>
        <RedoIcon />
      </Toggle>

      <div className='w-2 border-l-2' />

      <Toggle pressed={editor.isActive("heading", { level: 1 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        <Heading1Icon />
      </Toggle>
      <Toggle pressed={editor.isActive("heading", { level: 2 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2Icon />
      </Toggle>
      <Toggle pressed={editor.isActive("heading", { level: 3 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3Icon />
      </Toggle>

      <div className='w-2 border-l-2' />

      <Toggle pressed={editor.isActive("bold")} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
        <BoldIcon />
      </Toggle>
      <Toggle pressed={editor.isActive("italic")} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
        <ItalicIcon />
      </Toggle>
      <Toggle pressed={editor.isActive("strike")} onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
        <StrikethroughIcon />
      </Toggle>

      <div className='w-2 border-l-2' />

      <Toggle pressed={editor.isActive({ textAlign: "left" })} onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}>
        <AlignLeftIcon />
      </Toggle>
      <Toggle pressed={editor.isActive({ textAlign: "center" })} onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}>
        <AlignCenterIcon />
      </Toggle>
      <Toggle pressed={editor.isActive({ textAlign: "right" })} onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}>
        <AlignRightIcon />
      </Toggle>
      <Toggle pressed={editor.isActive({ textAlign: "justify" })} onPressedChange={() => editor.chain().focus().setTextAlign("justify").run()}>
        <AlignJustifyIcon />
      </Toggle>

      <div className='w-2 border-l-2' />

      <Toggle pressed={editor.isActive("bulletList")} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
        <List />
      </Toggle>
      <Toggle pressed={editor.isActive("orderedList")} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered />
      </Toggle>

      <div className='w-2 border-l-2' />

      <Toggle pressed={editor.isActive("codeBlock")} onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}>
        <Code />
      </Toggle>

      

      <Toggle pressed={false}>
        <Input id="imageTiptap" type="file" onChange={handleImageOnChange} className='hidden' />
        <Label htmlFor="imageTiptap"><ImageIcon /></Label>
      </Toggle>
    </div>
  )
}

export default Menubar
