import globalStore from "../store/globalStore";
import wallpaperStore from "../store/wallpaperStore";
import { TWallpaperItem } from "../types/wallpaperTypes";

let autoSwtichHandler: null | NodeJS.Timeout = null;

function minuteToMilliseconds(minutes: number): number {
  return minutes * 60 * 1000;
}

function genRandomNumber(min: number = 0, max: number = 10): number {
  max = max - min + 1;
  if (max < 0) max = 0;
  return min + Math.round(Math.random() * max);
}
function genRandomTime(): number {
  return minuteToMilliseconds(genRandomNumber(5, 10));//* 以分钟为基准单位
}

let setWallpaperPromise: null | Promise<any> = null;

export default {
  pushQueue(wallpaperItem: TWallpaperItem) {
    wallpaperStore.autoSwitchQueue.push(wallpaperItem);
    return wallpaperStore.autoSwitchQueue;
  },
  resetCycle() {
    clearTimeout(autoSwtichHandler as NodeJS.Timeout);
    autoSwtichHandler = null;
    localStorage.setItem("lastTimeSwtiched", Date.now().toString());
    this.switchWallpaper();
  },
  switchWallpaper(enforce: boolean = false) {
    if (wallpaperStore.wallpaperSetting) {
      return this.waitSet().then(() => {
        this.switchWallpaper(enforce);
      })
    }
    if (enforce) return this.autoSwitchWallpaper(enforce);

    let nextTime: number = 0;
    const lastTimeSwtiched: number = localStorage.getItem("lastTimeSwtiched") ? Number(localStorage.getItem("lastTimeSwtiched")) : -1;
    switch (globalStore.settings.autoSwtichUnit) {
      case "day":
        if (lastTimeSwtiched > 0) {
          const nextSwitchTime: number = lastTimeSwtiched + (globalStore.settings.autoSwtichInterval * 86400000);
          nextTime = globalStore.settings.autoSwtichInterval * 86400000;
          if (nextSwitchTime > Date.now()) {
            nextTime = nextSwitchTime - Date.now();
          }
        } else {
          nextTime = globalStore.settings.autoSwtichInterval * 86400000;
        }
        break;
      case "hour":
        nextTime = (lastTimeSwtiched + minuteToMilliseconds(globalStore.settings.autoSwtichInterval * 60)) - Date.now();
        break;
      case "minute":
        nextTime = (lastTimeSwtiched + minuteToMilliseconds(globalStore.settings.autoSwtichInterval)) - Date.now();
        break;
      case "random":
        nextTime = genRandomTime();
        break;
    }
    if (nextTime < 1) {
      nextTime = 0;
    }

    setTimeout(this.autoSwitchWallpaper, nextTime);
  },
  autoSwitchWallpaper(enforce: boolean = false): Promise<TWallpaperItem | null> {
    if (wallpaperStore.wallpaperSetting) {
      return this.waitSet().then(() => {
        return this.autoSwitchWallpaper(enforce);
      });
    }
    if (enforce) {
      clearTimeout(autoSwtichHandler as NodeJS.Timeout);
      autoSwtichHandler = null;
    };
    if (globalStore.settings.autoSwitch === false || autoSwtichHandler || wallpaperStore.autoSwitchQueue.length === 0) return Promise.resolve(null);

    const first: TWallpaperItem = wallpaperStore.autoSwitchQueue[0];

    return this.setWallpaper(first.fileUrl).then(() => {
      wallpaperStore.autoSwitchQueue.shift();
      localStorage.setItem("lastTimeSwtiched", Date.now().toString());

      let nextTime: number = 50000;
      switch (globalStore.settings.autoSwtichUnit) {
        case "day":
          const lastTimeSwtiched: number = localStorage.getItem("lastTimeSwtiched") ? Number(localStorage.getItem("lastTimeSwtiched")) : -1;
          if (lastTimeSwtiched > 0) {
            const nextSwitchTime: number = lastTimeSwtiched + (globalStore.settings.autoSwtichInterval * 86400000);
            nextTime = globalStore.settings.autoSwtichInterval * 86400000;
            if (nextSwitchTime > Date.now()) {
              nextTime = nextSwitchTime - Date.now();
            }
          } else {
            nextTime = globalStore.settings.autoSwtichInterval * 86400000;
          }
          break;
        case "hour":
          nextTime = minuteToMilliseconds(globalStore.settings.autoSwtichInterval * 60);
          break;
        case "minute":
          nextTime = minuteToMilliseconds(globalStore.settings.autoSwtichInterval);
          break;
        case "random":
          nextTime = genRandomTime();
          break;
      }

      autoSwtichHandler = setTimeout(() => {
        clearTimeout(autoSwtichHandler as NodeJS.Timeout);
        autoSwtichHandler = null;
        this.autoSwitchWallpaper();
      }, nextTime);
      return first;
    }).catch(err => {
      return null;
    })
  },
  cancelAutoSwitchWallpaper() {
    clearTimeout(autoSwtichHandler as NodeJS.Timeout);
    autoSwtichHandler = null;
  },
  waitSet(): Promise<void> {
    if (setWallpaperPromise) return setWallpaperPromise;
    return Promise.resolve();
  },
  setWallpaper(fileUrl: string): Promise<void> {
    setWallpaperPromise = window.wallpaper
      .set(fileUrl)
      .finally(() => {
        wallpaperStore.wallpaperSetting = false;
      });
    return setWallpaperPromise;
  }
}