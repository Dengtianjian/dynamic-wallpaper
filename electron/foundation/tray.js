const { ipcMain, Tray, Menu } = require("electron");
const { createMainWindow, getMainWindow } = require("./window");
const Path = require("path");
const { app } = require("electron");
const Main = require("electron/main");

let applicationTray = null;
function fixedTray() {
  if (!applicationTray) {
    applicationTray = new Tray(Path.join(global.app.basePath, "assets", "icon.png"));
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "退出",
        type: "normal",
        click() {
          app.quit();
        }
      }
    ]);
    applicationTray.setContextMenu(contextMenu);
    applicationTray.setToolTip("wallpaper");
    applicationTray.on("click", () => {
      if (getMainWindow()) {
        const mainWindow = getMainWindow();
        if (mainWindow.isFocused() === false || mainWindow.isMinimized() || mainWindow.isNormal() === false || mainWindow.isVisible() === false) {
          mainWindow.show();
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