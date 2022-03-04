const { shell } = require("electron");
const Path = require('path');
const HTTPS = require("https");
const HTTP = require("http");
const FS = require("fs");
const { set } = require("wallpaper");

function saveFile(fileBinaryData, savePath, fileName, overwrite = true) {
  return new Promise((resolve, reject) => {
    if (!FS.existsSync(savePath)) {
      FS.mkdirSync(savePath, {
        recursive: true
      });
    }
    savePath += `/${fileName}`;
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
  let useProtocol = HTTPS;
  if (fileUrl.startsWith("http://")) {
    useProtocol = HTTP;
  }
  return new Promise((resolve, reject) => {
    useProtocol.get(fileUrl, (res) => {
      let total = bitToMb(res.headers['content-length']);
      let extensionName = res.headers['content-type'].split("/")[1];
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
        resolve({ data: fileData, size: total, extensionName });
      });
      res.on("error", reject)
    })
  })
}
function setWallpaper(wallpaperImageUrl, id, callback = null) {
  return download(wallpaperImageUrl, id, callback).then(res => {
    return set(res).then(() => true).catch(() => false);
  })
}
function download(wallpaperImageUrl, id, callback = null) {
  return new Promise((resolve, reject) => {
    const fileDirPath = Path.join(global.app.env.rootPath, "attachments", "wallpapers");
    const fileName = `${id}.webp`;
    const fullPath = Path.join(fileDirPath, fileName);
    if (FS.existsSync(fullPath)) {
      return resolve(fullPath);
    }
    downloadFile(wallpaperImageUrl, callback).then(({ data, size, extensionName }) => {
      saveFile(data, fileDirPath, fileName).then(() => { resolve(fullPath) }).catch(reject);
    });
  });
}
function openLink(linkURL) {
  shell.openExternal(linkURL);
}

module.exports = {
  saveFile,
  bitToMb,
  downloadFile,
  setWallpaper,
  download,
  openLink
}