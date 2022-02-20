const { app } = require("electron");
const Path = require("path");
const window = require("./foundation/window");
const tray = require("./foundation/tray");
const wallpaperService = require("./service/wallpaperService");

global.app = {
  basePath: Path.join(__dirname)
};

app.whenReady().then(() => {
  window.createMainWindow();
  tray.initTray();
  wallpaperService.init();
});

app.on("window-all-closed", () => {
  mainWindow = null
  if (process.platform !== 'darwin') {
    app.quit()
  }
});