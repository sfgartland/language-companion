import "./App.css";
import { useSelectionDetector } from "@/lib/SelectionDetector";
import {
  Button,
  Link,
  NextUIProvider,
  Select,
  SelectItem,
  Tooltip,
} from "@nextui-org/react";
import { AssistantComponent } from "@/components/AssistantComponents/AssistantComponent";

import { useUIStateStore } from "./zustand/UIState";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { FaCog } from "react-icons/fa";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../tailwind.config";
import { useMediaQuery } from "react-responsive";
import {
  DictionaryComponent,
  DictionaryPlaceholderComponent,
} from "@/components/DictionaryComponents/DictionaryComponent";
import { SettingsModal } from "./components/SettingsModal/SettingsModal";
import { inDemoMode } from "./lib/StateHelpers";
import { useEffect } from "react";
import { useAlertStore } from "./zustand/AlertStore";
import useSettingsStore from "./zustand/SettingsStore";
import { ModelSelector } from "./components/SettingsModal/ModelSelector";
import { AlertHandler } from "./components/AlertHandler";
import { startupCheckForUpdate } from "./updater/Updater";

const RightMenuBar = () => {
  const { isDictionaryOpen, setDictionaryOpen, setSettingsOpen } =
    useUIStateStore();
  const isFullLayout = useIsFullLayout();
  return (
    <div className="flex flex-col items-center justify-start h-full">
      <div
        onClick={() => setDictionaryOpen(!isDictionaryOpen)}
        className="group hover:bg-slate-100 rounded-large flex flex-col items-center p-4 bg-white"
      >
        <div className="mb-3">
          {/* <IoMdSearch size={20} className="text-slate-600" /> */}
        </div>
        <h5 className="writing-vertical tracking-wide group-hover:tracking-widest transition-all duration-300 ease-out cursor-pointer text-slate-600">
          {isFullLayout || !isDictionaryOpen ? "Dictionary" : "Assistant"}
        </h5>
      </div>
      <Button
        isIconOnly
        className="mt-auto"
        variant="light"
        onPress={() => setSettingsOpen(true)}
      >
        <FaCog size={20} className="text-slate-600" />
      </Button>
    </div>
  );
};

const LanguageBar = () => {
  const { currentLanguage, setCurrentLanguage, availableLanguages } =
    useSettingsStore();
  const languages = availableLanguages.map((lang) => ({
    key: lang,
    label: lang,
  }));

  return (
    <div className="flex justify-end flex-1">
      <Select
        className="max-w-xs min-w-52"
        items={languages}
        label="Selected language"
        placeholder="Select a language"
        selectedKeys={[currentLanguage]}
        onChange={(selected) => setCurrentLanguage(selected.target.value)}
      >
        {(animal) => <SelectItem>{animal.label}</SelectItem>}
      </Select>
      {/* <Button isIconOnly variant="light" size="lg">
        <IoMdAdd />
      </Button> */}
    </div>
  );
};

const useIsFullLayout = () => {
  const fullConfig = resolveConfig(tailwindConfig);
  const xlBreakpoint = fullConfig.theme.screens.xl;

  const isFullLayout = useMediaQuery({ query: `(min-width: ${xlBreakpoint})` });

  return isFullLayout;
};

const DemoInfo = () => {
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

function App() {
  useSelectionDetector();

  const { isDictionaryOpen } = useUIStateStore();
  const { currentLanguage, developerMode } = useSettingsStore();
  const { demoCredits, useDemoCredits } = useUIStateStore();
  const {addAlert} = useAlertStore();


  const isFullLayout = useIsFullLayout();

  useEffect(() => {
    startupCheckForUpdate();
  }, []);

  return (
    <NextUIProvider>
      <div className="flex flex-col h-screen w-screen bg-white">
        {import.meta.env.DEV && developerMode ? (
          <div>
            <Button onPress={() => useDemoCredits(demoCredits)}>
              0 Credits
            </Button>
            <Button onPress={() => useDemoCredits(-10 + demoCredits)}>
              10 credits
            </Button>
            <Button
              onPress={() => addAlert({ message: "Hello", type: "error" })}
            >
              Add Alert
            </Button>
            <Button onPress={() => startupCheckForUpdate()}>
              Run startup update check
            </Button>
          </div>
        ) : null}
        <div className="flex-0 mb-5 p-5 flex justify-between items-center">
          <AnimatePresence initial={inDemoMode()}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {inDemoMode() ? <DemoInfo /> : null}
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-5">
            {import.meta.env.VITE_IS_WEB_VERSION === "true" ? (
              <Link
                className="mx-5 whitespace-nowrap align-middle"
                href="https://github.com/sfgartland/language-companion"
                underline="always"
                isExternal
                showAnchorIcon
              >
                Download the app
              </Link>
            ) : null}
            <LanguageBar />
            <ModelSelector />
          </div>
        </div>
        <div className="flex flex-row flex-1 justify-center ml-10 overflow-y-hidden">
          <div className="flex flex-row flex-1 justify-center ml-10">
            <AnimatePresence initial={!isDictionaryOpen || isFullLayout}>
              {!isDictionaryOpen || isFullLayout ? (
                <motion.div
                  className="flex flex-col items-stretch h-full overflow-y-auto xl:mr-10 max-w-screen-lg"
                  initial={{ opacity: 0, flex: 0 }}
                  animate={{ opacity: 1, flex: 1 }}
                  exit={{ opacity: 0, flex: 0 }}
                >
                  <h1 className="text-3xl font-bold mb-10">
                    {currentLanguage} Assistant
                  </h1>
                  <AssistantComponent />
                </motion.div>
              ) : null}
            </AnimatePresence>
            <AnimatePresence initial={isDictionaryOpen}>
              {isDictionaryOpen ? (
                <motion.div
                  className="flex flex-col items-stretch h-full overflow-y-auto max-w-screen-lg"
                  initial={{ opacity: 0, flex: 0 }}
                  animate={{ opacity: 1, flex: 1 }}
                  exit={{ opacity: 0, flex: 0 }}
                >
                  <h1 className="text-3xl font-bold mb-10">Dictionary</h1>
                  {import.meta.env.VITE_ENABLE_DICTIONARY === "true" ? (
                    <DictionaryComponent />
                  ) : (
                    <DictionaryPlaceholderComponent />
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <div className=" flex-0 right-0 py-5 px-2 justify-self-stretch ml-auto m-0 h-full z-50">
            <RightMenuBar />
          </div>
        </div>
      </div>
      <SettingsModal />
      <AlertHandler />
    </NextUIProvider>
  );
}

export default App;
