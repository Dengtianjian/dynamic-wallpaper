import config from "../config";
import http from "./http";
import { version } from "../../package.json";

export default {
  genDownloadUrl(fileId: string) {
    return `${config.api.url}/attachments/${fileId}/download?v=${version}`;
  },
  genImageThumbUrl(fileId: string, width: number = -1, height: number = -1) {
    const querys: Record<string, string> = {
      version
    };
    if (width > 0) {
      querys['w'] = width.toString();
    }
    if (height > 0) {
      querys['h'] = height.toString();
    }
    const query: string = http.generateQuery(querys);
    return `${config.api.url}/attachments/${fileId}/preview?${query}`;
  }
}