const Path = require("path");
const { app, BrowserWindow } = require("electron");
let mainWindow = null;
let isQuitApp = false;

function createMainWindow() {
  if (mainWindow) return;
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
      preload: Path.join(global.app.basePath, "foundation", "preload.js")
    }
  });

  mainWindow.on("close", (e) => {
    if (isQuitApp === false) {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  if (app.isPackaged) {
    mainWindow.loadFile("index.html");
  } else {
    mainWindow.loadURL("http://localhost:3000");
  }
}

function getMainWindow() {
  return mainWindow;
}

function destroyMainWindow() {
  mainWindow = null;
}

function quitApp() {
  isQuitApp = true;
  app.quit();
}

module.exports = {
  mainWindow,
  createMainWindow,
  getMainWindow,
  destroyMainWindow,
  quitApp
}