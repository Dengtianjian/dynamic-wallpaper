const { App } = require("./foundation/app");
const tray = require("./modules/tray");
const systemService = require("./service/systemService");
const wallpaperService = require("./service/wallpaperService");

new App()
  .before(tray)
  .on("autoStart", systemService.autoStartProgram)
  .on("wallpaperSet", wallpaperService.setWallpaper)
  .on("downloadWallpaper", wallpaperService.download)
  .on("openLink", wallpaperService.openLink)
  .start();