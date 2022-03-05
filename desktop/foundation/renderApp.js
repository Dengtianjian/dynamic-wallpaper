const { App } = require("./app");
const { ipcRenderer, contextBridge } = require("electron");

const asyncTokenMap = new Map();

ipcRenderer.on("__resolve", (event, token, args) => {
  if (asyncTokenMap.has(token)) {
    asyncTokenMap.get(token).resolve(args);
  }
});
ipcRenderer.on("__reject", (event, token, err) => {
  if (asyncTokenMap.has(token)) {
    asyncTokenMap.get(token).reject(err);
  }
});

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
          const token = Date.now();
          return new Promise((resolve, reject) => {
            const result = ipcRenderer.send(name, token, ...args);
            if (result !== undefined) {
              resolve(result);
              asyncTokenMap.delete(token);
            } else {
              asyncTokenMap.set(token, {
                resolve,
                reject
              });
            }
          })
        }
      } else {
        this.#exposes[key] = name;
      }
    } else {
      if (name === null) {
        this.#exposes[key] = (...args) => {
          const token = Date.now();
          return new Promise((resolve, reject) => {
            const result = ipcRenderer.send(name, token, ...args);
            if (result !== undefined) {
              resolve(result);
              asyncTokenMap.delete(token);
            } else {
              asyncTokenMap.set(token, {
                resolve,
                reject
              });
            }
          })
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
      return new Promise((resolve, reject) => {
        ipcRenderer.send(channelName, [resolve, reject, ...args]);
      })
    });

    for (const key in this.#exposes) {
      contextBridge.exposeInMainWorld(key, this.#exposes[key]);
    }

    return this;
  }
}