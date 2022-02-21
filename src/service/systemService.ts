import settingApi from "../api/settingApi";
import globalStore from "../store/globalStore";

let initPromise: Promise<boolean> | null = null;

export default {
  init(): Promise<boolean> {
    if (initPromise) {
      return initPromise;
    } else {
      initPromise = new Promise((res, rej) => {
        settingApi.getSettings().then((res) => {
          globalStore.settings.autoStart = Boolean(res.autoStart);
          globalStore.settings.autoSwitch = Boolean(res.autoSwitch);
          globalStore.settings.autoSwtichInterval = Number(res.autoSwtichInterval);
          globalStore.settings.autoSwtichUnit = String(res.autoSwtichUnit);
          globalStore.settings.fixedTray = Boolean(res.fixedTray);
          if (globalStore.settings?.fixedTray) {
            window.system.ipcRenderer.send("fixedTray", true);
          }

          return true;
        }).then(res).catch(rej);
      });
      return initPromise;
    }
  }
}