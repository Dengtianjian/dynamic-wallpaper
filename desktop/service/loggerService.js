
const log = require('electron-log');
const path = require('path');
log.transports.file.level = 'false';
log.transports.file.maxSize = 1048576;
log.transports.console.level = 'debug';
log.transports.file.resolvePathFn = () => path.join(process.env.BASE_PATH, "logs", "log.txt");

module.exports = log;