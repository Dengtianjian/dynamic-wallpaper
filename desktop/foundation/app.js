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
  windows = new Map();
  readyWait = null;

  constructor(singleInstance = true) {
    this.#singleInstance = singleInstance;

    this.env = {
      rootPath: Path.join(process.cwd(), "../"),
      basePath: Path.join(__dirname, "../")
    };

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
      listener.call(this, ...args, event);
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
  #createMainWindow() {
    if (this.mainWindow) return;
    const { screen } = require("electron");
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    this.mainWindow = this.createWindow("main", {
      width: Math.ceil(width * 0.8),
      height: Math.ceil(height * 0.8),
      // resizable: false,
      maximizable: true,
      minHeight: Math.ceil(height * 0.6),
      minWidth: Math.ceil(width * 0.6),
    });

    this.mainWindow.on("close", (e) => {
      if (isQuitApp === false) {
        e.preventDefault();
        this.mainWindow.hide();
      }
    });

    if (app.isPackaged) {
      this.mainWindow.loadFile("index.html");
    } else {
      this.mainWindow.loadURL("http://localhost:3000");
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
  needQuitApp = false;
  quit() {
    this.needQuitApp = true;
    app.quit();
  }
}