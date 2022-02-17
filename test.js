const HTTPS = require("https");
const FS = require("fs");
const Path = require("path");

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
        console.log(downloadedSize);
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
function downloadImageToLocal(imageUrl, callback = null) {
  return new Promise((resolve, reject) => {
    downloadFile(imageUrl, callback).then(imageData => {
      const extensionName = Path.extname(imageUrl);
      const dirPath = Path.join("electron", "local");
      if (!FS.existsSync(dirPath)) {
        FS.mkdirSync(dirPath);
      }
      const fileSavePath = Path.join(dirPath, `${Date.now()}.${extensionName}`);
      saveFile(imageData, fileSavePath).then(() => { resolve(fileSavePath) }).catch(reject);
    });
  })
}
downloadImageToLocal("https://wallpaper.isdtj.com/downloadAttachment?fileId=attachment:1645090541.16450905416b3ff4562179c8/Attachments/18881645090541.jpg").then(res => {
  console.log(res);
})