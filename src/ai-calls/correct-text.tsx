import { createOpenAI } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { OPENAI_API_KEY } from "./env";
import { correctionSchema } from "@/types/aiAnswerSchema";

const openai = createOpenAI({
  apiKey: OPENAI_API_KEY, // should ideally be loaded from external place such as env variable
});

export function correctGermanSentence(
  inputSentence: string,
  emphasis?: string
) {
  const { partialObjectStream } = streamObject({
    schema: correctionSchema,
    prompt: `
      You are a college level German teacher correcting the grammar of your student's writing.
      Please add explanations to your corrections.
      Return the corrected text with the json field "correction" in markdown, mark the corrections in **bold**. If the sentence is correct, return the "correction" field as null.
      Return the explanation with the json field "explanation" in gfm markdown.
      Return the English translation with the json field "translation".
      
    Emphasize the following in your correction: ${emphasis || "nothing"}.


      Sentence to correct: "${inputSentence}"
    `,
    model: openai("gpt-4-turbo"),
  });

  return partialObjectStream;
}
