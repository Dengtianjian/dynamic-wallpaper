const { Tray, Menu } = require("electron");
const Path = require("path");

let appIns = null;

module.exports = function (ins) {
  appIns = ins;
  if (ins.render) {
    ins.expose("tray", "fixedTray");
  } else {
    ins.on("fixedTray", (checked) => {
      if (checked) {
        fixedTray();
      } else {
        cancelFixedTray();
      }
    })
  }
}

let applicationTray = null;
function fixedTray() {
  if (!applicationTray) {
    applicationTray = new Tray(Path.join(appIns.env.basePath, "assets", "icon.png"));
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "退出",
        type: "normal",
        click: () => {
          appIns.quit(true);
        }
      }
    ]);
    applicationTray.setContextMenu(contextMenu);
    applicationTray.setToolTip("wallpaper");
    applicationTray.on("click", () => {
      appIns.showMainWindow();
    });
  }
}
function cancelFixedTray() {
  if (applicationTray) {
    applicationTray.destroy();
    applicationTray = null;
  }
}