import { create } from 'zustand';

type SavingState = {
  isSaving: boolean
  setIsSaving: (state: boolean) => void
}

export const useSavingStore = create<SavingState>((set) => ({
  isSaving: false,
  setIsSaving: (state) => set({ isSaving: state })
}))
