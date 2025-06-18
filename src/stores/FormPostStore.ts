import { create } from 'zustand'
import { UseFormReturn } from 'react-hook-form'
import { PostFormSchema } from '../forms/post'

type FormPostState = {
  form: UseFormReturn<PostFormSchema> | null
  setForm: (form: UseFormReturn<PostFormSchema>) => void
}

export const useFormPostStore = create<FormPostState>((set) => ({
  form: null,
  setForm: (state) => set({ form: state })
}))
