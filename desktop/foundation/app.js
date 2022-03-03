const { app, BrowserWindow, ipcMain, ipcRenderer, contextBridge } = require("electron");
const Path = require("path");

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

    this.env = {
      rootPath: Path.join(process.cwd(), "../"),
      basePath: Path.join(__dirname, "../")
    };

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
  on(channel, listener) {
    ipcMain.on(channel, (event, args) => {
      listener.call(this, ...args);
    });

    return this;
  }
  createWindow(windowId, options = {}) {
    Object.assign(options, {
      webPreferences: {
        preload: Path.join(this.env.basePath, "render.js")
      }
    });

    const winIns = new BrowserWindow(options);
    this.windows.set(windowId, winIns);

    return winIns;
  }
  async #createMainWindow() {
    if (this.mainWindow) return;

    const options = {};
    if (this.mainWindowOptionsCallBack) {
      Object.assign(options, await this.mainWindowOptionsCallBack());
    }

    this.mainWindow = this.createWindow("main", options);

    this.mainWindow.on("close", (e) => {
      if (this.forceQuit === false) {
        e.preventDefault();
        this.mainWindow.hide();
      }
    });

    if (app.isPackaged) {
      this.mainWindow.loadFile("index.html");
    } else {
      this.mainWindow.loadURL("http://localhost:3000");
    }

    return this;
  }
  showMainWindow() {
    if (this.mainWindow) {
      if (this.mainWindow.isFocused() === false || this.mainWindow.isMinimized() || this.mainWindow.isNormal() === false || this.mainWindow.isVisible() === false) {
        this.mainWindow.show();
      }
    } else {
      this.#createMainWindow();
    }
  }
  start() {
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

    this.readyWait = app.whenReady().then(this.#createMainWindow.bind(this));

    return this;
  }
  forceQuit = false;
  quit(forceQuit = true) {
    this.forceQuit = forceQuit;
    app.quit();
  }
}