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

import { FaRegTrashAlt } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { ModelSelector } from "./ModelSelector";
import useSettingsStore from "@/zustand/SettingsStore";
import { useState } from "react";
import { checkForUpdate, downloadAndInstallUpdate } from "@/updater/Updater";
import { useUpdaterUIState } from "@/zustand/UpdaterUIStore";
import { LanguageSelector } from "../TopBar/LanguageSelector";
import { LanguageManager } from "./LanguageManager";

export const SettingsModal = () => {
  const { isSettingsOpen, setSettingsOpen } = useUIStateStore();

  const {
    apiKey,
    setApiKey,
    developerMode,
    setDeveloperMode,
  } = useSettingsStore();

  const { foundUpdate, checkingForUpdates } = useUpdaterUIState();

  const [keyInput, setKeyInput] = useState(apiKey);

 

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
              </tbody>
            </table>
          </div>
          <div className="flex flex-col items-center justify-stretch">
            <h3 className="text-xl border-b mb-5 mt-8 w-full">Languages</h3>
            <LanguageManager />
          </div>
          <div className="flex flex-col">
            <h3 className="text-xl border-b mb-5 mt-8">Miscellaneous</h3>
            <table className="table-auto">
              <tbody>
                <tr className="*:py-3">
                  <td className="w-full text-slate-500">Send telemetry</td>
                  <td>
                    <Switch isDisabled />
                  </td>
                </tr>
                {import.meta.env.DEV ? (
                  <tr className="*:py-3">
                    <td className="w-full">Developer mode</td>
                    <td>
                      <Switch
                        isSelected={developerMode}
                        onValueChange={setDeveloperMode}
                      />
                    </td>
                  </tr>
                ) : null}
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
              </tbody>
            </table>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
