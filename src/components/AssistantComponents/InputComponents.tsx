import {
  useCorrectionState,
  useExplanationState,
} from "@/zustand/AssistantsStore";
import { BasicInputArea } from "./BasicInputArea";
import { useUIStateStore } from "@/zustand/UIState";
import useSettingsStore from "@/zustand/SettingsStore";

export const CorrectTextInput = () => {
  const { input, setInput, emphasis, setEmphasis, getResponse } =
    useCorrectionState();
  return (
    <BasicInputArea
      label={`What would you like to grammar check in ${useSettingsStore
        .getState()
        .currentLanguage}?`}
      question={input}
      setQuestion={setInput}
      emphasis={emphasis}
      setEmphasis={setEmphasis}
      submitAction={getResponse}
    />
  );
};

export const ExplanationInput = () => {
  const {
    input,
    setInput,
    emphasis,
    setEmphasis,
    getResponse: getCorrection,
  } = useExplanationState();
  return (
    <BasicInputArea
      label={`What would you like explained? E.g. a word, the difference between words, a sentence structure, etc. in ${useSettingsStore
        .getState()
        .currentLanguage}`}
      question={input}
      setQuestion={setInput}
      emphasis={emphasis}
      setEmphasis={setEmphasis}
      submitAction={getCorrection}
    />
  );
};
