<template>
  <main class="page-main" @scroll="wallpaperListScrolling" ref="pageMainEl">
    <ul class="source-select">
      <li
        class="source-item"
        :class="{ 'source-item_selected': currentUsedSource === 'pexels' }"
        @click="switchSource('pexels')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32px"
          height="32px"
          viewBox="0 0 32 32"
        >
          <path
            d="M2 0h28a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"
            fill="#05A081"
          ></path>
          <path
            d="M13 21h3.863v-3.752h1.167a3.124 3.124 0 1 0 0-6.248H13v10zm5.863 2H11V9h7.03a5.124 5.124 0 0 1 .833 10.18V23z"
            fill="#fff"
          ></path>
        </svg>
        Pexels
      </li>
      <li
        class="source-item"
        :class="{ 'source-item_selected': currentUsedSource === 'unsplash' }"
        @click="switchSource('unsplash')"
      >
        <img src="../assets/thirdparty/unsplash_logo.png" />
      </li>
    </ul>
    <n-spin :show="wallpaperListLoading">
      <ul class="wallpaper-list">
        <d-wallpaper-item
          :data="wallpaperItem"
          v-for="(wallpaperItem, itemIndex) in wallpapers"
          :key="wallpaperItem.id"
        >
          <section @click.stop>
            <div class="wallpaper-title">{{ wallpaperItem.description }}</div>
            <div class="wallpaper-author">
              来自 {{ wallpaperItem.source }} 的
              <img
                :src="wallpaperItem.authorAvatar"
                :alt="wallpaperItem.author"
                class="wallpaper-author_avatar"
                v-if="wallpaperItem.authorAvatar"
              />
              {{ wallpaperItem.author }}
            </div>
            <ul class="wallpaper-operations">
              <li>
                <n-tooltip>
                  <template #trigger>
                    <i
                      class="shoutao st-link"
                      @click.stop="openLink(wallpaperItem.sourceUrl)"
                    ></i>
                  </template>
                  浏览器打开
                </n-tooltip>
              </li>
              <li>
                <n-tooltip>
                  <template #trigger>
                    <i
                      class="qianniu qianniu-add"
                      @click.stop="collect(wallpaperItem)"
                    ></i>
                  </template>
                  收集
                </n-tooltip>
              </li>
              <li>
                <n-tooltip>
                  <template #trigger>
                    <i
                      class="qianniu qianniu-right"
                      @click.stop="collectAndSetWallpaper(wallpaperItem)"
                    ></i>
                  </template>
                  收集并且设置为壁纸
                </n-tooltip>
              </li>
            </ul>
          </section>
        </d-wallpaper-item>
      </ul>
    </n-spin>
  </main>
</template>

<script lang="ts" setup>
import { useMessage, NTooltip } from "naive-ui";
import { onMounted, ref } from "vue";
import { TWallpaperItem } from "../types/wallpaperTypes";
import DWallpaperItem from "../components/DWallpaperItem.vue";
import wallpaperService from "../service/wallpaperService";
import wallpaperStore from "../store/wallpaperStore";
import pexelsApi from "../api/thirdpart/pexelsApi";
import unsplashApi from "../api/thirdpart/unsplashApi";
const NMessage = useMessage();

const currentUsedSource = ref<string>("pexels");

const pageMainEl = ref<HTMLElement | null>(null);
const wallpaperListLoading = ref<boolean>(false);
let wallpaperSetting = false;
let wallpaperPage = 1;
let wallpaperLoadLimit = 28;
let wallpaperLoadFinished = false;

const wallpapers = ref<TWallpaperItem[]>([]);

function getWallapers(): void {
  if (wallpaperListLoading.value || wallpaperLoadFinished) {
    return;
  }

  wallpaperListLoading.value = true;
  new Promise<TWallpaperItem[]>((resolve, reject) => {
    switch (currentUsedSource.value) {
      case "pexels":
        pexelsApi
          .curated(wallpaperPage, wallpaperLoadLimit)
          .then(({ photos }) => {
            return photos.map((photoItem): TWallpaperItem => {
              return {
                author: photoItem.photographer,
                authorAvatar: "",
                createdAt: "",
                deletedAt: "",
                description: photoItem.alt,
                fileid: "",
                fileUrl: photoItem.src.original,
                thumbUrl: photoItem.src.tiny,
                id: photoItem.id.toString(),
                source: "Pexels",
                tags: "",
                updatedAt: "",
                uploadedBy: photoItem.photographer,
                downloading: false,
                sourceUrl: photoItem.url,
              };
            });
          })
          .then(resolve)
          .catch(reject);
        break;
      case "unsplash":
        unsplashApi
          .listPhotos(wallpaperPage, wallpaperLoadLimit, "popular")
          .then((photos) => {
            return photos.map((photoItem): TWallpaperItem => {
              return {
                author: photoItem.user.username,
                authorAvatar: photoItem.user.profile_image.medium,
                createdAt: "",
                deletedAt: "",
                description: photoItem.description || "",
                fileid: "",
                fileUrl: photoItem.links.download,
                thumbUrl: photoItem.urls.small,
                id: photoItem.id.toString(),
                source: "Pexels",
                tags: "",
                updatedAt: photoItem.updated_at,
                uploadedBy: photoItem.user.name,
                downloading: false,
                sourceUrl: photoItem.links.html,
              };
            });
          })
          .then(resolve)
          .catch(reject);
        break;
      default:
        resolve([]);
    }
  })
    .then((res) => {
      if (res.length < wallpaperLoadLimit) {
        wallpaperLoadFinished = true;
        if (res.length === 0) return;
      }
      wallpaperPage++;
      wallpapers.value.push(...res);
    })
    .finally(() => {
      wallpaperListLoading.value = false;
    });
}

function collect(wallpaperItem: TWallpaperItem): Promise<void> {
  console.log(wallpaperItem);

  return Promise.resolve();
}
function collectAndSetWallpaper(wallpaperItem: TWallpaperItem) {
  if (wallpaperSetting) {
    return NMessage.warning("已经有壁纸设置中，请勿重复点击");
  }

  wallpaperSetting = true;
  wallpaperListLoading.value = true;

  wallpaperService
    .setWallpaper(wallpaperItem.fileUrl)
    .then((res: any) => {
      NMessage.success("设置成功");
      wallpaperService.resetCycle();
    })
    .catch((err: any) => {
      console.log(err);
      NMessage.error("设置失败");
    })
    .finally(() => {
      wallpaperStore.wallpaperSetting = false;
      wallpaperSetting = false;
      wallpaperListLoading.value = false;
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

function switchSource(sourceKey: string) {
  currentUsedSource.value = sourceKey;
  wallpaperListLoading.value = false;
  wallpaperPage = 1;
  wallpaperLoadFinished = false;
  wallpapers.value = [];

  getWallapers();
}
function openLink(link: string) {
  window.wallpaper.openLink(link);
}

onMounted(() => {
  getWallapers();
});
</script>

<style scoped>
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
  margin: 0 20px;
  box-sizing: border-box;
}
@media screen and (min-width: 1400px) {
  .wallpaper-list {
    grid-template-columns: repeat(5, calc(20% - 15px));
  }
}
@media screen and (min-width: 2000px) {
  .wallpaper-list {
    grid-template-columns: repeat(6, calc(20.2vw - 15px));
  }
}
.wallpaper-title {
  width: 100%;
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/** 图片操作 */
.wallpaper-operations {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0 3px;
}
.wallpaper-operations li {
  padding: 0 5px;
  cursor: pointer;
}
.wallpaper-operations li i {
  font-size: 18px;
}
.wallpaper-operations li:hover {
  color: var(--primary-color);
}
/** 图片作者 */
.wallpaper-author {
  display: flex;
  align-items: center;
  gap: 0 5px;
  /* margin: 5px 0; */
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

/** 来源 */
.source-select {
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 20px;
  padding: 10px 0;
  margin-bottom: 20px;
  background-color: #fafafa;
}
.source-select img {
  height: 30px;
}
.source-select svg {
  width: 30px;
  height: 30px;
}
.source-select .source-item {
  display: flex;
  align-items: center;
  column-gap: 5px;
  padding: 10px;
  cursor: pointer;
}
.source-select .source-item_selected {
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
  border-radius: calc(var(--radius-angle) / 2);
}
</style>
