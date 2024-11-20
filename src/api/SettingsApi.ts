import { RequestService } from "../service/RequestService";
import request from "./request"

export class SettingsApi extends RequestService {
  getSettings(): Promise<Record<string, any>> {
    return this.get(null);
  }
  updateSetting(key: string, value: any): Promise<boolean> {
    return this.patch(null, {
      key,
      value
    });
  }
}

export default new SettingsApi("settings");