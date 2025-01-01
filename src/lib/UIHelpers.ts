import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";
import { useMediaQuery } from "react-responsive";
import { useUIStateStore } from "@/zustand/UIState";

export const useIsFullLayout = () => {
  const fullConfig = resolveConfig(tailwindConfig);
  const xlBreakpoint = fullConfig.theme.screens.xl;

  const isFullLayout = useMediaQuery({ query: `(min-width: ${xlBreakpoint})` });

  return isFullLayout;
};

export const makeSureAssistantIsVisible = () => {
  //   const isFullLayout = useIsFullLayout();

  //   if (!isFullLayout) {
  //     const uiState = useUIStateStore.getState();
  //     uiState.setDictionaryOpen(false);
  //   }
  useUIStateStore.getState().setDictionaryOpen(false); // TODO fix to actually check open state and evaluate
};
