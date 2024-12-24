//www.duden.de/deklination/substantive/Studentin

import * as cheerio from "cheerio";

// const cheerio = require("cheerio")

import {
  Conjugation,
  ConjugationRow,
  NounDeclention,
  DUDEN_SearchResult,
  DUDEN_DictEntry,
  DUDEN_QuickSearchResult,
  DUDEN_EntryMeaning,
  LibOptions,
} from "./types";
import { DUDEN_GeneralEntry } from "@/dict-api/types";
import { handleFetch } from "@/dict-api/utils";

export async function DUDEN_getDictionaryEntry(
  duden_id: string,
  options?: LibOptions
): Promise<DUDEN_DictEntry> {
  const url = `https://www.duden.de/rechtschreibung/${duden_id}`;
  const html = await handleFetch(url, options);

  const $ = cheerio.load(html);

  const lemma_main = $(".lemma__main").text();
  const lemma_determiner = $(".lemma__determiner").text();
  const tuples = $("dl.tuple")
    .get()
    .map(
      //@ts-ignore
      (el) =>
        <{ key: string; content: string }>{
          key: $(".tuple__key", el).text(),
          content: $(".tuple__val", el).text(),
        }
    );

  const wortart = tuples.find((el) => el.key.includes("Wortart"))?.content;

  const grammarString = $("div.division#grammatik>p").first().text();
  const matches = /^(.+)\;\sGenitiv\:\s(.+)\,\sPlural\:\s(.+)/.exec(
    grammarString
  );

  const genitiv = matches && matches?.length > 0 ? matches[2] : undefined;
  const plural = matches && matches?.length > 0 ? matches[3] : undefined;

  const synonyms = $("div.division#synonyme ul a")
    .get()
    //@ts-ignore
    .map((el) => {
      const link = $(el).attr("href");
      if (!link) throw Error("Failed to parse duden website!");

      return <DUDEN_GeneralEntry>{
        duden_id: link.split("/").at(-1),
        word: $(el).text(),
      };
    });

  const meanings: DUDEN_EntryMeaning[] = $(
    "div.division#bedeutungen .enumeration .enumeration__item"
  )
    .get()
    //@ts-ignore
    .map((el) => {
      const meaning = $(".enumeration__text", el)
        .text()
        .trim()
        .replace(/\s+/g, " ");

      const notes = $(".note", el)
        .get()
        //@ts-ignore
        .map((note) => {
          const noteTitle = $("dt.note__title", note).text();
          const content = $("dd", note);

          return {
            title: noteTitle,
            content: content,
          };
        });

      const exampleNotes = notes.filter(
        //@ts-ignore
        (note) => note.title == "Beispiel" || note.title == "Beispiele"
      );
      if (exampleNotes.length != notes.length) {
        console.warn(
          "There is probably additional notes that have not been parsed on this page!"
        );
      }
      const examples = exampleNotes.map((note) =>
        $(".note__list li", note.content).text().trim().replace(/\s+/g, " ")
      );

      return {
        meaning: meaning,
        examples: examples.length > 0 ? examples : undefined,
      };
    });

  return {
    api: "duden",
    duden_id: duden_id,
    wordart: wortart,
    word: lemma_main,
    synonyms: synonyms,
    article: lemma_determiner,
    genitiv: genitiv,
    plural: plural,
    meanings: meanings,
  };
}

export async function DUDEN_getNounDeclention(
  duden_id: string,
  options?: LibOptions
) {
  const url = `https://www.duden.de/deklination/substantive/${duden_id}`;
  const html = await handleFetch(url, options);

  const $ = cheerio.load(html);

  // const infinitiveForm = $("h1 > em").first().text();

  const tables: NounDeclention[] = $("#accordion")
    .get()
    //@ts-ignore
    .map((el): NounDeclention => {
      console.log("Table");
      let conjunction: NounDeclention = { api: "duden" };

      $(".accordion-table", el)
        .get()
        //@ts-ignore
        .forEach((el) => {
          const casesText = $(".sidebar-column .accordion__item", el)
            .get()
            //@ts-ignore
            .map((el) => $(el).text());
          const declentionsText = $(".content-column .accordion__item", el)
            .get()
            //@ts-ignore
            .map((el) => $(el).text());

          if (casesText[0] != "Kasus")
            throw Error("There was an error parsing the duden website!");

          const plurality = declentionsText[0];

          const cases = casesText.slice(1);
          const declentions = declentionsText.slice(1);

          // TODO check that this works
          const conjunctionRow = cases.reduce(
            //@ts-ignore
            (prev, curr: string, index) => {
              // console.log(prev)
              // console.log("---")

              // @ts-ignore
              prev[curr] = <Conjugation>{
                article: declentions[index].split(" ")[0],
                word: declentions[index].split(" ").slice(1).join(" "),
              };
              return prev;
            },
            <ConjugationRow>{}
          );

          conjunction = { ...conjunction, [plurality]: conjunctionRow };
        });

      if (!conjunction.Plural && !conjunction.Singular)
        throw Error("Failed to parse duden page!");

      return conjunction;
    });

  return tables;
}

function DUDEN_generalSearchParser(html: string) {
  const $ = cheerio.load(html);

  const allHits: DUDEN_SearchResult[] = $(".vignette")
    .get()
    //@ts-ignore
    .map((el) => {
      const link = $("a", el).first().attr("href");
      const duden_id = link?.split("/").at(-1);
      if (!duden_id || !link) throw Error("Failed to parse duden site!");

      return {
        api: "duden",
        word: $("strong", el).text(), // TODO fix the &shy; character problem
        duden_id: duden_id,
        moreInfo: $(".vignette__snippet", el).first().text().trim(),
        link: link,
      };
    });

  return allHits;
}

export async function DUDEN_quickSearch(
  text: string,
  options?: LibOptions
): Promise<DUDEN_QuickSearchResult[]> {
  const url = `https://www.duden.de/search_api_autocomplete/dictionary_search?display=page_1&&filter=search_api_fulltext&q=${encodeURIComponent(text)}&scope=dictionary`;
  const html = await handleFetch(url, options);

  const json = JSON.parse(html);

  const parsed: DUDEN_QuickSearchResult[] = json.map(
    (val: { value: string; build: string }) => {
      const $ = cheerio.load(val.build);
      const word = $(".form-asap__guess-lemma").text();

      return { link: val.value, word: word };
    }
  );

  // console.log(json)
  return parsed;
}

export async function DUDEN_generalSearch(text: string, options?: LibOptions) {
  const url = `https://www.duden.de/suchen/dudenonline/${text}`;
  const html = await handleFetch(url, options);

  // const html = fs.readFileSync("html.html").toString().replace("&shy;", "");
  // fs.writeFileSync("./html.html", html)

  return DUDEN_generalSearchParser(html);
}

export async function DUDEN_grammarSearch(text: string, options?: LibOptions) {
  const url = `https://www.duden.de/suchen/flexion/${text}`; //TODO clean the text to be url OK
  const html = await handleFetch(url, options);

  // const html = fs.readFileSync("html.html").toString().replace("&shy;", "");
  // fs.writeFileSync("./html.html", html)

  return DUDEN_generalSearchParser(html);
}

// const main = async () => {
//   // const html = fs.readFileSync("html.html").toString();
//   // fs.writeFileSync("./html.html", html)

//   // console.log(await getNounDeclention("studentin"));
//   // console.log(await generalSearch("lesen"));

//   const search_term = "Nachbar";
//   const duden_id = (await generalSearch(search_term))[0].duden_id;
//   console.log(`Getting declention for "${duden_id}"`);
//   const decl = await getNounDeclention(duden_id);
//   const mainDeclention = decl[0];
//   const genitiv = mainDeclention.find(
//     (decl) => decl.kasus == "Genitiv" && !decl.plural
//   );
//   const plural = mainDeclention.find(
//     (decl) => decl.kasus == "Nominativ" && decl.plural
//   );
//   console.table([genitiv, plural]);
// };
