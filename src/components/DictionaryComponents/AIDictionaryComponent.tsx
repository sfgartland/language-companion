import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useDictionaryStore } from "@/zustand/DictionaryStore";
import { Skeleton } from "@nextui-org/react";

export const AIDictionaryComponent = () => {
  const { aiDictionaryResult } = useDictionaryStore();
  if (aiDictionaryResult === null)
    return <Skeleton className="w-full h-10 rounded-lg"></Skeleton>;
  else {
    return (
      <div className="flex flex-col prose-sm prose-h1:text-lg mt-5 mb-10 border-y-1">
        <Markdown remarkPlugins={[remarkGfm]}>
          {aiDictionaryResult}
        </Markdown>
      </div>
    );
  }
};
