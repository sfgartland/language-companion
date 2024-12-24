"use client";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Link,
} from "@nextui-org/react";

import { IoMdSearch } from "react-icons/io";
import { KeyboardEvent, ReactNode, useEffect, useRef, useState } from "react";
import {
  DUDEN_getNounDeclention,
  DUDEN_quickSearch,
} from "@/dict-api/duden";
import {
  AllPonsResultTypes,
  Conjugation,
  DUDEN_DictEntry,
  DUDEN_EntryMeaning,
  DUDEN_NounEntry,
  NounDeclention,
  PONSResult,
  PONSResultNoun,
  PONSTranslation,
} from "@/dict-api/types";
import { useSelectionStore } from "@/zustand/SelectionStore";
import { useDictionaryStore } from "@/zustand/DictionaryStore";
import { PONSUIEntry, UISearchResult } from "@/types/DictionaryUITypes";

// { doSearch }: { doSearch: (query: string) => void }
export function DictSearchBar() {
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

  const handleKeySubmit = (e: KeyboardEvent) => {
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
    <div className="flex flex-col mb-10">
      <div className={`my-3`}>
        <Button
          onClick={handleGlobalSelectionSubmit}
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
        />
        <Button
          isIconOnly
          variant="light"
          size="lg"
          onClick={() => handleSubmit()}
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

function PONSTranslationElRow({ trans }: { trans: PONSTranslation }) {
  return (
    <tr className="bg-white odd:bg-slate-100 *:py-5 *:px-2 *:whitespace-pre-wrap">
      <td className="text-end">{trans.de.trim()}</td>
      <td>:</td>
      <td>{trans.en.trim()}</td>
    </tr>
  );
}

function PONSTranslationEl({
  title,
  translations,
}: {
  title: string;
  translations: PONSTranslation[];
}) {
  return (
    <div className="flex-1 flex flex-col">
      <h4 className="text-lg mb-3 mt-5">{title}</h4>
      <table className="mx-5 p-2 table-fixed flex-1">
        <tbody>
          {translations.map((val, i) => (
            <PONSTranslationElRow trans={val} key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BasePONSEntry({
  entry,
  url,
  addiHeader,
}: {
  entry: PONSResult;
  url: string;
  addiHeader?: ReactNode;
}) {

  return (
    <>
      <Card className="mb-10 bg-green-50">
        <CardHeader className="flex justify-between my-3 pl-3 pr-2">
          <span className="flex-1 flex items-end">
            <h4 className="text-medium mr-10 ml-4 text-slate-500 italic whitespace-nowrap">
              PONS Entry
            </h4>
            <h2 className="text-2xl">
              {entry.word}
              {(entry as PONSResultNoun).femininisation}
            </h2>
            <span className="[&>*]:mr-5 ml-5">
              <span>{entry.flexicon}</span>
              <span>{entry.phonetics}</span>
              <span>{entry.wordclass}</span>
              <span className="italic">{(entry as PONSResultNoun).genus}</span>
              {addiHeader}
            </span>
          </span>
          {url ? (
            <Link
              className="whitespace-nowrap"
              isExternal
              isBlock
              showAnchorIcon
              href={`${url}#${entry.pons_id}`}
            >
              open in PONS
            </Link>
          ) : null}
        </CardHeader>
        <CardBody className="pl-5">
          {entry.translations.map((val, i) => (
            <PONSTranslationEl key={i} {...val} />
          ))}
        </CardBody>
        <CardFooter className="flex"></CardFooter>
      </Card>
      {/* {DUDEN_entry ? (
        <div className="ml-10">
          <DUDEN_Entry entry={DUDEN_entry} />
        </div>
      ) : null} */}
    </>
  );
}

function PONSNonRenderable({ entry, url }: { entry: PONSResult; url: string }) {
  return <BasePONSEntry entry={entry} url={url} />;
}

function PONSNoun({ entry, url }: { entry: PONSResultNoun; url: string }) {
  return <BasePONSEntry entry={entry} url={url} />;
}

function PONSEntry({ entry, url }: { entry: AllPonsResultTypes; url: string }) {
  if (entry.wordclass == "SUBST")
    return <PONSNoun entry={entry as PONSResultNoun} url={url} />;
  else return <PONSNonRenderable entry={entry as PONSResult} url={url} />;
}

function DUDENEntryExample({ example }: { example: string }) {
  return <li className="my-4">- {example}</li>;
}

function DUDENEntryMeaning({ meaning }: { meaning: DUDEN_EntryMeaning }) {
  return (
    <div className="bg-slate-50 p-5 my-4 ">
      <p className="text-sm">{meaning.meaning}</p>
      {meaning.examples ? (
        <h6 className="text-medium mt-10">Examples</h6>
      ) : null}
      <ul className="ml-5">
        {meaning.examples?.map((examp, i) => (
          <DUDENEntryExample example={examp} key={i} />
        ))}
      </ul>
    </div>
  );
}

//
function BaseDUDENEntry({
  entry,
  addiBodyContent,
  addiHeaderContent,
  addiFooterContent,
}: {
  entry: DUDEN_DictEntry;
  addiBodyContent?: ReactNode;
  addiHeaderContent?: ReactNode;
  addiFooterContent?: ReactNode;
}) {
  return (
    <>
      <Card className="bg-amber-50">
        <CardHeader className="flex justify-between my-3 pl-3 pr-2">
          <span className="flex-1 flex items-end">
            <h4 className="text-medium mr-10 ml-4 text-slate-500 italic whitespace-nowrap">
              DUDEN Entry
            </h4>
            <h2 className="text-2xl">{entry.word}</h2>
            <span className="[&>*]:mr-5 ml-5">
              <span>{entry.wordart}</span>
              {addiHeaderContent}
            </span>
          </span>
          <Link
            className="whitespace-nowrap"
            isExternal
            isBlock
            showAnchorIcon
            href={`https://www.duden.de/rechtschreibung/${entry.duden_id}`}
          >
            open in Duden
          </Link>
        </CardHeader>
        <CardBody className="*:ml-10 *:mb-5 flex flex-col">
          <div className="flex flex-col">
            <h4 className="text-lg mb-2">Synonyms</h4>
            <span className="ml-4">
              {entry.synonyms.length > 0 ? (
                entry.synonyms.map((syn, i, arr) => (
                  <span key={i}>
                    <Link
                      href={`https://www.duden.de/rechtschreibung/${syn.duden_id}`}
                      isExternal
                      color="foreground"
                    >
                      {syn.word}
                    </Link>
                    {arr.length != i + 1 ? ", " : ""}
                  </span>
                ))
              ) : (
                <i>No entries found under synonyms</i>
              )}
            </span>
          </div>

          <div className="">
            <h4 className="text-lg mb-2">Meanings</h4>
            <ul className="ml-4">
              {entry.meanings.length > 0 ? (
                entry.meanings.map((mean, i) => (
                  <DUDENEntryMeaning meaning={mean} key={i} />
                ))
              ) : (
                <i>No entries found under meaning</i>
              )}
            </ul>
          </div>
          {addiBodyContent}
        </CardBody>
        <CardFooter className="flex">{addiFooterContent}</CardFooter>
      </Card>
      <div className="mb-4 flex flex-col">
        <div className="flex justify-between my-3 pl-3 pr-2"></div>
        <div className="mt-5"></div>
      </div>
    </>
  );
}

function DUDEN_UINounEntry({ entry }: { entry: DUDEN_NounEntry }) {
  const [declentions, setDeclentions] = useState<NounDeclention[]>();

  const getDeclentions = () => {
    DUDEN_getNounDeclention(entry.duden_id).then((res) => setDeclentions(res));
  };

  const footer = (
    <div className="flex flex-col flex-1 p-5">
      {!declentions ? (
        <Button onPress={getDeclentions}>Get Noun Declention</Button>
      ) : (
        declentions.map((decl, i) => <DUDENDeclention key={i} decl={decl} />)
      )}
    </div>
  );

  return (
    <BaseDUDENEntry
      entry={entry as DUDEN_DictEntry}
      addiFooterContent={footer}
    />
  );
}

function DUDEN_Entry({ entry }: { entry: DUDEN_DictEntry }) {
  if (entry.wordart?.includes("Substantiv"))
    return <DUDEN_UINounEntry entry={entry as DUDEN_NounEntry} />;
  else return <BaseDUDENEntry entry={entry} />;
}

function DUDENDeclention({ decl }: { decl: NounDeclention }) {
  const toString = (con: Conjugation | undefined) =>
    con ? `${con.article} ${con.word}` : "";

  const HeadingCell = ({
    children,
    className,
  }: {
    children: any;
    className?: string;
  }) => (
    <th className={`px-5 pt-3 pb-1 text-center ${className}`}>{children}</th>
  );

  const Cell = ({
    children,
    className,
  }: {
    children: any;
    className?: string;
  }) => (
    <td className={`px-5 py-3 border text-center ${className}`}>{children}</td>
  );

  const Row = ({ children }: { children: any }) => (
    <tr className="odd:bg-slate-50">{children}</tr>
  );

  return (
    <>
      <h3 className="text-xl mb-3">Declention Table</h3>
      <table className="table-auto border-collapse">
        <thead>
          <tr>
            <HeadingCell className="text-right">Kasus</HeadingCell>
            <HeadingCell>Singular</HeadingCell>
            <HeadingCell>Plural</HeadingCell>
          </tr>
        </thead>
        <tbody>
          <Row>
            <Cell className="text-right">Nominativ</Cell>
            <Cell>{toString(decl.Singular?.Nominativ)}</Cell>
            <Cell>{toString(decl.Plural?.Nominativ)}</Cell>
          </Row>
          <Row>
            <Cell className="text-right">Akkusativ</Cell>
            <Cell>{toString(decl.Singular?.Akkusativ)}</Cell>
            <Cell>{toString(decl.Plural?.Akkusativ)}</Cell>
          </Row>
          <Row>
            <Cell className="text-right">Dativ</Cell>
            <Cell>{toString(decl.Singular?.Dativ)}</Cell>
            <Cell>{toString(decl.Plural?.Akkusativ)}</Cell>
          </Row>
          <Row>
            <Cell className="text-right">Genitiv</Cell>
            <Cell>{toString(decl.Singular?.Genitiv)}</Cell>
            <Cell>{toString(decl.Plural?.Akkusativ)}</Cell>
          </Row>
        </tbody>
      </table>
    </>
  );
}

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

function SelectionButtonsGroup({
  searchResults,
  currResult,
  selectResult,
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
          active={currResult == ent}
        />
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

export function DictionaryComponent() {
  const {
    searchResults,
    selectedResult,
    entries,
    selectResult,
    getEntries,
  } = useDictionaryStore();

  useEffect(() => {}, []);

  useEffect(() => {
    getEntries();
  }, [selectedResult]);

  console.log(entries || "No Entries!!")

  return (
    <div>
      <h1 className="text-3xl font-bold mb-10">Dictionary</h1>
      <DictSearchBar />
      <div className="flex flex-col">
        {entries ? (
          <>
            <div className="mb-10">
              <SelectionButtonsGroup
                searchResults={searchResults}
                currResult={selectedResult || undefined}
                selectResult={selectResult}
              />
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
