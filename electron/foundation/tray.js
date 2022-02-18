const { ipcMain, Tray } = require("electron");
const { mainWindow } = require("./window");
const Path = require("path");
const setting = require("./setting");

let applicationTray = null;
function fixedTray() {
  if (!applicationTray) {
    applicationTray = new Tray(Path.join(setting.get("basePath"), "assets", "icon.png"));
    applicationTray.setToolTip("wallpaper");
    applicationTray.on("click", () => {
      if (mainWindow) {
        if (mainWindow.isFocused() || !mainWindow.isMinimized()) {
          mainWindow.minimize();
        } else {
          mainWindow.focus();
        }
      } else {
        createMainWindow();
      }
    })
  }
}
function cancelFixedTray() {
  if (applicationTray) {
    applicationTray.destroy();
    applicationTray = null;
  }
}
function initTray() {
  if (setting.get("tray").fixed) {
    fixedTray();
  }
  ipcMain.on("fixedTray", (event, checked) => {
    if (checked) {
      fixedTray();
    } else {
      cancelFixedTray();
    }
  });
}

module.exports = {
  initTray,
  fixedTray,
  cancelFixedTray
}