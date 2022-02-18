const { app, BrowserWindow, Menu, Tray, ipcMain } = require("electron");
const path = require("path");

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

  ipcMain.on("fixedTray", (event, checked) => {
    if (checked) {
      fixedTray();
    } else {
      cancelFixedTray();
    }
  })
});

app.on("window-all-closed", () => {
  mainWindow = null
  if (process.platform !== 'darwin') {
    app.quit()
  }
});