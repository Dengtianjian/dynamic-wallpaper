const { app, BrowserWindow, Menu, Tray } = require("electron");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  if (app.isPackaged) {
    mainWindow.loadFile("dist/index.html");
  } else {
    mainWindow.loadURL("http://localhost:3000");
  }
}

app.whenReady().then(() => {
  createWindow();
});