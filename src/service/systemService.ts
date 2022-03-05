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
          globalStore.settings.autoStart = Boolean(Number(res.autoStart));
          globalStore.settings.autoSwitch = Boolean(Number(res.autoSwitch));
          globalStore.settings.autoSwtichInterval = Number(Number(res.autoSwtichInterval));
          globalStore.settings.autoSwtichUnit = String(res.autoSwtichUnit);
          globalStore.settings.fixedTray = Boolean(Number(res.fixedTray));
          if (globalStore.settings?.fixedTray) {
            window.tray.fixedTray(true);
          }

          return true;
        }).then(res).catch(rej);
      });
      return initPromise;
    }
  }
}