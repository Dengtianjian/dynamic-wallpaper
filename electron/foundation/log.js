const FS = require("fs");
const Path = require("path");
const setting = require("./setting");
const logDirPath = Path.join(setting.get("basePath"), "electron", "logs");

function genFileName() {
  const d = new Date();
  return `${d.getFullYear()}_${d.getMonth() + 1}_${d.getDate()}.yaml`;
}

module.exports = {
  record(content) {
    if (!FS.existsSync(logDirPath)) {
      FS.mkdirSync(logDirPath, {
        recursive: true
      });
    }
    FS.appendFileSync(Path.join(logDirPath, genFileName()), `${content}\n`);
  }
}