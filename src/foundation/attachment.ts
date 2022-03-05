import config from "../config";
import http from "./http";

export default {
  genDownloadUrl(fileId: string) {
    return `${config.api.url}/downloadAttachment?fileId=${escape(fileId)}`;
  },
  genImageThumbUrl(fileId: string, width: number = -1, height: number = -1) {
    const querys: Record<string, string> = {
      fileId: escape(fileId)
    };
    if (width > 0) {
      querys['width'] = width.toString();
    }
    if (height > 0) {
      querys['height'] = height.toString();
    }
    const query: string = http.generateQuery(querys);
    return `${config.api.url}/thumbnail?${query}`;
  }
}