import config from "../config";

export default {
  genDownloadUrl(fileId: string) {
    return `${config.api.url}/downloadAttachment?fileId=${escape(fileId)}`;
  },
  genImageThumbUrl(fileId: string, width?: number, height?: number) {
    return `${config.api.url}/thumbnail?fileId=${escape(fileId)}&width=${width}&height=${height}`;
  }
}