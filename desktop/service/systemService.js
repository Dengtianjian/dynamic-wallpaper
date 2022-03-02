const { app } = require("electron");

module.exports = {
  autoStartProgram(yes = true) {
    const options = {
      openAtLogin: yes,
      args: [],
      openAsHidden: true
    }

    app.setLoginItemSettings(options);
  }
}