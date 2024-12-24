import { DUDEN_generalSearch, DUDEN_getDictionaryEntry } from "@/dict-api/duden"
import { PONS_getEntry, PONS_search } from "@/dict-api/pons"
import { UIEntries, UISearchResult } from "@/types/DictionaryUITypes"
import { create } from "zustand"


interface DictionaryStore {
  searchResults: UISearchResult[]
  selectedResult: UISearchResult | null
  entries: UIEntries | null,
  doSearch: (query: string) => void,
  selectResult: (selection: UISearchResult) => void,
  getEntries: (selection?: UISearchResult) => void
}

export const useDictionaryStore = create<DictionaryStore>((set, get) => ({
  searchResults: [],
  selectedResult: null,
  entries: null,
  doSearch: async (query: string) => {
    set({entries: null, searchResults: []})

    const duden_res = await DUDEN_generalSearch(query)
    const pons_res = await PONS_search(query)

    const allResults = [
      ...pons_res.map(val => ({ pons: val })),
      ...duden_res.map(val => ({ duden: val }))
    ]
    
        set({searchResults: allResults})
        get().selectResult(allResults[0])
  },
  selectResult: (res: UISearchResult) => {
    set({selectedResult: res})

    // get().getEntries(res)
  },
  getEntries: async (selection?: UISearchResult) => {
    const selectedResult = selection || get().selectedResult
    if(selectedResult) {
      if (selectedResult.pons) {
        const pons_res = await PONS_getEntry(selectedResult.pons.value)

          if (selectedResult.duden) {
            const duden_res = await DUDEN_getDictionaryEntry(
              selectedResult.duden.duden_id
            )
            set({entries: [duden_res, pons_res]})
          } else {
            set({entries: [pons_res]})
          }
      } else if (selectedResult.duden) {
        const duden_res = await DUDEN_getDictionaryEntry(
          selectedResult.duden.duden_id
        )
        set({entries: [duden_res]})
      }
    }
  }
}))
