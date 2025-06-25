import './Styles.css'

import { useEditor, EditorContent } from '@tiptap/react'
import Menubar from './Menubar'
import extensions from './TiptapConfig'
import { useEffect } from 'react'
import Bottombar from './Bottombar'

type TiptapProps = {
  value?: string
  onChange: (value: string) => void
}

const Tiptap = ({ value, onChange }: TiptapProps) => {
  const editor = useEditor({
    extensions: extensions,
    content: value,
    editorProps: {
      attributes: {
        class: "p-8"
      }
    },
    onUpdate({ editor }) {
      const html = editor.getHTML()
      onChange(html)
    },
    immediatelyRender: false
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value ?? "Your Content Here...");
    }
  }, [value, editor]);

  return (
    <div className="max-h-[40rem] flex flex-col border-2 border-muted rounded-xl bg-primary-foreground">
      <Menubar editor={editor} />
      <EditorContent editor={editor} className="overflow-y-auto tiptap" />
      <Bottombar editor={editor} />
    </div>
  )
}

export default Tiptap
