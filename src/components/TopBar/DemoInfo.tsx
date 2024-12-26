import { useUIStateStore } from "@/zustand/UIState";
import { Tooltip } from "@nextui-org/react";
import { useAnimate } from "framer-motion";
import { useEffect } from "react";

export const DemoInfo = () => {
    const { demoCredits } = useUIStateStore();
    const [scope, animate] = useAnimate();
  
    useEffect(() => {
      animate([
        ["div", { scale: 1.1 }, { type: "spring", duration: 0.2 }],
        ["div", { scale: 1 }, { type: "spring", duration: 0.1 }],
      ]);
    }, [demoCredits]);
  
    return (
      <div>
        <p className="prose">
          <i>You are currently in demo mode!</i> Add a API key to unlock all
          features.
        </p>
        <span ref={scope}>
          <Tooltip content="Add your own API key to allow for more requests">
            <div
              className={
                "whitespace-nowrap" + ` ${demoCredits <= 0 ? "text-red-500" : ""}`
              }
            >
              Free Credits: <b>{demoCredits}</b>
            </div>
          </Tooltip>
        </span>
      </div>
    );
  };