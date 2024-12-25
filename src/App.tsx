import "./App.css";
import { useSelectionDetector } from "@/lib/SelectionDetector";
import { Button, NextUIProvider } from "@nextui-org/react";
import { AssistantComponent } from "@/components/AssistantComponents/AssistantComponent";

import { useUIStateStore } from "./zustand/UIState";
import { AnimatePresence, motion } from "motion/react";
import { FaCog } from "react-icons/fa";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../tailwind.config";
import { useMediaQuery } from "react-responsive";
import { DictionaryComponent, DictionaryPlaceholderComponent } from "@/components/DictionaryComponents/DictionaryComponent";

const RightMenuBar = () => {
  const { isDictionaryOpen, setDictionaryOpen } = useUIStateStore();
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
      <Button isIconOnly className="mt-auto" variant="light">
        <FaCog size={20} className="text-slate-600" />
      </Button>
    </div>
  );
};

const LangaugeSelectionButton = ({ lang }: { lang: string }) => {
  const { currentLanguage, setCurrentLanguage } = useUIStateStore();
  const isActive = currentLanguage === lang;
  return (
    <Button
      color="primary"
      size="sm"
      radius="full"
      variant={isActive ? "solid" : "ghost"}
      onPress={() => setCurrentLanguage(lang)}
      className="mx-2"
    >
      {lang}
    </Button>
  );
};

const LanguageBar = () => {
  return (
    <div className="flex mx-5">
      <h3>Select Language: </h3>
      <LangaugeSelectionButton lang="German" />
      <LangaugeSelectionButton lang="English" />
      <LangaugeSelectionButton lang="Spanish" />
      <LangaugeSelectionButton lang="French" />
    </div>
  );
};

const useIsFullLayout = () => {
  const fullConfig = resolveConfig(tailwindConfig);
  const xlBreakpoint = fullConfig.theme.screens.xl;

  const isFullLayout = useMediaQuery({ query: `(min-width: ${xlBreakpoint})` });

  return isFullLayout;
};

function App() {
  useSelectionDetector();

  const { isDictionaryOpen } = useUIStateStore();

  const isFullLayout = useIsFullLayout();

  return (
    <NextUIProvider>
      <div className="flex flex-col h-screen w-screen pt-10 bg-white">
        <div className="flex-0 max-w-screen-md mb-10">
          <LanguageBar />
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
                  <h1 className="text-3xl font-bold mb-10">Assistant</h1>
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
                  {import.meta.env.VITE_ENABLE_DICTIONARY === "true" ? <DictionaryComponent /> : <DictionaryPlaceholderComponent/>}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <div className=" flex-0 right-0 py-5 px-2 justify-self-stretch ml-auto m-0 h-full z-50">
            <RightMenuBar />
          </div>
        </div>
      </div>
    </NextUIProvider>
  );
}

export default App;
