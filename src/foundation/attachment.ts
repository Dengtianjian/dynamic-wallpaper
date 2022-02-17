import config from "../config";

export default {
  genDownloadUrl(fileId: string) {
    return `${config.api.url}/downloadAttachment?fileId=${fileId}`;
  }
}