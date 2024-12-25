import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { OPENAI_API_KEY } from "./env";
// import { explanationSchema } from "@/types/aiAnswerSchema";

const openai = createOpenAI({
  apiKey: OPENAI_API_KEY, // should ideally be loaded from external place such as env variable
});

export function ai_explain(
  input: string,
  language: string,
  emphasis?: string
) {
  const { textStream } = streamText({
    prompt: `You are a college level ${language} teacher explaing ${language} words, concepts, and phrases to your students. Please explain any ${language} word you are sent using English. Return your explanation in gfm markdown format.  Add headings for each section.
    
    Emphasize the following in your explanation: ${emphasis || "nothing"}.

    Explain: ${input}
    `,
    model: openai("gpt-4-turbo"),
  });

  return textStream;
}
