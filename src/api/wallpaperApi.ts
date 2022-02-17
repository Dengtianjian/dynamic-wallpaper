import http from "../foundation/http"
import request from "./request"

export default {
  getWallpapers(page: number = 1, perPage: number = 10) {
    return request.get("wallpapers", {
      page,
      perPage
    });
  },
  uploadWallpaper(file: File) {
    return request.upload<{
      path: string,
      fileId: string,
      fileName: string
    }>("attachment", undefined, file);
  },
  saveWallpaper(description: string, fileid: string, tags: string, source: string, author: string) {
    return request.post("wallpaper/publish", {
      description,
      fileid,
      tags,
      source,
      author
    });
  }
}