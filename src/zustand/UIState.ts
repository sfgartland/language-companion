import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

export enum AssistantMode {
    CorrectText = "Correct",
    Explanation = "Explain",
  }


export interface UIStateStore {
    mode: AssistantMode
    isDictionaryOpen: boolean
    currentLanguage: string
    setMode: (mode: AssistantMode) => void
    setDictionaryOpen: (open: boolean) => void
    setCurrentLanguage: (lang: string) => void
}

export const useUIStateStore = create<UIStateStore>()(devtools(persist((set) => ({
    mode: AssistantMode.CorrectText,
    isDictionaryOpen: false,
    currentLanguage: "German",
    setMode: (mode) => set(({mode: mode})),
    setDictionaryOpen: (open) => set(({isDictionaryOpen: open})),
    setCurrentLanguage: (lang) => set(({currentLanguage: lang}))
}), {
    name: "UI-storage"
})))