"use client";
import { useEffect } from "react";

import {
  AllPonsResultTypes,
  DUDEN_DictEntry,
  PONSResultNoun,
} from "@/dict-api/types";
import { useDictionaryStore } from "@/zustand/DictionaryStore";
import { PONSUIEntry } from "@/types/DictionaryUITypes";
import { SelectionButtonsGroup } from "./SelectionButtonsGroup";
import { DictSearchBar } from "./DictSearchBar";
import { PONSEntry } from "./PONSEntry";
import { DUDEN_Entry } from "./DUDENEntry";
import { AIDictionaryComponent } from "./AIDictionaryComponent";

function PONSEntries({
  entries,
  url,
}: {
  entries: AllPonsResultTypes[];
  url: string;
}) {
  return (
    <div>
      {entries.map((el) => (
        <PONSEntry key={el.pons_id} entry={el as PONSResultNoun} url={url} />
      ))}
    </div>
  );
}

export function DictionaryPlaceholderComponent() {
  return (
    <div className="flex flex-col w-full h-full p-10 mb-10 bg-white">
      <DictSearchBar disabled />
      <div className="flex flex-col prose">
        <h3>Dictionary is disabled in the distributed version</h3>
        <p>
          The dictionary is currently only available in German and uses
          unofficial APIs, therefore I cannot include it in the distributed
          version of this software. <br /> <br />
          <i>
            If you know of any official dictionary APIs, please let me know so
            that they can be implemented.
          </i>
        </p>
      </div>
    </div>
  );
}

export function DictionaryComponent() {
  const { searchResults, selectedResult, entries, selectResult, getEntries } =
    useDictionaryStore();

  const isDisabled = import.meta.env.VITE_IS_WEB_VERSION;

  useEffect(() => {
    if (!isDisabled) getEntries();
  }, [selectedResult]);

  return (
    <div className="flex flex-col w-full h-full p-10 mb-10 bg-white">
      <DictSearchBar />
      <AIDictionaryComponent />{" "}
      {/* TODO problem with it disapearing when skeleton and entries are loaded */}
      {isDisabled ? (
        <div className="flex flex-col items-center prose mt-10">
          <p className="prose">
            <i>PONS and DUDEN dictionary is disabled in the web version</i>
          </p>
        </div>
      ): null}
      <div className="flex flex-col">
        {entries ? (
          <>
            <div className="mb-10">
              {isDisabled ? null : (
                <SelectionButtonsGroup
                  searchResults={searchResults}
                  currResult={selectedResult || undefined}
                  selectResult={selectResult}
                />
              )}
            </div>
            {entries.map((ent, i) => {
              if ((ent as DUDEN_DictEntry).api == "duden")
                return <DUDEN_Entry key={i} entry={ent as DUDEN_DictEntry} />;
              else
                return (
                  <PONSEntries
                    key={i}
                    entries={(ent as PONSUIEntry)[0] as AllPonsResultTypes[]}
                    url={(ent as PONSUIEntry)[1] as string}
                  />
                );
            })}
            {/* <PONSEntries entries={entries[0]} url={entries[1]} /> */}
          </>
        ) : null}
        {/* {decls.map(decl => (
           <DUDENDeclention decl={decl} />
         ))} */}
      </div>
    </div>
  );
}
