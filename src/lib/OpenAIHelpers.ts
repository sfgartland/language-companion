import useSettingsStore from "@/zustand/SettingsStore";
import { inDemoMode } from "./StateHelpers";
import { useUIStateStore } from "@/zustand/UIState";


export const getOpenAIKey = (): string => {
    const settingsKey = useSettingsStore.getState().apiKey;
    if(settingsKey !== "") {
        console.log(settingsKey)
        return settingsKey;
    } else {
        return import.meta.env.VITE_DEMO_OPENAI_KEY as string;
    }
   
}

export const authenticateRequest = () => {
    if(inDemoMode() && useUIStateStore.getState().demoCredits <= 0) {
        throw new Error("Out of demo credits");
    } else {
        useUIStateStore.getState().useDemoCredits()
    }
}