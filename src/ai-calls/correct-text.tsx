import { createOpenAI } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { CorrectionSchema, correctionSchema } from "@/types/aiAnswerSchema";
import { authenticateRequest, getOpenAIKey } from "@/lib/OpenAIHelpers";
import useSettingsStore from "@/zustand/SettingsStore";
export function correctSentence(
  inputSentence: string,
  language: string,
  emphasis?: string,
  abortSignal?: AbortSignal
): AsyncIterable<Partial<CorrectionSchema>> {
  authenticateRequest();

  const selectedModel = useSettingsStore.getState().currentModel;
  const openai = createOpenAI({
    apiKey: getOpenAIKey(), // should ideally be loaded from external place such as env variable
  });

  const { partialObjectStream } = streamObject({
    schema: correctionSchema,
    prompt: `
      You are a college level ${language} teacher correcting the grammar of your student's writing.
      Please add explanations to your corrections.
      Return the corrected text with the json field "correction" in markdown, mark the corrections in **bold**. If the sentence is correct, return the "correction" field as null.
      Return the explanation with the json field "explanation" in gfm markdown.
      Return the English translation with the json field "translation".
      
      Emphasize the following in your correction: ${emphasis || "nothing"}.


      Sentence to correct: "${inputSentence}"
    `,
    model: openai(selectedModel),
    providerOptions: {
      openai: { reasoningEffort: "medium" },
    },
    abortSignal: abortSignal,
  });

  return partialObjectStream;
}
