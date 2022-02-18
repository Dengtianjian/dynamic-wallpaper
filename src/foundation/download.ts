import { reactive, ref } from "vue";
import { TWallpaperDownloadItem, TWallpaperItem } from "../types/wallpaperTypes";

const downloadList = reactive<Map<string, TWallpaperDownloadItem>>(new Map());

export default {
  getAll(): Map<string, TWallpaperDownloadItem> {
    return downloadList;
  },
  get(id: string): TWallpaperDownloadItem | undefined {
    return downloadList.get(id);
  },
  add(wallpaerItem: TWallpaperItem) {
    if (downloadList.has(wallpaerItem.id)) {
      return true;
    }
    wallpaerItem.download = {
      downloading: false,
      progress: 0
    }
    downloadList.set(wallpaerItem.id, wallpaerItem as TWallpaperDownloadItem);
  },
  remove(id: string): boolean {
    if (!downloadList.has(id)) {
      return true;
    }
    downloadList.delete(id);
    return true;
  },
  updateProgress(id: string, progress: number) {
    if (downloadList.has(id)) {
      (downloadList.get(id) as TWallpaperDownloadItem).download.progress = progress;
    }
  }
}