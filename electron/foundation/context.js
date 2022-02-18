const { ipcRenderer } = require("electron");

const exportContext = {
  system: {
    ipcRenderer
  }
}

module.exports = {
  exports: exportContext,
  add(key, name, callback) {
    if (!exportContext[key]) {
      exportContext[key] = {};
    }
    exportContext[key][name] = callback;
  }
}