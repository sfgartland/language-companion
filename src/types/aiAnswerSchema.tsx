import { z } from "zod";

export const correctionSchema = z.object({
    correction: z.string().nullable(),
    translation: z.string(), // English translation of the corrected text,
    explanation: z.string(), // GFM Markdown format
});

export type CorrectionSchema = z.infer<typeof correctionSchema>

// ---------------------------------------

export const explanationSchema = z.string();

export type ExplanationSchema = z.infer<typeof explanationSchema>

//****************************************************//

export type AnyAnswerSchema = CorrectionSchema | ExplanationSchema;