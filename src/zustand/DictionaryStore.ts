import { ai_dictionary } from "@/ai-calls/dictionary";
import {
  DUDEN_generalSearch,
  DUDEN_getDictionaryEntry,
} from "@/dict-api/duden";
import { PONS_getEntry, PONS_search } from "@/dict-api/pons";
import { aiDictionarySchema } from "@/types/aiAnswerSchema";
import { UIEntries, UISearchResult } from "@/types/DictionaryUITypes";
import { create } from "zustand";
import { useAlertStore } from "./AlertStore";
import useSettingsStore from "./SettingsStore";

interface DictionaryStore {
  searchResults: UISearchResult[];
  selectedResult: UISearchResult | null;
  entries: UIEntries | null;
  aiDictionaryResult: aiDictionarySchema | null;
  doSearch: (query: string, language?: string) => void;
  selectResult: (selection: UISearchResult) => void;
  getEntries: (selection?: UISearchResult) => void;
}

export const useDictionaryStore = create<DictionaryStore>((set, get) => ({
  searchResults: [],
  selectedResult: null,
  entries: null,
  aiDictionaryResult: "",
  doSearch: async (query, language) => {
    set({ entries: null, searchResults: [], aiDictionaryResult: null });

    if (language === undefined)
      language = useSettingsStore.getState().currentLanguage;

    const handleAiSearch = async () => {
      const fastAIDictionary = useSettingsStore.getState().fastAIDictionary;
      try {
        const response = ai_dictionary(query, language, fastAIDictionary ? "gpt-4o-mini" : undefined);

        for await (const partialReply of response) {
          const currAnswer = get().aiDictionaryResult;
          console.log("current answer: ",currAnswer)
          set({
            aiDictionaryResult:
              currAnswer === null ? partialReply : currAnswer + partialReply,
          });
        }
      } catch (e: any) {
        console.error("Error in AI dictionary function: ", e);
        useAlertStore
          .getState()
          .addAlert({ type: "error", message: e.message });
      }
    };

    handleAiSearch();

    if (language === "German") {
      const duden_res = await DUDEN_generalSearch(query);
      const pons_res = await PONS_search(query);

      const allResults = [
        ...pons_res.map((val) => ({ pons: val })),
        ...duden_res.map((val) => ({ duden: val })),
      ];

      set({ searchResults: allResults });
      get().selectResult(allResults[0]);
    }
  },
  selectResult: (res: UISearchResult) => {
    set({ selectedResult: res });

    // get().getEntries(res)
  },
  getEntries: async (selection?: UISearchResult) => {
    const selectedResult = selection || get().selectedResult;
    if (selectedResult) {
      if (selectedResult.pons) {
        const pons_res = await PONS_getEntry(selectedResult.pons.value);

        if (selectedResult.duden) {
          const duden_res = await DUDEN_getDictionaryEntry(
            selectedResult.duden.duden_id
          );
          set({ entries: [duden_res, pons_res] });
        } else {
          set({ entries: [pons_res] });
        }
      } else if (selectedResult.duden) {
        const duden_res = await DUDEN_getDictionaryEntry(
          selectedResult.duden.duden_id
        );
        set({ entries: [duden_res] });
      }
    }
  },
}));
