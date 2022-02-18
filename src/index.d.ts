type TDownloadCallback = (total: number, downloadedSize: number, progress: number) => void;

interface Window {
  wallpaper: {
    set: (wallpaperImageUrl: string, callback?: TDownloadCallback) => Promise<void>,
    download: (wallpaperImageUrl: string, callback?: TDownloadCallback) => Promise<boolean>,
    openLink: (linkURL: string) => void
  },
  system: {
    ipcRenderer: any
  },
}