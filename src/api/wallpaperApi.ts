import http from "../foundation/http"
import { TWallpaperItem } from "../types/wallpaperTypes";
import request from "./request"

type TWallpaperHomeWallpaper = {
  link: string,
  cover: string,
  keywords: string[],
  id: string,
}

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
  },
  removeToTrash(wallpaperId: string) {
    return request.patch("wallpaper/" + wallpaperId, {});
  },
  randomGetWallpapers(count: number) {
    return request.get<TWallpaperItem[]>("wallpaper/random", {
      count
    });
  },
  collect(sourceId: string,
    author: string,
    description: string,
    fileUrl: string,
    source: string,
    sourceUrl: string): Promise<TWallpaperItem> {
    return request.post<TWallpaperItem>("wallpapers/recordCollect", {
      sourceId,
      author,
      description,
      fileUrl,
      source,
      sourceUrl
    });
  },
  getWallpaperHomeList(categoryId: string, page: number = 1, perPage: number = 10) {
    return request.get<{
      list: TWallpaperHomeWallpaper[],
      pagination: {
        page: number,
        limit: number,
        total: number
      }
    }>("thirdparty/wallpaperhome", {
      page,
      perPage,
      categoryId
    });
  },
  crawlWallpapersHome(url: string) {
    return request.get("thirdparty/wallpaperhome/recordCollect", {
      targetUrl: url
    });
  },
  getWallpaperHomeCategories() {
    return request.get<{
      name: string,
      link: string
    }[]>("thirdparty/wallpaperhome/categories");
  }
}