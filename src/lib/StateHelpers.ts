import {
  useCorrectionState,
  useExplanationState,
} from "@/zustand/AssistantsStore";
import useSettingsStore from "@/zustand/SettingsStore";
import { AssistantMode, useUIStateStore } from "@/zustand/UIState";

export const setInputAndGetResponse = (
  mode: AssistantMode,
  input: string,
  emphasis?: string
) => {
  const modeState = useModeState(mode).getState();

  modeState.setInput(input);
  if (emphasis) {
    modeState.setEmphasis(emphasis);
  }

  modeState.getResponse();
};

export const useModeState = (mode: AssistantMode) => {
  if (mode == AssistantMode.CorrectText) {
    return useCorrectionState;
  } else if (mode == AssistantMode.Explanation) {
    return useExplanationState;
  } else {
    throw Error("Something is very wrong, too many modes added??");
  }
};

export const universalModeSubmitHandler = (submitMode: AssistantMode) => {
  const uiState = useUIStateStore.getState();
  const currentModeState = useModeState(uiState.mode).getState()


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
