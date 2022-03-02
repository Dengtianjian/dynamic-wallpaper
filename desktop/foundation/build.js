const builder = require("electron-builder");
const { zip } = require('zip-a-folder');
const path = require("path");

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
    {
      from: "desktop",
      to: "desktop",
      filter: ["!attachments","!logs"]
    },
    "package.json"
  ],
  win: {
    target: [{
      target: "nsis"
    }]
  },
  nsis: {
    deleteAppDataOnUninstall: true
  },
  publish: false
}

builder.build({
  config
}).then(() => {
  return zip(path.join(__dirname, "../../packages"), path.join(__dirname, "../../package.zip"));
});