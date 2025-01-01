import {
  useCorrectionState,
  useExplanationState,
} from "@/zustand/AssistantsStore";
import useSettingsStore from "@/zustand/SettingsStore";
import { AssistantMode, useUIStateStore } from "@/zustand/UIState";
import { m } from "framer-motion";

export const setInputAndGetResponse = (
  mode: AssistantMode,
  input: string,
  emphasis?: string
) => {
  const modeState = getModeState(mode);

  modeState.setInput(input);
  if (emphasis) {
    modeState.setEmphasis(emphasis);
  }

  modeState.getResponse();
};

export const getModeState = (mode: AssistantMode) => {
  if (mode == AssistantMode.CorrectText) {
    return useCorrectionState.getState();
  } else if (mode == AssistantMode.Explanation) {
    return useExplanationState.getState();
  } else {
    throw Error("Something is very wrong, too many modes added??");
  }
};

export const universalModeSubmitHandler = (submitMode: AssistantMode) => {
  const uiState = useUIStateStore.getState();
  const currentModeState = getModeState(uiState.mode)


  if (submitMode !== uiState.mode) {
    uiState.setMode(submitMode);
    setInputAndGetResponse(submitMode, currentModeState.input);
  } else {
    currentModeState.getResponse();
  }
};

export const inDemoMode = () => {
  const settingsKey = useSettingsStore.getState().apiKey;
  return settingsKey === "";
};
