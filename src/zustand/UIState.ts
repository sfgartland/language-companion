import { getOpenAIKey } from "@/lib/OpenAIHelpers";
import OpenAI from "openai";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { whitelistedModels } from "./SettingsStore";

export enum AssistantMode {
  CorrectText = "Correct",
  Explanation = "Explain",
}

export interface UIStateStore {
  mode: AssistantMode;
  isDictionaryOpen: boolean;
  isSettingsOpen: boolean;
  demoCredits: number;
  availableModels: string[];
  getAvailableModels: (key?: string) => Promise<void>;
  useDemoCredits: (credits?: number) => void;
  setMode: (mode: AssistantMode) => void;
  setDictionaryOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
}

export const useUIStateStore = create<UIStateStore>()(
  devtools(
    persist(
      (set) => ({
        mode: AssistantMode.CorrectText,
        isDictionaryOpen: false,
        isSettingsOpen: false,
        demoCredits: 10,
        availableModels: ["gpt-4o-mini"],
        getAvailableModels: async (key?) => {
          const openai = new OpenAI({
            apiKey: key || getOpenAIKey(),
            dangerouslyAllowBrowser: true,
          });
          const list = await openai.models.list();
          const allModels = list.data.map((data) => data.id);
          const filteredModels = allModels.filter((model) =>
            whitelistedModels.includes(model)
          );
          set({
            availableModels: filteredModels,
          });
        },
        useDemoCredits: (credits = 1) =>
          set((state) => ({ demoCredits: state.demoCredits - credits })),
        setMode: (mode) => set({ mode }),
        setDictionaryOpen: (open) => set({ isDictionaryOpen: open }),
        setSettingsOpen: (open) => set({ isSettingsOpen: open }),
      }),
      {
        name: "UI-storage",
      }
    )
  )
);
