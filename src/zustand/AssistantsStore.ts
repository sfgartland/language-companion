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
import useSettingsStore from "./SettingsStore";
import { useAlertStore } from "./AlertStore";

interface BaseCardState {
  input: string;
  emphasis: string;
  answer: Partial<AnyAnswerSchema> | null;
  initializingRequest: boolean;
  streaming: boolean;
  abortController: AbortController;

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
        abortController: new AbortController(),
        setInput: (input) => set(() => ({ input })),
        setEmphasis: (emphasis) => set(() => ({ emphasis })),
        getResponse: async () => {
          const { input, emphasis } = get();
          set({ initializingRequest: true, answer: null });

          const abortController = new AbortController();
          const abortSignal = abortController.signal;

          try {
            const response = correctSentence(
              input,
              useSettingsStore.getState().currentLanguage,
              emphasis,
              abortSignal
            );

            for await (const partialObject of response) {
              set({
                answer: partialObject,
                initializingRequest: false,
                streaming: true,
              });
            }
          } catch (e: any) {
            if (e.name !== "AbortError") {
              console.error("Error in explain function: ", e);
              useAlertStore
                .getState()
                .addAlert({ type: "error", message: e.message });
            }
          }

          set({ streaming: false, initializingRequest: false });
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
        abortController: new AbortController(),
        setInput: (input) => {
          set(() => ({ input }));
        },
        setEmphasis: (emphasis) => set(() => ({ emphasis })),
        getResponse: async () => {
          const { input, emphasis } = get();

          const abortController = new AbortController();
          const abortSignal = abortController.signal;

          set({
            initializingRequest: true,
            answer: null,
            abortController: abortController,
          });

          try {
            const response = ai_explain(
              input,
              useSettingsStore.getState().currentLanguage,
              emphasis,
              abortSignal
            );
            for await (const partialReply of response) {
              const currAnswer = get().answer;
              set({
                answer:
                  currAnswer === null
                    ? partialReply
                    : currAnswer + partialReply,
                initializingRequest: false,
                streaming: true,
              });
            }
          } catch (e: any) {
            if (e.name !== "AbortError") {
              console.error("Error in explain function: ", e);
              useAlertStore
                .getState()
                .addAlert({ type: "error", message: e.message });
            }
          }

          set({
            streaming: false,
            initializingRequest: false,
          });
        },
      }),
      {
        name: "explanation-storage",
      }
    )
  )
);
