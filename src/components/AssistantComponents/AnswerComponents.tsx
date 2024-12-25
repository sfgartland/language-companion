
import { useCorrectionState, useExplanationState } from "@/zustand/AssistantsStore";
import { Skeleton } from "@nextui-org/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const AnswerSkeleton = () => (
  <div className="flex flex-col mb-10">
    {/* <Skeleton className="w-full h-4 mb-5 rounded-lg"></Skeleton> */}
    <Skeleton className="w-full h-40 rounded-lg"></Skeleton>
  </div>
);

export const CorrectionAnswer = () => {
  const { answer, initializingRequest } = useCorrectionState();
  if (initializingRequest) return <AnswerSkeleton />;
  else if (answer == null) return null;
  else {
    return (
      <div className="flex flex-col mb-10 p-10 text-left">
        {answer.correction !== null ? (
          <div className="mb-5 whitespace-pre-wrap">
            <Markdown remarkPlugins={[remarkGfm]}>
              {"**Correction:** " + answer.correction}
            </Markdown>
          </div>
        ) : null}
        <div className="mb-5 whitespace-pre-wrap">
          <Markdown remarkPlugins={[remarkGfm]}>
            {"**Translation:** " + answer.translation}
          </Markdown>
        </div>
        <div className="whitespace-pre-wrap prose prose-h1:text-lg">
          <b>Explanation</b>
          <Markdown remarkPlugins={[remarkGfm]}>{answer.explanation}</Markdown>
        </div>
      </div>
    );
  }
};

export const ExplanationAnswer = () => {
  const { answer, initializingRequest } = useExplanationState();
  if (initializingRequest) return <AnswerSkeleton />;
  else if (answer == null) return null;
  else {
    return (
      <div className="flex flex-col prose-sm prose-h1:text-lg mt-5 mb-10">
        <Markdown remarkPlugins={[remarkGfm]}>{answer}</Markdown>
      </div>
    );
  }
};
