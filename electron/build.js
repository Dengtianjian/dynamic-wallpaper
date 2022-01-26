const builder = require("electron-builder");

const config = {
  x64: true,
  directories: {
    output: "packages"
  },
  asar: false,
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
  }
}

builder.build({
  config
}).then((res) => {
  console.log(res);
}).catch(err => {
  console.error(err);
})