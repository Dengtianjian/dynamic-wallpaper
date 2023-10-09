const { Tray, Menu, nativeImage } = require("electron");
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
    let icon = nativeImage.createFromPath(Path.join(appIns.env.basePath, "assets", "icon.png"));
    if (process.platform === "darwin" || process.platform === "linux") {
      icon = icon.resize({
        width: 16,
        height: 16
      });
    }
    applicationTray = new Tray(icon);
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