const { app } = require("electron");

module.exports = {
  autoStartProgram(yes = true) {
    const options = {
      openAtLogin: true,
      path=process.execPath,
      args: []
    }
    if (yes === false) {
      options.openAtLogin = false;
    }

    app.setLoginItemSettings(options);
  }
}