let applicationTray = null;
function fixedTray() {
  if (!applicationTray) {
    applicationTray = new Tray(path.join(__dirname, "images", "icon.png"));
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

export default {
  fixedTray,
  cancelFixedTray
}