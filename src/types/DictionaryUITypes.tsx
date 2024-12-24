import { AllPonsResultTypes, DUDEN_DictEntry, DUDEN_QuickSearchResult, DUDEN_SearchResult, PONS_SearchResult } from "@/dict-api/types"

export interface UISearchResult {
    pons?: PONS_SearchResult
    duden?: DUDEN_SearchResult
    duden_quick?: DUDEN_QuickSearchResult
  }
  
  export type PONSUIEntry = [AllPonsResultTypes[], string]
  
  export type UIEntries = (PONSUIEntry | DUDEN_DictEntry)[]