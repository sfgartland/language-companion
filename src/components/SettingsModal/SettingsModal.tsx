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

export const SettingsModal = () => {
  const { isSettingsOpen, setSettingsOpen } = useUIStateStore();

  const {
    availableLanguages,
    apiKey,
    setApiKey,
    developerMode,
    setDeveloperMode,
    removeLanguage,
    addLanguage,
    currentLanguage,
  } = useSettingsStore();

  const [keyInput, setKeyInput] = useState(apiKey);

  const [addLangInput, setAddLangInput] = useState("");

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
                      endContent={<Button onPress={() => setApiKey(keyInput)} variant="light" className={keyInput !== apiKey ? "visible" : "invisible"}>Save</Button>}
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
            <table className="table-auto w-full max-w-md">
              <tbody>
                {availableLanguages.map((lang) => (
                  <tr key={lang} className="border-b *:py-2">
                    <td className={lang === currentLanguage ? "font-bold" : ""}>
                      {lang}
                    </td>
                    <td className="text-center">
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        onPress={() => removeLanguage(lang)}
                      >
                        <FaRegTrashAlt className="text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
                <tr className="*:py-2 text-center">
                  <td>
                    <Input
                      placeholder="Add language"
                      value={addLangInput}
                      onValueChange={setAddLangInput}
                    />
                  </td>
                  <td>
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={() => {
                        addLanguage(addLangInput);
                        setAddLangInput("");
                      }}
                    >
                      <IoMdAdd size="25" className="text-slate-600" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
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
              </tbody>
            </table>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
