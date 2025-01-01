import { AssistantMode, useUIStateStore } from "@/zustand/UIState";
import { register, unregisterAll } from "@tauri-apps/plugin-global-shortcut";
import { readText } from "@tauri-apps/plugin-clipboard-manager";
import { setInputAndGetResponse } from "./StateHelpers";

import { getCurrentWindow } from '@tauri-apps/api/window';
import { useDictionaryStore } from "@/zustand/DictionaryStore";
import { makeSureAssistantIsVisible } from "./UIHelpers";

enum Hotkeys {
  correct = "CommandOrControl+Alt+K",
  explain = "CommandOrControl+Alt+E",
  dictionary = "CommandOrControl+Alt+D"

}

export const registerHotkeys = async () => {
  await unregisterAll();

  await register(Hotkeys.correct, async (event) => {
    console.log("Shortcut triggered: ", event);
    if (event.state === "Pressed") {
      const clipboardContent = await readText();
      console.log("Clipboard: ", clipboardContent)
      makeSureAssistantIsVisible()
      await getCurrentWindow().setFocus();


      setInputAndGetResponse(AssistantMode.CorrectText, clipboardContent);
    }
  });

  await register(Hotkeys.explain, async (event) => {
    console.log("Shortcut triggered: ", event);
    if (event.state === "Pressed") {
      const clipboardContent = await readText();
      console.log("Clipboard: ", clipboardContent)
      makeSureAssistantIsVisible();
      await getCurrentWindow().setFocus();
      setInputAndGetResponse(AssistantMode.Explanation, clipboardContent);
    }
  });

  await register(Hotkeys.dictionary, async (event) => {
    console.log("Shortcut triggered: ", event);
    if (event.state === "Pressed") {
      const clipboardContent = await readText();
      console.log("Clipboard: ", clipboardContent)
      await getCurrentWindow().setFocus();
      useUIStateStore.getState().setDictionaryOpen(true)

      const dictState = useDictionaryStore.getState()
      dictState.doSearch(clipboardContent)
    }
  });
};
