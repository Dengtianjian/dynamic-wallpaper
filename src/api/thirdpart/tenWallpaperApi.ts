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

export default {
  categories() {
    return request.get<TCategory[]>("thirdparty/10wallpaper/categories");
  },
  albums() {
    return request.get<TAlbum[]>("thirdparty/10wallpaper/albums");
  },
  wallpapers(targetURL: string) {
    return request.get<{
      list: TWallpaper[],
      pagination: {
        total: number,
      }
    }>("thirdparty/10wallpaper/wallpapers", {
      targetURL
    });
  },
  crawl(targetURL: string) {
    return request.get<boolean>("thirdparty/10wallpaper/wallpapers/crawl", {
      targetURL
    });
  }
}