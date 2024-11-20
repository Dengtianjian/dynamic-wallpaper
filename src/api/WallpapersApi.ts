import { RequestService } from "../service/RequestService";
import { TWallpaperItem } from "../types/wallpaperTypes";

type TWallpaperHomeWallpaper = {
  link: string,
  cover: string,
  keywords: string[],
  id: string,
}

export class WallpapersApi extends RequestService {
  getWallpapers(page: number = 1, perPage: number = 10) {
    return this.get<{
      pagination: {
        page: number,
        perPage: number,
        total: number
      },
      list: TWallpaperItem[]
    }>(null, {
      page,
      perPage
    });
  }
  saveWallpaper(description: string, fileKey: string, tags: string, source: string, author: string, privacy: string = "public") {
    return this.post("publish", {
      description,
      fileKey,
      tags,
      source,
      author,
      privacy
    });
  }
  deleteWallpaper(wallpaperId: string) {
    return this.delete(wallpaperId);
  }
  randomGetWallpapers(count: number) {
    return this.get<TWallpaperItem[]>("random", {
      count
    });
  }
  collect(sourceId: string,
    author: string,
    description: string,
    fileUrl: string,
    source: string,
    sourceUrl: string): Promise<TWallpaperItem> {
    return this.post<TWallpaperItem>("recordCollect", {
      sourceId,
      author,
      description,
      fileUrl,
      source,
      sourceUrl
    });
  }
  getWallpaperHomeList(categoryId: string, page: number = 1, perPage: number = 10) {
    return this.get<{
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
  }
  crawlWallpapersHome(url: string) {
    return this.get("thirdparty/wallpaperhome/recordCollect", {
      targetUrl: url
    });
  }
  getWallpaperHomeCategories() {
    return this.get<{
      name: string,
      link: string
    }[]>("thirdparty/wallpaperhome/categories");
  }
}

export default new WallpapersApi("wallpapers");