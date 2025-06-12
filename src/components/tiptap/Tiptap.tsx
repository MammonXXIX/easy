import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Menubar from './Menubar'

type TiptapProps = {
  value?: string
  onChange: (value: string) => void
}

const Tiptap = ({ value, onChange }: TiptapProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value ?? "Your Content Here..."
  })

  return (
    <div>
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default Tiptap
