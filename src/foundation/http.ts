type TMethods = {
  GET: 0,
  POST: 0,
  PUT: 0,
  DELETE: 0,
  PATCH: 0
}

function generateQuery(query: Record<string, any>): string {
  let queryStrings: string[] = [];
  for (const key in query) {
    if (typeof query[key] === "object") {
      query[key] = JSON.stringify(query[key]);
    }
    queryStrings.push(`${key}=${query[key]}`);
  }
  return queryStrings.join("&");
}

function request<T>(url: string, method: keyof TMethods = "GET", query: Record<string, any> = {}, body: BodyInit | Record<string, any>, requestHeaders: Record<string, any> = {}): Promise<{
  data: T,
  headers: Record<string, string>,
  status: number
}> {
  url += `?${generateQuery(query)}`;

  const headers: Headers = new Headers();
  for (const key in requestHeaders) {
    headers.append(key, requestHeaders[key]);
  }
  const options: RequestInit = { method, headers };

  if (method !== "GET") {
    if (Object.prototype.toString.call(body).includes("Object")) {
      headers.append("Content-type", "application/json;charset=UTF-8");
      options['body'] = JSON.stringify(body);
    } else {
      // @ts-ignore：已经跳过了Object类型
      options['body'] = body;
    }
  }

  return fetch(url, options).then(async res => {
    let data = await res.json();
    let headers: Record<string, string> = {};
    res.headers.forEach((item, key) => {
      headers[key] = item;
    })
    return {
      status: res.status,
      headers,
      data
    }
  }).then((res) => {
    if (res.status > 299) {
      return Promise.reject(res)
    }
    return res;
  })
}

function get<T>(url: string, query: Record<string, any> = {}, headers: Record<string, any> = {}) {
  return request<T>(url, "GET", query, {}, headers);
}
function post<T>(url: string, query: Record<string, any> = {}, body: BodyInit | Record<string, any>, headers: Record<string, any> = {}) {
  return request<T>(url, "POST", query, body, headers);
}
function patch<T>(url: string, query: Record<string, any> = {}, body: BodyInit | Record<string, any>, headers: Record<string, any> = {}) {
  return request<T>(url, "PATCH", query, body, headers);
}
function put<T>(url: string, query: Record<string, any> = {}, body: BodyInit & Record<string, any>, headers: Record<string, any> = {}) {
  return request<T>(url, "PUT", query, body, headers);
}
function deleteRequest<T>(url: string, query: Record<string, any> = {}, body: BodyInit & Record<string, any>, headers: Record<string, any> = {}) {
  return request<T>(url, "DELETE", query, body, headers);
}
function generateUrl(baseUrl: string, uri: string = "", query: Record<string | number, any> = {}): string {
  return `${baseUrl}/${uri}?${generateQuery(query)}`;
}


export default {
  request,
  get,
  post,
  patch,
  put,
  deleteRequest,
  generateQuery,
  generateUrl
}