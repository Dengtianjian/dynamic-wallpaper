import { IRuyiFileInfo } from "../ruyijs/Vue";
import { RequestService } from "../service/RequestService";
import request from "./request"

export class FilesApi extends RequestService {
  getAuth(method: string, data: Record<string, string | number>) {
    return this.post<{
      auth: {
        local:
        {
          'header-list': string
          'key-time': string
          'sign-algorithm': string
          'sign-time': string
          signature: string
          'url-param-list': string
        }
      },
      key: string,
      method: string,
      platform: string
    }>(`auth/${method}`, data);
  }
  uploadFile(FileKey: string, File: File) {
    return this.upload<IRuyiFileInfo>(FileKey, File);
  }
}

export default new FilesApi("files");