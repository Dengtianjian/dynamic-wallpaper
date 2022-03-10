import config from "../../config"
import http from "../../foundation/http"

type TResponse = {
  count: number,
  list: TWallpaper[],
  pagenp: number,
  total_count: number,
  total_page: number
}
type TWallpaper = {
  category: string,
  class_id: string,
  id: string,
  live_open: boolean,
  status: string,
  tag: string,
  url: string
}
type TCategoryTag = {
  tag: string,
  show_tag: string,
  icon: string,
}
type TCategory = {
  category: string,
  shwo_name: string,
  icon: string,
  position: string,
  hot_tag: TCategoryTag[],
  old_id: string
}

export default {
  getCategory() {
    return http.get<{
      data: TCategory[]
    }>(http.generateUrl(config.birdpaper.url, "intf/getCategory")).then(res => res.data.data)
  },
  news(page: number = 1, limit: number = 10) {
    return http.get<{
      data: TResponse
    }>(http.generateUrl(config.birdpaper.url, "intf/newestList", {
      pageno: page,
      count: limit
    })).then(res => res.data.data);
  },
  search(keyword: string, page: number = 1, limit: number = 10) {
    return http.get<{
      data: TResponse
    }>(http.generateUrl(config.birdpaper.url, "intf/search", {
      content: keyword,
      pageno: page,
      count: limit
    })).then(res => res.data.data)
  },
  getListByCategory(categoryId: string, page: number = 1, limit: number = 10) {
    return http.get<{
      data: TResponse
    }>(http.generateUrl(config.birdpaper.url, "intf/GetListByCategory", {
      cids: categoryId,
      pageno: page,
      count: limit
    })).then(res => res.data.data)
  }
}