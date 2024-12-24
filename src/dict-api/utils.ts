// import { Conjugation } from "./types";

import { LibOptions } from "./types";
import { fetch } from '@tauri-apps/plugin-http';


// TODO PONS no longer uses this!!!
export async function handleFetch(url: string, options?: LibOptions): Promise<string> {

    if(options == undefined || options.PageFetcher == undefined){
        const res = await fetch(url, {
            method: "GET",
          });
          return await res.text();
    } else {
        return await options.PageFetcher(url)
    }
}
