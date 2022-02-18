const FS = require("fs");
const Path = require("path");

const config = {
  basePath: ""
};
function init() {
  this.read();
}
function read() {
  const localSetting = FS.readFileSync(Path.join(config['basePath'], "setting.json"));
  Object.assign(config, JSON.parse(localSetting ?? "{}"));
  return config;
}
function set(key, value) {
  config[key] = value;
}
function get(key) {
  return config[key];
}

module.exports = {
  init,
  read,
  set,
  get
};