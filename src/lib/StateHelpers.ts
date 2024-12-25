import {
  useCorrectionState,
  useExplanationState,
} from "@/zustand/AssistantsStore";
import { AssistantMode, useUIStateStore } from "@/zustand/UIState";

export const getModeState = (mode: AssistantMode) => {
  if (mode == AssistantMode.CorrectText) {
    const correctionState = useCorrectionState.getState();
    return {
      input: correctionState.input,
      setInput: correctionState.setInput,
      getResponse: correctionState.getResponse,
    };
  } else if (mode == AssistantMode.Explanation) {
    const explanationState = useExplanationState.getState();
    return {
      input: explanationState.input,
      setInput: explanationState.setInput,
      getResponse: explanationState.getResponse,
    };
  } else {
    throw Error("Something is very wrong, too many modes added??");
  }
};

export const universalModeSubmitHandler = (submitMode: AssistantMode) => {
  const uiState = useUIStateStore.getState();
  const submitModeState = getModeState(submitMode);
  if (submitMode !== uiState.mode) {
    const currentModeState = getModeState(uiState.mode);

    submitModeState.setInput(currentModeState.input);
    submitModeState.getResponse();

    uiState.setMode(submitMode);
  } else {
    submitModeState.getResponse();
  }
};
