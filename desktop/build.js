const builder = require("electron-builder");
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const { exit } = require("process");

process.env.isPackaged = true;
const OutputDir = path.join(process.cwd(), "dist", "desktop");
if (fs.existsSync(OutputDir)) {
  fse.emptyDirSync(OutputDir);
}
const EnvsDir = path.join(process.cwd(), "desktop", "envs");
if (fs.existsSync(EnvsDir)) {
  fse.emptyDirSync(EnvsDir);
} else {
  fs.mkdirSync(EnvsDir);
}
if (fs.existsSync(EnvsDir)) {
  const EnvFiles = fs.readdirSync(path.join(process.cwd(), "envs"));
  for (const item of EnvFiles) {
    if (!item.startsWith(".env")) continue;
    fs.copyFileSync(path.join(process.cwd(), "envs", item), path.join(EnvsDir, `${item.split(".")[2]}.env`));
  }
}

require("./service/envService");

const config = {
  appId: "com.electron.wallpaper",
  productName: "Wallpaper",
  copyright: "Tianjian",
  directories: {
    output: "dist/desktop"
  },
  asar: false,
  files: [
    "desktop",
    "dist/web",
    "node_modules",
    "package.json"
  ],
  mac: {
    icon: "desktop/icons/icon.icns"
  },
  win: {
    icon: "desktop/icons/icon.ico",
    target: [
      {
        target: "nsis"
      }
      // , {
      //   target: "msi"
      // }
    ]
  },
  nsis: {
    oneClick: false,
    allowElevation: true,
    perMachine: true,
    deleteAppDataOnUninstall: true,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    installerLanguages: "zh-CN"
  }
}

builder.build({
  config
}).finally(() => {
  fse.emptyDirSync(EnvsDir);
  fs.rmdirSync(EnvsDir, {
    force: true
  });
});