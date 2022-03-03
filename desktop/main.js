const { App } = require("./foundation/app");
const tray = require("./modules/tray");
const { ipcRenderer } = require("electron");
const systemService = require("./service/systemService");

new App()
  .before(tray)
  .on("autoStart", systemService.autoStartProgram)
  .start();