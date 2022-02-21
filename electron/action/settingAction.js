const { ipcMain } = require("electron");
const systemService = require("../service/systemService");

module.exports = {
  main() {
    ipcMain.on("autoStartProgram", systemService.autoStartProgram);
  }
}