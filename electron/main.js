const { app } = require("electron");
const Path = require("path");
const window = require("./foundation/window");
const tray = require("./foundation/tray");
const setting = require("./foundation/setting");
const log = require("./foundation/log");

app.whenReady().then(() => {
  setting.set("basePath", Path.join(__dirname));
  setting.init();
  window.createMainWindow();
  tray.initTray();
});

app.on("window-all-closed", () => {
  mainWindow = null
  if (process.platform !== 'darwin') {
    app.quit()
  }
});