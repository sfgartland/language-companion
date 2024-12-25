"use client";
import { UISearchResult } from "@/types/DictionaryUITypes";
import { Button } from "@nextui-org/react";
import { ReactNode } from "react";

export function SelectionButtonsGroup({
  searchResults, currResult, selectResult,
}: {
  searchResults: UISearchResult[];
  currResult?: UISearchResult;
  selectResult: (res: UISearchResult) => void;
}) {
  const sortedResults = searchResults.sort((a, b) => {
    const a_val = a.pons ? a.pons.label : a.duden?.word || "";
    const b_val = b.pons ? b.pons.label : b.duden?.word || "";
    return a_val.localeCompare(b_val);
  });

  return (
    <div className="flex flex-wrap">
      {sortedResults.map((ent, i) => (
        <SelectionButton
          key={i}
          res={ent}
          action={() => selectResult(ent)}
          active={currResult == ent} />
      ))}
    </div>
  );
}


function SelectionButton({
  res,
  action,
  active,
}: {
  res: UISearchResult;
  action: () => void;
  active: boolean;
}) {
  let text: ReactNode = "";
  let color: string = "";
  let activeColor: string = "";
  // console.log(res.duden && res.pons)
  if (res.duden && res.pons) {
    text = `${res.duden.word} - ${res.duden.moreInfo}`;
    color = "bg-purple-50";
    activeColor = "bg-purple-300";
  } else if (res.duden) {
    text = `${res.duden.word} - ${res.duden.moreInfo}`;
    color = "bg-yellow-50";
    activeColor = "bg-yellow-300";
  } else if (res.pons) {
    text = (
      <>
        {res.pons.label}
        {res.pons.lang == "en" ? <i>EN</i> : null}
      </>
    );
    color = "bg-green-50";
    activeColor = "bg-green-300";
  } else if (res.duden_quick) {
    text = res.duden_quick.word;
    color = "bg-gray-100";
  } else {
    throw Error("There has been a problem with parsing the search results!");
  }

  return (
    <Button
      className={`m-2 ${active ? activeColor : color}`}
      size="sm"
      radius="full"
      onPress={action}
    >
      {text}
    </Button>
  );
}
