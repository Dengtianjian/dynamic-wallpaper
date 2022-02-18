const Path = require("path");
const { app, BrowserWindow } = require("electron");
const setting = require("./setting")

let mainWindow = null;

function createMainWindow() {
  const { screen } = require("electron");
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  mainWindow = new BrowserWindow({
    width: Math.ceil(width * 0.8),
    height: Math.ceil(height * 0.8),
    // resizable: false,
    maximizable: true,
    minHeight: Math.ceil(height * 0.6),
    minWidth: Math.ceil(width * 0.6),
    webPreferences: {
      preload: Path.join(setting.get("basePath"), "foundation", "preload.js")
    }
  });

  if (app.isPackaged) {
    mainWindow.loadFile("index.html");
  } else {
    mainWindow.loadURL("http://localhost:3000");
  }
}

module.exports = {
  mainWindow,
  createMainWindow
}