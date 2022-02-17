import config from "../../config"
import http from "../../foundation/http"

type TActions = {
  photos: 0
}
type TOrderBy = {
  latest: 0,
  oldest: 0,
  popular: 0,
}
type TPhotoItem = {
  id: string,
  created_at: string,
  updated_at: string,
  width: number,
  height: number,
  color: string,
  blur_hash: string,
  likes: number,
  liked_by_user: false,
  description: string,
  user: {
    id: string,
    username: string,
    name: string,
    portfolio_url: string,
    bio: string,
    location: string,
    total_likes: number,
    total_photos: number,
    total_collections: number,
    instagram_username: string,
    twitter_username: string,
    profile_image: {
      small: string,
      medium: string,
      large: string,
    },
    links: {
      self: string,
      html: string,
      photos: string,
      likes: string,
      portfolio: string,
    }
  },
  current_user_collections: [
    {
      id: number,
      title: string,
      published_at: string,
      last_collected_at: string,
      updated_at: string,
      cover_photo: null,
      user: null
    }
  ],
  urls: {
    raw: string,
    full: string,
    regular: string,
    small: string,
    thumb: string,
  },
  links: {
    self: string,
    html: string,
    download: string,
    download_location: string,
  }
}

function request<T>(action: keyof TActions) {
  const url: string = `${config.unsplash.url}${action}`;
  return {
    get(query: Record<string, any> = {}, headers: Record<string, any> = {}) {
      headers['Authorization'] = `Client-ID ${config.unsplash.key}`;
      headers['Accept-Version'] = config.unsplash.version;
      return http.get<T>(url, query, headers);
    }
  }
}

function listPhotos(page: number = 1, per_page: number = 12, order_by: keyof TOrderBy = "latest"): Promise<TPhotoItem[]> {
  return request<TPhotoItem[]>("photos").get({
    page,
    per_page,
    order_by
  }).then(({ data }) => data);
}

export default {
  listPhotos
}