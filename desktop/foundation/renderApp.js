const { App } = require("./app");
const { ipcRenderer, contextBridge } = require("electron");

module.exports.RenderApp = class extends App {
  constructor() {
    super();
    this.render = true;
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
  start() {
    this.expose("ipcEmit", (channelName, ...args) => {
      ipcRenderer.send(channelName, args);
    });

    for (const key in this.#exposes) {
      contextBridge.exposeInMainWorld(key, this.#exposes[key]);
    }

    return this;
  }
}