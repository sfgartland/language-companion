import { Update } from "@tauri-apps/plugin-updater";
import { set } from "zod";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface UpdaterUIState {
  updateProgress: number | null;
  updateSize: number | null;
  checkingForUpdates: boolean;
  foundUpdate: Update | null,
  setCheckingForUpdates: (checking: boolean) => void;
  setUpdateProgress: (progress: number | null) => void;
  setUpdateSize: (size: number | null) => void;
  setFoundUpdate: (update: Update | null) => void;
}

export const useUpdaterUIState = create<UpdaterUIState>()(
  devtools((set) => ({
    updateProgress: null,
    updateSize: null,
    checkingForUpdates: false,
    foundUpdate: null,
    setCheckingForUpdates: (checking) => set({ checkingForUpdates: checking }),
    setUpdateProgress: (progress) => set({ updateProgress: progress }),
    setUpdateSize: (size) => set({ updateSize: size }),
    setFoundUpdate: (update) => set({ foundUpdate: update }),
  }))
);
