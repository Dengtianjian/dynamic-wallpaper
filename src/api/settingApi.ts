import request from "./request"

export default {
  getSettings(): Promise<Record<string, any>> {
    return request.get("settings");
  },
  updateSetting(key: string, value: any): Promise<boolean> {
    return request.patch("settings", {
      key,
      value
    });
  }
}