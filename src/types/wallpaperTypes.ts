export type TWallpaperItem = {
  [key: string]: any,
  author: string
  createdAt: string,
  deletedAt: string,
  description: string,
  fileid: string,
  fileUrl: string,
  thumbUrl: string,
  id: string,
  source: string,
  tags: string,
  updatedAt: string,
  uploadedBy: string,
  downloading: boolean,
  crawlUrl?: string
};

export type TExternalWallpaper = {
  sourceId: string,
  sourceUrl: string,
  collecting: boolean
} & TWallpaperItem;

export type TWallpaperDownloadItem = {
  download: {
    progress: number,
    downloading: boolean
  }
} & TWallpaperItem;

export type TCategory = {
  id: string,
  name: string
}