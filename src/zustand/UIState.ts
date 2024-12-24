import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

export enum AssistantMode {
    CorrectText = "Correct",
    Explanation = "Explain",
  }


export interface UIStateStore {
    mode: AssistantMode
    setMode: (mode: AssistantMode) => void
}

export const useUIStateStore = create<UIStateStore>()(devtools(persist((set) => ({
    mode: AssistantMode.CorrectText,
    setMode: (mode) => set(({mode: mode}))
}), {
    name: "UI-storage"
})))