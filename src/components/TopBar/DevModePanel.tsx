import { startupCheckForUpdate } from "@/updater/Updater";
import { useAlertStore } from "@/zustand/AlertStore";
import { useUIStateStore } from "@/zustand/UIState";
import { Button } from "@nextui-org/react";

export const DevModePanel = () => {

    const {useDemoCredits, demoCredits} = useUIStateStore();
    const {addAlert} = useAlertStore();

    return(
      <div>
        <Button onPress={() => useDemoCredits(demoCredits)}>0 Credits</Button>
        <Button onPress={() => useDemoCredits(-10 + demoCredits)}>
          10 credits
        </Button>
        <Button onPress={() => addAlert({ message: "Hello", type: "error" })}>
          Add Alert
        </Button>
        <Button onPress={() => startupCheckForUpdate()}>
          Run startup update check
        </Button>
      </div>
    )
};
