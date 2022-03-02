const wallpaperService = require("../service/wallpaperService");
const context = require('../foundation/context');

module.exports = {
  exportContext() {
    context.add("wallpaper", "download", wallpaperService.download);
    context.add("wallpaper", "openLink", wallpaperService.openLink);
    context.add("wallpaper", "set", wallpaperService.setWallpaper);
  }
}