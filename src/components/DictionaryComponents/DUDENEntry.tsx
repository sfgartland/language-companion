import { DUDEN_getNounDeclention } from "@/dict-api/duden";
import { Conjugation, DUDEN_DictEntry, DUDEN_EntryMeaning, DUDEN_NounEntry, NounDeclention } from "@/dict-api/types";
import { Button, Card, CardBody, CardFooter, CardHeader, Link } from "@nextui-org/react";
import { ReactNode, useState } from "react";

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
  
  export function DUDEN_Entry({ entry }: { entry: DUDEN_DictEntry }) {
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