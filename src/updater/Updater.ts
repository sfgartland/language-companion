import { check, Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { useUpdaterUIState } from "@/zustand/UpdaterUIStore";
import { useAlertStore } from "@/zustand/AlertStore";


export const startupCheckForUpdate = async () => {
    const update = await checkForUpdate();
    if (update) {
        useAlertStore.getState().addAlert({type: "update", message: ""});
    }
};

export const checkForUpdate = async () => {
    useUpdaterUIState.getState().setCheckingForUpdates(true);
    const update = await check();
    console.log("Update:", update)
    useUpdaterUIState.getState().setFoundUpdate(update);
    useUpdaterUIState.getState().setCheckingForUpdates(false);

    return update;
};


export const downloadAndInstallUpdate = async (update: Update) => {

    console.log(
      `installing update ${update.version} from ${update.date} with notes ${update.body}`
    );
    let downloaded = 0;
    let contentLength: number | undefined = 0;
    // alternatively we could also call update.download() and update.install() separately
    await update.downloadAndInstall((event) => {
      switch (event.event) {
        case "Started":
          useUpdaterUIState
            .getState()
            .setUpdateSize(event.data.contentLength || null);
            useUpdaterUIState.getState().setUpdateProgress(0);
          contentLength = event.data.contentLength;
          console.log(`started downloading ${event.data.contentLength} bytes`);
          break;
        case "Progress":
          downloaded += event.data.chunkLength;
          useUpdaterUIState.getState().setUpdateSize(downloaded);
          break;
        case "Finished":
          console.log("download finished");
          useUpdaterUIState.getState().setUpdateSize(null);
          useUpdaterUIState.getState().setUpdateProgress(null);
          break;
      }
    });

    console.log("update installed");
    await relaunch();
};
