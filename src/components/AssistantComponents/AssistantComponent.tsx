"use client";

import { Button, ButtonGroup } from "@nextui-org/react";
import {
  CorrectTextInput,
  ExplanationInput,
} from "@/components/AssistantComponents/InputComponents";
import {
  CorrectionAnswer,
  ExplanationAnswer,
} from "@/components/AssistantComponents/AnswerComponents";
import { AssistantMode, useUIStateStore } from "@/zustand/UIState";

const TopBarButton = ({ mode }: { mode: AssistantMode }) => {
  const { mode: currentMode, setMode } = useUIStateStore();

  return (
    <Button
      radius="full"
      color="primary"
      variant={mode === currentMode ? "solid" : "ghost"}
      onPress={() => setMode(mode)}
    >
      {mode}
    </Button>
  );
};

const CorrectionView = () => (
  <>
    <CorrectTextInput />
    <CorrectionAnswer />
  </>
);

const ExplanationView = () => (
  <>
    <ExplanationInput />
    <ExplanationAnswer />
  </>
);

export function AssistantComponent() {
  const { mode } = useUIStateStore();

  return (
    <div className="flex flex-col w-full h-full p-10 mb-10 bg-white">
      <ButtonGroup className="mb-10">
        <TopBarButton mode={AssistantMode.CorrectText} />
        <TopBarButton mode={AssistantMode.Explanation} />
      </ButtonGroup>
      {mode == AssistantMode.CorrectText ? <CorrectionView /> : null}
      {mode == AssistantMode.Explanation ? <ExplanationView /> : null}
    </div>
  );
}
