import { check, Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { useUpdaterUIState } from "@/zustand/UpdaterUIStore";
import { useAlertStore } from "@/zustand/AlertStore";

export const checkIfUpdatable = () => {
  if (import.meta.env.VITE_IS_WEB_VERSION === "true")
    throw Error("Updater cannot run on the web version.");
};

export const startupCheckForUpdate = async () => {
  const update = await checkForUpdate();
  if (update) {
    useAlertStore.getState().addAlert({ type: "update", message: "" });
  }
};

export const checkForUpdate = async () => {
  try {
    checkIfUpdatable();

    useUpdaterUIState.getState().setCheckingForUpdates(true);
    const update = await check();
    console.log("Update:", update);
    useUpdaterUIState.getState().setFoundUpdate(update);
    useUpdaterUIState.getState().setCheckingForUpdates(false);

    return update;
  } catch (error) {
    console.error("Error while checking for updates:", error);
    useUpdaterUIState.getState().setUpdateSize(null);
    useUpdaterUIState.getState().setUpdateProgress(null);
    useAlertStore.getState().addAlert({
      type: "error",
      message: `Error while checking for updates: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    });
  }
};

export const downloadAndInstallUpdate = async (update: Update) => {
  try {
    checkIfUpdatable();

    console.log(
      `installing update ${update.version} from ${update.date} with notes ${update.body}`
    );
    let downloaded = 0;
    // alternatively we could also call update.download() and update.install() separately
    await update.downloadAndInstall((event) => {
      switch (event.event) {
        case "Started":
          useUpdaterUIState
            .getState()
            .setUpdateSize(event.data.contentLength || null);
          useUpdaterUIState.getState().setUpdateProgress(0);
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
  } catch (error) {
    console.error("error while downloading and installing update:", error);
    useUpdaterUIState.getState().setUpdateSize(null);
    useUpdaterUIState.getState().setUpdateProgress(null);
    useAlertStore.getState().addAlert({
      type: "error",
      message: `Error while downloading and installing update: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    });
  }
};
