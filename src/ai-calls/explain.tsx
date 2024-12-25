import { authenticateRequest, getOpenAIKey } from "@/lib/OpenAIHelpers";
import useSettingsStore from "@/zustand/SettingsStore";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
// import { explanationSchema } from "@/types/aiAnswerSchema";

export function ai_explain(
  input: string,
  language: string,
  emphasis?: string
): AsyncIterable<string> {
  authenticateRequest();

  const openai = createOpenAI({
    apiKey: getOpenAIKey(), // should ideally be loaded from external place such as env variable
  });
  const selectedModel = useSettingsStore.getState().currentModel;

  const { textStream } = streamText({
    prompt: `You are a college level ${language} teacher explaing ${language} words, concepts, and phrases to your students. Please explain any ${language} word you are sent using English. Return your explanation in gfm markdown format.  Add headings for each section.
      
      Emphasize the following in your explanation: ${emphasis || "nothing"}.
  
      Explain: ${input}
      `,
    model: openai(selectedModel),
  });

  return textStream;
}
