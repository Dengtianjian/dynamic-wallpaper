import config from "../config";
import http from "../foundation/http";

type TSearchImagesResponse = {
  total: number,
  totalHits: number,
  hits: Array<{
    id: number,
    pageURL: string,
    tags: string,
    previewURL: string,
    previewWidth: number,
    previewHeight: number,
    webformatURL: string,
    webformatWidth: number,
    webformatHeight: number,
    largeImageURL: string,
    fullHDURL: string,
    imageURL: string,
    imageWidth: number,
    imageHeight: number,
    imageSize: number,
    views: number,
    downloads: number,
    likes: number,
    comments: number,
    user_id: number,
    user: string,
    userImageURL: string
  }>
}

function request<T>(action: string = "") {
  const url: string = `${config.pixabay.url}${action}`;
  return {
    get(query: Record<string, any> = {}, headers: Record<string, any> = {}) {
      query['key'] = config.pixabay.key;
      return http.get<T>(url, query, headers);
    }
  }
}

function saerchImages(keyword: string = "", page: number = 1, per_page: number = 12): Promise<TSearchImagesResponse> {
  return request<TSearchImagesResponse>("").get({
    q: keyword,
    page,
    per_page,
    lang: "zh",
    min_width: 1920
  }).then((res) => res.data);
}

export default {
  saerchImages
}