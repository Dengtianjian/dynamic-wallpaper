const { App } = require("./foundation/app");
const { app, globalShortcut } = require("electron");
const tray = require("./modules/tray");
const systemService = require("./service/systemService");
const wallpaperService = require("./service/wallpaperService");

let maxWidth = 0;
let maxHeight = 0;
let primaryDisplay = null;

const Ins = new App(true, () => {
  const { screen } = require("electron");
  const Displays = screen.getAllDisplays();
  primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  maxWidth = width;
  maxWidth = height;

  Displays.forEach(display => {
    if (display.size.width > maxWidth && display.size.height > maxHeight) {
      maxWidth = display.size.width;
      maxHeight = display.size.height;
    }
  });

  app.on("window-all-closed", () => {
    globalShortcut.unregister("CommandOrControl+q");
    if (process.platform !== 'darwin') {
      Ins.quit(true);
    }
  });
  app.on("activate", function () {
    Ins.showMainWindow();
  });

  app.on("browser-window-blur",()=>{
    globalShortcut.unregister("CommandOrControl+q");
  });
  app.on("browser-window-focus", () => {
    globalShortcut.register("CommandOrControl+q", () => {
      Ins.quit(true);
    });
  });

  app.on('will-quit', () => {
    globalShortcut.unregisterAll()
  })

  return {
    width: Math.ceil(width * 0.8),
    height: Math.ceil(height * 0.8),
    // resizable: false,
    maximizable: true,
    minHeight: Math.ceil(height * 0.6),
    minWidth: Math.ceil(width * 0.6),
  }

})
  .before(tray)
  .on("init", function () {
    return Promise.resolve({
      width: maxWidth,
      height: maxHeight
    });
  })
  .on("autoStart", systemService.autoStartProgram)
  .on("wallpaperSet", wallpaperService.setWallpaper)
  .on("downloadWallpaper", wallpaperService.download)
  .on("openLink", wallpaperService.openLink)
  .on("pro", () => {
    return new Promise(res => {
      setTimeout(() => {
        res(666);
      }, 5000);
    })
  })
  .start();