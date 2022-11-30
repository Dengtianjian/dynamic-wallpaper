const { ipcRenderer } = require("electron");
const { RenderApp } = require("./foundation/renderApp");
const tray = require("./modules/tray");

new RenderApp()
  .before(tray)
  .expose("ipcRenderer", ipcRenderer)
  .expose("system", "autoStart")
  .expose("wallpaper", "wallpaperSet")
  .expose("wallpaper", "downloadWallpaper")
  .expose("wallpaper", "openLink")
  .expose("pro")
  .expose("system", "init")
  .start();