import { SelectionButtonsGroup } from "@/components/DictionaryComponents/SelectionButtonsGroup";
import { DUDEN_quickSearch } from "@/dict-api/duden";
import { UISearchResult } from "@/types/DictionaryUITypes";
import { useDictionaryStore } from "@/zustand/DictionaryStore";
import { useSelectionStore } from "@/zustand/SelectionStore";
import { Button, Input } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { IoMdSearch } from "react-icons/io";

export function DictSearchBar({disabled} : {disabled?: boolean}) {
    const [query, setQuery] = useState<string>("");
    const [autoComplete, setAutoComplete] = useState<UISearchResult[]>([]);
    const timer = useRef<ReturnType<typeof setTimeout>>();
    const globalSelection = useSelectionStore((state) => state.text);
  
    const doSearch = useDictionaryStore((state) => state.doSearch);
  
    useEffect(() => {
      if (query.length > 1) {
        clearTimeout(timer.current);
  
        timer.current = setTimeout(() => {
          DUDEN_quickSearch(query).then((vals) =>
            setAutoComplete(vals.map((val) => ({ duden_quick: val })))
          );
        }, 200);
      }
    }, [query]);
  
    const handleKeySubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.code === "Enter" && query != "") handleSubmit();
    };
  
    const handleSubmit = (altQuery?: string) => {
      setAutoComplete([]);
      doSearch(altQuery || query);
    };
  
    const handleGlobalSelectionSubmit = () => {
      setQuery(globalSelection);
      handleSubmit(globalSelection);
    };
  
    const handleAutoCompSelect = (res: UISearchResult) => {
      let possQuery = "";
      if (res.pons) possQuery = res.pons.label;
      else if (res.duden) possQuery = res.duden.word;
      else if (res.duden_quick) possQuery = res.duden_quick.word;
  
      if (possQuery.length > 1) {
        setQuery(possQuery);
        handleSubmit(possQuery);
      }
    };
  
    const doIHaveGlobalSelection = globalSelection && globalSelection.length > 0;
  
    return (
      <div className="flex flex-col">
        <div className={`my-3`}>
          <Button
            onPress={handleGlobalSelectionSubmit}
            size="sm"
            radius="full"
            isDisabled={!doIHaveGlobalSelection}
          >
            {doIHaveGlobalSelection
              ? `Search for: ${globalSelection}`
              : "Select a word to search..."}
          </Button>
        </div>
  
        <div className="flex">
          <Input
            onValueChange={setQuery}
            value={query}
            placeholder="Search"
            className="mr-1"
            size="lg"
            onKeyDown={handleKeySubmit}
            disabled={disabled}
          />
          <Button
            isIconOnly
            variant="light"
            size="lg"
            onPress={() => handleSubmit()}
            disabled={disabled}
          >
            <IoMdSearch />
            {/* <CtrlEnterSymbol /> */}
          </Button>
        </div>
        <div
          className={`flex items-center mt-3 pb-3 mb-5 pl-5 border-b-1 ${
            autoComplete.length > 0 ? "" : "opacity-0"
          }`}
        >
          <label className="align-middle font-light text-gray-900 mr-10">
            suggestions:{" "}
          </label>
          <SelectionButtonsGroup
            searchResults={autoComplete}
            selectResult={handleAutoCompSelect}
          />
        </div>
      </div>
    );
  }