import { RequestService } from "../../service/RequestService"
import request from "../request"
export type TCategory = {
  key: string,
  name: string,
  link: string
}
export type TAlbum = {
  key: string,
  name: string,
  link: string
}
export type TWallpaper = {
  tags: string,
  link: string,
  cover: string
}

export class TenWallpaperApi extends RequestService {
  categories() {
    return this.get<TCategory[]>("categories");
  }
  albums() {
    return this.get<TAlbum[]>("albums");
  }
  wallpapers(targetURL: string) {
    return this.get<{
      list: TWallpaper[],
      pagination: {
        total: number,
      }
    }>("wallpapers", {
      targetURL
    });
  }
  crawl(targetURL: string) {
    return this.get<boolean>("wallpapers/crawl", {
      targetURL
    });
  }
}

export default new TenWallpaperApi("wallpapers/thirdparty/10wallpaper");