const { app } = require("electron");
const Path = require("path");
const window = require("./foundation/window");
const tray = require("./foundation/tray");
const settingAction = require("./action/settingAction");

const getTheLock = app.requestSingleInstanceLock();

if (!getTheLock) {
  return app.quit();
}

app.on("second-instance", () => {
  if (window.getMainWindow()) {
    // if(window.getMainWindow().)
    if (window.getMainWindow().isMinimized()) window.getMainWindow().restore();
    window.getMainWindow().focus();
  }
});

global.app = {
  rootPath: process.cwd(),
  basePath: Path.join(__dirname)
};

app.whenReady().then(() => {
  window.createMainWindow();
  tray.initTray();

  settingAction.main();
});