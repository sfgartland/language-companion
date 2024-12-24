
export type ConversationTextResponseType = {
  answer: string
  inputText: string
  correction?: string
} // import { simpleCompletion } from '@/app/actions'

export type CorrectionType = {
  inputText: string
  correct: boolean
  translation: string
  text: string
  explanation: string
}

export type ExplanationType = string

export enum Mode {
  Explanation,
  Correction
}
