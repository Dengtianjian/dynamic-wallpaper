interface Window {
  wallpaper: {
    set: (wallpaperImageUrl: string) => Promise<void>,
    download: (wallpaperImageUrl: string) => Promise<boolean>
  },
  link: {
    openLink: (linkURL: string) => void
  }
}