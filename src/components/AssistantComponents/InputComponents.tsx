import { BasicInputArea } from "./BasicInputArea";
import useSettingsStore from "@/zustand/SettingsStore";
import { AssistantMode } from "@/zustand/UIState";

export const CorrectTextInput = () => {

  return (
    <BasicInputArea
      label={`What would you like to grammar check in ${useSettingsStore
        .getState()
        .currentLanguage}?`}
        currentMode={AssistantMode.CorrectText}
    />
  );
};

export const ExplanationInput = () => {

  return (
    <BasicInputArea
      label={`What would you like explained? E.g. a word, the difference between words, a sentence structure, etc. in ${useSettingsStore
        .getState()
        .currentLanguage}`}
        currentMode={AssistantMode.Explanation}
    />
  );
};
