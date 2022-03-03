const { App } = require("./foundation/app");
const tray = require("./modules/tray");
const systemService = require("./service/systemService");
const wallpaperService = require("./service/wallpaperService");

new App(true, () => {
  const { screen } = require("electron");
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  return {
    width: Math.ceil(width * 0.8),
    height: Math.ceil(height * 0.8),
    // resizable: false,
    maximizable: true,
    minHeight: Math.ceil(height * 0.6),
    minWidth: Math.ceil(width * 0.6),
  }
})
  .before(tray)
  .on("autoStart", systemService.autoStartProgram)
  .on("wallpaperSet", wallpaperService.setWallpaper)
  .on("downloadWallpaper", wallpaperService.download)
  .on("openLink", wallpaperService.openLink)
  .start();