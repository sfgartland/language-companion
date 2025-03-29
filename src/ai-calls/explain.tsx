import { authenticateRequest, getOpenAIKey } from "@/lib/OpenAIHelpers";
import useSettingsStore from "@/zustand/SettingsStore";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
// import { explanationSchema } from "@/types/aiAnswerSchema";

export function ai_explain(
  input: string,
  language: string,
  emphasis?: string,
  abortSignal?: AbortSignal
): AsyncIterable<string> {
  authenticateRequest();

  const openai = createOpenAI({
    apiKey: getOpenAIKey(), // should ideally be loaded from external place such as env variable
  });
  const selectedModel = useSettingsStore.getState().currentModel;

  const { textStream } = streamText({
    prompt: `You are a college level ${language} teacher explaing ${language} words, concepts, and phrases to your students. Please explain any ${language} word, phrase, or question that you are sent using English.

    If it is a single word, start by giving its meaning in English. Then explain its usage, etymology, nuances, synonyms and some examples of its usage.

    If it is a phrase in ${language}, start by giving a translation, mention any ambiguities, give a gramatical structure analysis, and then the rest of your explanation.
    
    Return your explanation in gfm markdown format. Add headings for each section. Do not return as code.
      
      Emphasize the following in your explanation: ${emphasis || "nothing"}.
  
      Explain: ${input}
      `,
    model: openai(selectedModel),
    abortSignal: abortSignal,
  });

  return textStream;
}
