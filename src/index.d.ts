type TDownloadCallback = (total: number, downloadedSize: number, progress: number) => void;

interface Window {
  wallpaper: {
    wallpaperSet: (wallpaperImageUrl: string, id: string, callback?: TDownloadCallback) => Promise<void>,
    downloadWallpaper: (wallpaperImageUrl: string, id: string, callback?: TDownloadCallback) => Promise<boolean>,
    openLink: (linkURL: string) => void
  },
  tray: {
    fixedTray: (checked: boolean) => void
  },
  system: {
    ipcRenderer: any,
    autoStart: (yes: boolean) => void
  },
  ipcEmit(channelName: string, ...args: any[]): void
}