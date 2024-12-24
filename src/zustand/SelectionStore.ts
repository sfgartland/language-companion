import { create } from "zustand";

export interface SelectionState {
    text: string
    setText: (newText: string) => void
  }

export const useSelectionStore = create<SelectionState>(set => ({
    text: '',
    setText: (newText: string) => set(() => ({ text: newText }))
  }))