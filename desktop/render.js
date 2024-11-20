require("./service/envService");

const { ipcRenderer } = require("electron");
const { RenderApp } = require("./foundation/renderApp");
const tray = require("./modules/tray");
const { version } = require("../package.json");

new RenderApp()
  .before(tray)
  .expose("ipcRenderer", ipcRenderer)
  .expose("system", "autoStart")
  .expose("system", "init")
  .expose("client", {
    platform: process.platform,
    env: process.env.mode,
    versions: {
      node: process.versions.node,
      chrome: process.versions.chrome,
      electron: process.versions.electron,
      app: version,
      url: `${process.env.VITE_BACKEND_BASE_URL}/Data/Electron/${process.platform}`
    }
  })
  .expose("client", "checkUpdate")
  .expose("client", "checkAndDownloadUpdate")
  .expose("client", "installUpdate")
  .expose("wallpaper", "wallpaperSet")
  .expose("wallpaper", "downloadWallpaper")
  .expose("wallpaper", "openLink")
  .start();
