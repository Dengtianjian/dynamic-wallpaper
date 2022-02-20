const Path = require("path");
const { contextBridge } = require("electron");
const context = require("./context");
const wallpaperAction = require("../action/wallpaperAction");

global.app = {
  basePath: Path.join(__dirname, "../")
}

wallpaperAction.exportContext();

for (const key in context.exports) {
  contextBridge.exposeInMainWorld(key, context.exports[key]);
}