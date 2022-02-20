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
  downloading: boolean
};

export type TWallpaperDownloadItem = {
  download: {
    progress: number,
    downloading: boolean
  }
} & TWallpaperItem;