import { useModeState, universalModeSubmitHandler } from "@/lib/StateHelpers";
import { AssistantMode } from "@/zustand/UIState";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { MdKeyboardControlKey } from "react-icons/md";

export const KeySymbol = (mode: AssistantMode, ghost?: boolean) => (
  <div
    className={`flex rounded-full p-1 border-solid border-1 border-primary-400 ${
      ghost ? null : "bg-primary-400"
    }`}
  >
    <MdKeyboardControlKey />
    {mode === AssistantMode.CorrectText ? "K" : null}
    {mode === AssistantMode.Explanation ? "E" : null}
  </div>
);

export const ActionButton = ({
  currentMode,
}: {
  currentMode: AssistantMode;
}) => {
  const [show, setShow] = useState(false);
  const { streaming, initializingRequest, abortController } = useModeState(currentMode)();

  const nonSelectedModeButtons = Object.values(AssistantMode)
    .filter((key) => key !== currentMode)
    .map((val, i) => (
      <Button
        key={i}
        color="primary"
        variant="ghost"
        onPress={() => universalModeSubmitHandler(val)}
        className={`mx-2 py-6 px-8 opacity-50 ${
          show ? "visible" : "invisible"
        }`}
        disabled={!show}
      >
        {val}
        {KeySymbol(val, true)}
      </Button>
    ));

  return (
    <div
      className="flex flex-wrap-reverse my-5 justify-end"
      onMouseLeave={() => setShow(false)}
    >
      {streaming || initializingRequest ? (
        <Button
          color="primary"
          className="mx-2 px-8 py-6"
          onPress={() => abortController.abort()}
        >
          Stop
        </Button>
      ) : (
        <>
          {nonSelectedModeButtons}
          <Button
            color="primary"
            className="mx-2 px-8 py-6"
            onPress={() => universalModeSubmitHandler(currentMode)}
            onMouseEnter={() => setShow(true)}
          >
            {currentMode}
            {KeySymbol(currentMode)}
          </Button>
        </>
      )}
    </div>
  );
};
