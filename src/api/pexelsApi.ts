import config from "../config";
import http from "../foundation/http"

type TActions = {
  search: 0, //* 搜索
  curated: 0, //* 精选
  photos: 0 //* 获取图片
};
type TPhoto = {
  id: number,
  width: number,
  height: number,
  url: string,
  photographer: string,
  photographer_url: string,
  photographer_id: number,
  avg_color: string,
  liked: boolean,
  alt: string,
  src: {
    original: string,
    large2x: string,
    large: string,
    medium: string,
    small: string,
    portrait: string,
    landscape: string,
    tiny: string,
  }
}

function request(action: keyof TActions) {
  let url = `${config.pexels.url}/${action}`;
  return {
    get<T>(query: Record<string, any> = {}, headers: Record<string, any> = {}): Promise<T> {
      headers['Authorization'] = config.pexels.key;
      return http.get<T>(url, query, headers).then(res => res.data);
    }
  }
}

type TCuratedResponse = {
  page: number,
  per_page: number,
  total_results: number,
  prev_page: string,
  next_page: string,
  photos: TPhoto[]
}
function curated(page: number,
  per_page: number): Promise<TCuratedResponse> {
  return request("curated").get<TCuratedResponse>({
    page,
    per_page
  });
}

export default {
  curated
}