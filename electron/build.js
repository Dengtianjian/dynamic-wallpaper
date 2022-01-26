const builder = require("electron-builder");

const options = {
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
  ]
}

builder.build({
  config: options
}).then((res) => {
  console.log(res);
}).catch(err => {
  console.error(err);
})