import { authenticateRequest, getOpenAIKey } from "@/lib/OpenAIHelpers";
import useSettingsStore from "@/zustand/SettingsStore";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
// import { explanationSchema } from "@/types/aiAnswerSchema";

export function ai_dictionary(
  input: string,
  language: string,
  model?: string
): AsyncIterable<string> {
  authenticateRequest();
  if(model === undefined) model = useSettingsStore.getState().currentModel;

  const openai = createOpenAI({
    apiKey: getOpenAIKey(), // should ideally be loaded from external place such as env variable
  });
  const { textStream } = streamText({
    prompt: `Please explain what this word in ${language} means using one sentence or by listing its meaning. Answer in English
    
    Return your explanation in gfm markdown format. Do not return as code.
  
      The word: ${input}
      `,
    model: openai(model),
  });

  return textStream;
}
