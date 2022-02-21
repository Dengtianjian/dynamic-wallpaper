const { app } = require("electron");

module.exports = {
  autoStartProgram(yes = true) {
    const options = {
      openAtLogin: true,
      args: [],
      openAsHidden: true
    }
    if (yes === false) {
      options.openAtLogin = false;
    }

    app.setLoginItemSettings(options);
  }
}