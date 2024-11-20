const { app } = require("electron");
const { autoUpdater } = require('electron-updater');
// const loggerService = require("./loggerService");

module.exports = {
  checkUpdate() {
    if (process.platform === "darwin") {
      return Promise.reject({
        message: "Mac 系统请在官网手动下载安装包进行更新"
      });
    }

    autoUpdater.forceDevUpdateConfig = !app.isPackaged;
    autoUpdater.setFeedURL({
      provider: "generic",
      url: `${process.env.VITE_BACKEND_BASE_URL}/Data/Electron/${process.platform}`,
      updaterCacheDirName: "emrpg/update"
    });

    autoUpdater.disableWebInstaller = false;
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = false;

    return new Promise((resolve, reject) => {
      autoUpdater.on("error", (err) => {
        reject(err);
      });

      autoUpdater.on("update-available", (...res) => {
        resolve(true);
      });
      autoUpdater.on("update-not-available", (...res) => {
        resolve(false);
      });

      autoUpdater.checkForUpdates();
    });
  },
  checkAndDownloadUpdate() {
    if (process.platform === "darwin") {
      return Promise.reject({
        message: "Mac 系统请在官网手动下载安装包进行更新"
      });
    }

    autoUpdater.forceDevUpdateConfig = !app.isPackaged;

    autoUpdater.setFeedURL({
      provider: "generic",
      url: `${process.env.VITE_BACKEND_BASE_URL}/Data/Electron/${process.platform}`,
      updaterCacheDirName: "emrpg/update"
    });
    // autoUpdater.logger = loggerService;
    autoUpdater.disableWebInstaller = true;
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = false;

    return new Promise((resolve, reject) => {
      autoUpdater.on("error", (err) => {
        console.log(err);
        reject(err);
      });

      autoUpdater.on("update-available", (...res) => {
        autoUpdater.on("update-downloaded", () => {
          resolve(true);
        });
      });
      autoUpdater.on("update-not-available", (...res) => {
        resolve(false);
      });

      autoUpdater.checkForUpdates();
    });
  },
  installUpdate() {
    if (process.platform === "darwin") {
      return Promise.reject({
        message: "Mac 系统请在官网手动下载安装包进行更新"
      });
    }

    autoUpdater.quitAndInstall();
  }
}