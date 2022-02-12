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
function bitToMb(bit) {
  return Number(String(Number(bit) / 1024 / 1024).substring(0, 5));
}
function downloadFile(fileUrl, callback = null) {
  return new Promise((resolve, reject) => {
    HTTPS.get(fileUrl, (res) => {
      let total = bitToMb(res.headers['content-length']);
      let downloadedSize = 0;
      res.setEncoding("binary");
      let fileData = "";
      res.on("data", chunk => {
        fileData += chunk;
        downloadedSize += bitToMb(chunk.length);
        if (callback) {
          callback(
            total,
            downloadedSize,
            Number((downloadedSize / total * 100).toFixed(2)),
          );
        }
      });
      res.on("end", () => {
        if (callback) {
          callback(
            total,
            total,
            100,
          );
        }
        resolve(fileData);
      });
      res.on("error", reject)
    })
  })
}
function downloadImageToTemp(imageUrl, callback = null) {
  return new Promise((resolve, reject) => {
    downloadFile(imageUrl, callback).then(imageData => {
      const extensionName = Path.extname(imageUrl);
      const fileSavePath = Path.join(__dirname, "temp", `wallpaper.${extensionName}`);
      saveFile(imageData, fileSavePath).then(() => { resolve(fileSavePath) }).catch(reject);
    });
  });
}
function downloadImageToLocal(imageUrl, callback = null) {
  return new Promise((resolve, reject) => {
    downloadFile(imageUrl, callback).then(imageData => {
      const extensionName = Path.extname(imageUrl);
      const fileSavePath = Path.join(__dirname, "local", `${Date.now()}.${extensionName}`);
      saveFile(imageData, fileSavePath).then(() => { resolve(fileSavePath) }).catch(reject);
    });
  })
}
contextBridge.exposeInMainWorld("wallpaper", {
  set: (wallpaperImageUrl, callback = null) => {
    return downloadImageToTemp(wallpaperImageUrl, callback).then(res => {
      return set(res);
    });
  },
  download(wallpaperImageUrl, callback = null) {
    return downloadImageToLocal(wallpaperImageUrl, callback);
  }
});
contextBridge.exposeInMainWorld("link", {
  openLink: (linkURL) => {
    shell.openExternal(linkURL);
  }
});