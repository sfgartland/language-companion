import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUIStateStore } from "./UIState";

// Define the state interface
interface SettingsState {
  apiKey: string;
  availableLanguages: string[];
  currentModel: string;
  currentLanguage: string;
  developerMode: boolean;
  setDeveloperMode: (mode: boolean) => void;
  setApiKey: (key: string) => void;
  // setLanguages: (langs: string[]) => void;
  removeLanguage: (lang: string) => void;
  addLanguage: (lang: string) => void;
  setCurrentModel: (model: string) => void;
  setCurrentLanguage: (lang: string) => void;
}

export const whitelistedModels = ["gpt-4o-mini", "gpt-4o"];

// Create the Zustand store
const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      apiKey: "",
      availableLanguages: [
        "German",
        "French",
        "Spanish",
        "Italian",
        "Russian",
        "English",
      ],
      currentModel: "gpt-4o-mini",
      currentLanguage: "German",
      developerMode: false,
      setDeveloperMode: (mode) => {
        if (import.meta.env.DEV)
          set({
            developerMode: mode,
          }); // Only allow it to be on when running dev build
        else set({ developerMode: false });
      },
      setApiKey: (key: string) => {
        set({ apiKey: key });
        useUIStateStore.getState().getAvailableModels(key);
      },
      removeLanguage: (lang: string) =>
        set({
          availableLanguages: get().availableLanguages.filter(
            (l) => l !== lang
          ),
        }),
      addLanguage: (lang: string) =>
        set({
          availableLanguages: [...new Set([...get().availableLanguages, lang])], // using new Set to avoid duplicates
        }),
      // setLanguages: (langs: string[]) => set({ availableLanguages: langs }),

      setCurrentModel: (model: string) => set({ currentModel: model }),
      setCurrentLanguage: (lang: string) => set({ currentLanguage: lang }),
    }),
    {
      name: "settings-storage", // Unique storage key
    }
  )
);

export default useSettingsStore;