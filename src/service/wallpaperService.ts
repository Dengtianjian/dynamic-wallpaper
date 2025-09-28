import wallpaperApi from "../api/WallpapersApi";
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

function pushQueue(wallpaperItem: TWallpaperItem) {
  wallpaperStore.autoSwitchQueue.push(wallpaperItem);
  return wallpaperStore.autoSwitchQueue;
}
function resetCycle() {
  clearTimeout(autoSwtichHandler as NodeJS.Timeout);
  autoSwtichHandler = null;
  localStorage.setItem("lastTimeSwtiched", Date.now().toString());
  switchWallpaper(true);
}
function switchWallpaper(enforce: boolean = false) {
  if (wallpaperStore.wallpaperSetting) {
    return waitSet().then(() => {
      switchWallpaper(enforce);
    })
  }
  if (enforce) return autoSwitchWallpaper(enforce);

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

  setTimeout(autoSwitchWallpaper, nextTime);
}
async function autoSwitchWallpaper(enforce: boolean = false): Promise<TWallpaperItem | null> {
  if (!window.wallpaper) return Promise.reject(false);
  if (wallpaperStore.wallpaperSetting) {
    return waitSet().then(() => {
      return autoSwitchWallpaper(enforce);
    });
  }

  if (enforce) {
    clearTimeout(autoSwtichHandler as NodeJS.Timeout);
    autoSwtichHandler = null;
  };
  if (globalStore.settings.autoSwitch === false || autoSwtichHandler) return Promise.resolve(null);
  if (wallpaperStore.autoSwitchQueue.length === 0) {
    const getResult: boolean = await wallpaperApi.randomGetWallpapers(1).then(res => {
      wallpaperStore.autoSwitchQueue.push(...res);

      return true;
    }).catch(() => false);
    if (getResult === false) return Promise.reject();
  }
  
  const first: TWallpaperItem = wallpaperStore.autoSwitchQueue[0];
  if (!first) return autoSwitchWallpaper(enforce);

  return setWallpaper(first.downloadURL, first.id).then(() => {
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
      autoSwitchWallpaper();
    }, nextTime);
    return first;
  }).catch(() => {
    return null;
  })
}
function cancelAutoSwitchWallpaper() {
  clearTimeout(autoSwtichHandler as NodeJS.Timeout);
  autoSwtichHandler = null;
}
function waitSet(): Promise<void> {
  if (setWallpaperPromise) return setWallpaperPromise;
  return Promise.resolve();
}
function setWallpaper(fileUrl: string, id: string): Promise<void> {
  setWallpaperPromise = window.wallpaper
    .wallpaperSet(fileUrl, id)
    .finally(() => {
      wallpaperStore.wallpaperSetting = false;
    })
  return setWallpaperPromise;
}

export default {
  pushQueue,
  resetCycle,
  switchWallpaper,
  autoSwitchWallpaper,
  setWallpaper,
  cancelAutoSwitchWallpaper,
  waitSet,
}