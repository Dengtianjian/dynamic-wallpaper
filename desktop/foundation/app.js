const { app, BrowserWindow, ipcMain, Menu, nativeImage, dialog, Tray } = require("electron");
const Path = require("path");
const FS = require("fs");

let applicationTray = null;

module.exports.App = class {
  #singleInstance = true;
  render = false;

  env = {
    rootPath: "",
    basePath: ""
  }
  mainWindow = null;
  mainWindowOptionsCallBack = {};

  windows = new Map();
  readyWait = null;

  constructor(singleInstance = true, mainWindowOptionsCallBack = null) {
    this.#singleInstance = singleInstance;
    this.mainWindowOptionsCallBack = mainWindowOptionsCallBack;

    this.env.rootPath = process.cwd();
    this.env.desktopPath = "desktop";
    this.env.basePath = Path.join(__dirname, "../");

    global.app = this;
  }
  before(fn) {
    fn(this);

    return this;
  }
  after(fn) {
    if (this.readyWait) {
      this.readyWait.then(() => fn(this));
    } else {
      fn(this);
    }
  }
  listen(callback) {
    callback(this);

    return this;
  }
  on(channel, listener) {
    ipcMain.on(channel, (event, token, ...args) => {
      if (Object.prototype.toString.call(listener).indexOf("Async") !== -1) {
        listener.call(this, ...args).then((args) => {
          this.mainWindow.webContents.send("__resolve", token, args);
        }).catch(() => {
          this.mainWindow.webContents.send("__reject", token, err);
        })
      } else {
        const result = listener.call(this, ...args);
        if ((typeof result === "object" || typeof result === "function") && typeof result.then === "function") {
          result.then((args) => {
            this.mainWindow.webContents.send("__resolve", token, args);
          }).catch((err) => {
            this.mainWindow.webContents.send("__reject", token, err);
          })
        } else {
          event.returnValue = result;
        }
      }
    });

    return this;
  }
  dispatch(eventName, data) {
    this.mainWindow.webContents.send(eventName, data);

    return this;
  }
  createWindow(windowId, options = {}) {
    Object.assign(options, {
      title: "壁纸",
      icon: Path.join(__dirname, "../", "icons", "icon.ico"),
      titleBarStyle: process.platform === 'darwin' ? 'hidden' : "default",
      webPreferences: {
        // contextIsolation: false,
        sandbox: false,
        preload: Path.join(__dirname, '../render.js'),
        webSecurity: false
      }
    });

    const winIns = new BrowserWindow(options);

    this.windows.set(windowId, winIns);

    return winIns;
  }
  async createMainWindow(preloadFilePath = null, title = "Electron", icon = null, options = {}) {
    if (this.mainWindow) return;

    if (this.mainWindowOptionsCallBack) {
      Object.assign(options, await this.mainWindowOptionsCallBack());
    }

    if (preloadFilePath) {
      if (options['webPreferences']) {
        options['webPreferences']['preload'] = preloadFilePath;
      } else {
        options['webPreferences'] = {
          preload: Path.join(__dirname, 'preload.js')
        }
      }
    }

    if (title) {
      options['title'] = title;
    }
    if (icon) {
      options['icon'] = icon;
    } else {
      options['icon'] = Path.join(__dirname, "../", "icons", "icon.ico");
    }

    this.mainWindow = this.createWindow("main", options);

    if (app.isPackaged) {
      this.mainWindow.loadFile(Path.join(__dirname, "../../", "dist", "web", "index.html"));
    } else {
      this.mainWindow.loadURL('http://localhost:3000');
    }

    this.mainWindow.on("close", (e) => {
      if (this.forceQuit === false) {
        e.preventDefault();
        this.mainWindow.hide();
      }
    });

    // if (process.env.mode !== "production") {
    //   this.mainWindow.webContents.openDevTools();
    // }
    // this.mainWindow.webContents.openDevTools();

    this.mainWindow.setAutoHideMenuBar(true);
    if (process.platform !== 'darwin') {
      this.mainWindow.removeMenu();
    }

    return this;
  }
  showMainWindow() {
    if (this.mainWindow) {
      if (this.mainWindow.isFocused() === false || this.mainWindow.isMinimized() || this.mainWindow.isNormal() === false || this.mainWindow.isVisible() === false) {
        this.mainWindow.show();
      }
    } else {
      this.createMainWindow();
    }
  }
  start(callback = null) {
    if (this.#singleInstance) {
      const getTheLock = app.requestSingleInstanceLock();

      if (!getTheLock) {
        return app.quit();
      }

      app.on("second-instance", () => {
        if (this.mainWindow) {
          if (this.mainWindow.isMinimized()) this.mainWindow.restore();
          this.mainWindow.focus();
        }
      });
    }

    if (app.isPackaged) {
      Menu.setApplicationMenu(null);
    }

    this.readyWait = app.whenReady().then(() => {
      this.createMainWindow();

      callback && callback(this);
    });
    return this;
  }
  forceQuit = false;
  // close() {
  //   BrowserWindow.getAllWindows().forEach(item => {
  //     item.destroy();
  //   });
  //   this.mainWindow = null;
  // }
  quit(forceQuit = true) {
    this.forceQuit = forceQuit;
    app.quit();
  }
}