const builder = require("electron-builder");

const config = {
  directories: {
    output: "packages"
  },
  asar: true,
  files: [
    {
      from: "dist",
      to: ""
    },
    "electron",
    "package.json"
  ],
  win: {
    target: [{
      target: "nsis"
    }]
  },
  nsis: {
    deleteAppDataOnUninstall: true
  }
}

builder.build({
  config
}).then((res) => {
  console.log(res);
}).catch(err => {
  console.error(err);
})