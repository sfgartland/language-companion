import * as cheerio from "cheerio";
import { AllPonsResultTypes, LibOptions } from "./types";
import { PONSResultVerb } from "./types";
import { PONSResultNoun } from "./types";
import { PONS_SearchResult } from "./types";
import { handleFetch } from "@/dict-api/utils";
import { fetch } from "@tauri-apps/plugin-http";

export async function PONS_search(
  query: string,
  options?: LibOptions
): Promise<PONS_SearchResult[]> {
  const url = `https://de.pons.com/dict/search/autocomplete-json/?q=${query}&lf=de&l=deen`;
  const html = await handleFetch(url, options);
  const json: PONS_SearchResult[] = JSON.parse(html);

  return json;
}

export async function PONS_getEntry(
  word: string
): Promise<[AllPonsResultTypes[], string]> {
  const res = await fetch(
    "https://api-ng.pons.com/pons-mf-resultpage/api/translate",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        language1: "de",
        language2: "en",
        sourceLanguage: "de",
        query: word,
        dictionaryHint: "deen",
        locale: "de",
      }),
    }
  );

  const json = await res.json();

  const real_results = json["dictionary"]["result"].find(
    (result: any) => result.label == "im PONS Wörterbuch"
  ); // Only include the ones in their dictionary

  const entries: AllPonsResultTypes[] = real_results["content"].map(
    (contents: any) => {
      // const lang = contents["lang"]; // TODO Add!!!
      const hits = contents["hits"]
        .map((content: any) => {
          return content["primary_entry"] ? content["primary_entry"] : content;
        })
        .filter((content: any) => content["type_hint"] == "entry");

      const roms = hits.map((hit: any) => hit.roms).flat();
      const entries: AllPonsResultTypes[] = roms.map((rom: any) => {
        const word = rom["headword_normalized"];
        const id = rom["id"];
        const wordclass = rom["wordclass"];

        const $ = cheerio.load(rom["headword_full"]);
        const phonetics = $("span.phonetics").text().trim();
        const flexicon = $("span.flexion").text().trim();
        const genus = $("span.genus").text().trim() || undefined;
        const femininisation = $("span.femininisation").text().trim();
        const verbclass = $("span.verbclass").text().trim();

        const translations = rom["arabs"].map((arab: any) => ({
          title: arab["header"].replace(/<[^>]*>?/gm, "").replace(/&[a-z]+;/gm, ""),
          translations: arab["translations"].map((trans: any) => ({
            api: "pons",
            en: trans["target"].replace(/<[^>]*>?/gm, "").replace(/&[a-z]+;/gm, ""),
            de: trans["source"].replace(/<[^>]*>?/gm, "").replace(/&[a-z]+;/gm, ""),
          })),
        }));

        return <PONSResultNoun | PONSResultVerb>{
          api: "pons",
          wordtype: genus ? "noun" : "verb",
          pons_id: id,
          word: word,
          phonetics: phonetics,
          flexicon: flexicon,
          wordclass: wordclass,
          translations: translations,
          verbclass: verbclass,
          genus: genus ? genus : undefined,
          femininisation: femininisation,
        };
      });

      console.log(entries);
      return entries;
    }
  );

  const url = `https://de.pons.com/%C3%BCbersetzung-2/englisch-deutsch/${word}`; // For clicking to go to PONS
  return [entries.flat(), url];
}