const Path = require("path");
const { contextBridge, ipcRenderer } = require("electron");
const context = require("./context");
const wallpaperAction = require("../action/wallpaperAction");
const { App } = require("./app");

new App()
  .expose("ipcRenderer", ipcRenderer)
  .expose("system", "autoStart")
  .expose("system", "auto", () => {
    console.log("aa");
  })
  .render();