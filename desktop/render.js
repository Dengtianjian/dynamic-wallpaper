const { ipcRenderer } = require("electron");
const { App } = require("./foundation/app");

new App()
  .expose("ipcRenderer", ipcRenderer)
  .expose("system", "autoStart")
  .expose("wallpaper", "wallpaperSet")
  .expose("wallpaper", "downloadWallpaper")
  .expose("wallpaper", "openLink")
  .render();