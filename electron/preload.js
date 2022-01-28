const { contextBridge, shell } = require("electron");
const { set } = require("wallpaper");
const Path = require('path');
const HTTPS = require("https");
const FS = require("fs");

function saveFile(fileBinaryData, savePath, overwrite = true) {
  return new Promise((resolve, reject) => {

    if (FS.existsSync(savePath)) {
      if (overwrite) {
        FS.rmSync(savePath);
      } else {
        return resolve(savePath);
      }
    }
    FS.writeFile(savePath, fileBinaryData, "binary", (err) => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
}
function downloadFile(fileUrl) {
  return new Promise((resolve, reject) => {
    HTTPS.get(fileUrl, (res) => {
      res.setEncoding("binary");
      let fileData = "";
      res.on("data", chunk => fileData += chunk);
      res.on("end", () => {
        resolve(fileData);
      });
      res.on("error", reject)
    })
  })
}
function downloadImageToTemp(imageUrl) {
  return new Promise((resolve, reject) => {
    downloadFile(imageUrl).then(imageData => {
      const extensionName = Path.extname(imageUrl);
      const fileSavePath = Path.join(__dirname, "temp", `wallpaper.${extensionName}`);
      saveFile(imageData, fileSavePath).then(() => { resolve(fileSavePath) }).catch(reject);
    });
  });
}
function downloadImageToLocal(imageUrl) {
  return new Promise((resolve, reject) => {
    downloadFile(imageUrl).then(imageData => {
      const extensionName = Path.extname(imageUrl);
      const fileSavePath = Path.join(__dirname, "local", `${Date.now()}.${extensionName}`);
      saveFile(imageData, fileSavePath).then(() => { resolve(fileSavePath) }).catch(reject);
    });
  })
}
contextBridge.exposeInMainWorld("wallpaper", {
  set: (wallpaperImageUrl) => {
    return downloadImageToTemp(wallpaperImageUrl).then(res => {
      return set(res);
    });
  },
  download(wallpaperImageUrl) {
    return downloadImageToLocal(wallpaperImageUrl);
  }
});
contextBridge.exposeInMainWorld("link", {
  openLink: (linkURL) => {
    shell.openExternal(linkURL);
  }
});