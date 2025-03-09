import { useUIStateStore } from "@/zustand/UIState";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Switch,
} from "@nextui-org/react";

import {app} from "@tauri-apps/api"

import { ModelSelector } from "./ModelSelector";
import useSettingsStore from "@/zustand/SettingsStore";
import { useEffect, useState } from "react";
import { checkForUpdate, downloadAndInstallUpdate } from "@/updater/Updater";
import { useUpdaterUIState } from "@/zustand/UpdaterUIStore";
import { LanguageManager } from "./LanguageManager";

export const SettingsModal = () => {
  const { isSettingsOpen, setSettingsOpen } = useUIStateStore();

  const { fastAIDictionary, setFastAIDictionary, apiKey, setApiKey, developerMode, setDeveloperMode, showHiddenSettings, setShowHiddenSettings, enabledDictionary, setEnabledDictionary } =
    useSettingsStore();

  const { foundUpdate, checkingForUpdates } = useUpdaterUIState();

  const [michClicks, setMichClicks] = useState<Date[]>([]);

  const [currentVersion, setCurrentVersion] = useState<string>();

  const [keyInput, setKeyInput] = useState(apiKey);

  useEffect(() => {
    const findVersion = async () => {
      const version = await app.getVersion();
      setCurrentVersion(version);
    }

    findVersion();

  }, [])

  const handleMichClick = () => {
    const now = new Date();
    const newTimestamps = [...michClicks, now];
    
    // Remove timestamps older than 5 seconds
    const recentTimestamps = newTimestamps.filter(
      (timestamp) => now.getTime() - timestamp.getTime() <= 5000
    );

    if(recentTimestamps.length >= 5) {
      console.log("Toggling hidden settings!")
      setShowHiddenSettings(!showHiddenSettings);
      setMichClicks([]);
    } else {
      setMichClicks(recentTimestamps);
    }



  }

  return (
    <Modal
      size="3xl"
      isOpen={isSettingsOpen}
      onClose={() => setSettingsOpen(false)}
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          <h1>Settings</h1>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col">
            <h3 className="text-xl border-b mb-5 mt-8">AI Settings</h3>
            <table className="table-auto">
              <tbody>
                <tr className="*:my-5">
                  <td>OpenAI API Key</td>
                  <td className="flex">
                    <Input
                      placeholder="API Key"
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                      endContent={
                        <Button
                          onPress={() => setApiKey(keyInput)}
                          variant="light"
                          className={
                            keyInput !== apiKey ? "visible" : "invisible"
                          }
                        >
                          Save
                        </Button>
                      }
                      description={keyInput !== apiKey ? "Unsaved" : "Saved"}
                    />
                  </td>
                </tr>
                <tr className="*:py-5">
                  <td>AI Model</td>
                  <td className="flex justify-end">
                    <ModelSelector />
                  </td>
                </tr>
                <tr className="*:py-5">
                  <td>Fast AI Dictionary (uses gpt-4o-mini)</td>
                  <td className="flex justify-end">
                    <Switch isSelected={fastAIDictionary} onValueChange={setFastAIDictionary} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-col items-center justify-stretch">
            <h3 className="text-xl border-b mb-5 mt-8 w-full">Languages</h3>
            <LanguageManager />
          </div>
          <div className="flex flex-col">
            <h3 className="text-xl border-b mb-5 mt-8" onClick={handleMichClick}>Miscellaneous</h3>
            <table className="table-auto">
              <tbody>
                <tr className="*:py-3">
                  <td className="w-full text-slate-500">Send telemetry</td>
                  <td>
                    <Switch isDisabled />
                  </td>
                </tr>
                <tr className="*:py-3">
                  <td>
                    Current version
                  </td>
                  <td>{currentVersion || "Loading..."}</td>
                </tr>
                <tr className="*:py-3">
                  <td className="">
                    {!foundUpdate ? (
                      <Button
                        variant="ghost"
                        onPress={() => checkForUpdate()}
                        isLoading={checkingForUpdates}
                      >
                        Check for Update
                      </Button>
                    ) : (
                      `Found update ! (v${foundUpdate.version})`
                    )}
                  </td>
                  <td>
                    {foundUpdate ? (
                      <Button
                        variant="solid"
                        color="primary"
                        onPress={() => downloadAndInstallUpdate(foundUpdate)}
                      >
                        Install update
                      </Button>
                    ) : null}
                  </td>
                </tr>
                {import.meta.env.DEV || showHiddenSettings ? (
                  <div className="flex flex-col items-center justify-stretch">
                    <h3 className="text-xl border-b mb-5 mt-8 w-full">
                      Hidden Settings
                    </h3>
                    <table className="table-auto">
                      <tbody>
                        <tr className="*:py-3">
                          <td className="w-full">
                            Enable dictionary
                          </td>
                          <td>
                            <Switch isSelected={enabledDictionary} onValueChange={setEnabledDictionary} />
                          </td>
                        </tr>

                        <tr className="*:py-3">
                          <td className="w-full">Developer mode</td>
                          <td>
                            <Switch
                              isSelected={developerMode}
                              onValueChange={setDeveloperMode}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </tbody>
            </table>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
