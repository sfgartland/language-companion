import { AllPonsResultTypes, PONSResult, PONSResultNoun, PONSTranslation } from "@/dict-api/types";
import { Card, CardBody, CardFooter, CardHeader, Link } from "@nextui-org/react";
import { ReactNode } from "react";

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
  
  export function PONSNonRenderable({ entry, url }: { entry: PONSResult; url: string }) {
    return <BasePONSEntry entry={entry} url={url} />;
  }
  
  export function PONSNoun({ entry, url }: { entry: PONSResultNoun; url: string }) {
    return <BasePONSEntry entry={entry} url={url} />;
  }
  
  export function PONSEntry({ entry, url }: { entry: AllPonsResultTypes; url: string }) {
    if (entry.wordclass == "SUBST")
      return <PONSNoun entry={entry as PONSResultNoun} url={url} />;
    else return <PONSNonRenderable entry={entry as PONSResult} url={url} />;
  }
  