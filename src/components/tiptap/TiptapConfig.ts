import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import CharacterCount from '@tiptap/extension-character-count'

const extensions = [
  StarterKit,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Image,
  CharacterCount
]

export default extensions
