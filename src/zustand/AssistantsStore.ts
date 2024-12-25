import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import {
  AnyAnswerSchema,
  CorrectionSchema,
  ExplanationSchema,
} from "@/types/aiAnswerSchema";
import { correctSentence } from "@/ai-calls/correct-text";
import { ai_explain } from "@/ai-calls/explain";
import { useUIStateStore } from "./UIState";

interface BaseCardState {
  input: string;
  emphasis: string;
  answer: Partial<AnyAnswerSchema> | null;
  initializingRequest: boolean;
  streaming: boolean;

  setInput: (input: string) => void;
  setEmphasis: (emphasis: string) => void;
  getResponse: () => void;
}

interface CorrectionCardState extends BaseCardState {
  answer: Partial<CorrectionSchema> | null;
}

interface ExplanationCardState extends BaseCardState {
  answer: Partial<ExplanationSchema> | null;
}

export const useCorrectionState = create<CorrectionCardState>()(
  devtools(
    persist(
      (set, get) => ({
        input: "",
        emphasis: "",
        answer: null,
        initializingRequest: false,
        streaming: false,
        setInput: (input) => set(() => ({ input })),
        setEmphasis: (emphasis) => set(() => ({ emphasis })),
        getResponse: async () => {
          const { input, emphasis } = get();
          set({ initializingRequest: true, answer: null });

          for await (const partialObject of correctSentence(
            input,
            useUIStateStore.getState().currentLanguage,
            emphasis
          )) {
            set({
              answer: partialObject,
              initializingRequest: false,
              streaming: true,
            });
            console.log(partialObject);
          }
          set({ streaming: false });
        },
      }),
      {
        name: "correction-storage",
      }
    )
  )
);

export const useExplanationState = create<ExplanationCardState>()(
  devtools(
    persist(
      (set, get) => ({
        input: "",
        emphasis: "",
        answer: null,
        initializingRequest: false,
        streaming: false,
        setInput: (input) => set(() => ({ input })),
        setEmphasis: (emphasis) => set(() => ({ emphasis })),
        getResponse: async () => {
          const { input, emphasis } = get();
          set({ initializingRequest: true, answer: null });

          for await (const partialReply of ai_explain(
            input,
            useUIStateStore.getState().currentLanguage,
            emphasis
          )) {
            const currAnswer = get().answer;
            set({
              answer:
                currAnswer === null ? partialReply : currAnswer + partialReply,
              initializingRequest: false,
              streaming: true,
            });
            console.log(partialReply);
          }
          set({ streaming: false });
        },
      }),
      {
        name: "explanation-storage",
      }
    )
  )
);
