const { contextBridge } = require("electron");
const context = require("./context");
const wallpaperService = require("../service/wallpaperService");

wallpaperService.exportContext();

for (const key in context.exports) {
  contextBridge.exposeInMainWorld(key, context.exports[key]);
}