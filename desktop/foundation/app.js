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
  mainWindowOptions = {};
  windows = new Map();
  readyWait = null;

  constructor(singleInstance = true, mainWindowOptions = {}) {
    this.#singleInstance = singleInstance;
    this.mainWindowOptions = mainWindowOptions;

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
    this.mainWindow = this.createWindow("main", this.mainWindowOptions);

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