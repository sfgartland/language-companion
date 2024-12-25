"use client";
import { Textarea } from "@nextui-org/input";
import { KeyboardEvent } from "react";
import { ActionButton } from "@/components/AssistantComponents/ActionButton";
import { AssistantMode } from "@/zustand/UIState";
import { universalModeSubmitHandler } from "@/lib/StateHelpers";

export function BasicInputArea({
  label,
  question,
  emphasis,
  setEmphasis,
  setQuestion,
  submitAction,
}: {
  label: string;
  question: string;
  setQuestion: (v: string) => void;
  submitAction: () => void;
  emphasis?: string;
  setEmphasis?: (v: string) => void;
}) {
  const handleKeySubmit = (e: KeyboardEvent) => {
    console.log(e.code)
    if (e.code === "Enter" && e.ctrlKey && question != "") submitAction();
    if (e.code === "KeyE" && e.ctrlKey && question != "") {
      universalModeSubmitHandler(AssistantMode.Explanation)
    }
    if (e.code === "KeyK" && e.ctrlKey && question != "") {
      universalModeSubmitHandler(AssistantMode.CorrectText)
    }
  };

  return (
    <div className="flex flex-col">
      <Textarea
        type="text"
        label={label}
        name="input"
        // placeholder=""
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
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
        <ActionButton />
      </div>
    </div>
  );
}
