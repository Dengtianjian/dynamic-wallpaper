const { app, BrowserWindow, ipcMain, ipcRenderer, contextBridge } = require("electron");
const Path = require("path");
const window = require("./window");

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
    window.createMainWindow(this);
  }
  start() {
    // if (this.#singleInstance) {
    //   const getTheLock = app.requestSingleInstanceLock();

    //   if (!getTheLock) {
    //     return app.quit();
    //   }

    //   app.on("second-instance", () => {
    //     if (window.getMainWindow()) {
    //       // if(window.getMainWindow().)
    //       if (window.getMainWindow().isMinimized()) window.getMainWindow().restore();
    //       window.getMainWindow().focus();
    //     }
    //   });
    // }

    this.readyWait = app.whenReady().then(this.#createMainWindow.bind(this));

    return this;
  }
}