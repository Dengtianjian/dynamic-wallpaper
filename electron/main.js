const { app } = require("electron");
const Path = require("path");
const window = require("./foundation/window");
const tray = require("./foundation/tray");
const settingAction = require("./action/settingAction");

global.app = {
  rootPath: process.cwd(),
  basePath: Path.join(__dirname)
};

app.whenReady().then(() => {
  window.createMainWindow();
  tray.initTray();

  settingAction.main();
});

app.on("window-all-closed", () => {
  mainWindow = null
  if (process.platform !== 'darwin') {
    app.quit()
  }
});