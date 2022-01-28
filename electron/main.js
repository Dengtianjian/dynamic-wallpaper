const { app, BrowserWindow, Menu, Tray } = require("electron");
const path = require("path");

let mainWindow = null;
function createMainWindow() {
  const { screen } = require("electron");
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  mainWindow = new BrowserWindow({
    width: Math.ceil(width * 0.8),
    height: Math.ceil(height * 0.8),
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  if (app.isPackaged) {
    mainWindow.loadFile("index.html");
  } else {
    mainWindow.loadURL("http://localhost:3000");
  }
}

app.whenReady().then(() => {
  createMainWindow();
});

app.on("window-all-closed", () => {
  mainWindow = null
  if (process.platform !== 'darwin') {
    app.quit()
  }
});