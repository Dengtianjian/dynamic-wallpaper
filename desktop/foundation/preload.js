const { ipcRenderer, contextBridge } = require("electron");
const { RenderApp } = require("./renderApp");
const tray = require("../modules/tray");

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
});

new RenderApp()
  .before(tray)
  .expose("system", "autoStart")
  .expose("system", "init")
  .start();