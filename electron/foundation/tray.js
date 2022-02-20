const { ipcMain, Tray } = require("electron");
const { mainWindow } = require("./window");
const Path = require("path");

let applicationTray = null;
function fixedTray() {
  if (!applicationTray) {
    applicationTray = new Tray(Path.join(global.app.basePath, "assets", "icon.png"));
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