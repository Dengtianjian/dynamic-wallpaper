const { app, BrowserWindow, ipcMain, ipcRenderer, contextBridge } = require("electron");
const Path = require("path");
const window = require("./window");

module.exports.App = class {
  #singleInstance = true;
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
  #exposes = {};
  expose(key, name, listener = null) {
    if (listener === null) {
      if (typeof name === "string") {
        if (!this.#exposes[key]) {
          this.#exposes[key] = {};
        }
        this.#exposes[key][name] = (...args) => {
          ipcRenderer.send(name, args);
        }
      } else {
        this.#exposes[key] = name;
      }
    } else {
      if (name === null) {
        this.#exposes[key] = (...args) => {
          ipcRenderer.send(name, args);
        }
      } else {
        if (!this.#exposes[key]) {
          this.#exposes[key] = {};
        }
        this.#exposes[key][name] = listener;
      }
    }

    return this;
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
  render() {
    this.expose("ipcEmit", (channelName, ...args) => {
      ipcRenderer.send(channelName, args);
    });

    for (const key in this.#exposes) {
      contextBridge.exposeInMainWorld(key, this.#exposes[key]);
    }

    return this;
  }
}