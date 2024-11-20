import { TBody, THTTPMiddleware, TMethods } from "../ruyijs/Vue";
import Request from "../ruyijs/Vue/foundation/HTTP/request";

export class RequestService extends Request {
  constructor(prefix: string = null, method: TMethods = "GET", query: Record<string, number | string | boolean> = {}, body: TBody = null, pipes: string[] = [], options: RequestInit = {}, headers: Record<string, string> = {}, globalMiddlewares: Array<THTTPMiddleware> = []) {

    headers['X-Requested-With'] = "fetch";
    headers['Accept'] = "application/json";

    super(prefix, import.meta.env.VITE_BACKEND_API_URL, method, query, body, pipes, options, headers, globalMiddlewares);
  }
}