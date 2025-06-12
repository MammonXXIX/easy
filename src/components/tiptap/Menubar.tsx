import { Editor } from '@tiptap/react';
import { BoldIcon, ItalicIcon, StrikethroughIcon } from 'lucide-react';
import { Toggle } from '../ui/toggle';



const Menubar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return

  const OPTIONS = [
    {
      icon: <BoldIcon />,
      onClick: () => () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold")
    },
    {
      icon: <ItalicIcon />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
    },
    {
      icon: <StrikethroughIcon />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
    },
  ]

  return (
    <div>
      {OPTIONS.map((option, index) => (
        <Toggle key={index} pressed={option.pressed} onPressedChange={option.onClick}>
          {option.icon}
        </Toggle>
      ))}
    </div>
  )
}

export default Menubar
