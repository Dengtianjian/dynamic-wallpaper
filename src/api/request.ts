
import config from "../config";
import http from "../foundation/http"

export default {
  get<T>(uri: string, query?: Record<string, any>, headers: Record<string, any> = {}) {
    const url = `${config.api.url}/${uri}`;
    headers['X-Ajax'] = 1;
    return http.get<{
      data: T
    }>(url, query, headers).then(({ data }) => data.data);
  },
  post<T>(uri: string, body: BodyInit | Record<string, any>, query?: Record<string, any>, headers: Record<string, any> = {}) {
    const url = `${config.api.url}/${uri}`;
    headers['X-Ajax'] = 1;
    return http.post<{
      data: T
    }>(url, query, body, headers).then(({ data }) => data.data);
  },
  patch<T>(uri: string, body: BodyInit | Record<string, any>, query?: Record<string, any> | undefined, headers: Record<string, any> = {}) {
    const url = `${config.api.url}/${uri}`;
    headers['X-Ajax'] = 1;
    return http.patch<{
      data: T
    }>(url, query, body, headers).then(({ data }) => data.data);
  },
  put<T>(uri: string, query: Record<string, any> | undefined, body: BodyInit & Record<string, any>, headers: Record<string, any> = {}) {
    const url = `${config.api.url}/${uri}`;
    headers['X-Ajax'] = 1;
    return http.put<{
      data: T
    }>(url, query, body, headers).then(({ data }) => data.data);
  },
  delete<T>(uri: string, query: Record<string, any> | undefined, body: BodyInit & Record<string, any>, headers: Record<string, any> = {}) {
    const url = `${config.api.url}/${uri}`;
    headers['X-Ajax'] = 1;
    return http.deleteRequest<{
      data: T
    }>(url, query, body, headers).then(({ data }) => data.data);
  },
  upload<T>(uri: string, query: Record<string, any> | undefined, file: File, headers: Record<string, any> = {}) {
    const url = `${config.api.url}/${uri}`;
    const formData = new FormData();
    formData.append("file", file);
    headers['X-Ajax'] = 1;
    return http.post<{
      data: T
    }>(url, query, formData, headers).then(({ data }) => data.data);
  }
}