"use client";
import { Textarea } from "@nextui-org/input";
import { KeyboardEvent } from "react";
import { ActionButton } from "@/components/AssistantComponents/ActionButton";
import { AssistantMode } from "@/zustand/UIState";
import { useModeState, universalModeSubmitHandler } from "@/lib/StateHelpers";

export function BasicInputArea({
  label,

  currentMode,
}: {
  label: string;
  currentMode: AssistantMode;
}) {
  const {
    input,
    setInput,
    emphasis,
    setEmphasis,
    getResponse,
  } =  useModeState(currentMode)();
  console.log(currentMode)

  const handleKeySubmit = (e: KeyboardEvent) => {
    if (e.code === "Enter" && e.ctrlKey && input != "") getResponse();
    if (e.code === "KeyE" && e.ctrlKey && input != "") {
      universalModeSubmitHandler(AssistantMode.Explanation);
    }
    if (e.code === "KeyK" && e.ctrlKey && input != "") {
      universalModeSubmitHandler(AssistantMode.CorrectText);
    }
  };

  return (
    <div className="flex flex-col">
      <Textarea
        type="text"
        label={label}
        name="input"
        // placeholder=""
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeySubmit}
        className="mb-5"
      />
      {emphasis != undefined && setEmphasis != undefined ? (
        <Textarea
          type="text"
          label="Added emphasis (optional)"
          name="input"
          // placeholder=""
          value={emphasis}
          className=""
          onChange={(e) => setEmphasis(e.target.value)}
          onKeyDown={handleKeySubmit}
          minRows={1}
        />
      ) : null}
      <div className="w-full">
        <ActionButton currentMode={currentMode} />
      </div>
    </div>
  );
}
