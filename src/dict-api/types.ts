// export interface NounConjunction {
//   nominativeSingularForm: string;
//   kasus: "Nominativ" | "Akkusativ" | "Dativ" | "Genitiv";
//   plural: boolean;
//   deklination: string;
// }

export interface LibOptions {
  PageFetcher?: (url: string) => Promise<string>
}

export interface Conjugation {
  api: "duden";
  article: string;
  word: string;
}

export interface ConjugationRow {
  api: "duden";
  Nominativ?: Conjugation;
  Akkusativ?: Conjugation;
  Dativ?: Conjugation;
  Genitiv?: Conjugation;
}

export interface NounDeclention {
  api: "duden";
  Singular?: ConjugationRow;
  Plural?: ConjugationRow;
}

export interface DUDEN_SearchResult {
  api: "duden";
  word: string;
  duden_id: string;
  moreInfo: string;
  link: string;
}

export interface DUDEN_QuickSearchResult {
  link: string;
  word: string;
}

export interface DUDEN_GeneralEntry {
  api: "duden";
  duden_id: string;
  word: string;
  wordart?: string;
  synonyms: DUDEN_GeneralEntry[];
  meanings: DUDEN_EntryMeaning[];
}

export interface DUDEN_EntryMeaning {
  meaning: string,
  examples?: string[]
}

export interface DUDEN_NounEntry extends DUDEN_GeneralEntry {
  wordtype: "noun";
  gender: "Neutrum" | "Maskulin" | "Feminin" | "Pluralwort";
  article: string;
  genitiv?: string;
  plural?: string;
}

export type DUDEN_DictEntry = DUDEN_GeneralEntry | DUDEN_NounEntry

export interface PONSTranslation {
  api: "pons";
  de: string;
  en: string;
}

export interface PONSResult {
  api: "pons";
  pons_id: string;
  word: string;
  phonetics?: string;
  flexicon: string;
  wordclass: string;
  translations: { title: string; translations: PONSTranslation[] }[];
}

export interface PONSResultVerb extends PONSResult {
  wordtype: "verb";
  verbclass: string;
}
export interface PONSResultNoun extends PONSResult {
  wordtype: "noun";
  femininisation?: string;
  genus: string[];
}

export type AllPonsResultTypes = PONSResult | PONSResultVerb | PONSResultNoun;

export type SearchResult = PONS_SearchResult | DUDEN_SearchResult;

export interface PONS_SearchResult {
  api: "pons"
  label: string;
  value: string;
  lang: "de" | "en";
}

