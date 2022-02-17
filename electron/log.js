const FS = require("fs");
const Path = require("path");
const logDirPath = Path.join(__dirname, "logs");

module.exports = {
  record(content) {
    if (!FS.existsSync(logDirPath)) {
      FS.mkdirSync(logDirPath);
    }
    FS.writeFileSync(Path.join(logDirPath, `${Date.now()}.txt`), content);
  }
}