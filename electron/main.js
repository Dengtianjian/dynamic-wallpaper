const { app } = require("electron");
const Path = require("path");
const window = require("./foundation/window");
const tray = require("./foundation/tray");

global.app = {
  basePath: Path.join(__dirname)
};

app.whenReady().then(() => {
  window.createMainWindow();
  tray.initTray();
});

app.on("window-all-closed", () => {
  mainWindow = null
  if (process.platform !== 'darwin') {
    app.quit()
  }
});