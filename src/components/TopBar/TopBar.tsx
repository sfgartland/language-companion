import { inDemoMode } from "@/lib/StateHelpers";
import { Link } from "@nextui-org/react";
import { LanguageSelector } from "./LanguageSelector";
import { ModelSelector } from "../SettingsModal/ModelSelector";
import { DemoInfo } from "./DemoInfo";

import { AnimatePresence, motion } from "motion/react";


export const TopBar = () => {
  return (
    <div className="flex-0 mb-5 p-5 flex justify-between items-center">
      <AnimatePresence initial={inDemoMode()}>
        <motion.div
          className=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {inDemoMode() ? <DemoInfo /> : null}
        </motion.div>
      </AnimatePresence>
      <div className="gap-5 hidden xl:flex xl:visible">
        {import.meta.env.VITE_IS_WEB_VERSION === "true" ? (
          <Link
            className="mx-5 whitespace-nowrap align-middle"
            href="https://github.com/sfgartland/language-companion/releases/latest"
            underline="always"
            isExternal
            showAnchorIcon
          >
            Download the app
          </Link>
        ) : null}
        <LanguageSelector />
        <ModelSelector />
      </div>
    </div>
  );
};
