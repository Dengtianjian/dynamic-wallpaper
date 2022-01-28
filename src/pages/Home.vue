<template>
  <header class="page-header">
    <ul class="sources" @click="switchSource">
      <li
        class="source-item"
        :class="{ 'source-item_active': wallpaperSourceKey === sourceItem.key }"
        v-for="sourceItem in sources"
        :key="sourceItem.key"
        :data-key="sourceItem.key"
      >
        {{ sourceItem.label }}
      </li>
    </ul>
    <section class="page-header_user">
      <i class="shoutao st-settings"></i>
    </section>
  </header>
  <main class="page-main" @scroll="wallpaperListScrolling" ref="pageMainEl">
    <n-spin :show="wallpaperListLoading">
      <ul class="wallpaper-list">
        <li
          class="wallpaper-item"
          v-for="wallpaperItem in wallpapers"
          :key="wallpaperItem.cover"
          @click="setWallpaper(wallpaperItem)"
        >
          <img :src="wallpaperItem.cover" alt="" class="wallpaper-cover" />
          <section class="wallpaper-info" @click.stop>
            <div class="wallpaper-title">{{ wallpaperItem.title }}</div>
            <div class="wallpaper-author">
              来自 {{ wallpaperItem.source }} 的
              <img
                :src="wallpaperItem.authorAvatar"
                :alt="wallpaperItem.author"
                class="wallpaper-author_avatar"
              />
              {{ wallpaperItem.author }}
            </div>
            <ul class="wallpaper-operations">
              <li>
                <i
                  class="shoutao st-down"
                  @click.stop="downloadWallpaper(wallpaperItem)"
                ></i>
              </li>
            </ul>
          </section>
        </li>
      </ul>
    </n-spin>
    <section
      class="wallpaper-download-list"
      v-show="wallpapersDownloadList.length"
    >
      壁纸下载中：{{ wallpapersDownloadList.length }}
    </section>
    <section
      class="wallpaper-download-list_placeholder"
      v-show="wallpapersDownloadList.length"
    ></section>
  </main>
</template>

<script lang="ts" setup>
import { NMenu, MenuOption, useMessage } from "naive-ui";
import { onMounted, ref } from "vue";
import pexelsApi from "../api/pexelsApi";
import pixabayApi from "../api/pixabayApi";
const NMessage = useMessage();
const wallpaperSourceKey = ref<string>("pixabay");
const sources: {
  label: string;
  key: string;
}[] = [
  {
    label: "全部",
    key: "All",
  },
  {
    label: "Unsplash",
    key: "unsplash",
  },
  {
    label: "Pixabay",
    key: "pixabay",
  },
  {
    label: "Pexels",
    key: "pexels",
  },
  {
    label: "Bing",
    key: "bing",
  },
  {
    label: "本地",
    key: "local",
  },
];
const pageMainEl = ref<HTMLElement | null>(null);
const wallpaperListLoading = ref<boolean>(false);
let wallpaperSetting = false;
let wallpaperPage = 1;
let wallpaperLoadLimit = 36;
let wallpaperLoadFinished = false;

type TWallpaperItem = {
  cover: string;
  title: string;
  original: string;
  author: string;
  authorAvatar: string;
  source: string;
  downloading?: boolean;
};
const wallpapers = ref<TWallpaperItem[]>([]);
const wallpapersDownloadList = ref<TWallpaperItem[]>([]);

function getPexelsCurated(): Promise<TWallpaperItem[]> {
  return pexelsApi
    .curated(wallpaperPage, wallpaperLoadLimit)
    .then(({ photos }) => {
      return photos.map((photoItem) => {
        return {
          cover: photoItem.src.large,
          title: photoItem.alt,
          original: photoItem.src.original,
          authorAvatar: photoItem.photographer_url,
          author: photoItem.photographer,
          source: "Pexel",
        };
      });
    });
}
function getPixabayImages(): Promise<TWallpaperItem[]> {
  return pixabayApi
    .saerchImages("", wallpaperPage, wallpaperLoadLimit)
    .then(({ hits }) => {
      return hits.map((imageItem) => {
        return {
          cover: imageItem.webformatURL,
          title: imageItem.tags,
          original: imageItem.fullHDURL,
          author: imageItem.user,
          authorAvatar: imageItem.userImageURL,
          source: "Pixabay",
        };
      });
    });
}

async function getWallpapersBySource(): Promise<TWallpaperItem[]> {
  switch (wallpaperSourceKey.value) {
    case "pixabay":
      return getPixabayImages();
    case "pexels":
    default:
      return getPexelsCurated();
  }
}
function getWallapers(): void {
  if (wallpaperListLoading.value || wallpaperLoadFinished) {
    return;
  }
  wallpaperListLoading.value = true;
  getWallpapersBySource()
    .then((images) => {
      if (images.length < wallpaperLoadLimit) {
        wallpaperLoadFinished = true;
        if (images.length === 0) return;
      }
      wallpaperPage++;
      images.forEach((imageItem) => {
        imageItem.downloading = false;
      });
      wallpapers.value.push(...images);
    })
    .finally(() => {
      wallpaperListLoading.value = false;
    });
}

function setWallpaper(wallpaperItem: TWallpaperItem) {
  if (wallpaperSetting) {
    return NMessage.warning("已经有壁纸设置中，请勿重复点击");
  }
  wallpaperSetting = true;
  wallpaperListLoading.value = true;
  window.wallpaper
    .set(wallpaperItem.original)
    .then((res: any) => {
      NMessage.success("设置成功");
    })
    .catch((err: any) => {
      NMessage.error("设置失败");
    })
    .finally(() => {
      wallpaperSetting = false;
      wallpaperListLoading.value = false;
    });
}
function downloadWallpaper(wallpaperItem: TWallpaperItem) {
  wallpaperItem.downloading = true;
  wallpapersDownloadList.value.push(wallpaperItem);
  window.wallpaper
    .download(wallpaperItem.original)
    .then((res) => {
      NMessage.success("下载完成");
    })
    .finally(() => {
      let index: number = wallpapersDownloadList.value.indexOf(wallpaperItem);
      if (index > -1) {
        wallpapersDownloadList.value.splice(index, 1);
      }

      wallpaperItem.downloading = false;
    });
}

let scrollHandler: any | number = null;
function wallpaperListScrolling(payload: UIEvent) {
  if (wallpaperListLoading.value || wallpaperLoadFinished) return;
  if (scrollHandler) {
    clearTimeout(scrollHandler);
  }
  scrollHandler = setTimeout(async () => {
    const target: HTMLElement = payload.target as HTMLElement;
    const bottomDistance: number = target.scrollTop + target.clientHeight;
    if (target.scrollHeight - bottomDistance < 200) {
      await getWallapers();
    }
    clearTimeout(scrollHandler);
  }, 150);
}

function switchSource(payload: MouseEvent) {
  if (wallpaperListLoading.value || !(payload.target as HTMLElement).dataset) {
    return;
  }
  let key: string | undefined = (payload.target as HTMLElement).dataset.key;
  if (!key) return;

  wallpaperSourceKey.value = key;
  wallpaperListLoading.value = false;
  wallpaperPage = 1;
  wallpaperLoadFinished = false;
  wallpapers.value = [];

  getWallapers();
}

onMounted(() => {
  getWallapers();
});
</script>

<style scoped>
.page-header {
  display: grid;
  grid-template-columns: calc(80vw - 30px) 20vw;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.page-header_user {
  padding-right: 10px;
  justify-self: flex-end;
}

/** 来源 */
.sources {
  display: flex;
  align-items: center;
  gap: 0 20px;
  font-size: 14px;
}
.source-item {
  padding: 10px 18px;
  cursor: pointer;
}
.source-item:hover,
.source-item_active {
  color: var(--primary-color);
}

.page-main {
  padding: 20px 0;
  height: calc(100vh - 43px);
  overflow-y: auto;
  box-sizing: border-box;
}
/** 壁纸列表 */
.wallpaper-list {
  display: grid;
  grid-template-columns: repeat(4, calc(25% - 15px));
  gap: 20px;
  padding: 0 20px;
  box-sizing: border-box;
}
.wallpaper-item {
  position: relative;
  height: 264px;
  overflow: hidden;
}
.wallpaper-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  vertical-align: bottom;
  transition: transform 0.15s ease-in-out;
}
.wallpaper-info {
  position: absolute;
  bottom: -100%;
  left: 0;
  padding: 5px 10px;
  width: 100%;
  /* height: 40px; */
  color: white;
  background: rgba(0, 0, 0, 0.4);
  box-sizing: border-box;
  transition: bottom 0.15s ease-in-out;
}
.wallpaper-title {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/** 图片操作 */
.wallpaper-operations {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.wallpaper-operations li:hover {
  color: var(--primary-color);
}
.wallpaper-item:hover {
  cursor: pointer;
}
.wallpaper-item:hover .wallpaper-info {
  bottom: 0;
}
.wallpaper-item:hover .wallpaper-cover {
  transform: scale(1.05);
}
/** 图片作者 */
.wallpaper-author {
  display: flex;
  align-items: center;
  gap: 0 5px;
  margin: 5px 0;
  font-size: 12px;
}
.wallpaper-author_avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
}

/** 壁纸下载栏 */
.wallpaper-download-list {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 30px;
  line-height: 30px;
  width: 100vw;
  text-align: center;
  font-size: 14px;
  background-color: white;
  border-top: 1px solid #eee;
}
.wallpaper-download-list_placeholder {
  height: 30px;
  width: 100%;
  box-sizing: border-box;
}
</style>
