import config from "../../config";
import http from "../../foundation/http";

type TIdx = {
  0: 0,
  "-1": -1,
  1: 1
}

export default {
  everyDayWallpaper(idx: keyof TIdx = 0, n: number = 1) {
    const url = `${config.bing.url}/HPImageArchive.aspx`;
    return http.get(url, {
      format: "js",
      idx,
      n,
      mkt: "zh-CN"
    })
  }
}