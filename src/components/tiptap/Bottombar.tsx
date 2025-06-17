import { Editor } from '@tiptap/react';

const Bottombar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return

  return (
    <div className="p-2 flex gap-4 border-t-2 border-muted text-sm text-muted-foreground">
      <p>Words: {editor.storage.characterCount.words()}</p>
      <p>Characters: {editor.storage.characterCount.characters()}</p>
    </div>
  )
}

export default Bottombar
