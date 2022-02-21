import http from "../foundation/http"
import { TWallpaperItem } from "../types/wallpaperTypes";
import request from "./request"

export default {
  getWallpapers(page: number = 1, perPage: number = 10) {
    return request.get<{
      pagination: {
        page: number,
        perPage: number,
        total: number
      },
      wallpapers: TWallpaperItem[]
    }>("wallpapers", {
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
  saveWallpaper(description: string, fileid: string, tags: string, source: string, author: string, privacy: string = "public") {
    return request.post("wallpaper/publish", {
      description,
      fileid,
      tags,
      source,
      author,
      privacy
    });
  }
}