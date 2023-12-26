<template>
  <main class="page-main" @scroll="wallpaperListScrolling" ref="pageMainEl">
    <ul class="source-select">
      <!-- <li class="source-item" :class="{ 'source-item_selected': currentUsedSource === 'pexels' }"
        @click="switchSource('pexels')">
        <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 32 32">
          <path d="M2 0h28a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z" fill="#05A081"></path>
          <path
            d="M13 21h3.863v-3.752h1.167a3.124 3.124 0 1 0 0-6.248H13v10zm5.863 2H11V9h7.03a5.124 5.124 0 0 1 .833 10.18V23z"
            fill="#fff"></path>
        </svg>
        Pexels
      </li>
      <li class="source-item" :class="{ 'source-item_selected': currentUsedSource === 'unsplash' }"
        @click="switchSource('unsplash')">
        <img src="../assets/thirdparty/unsplash_logo.png" />
      </li> -->
      <li class="source-item" :class="{ 'source-item_selected': currentUsedSource === 'birdpaper' }"
        @click="switchSource('birdpaper')">
        <img src="../assets/thirdparty/birdpaper_logo.png" />
      </li>
      <li class="source-item" :class="{
        'source-item_selected': currentUsedSource === 'wallpapersHome',
      }" @click="switchSource('wallpapersHome')">
        <img src="../assets/thirdparty/wallpapershome_logo.jpg" />
      </li>
      <li class="source-item" :class="{ 'source-item_selected': currentUsedSource === '10wallpaper' }"
        @click="switchSource('10wallpaper')">
        <img src="../assets/thirdparty/10wallpaper_logo.png" />
      </li>
    </ul>
    <ul class="wallpaper-categories" @click="switchCategory">
      <li v-for="categoryItem in categories" :key="categoryItem.id"
        :class="{ active: currentSelectedCategoryId === categoryItem.id }" :data-id="categoryItem.id">
        {{ categoryItem.name }}
      </li>
    </ul>
    <ul class="wallpaper-list">
      <d-wallpaper-item :data="wallpaperItem" v-for="(wallpaperItem, itemIndex) in wallpapers" :key="wallpaperItem.id">
        <section @click.stop>
          <div class="wallpaper-title">{{ wallpaperItem.description }}</div>
          <ul class="wallpaper-operations">
            <li>
              <n-tooltip>
                <template #trigger>
                  <i class="shoutao st-link" @click.stop="openLink(wallpaperItem.sourceUrl)"></i>
                </template>
                浏览器打开
              </n-tooltip>
            </li>
            <li v-if="!wallpaperItem.crawlUrl">
              <n-tooltip>
                <template #trigger>
                  <div>
                    <i class="shoutao st-add" @click.stop="collect(wallpaperItem)" v-show="!wallpaperItem.collecting &&
                      !wallpaperItem.downloading
                      "></i>
                    <n-spin v-show="wallpaperItem.collecting || wallpaperItem.downloading
                      " :size="14">
                      <i class="qianniu qianniu-add" @click.stop="collect(wallpaperItem)"
                        v-show="!wallpaperItem.collecting"></i>
                    </n-spin>
                  </div>
                </template>
                收集
              </n-tooltip>
            </li>
            <li v-else>
              <n-tooltip>
                <template #trigger>
                  <div>
                    <i class="shoutao st-roundadd" @click.stop="collectAndCrawl(wallpaperItem)" v-show="!wallpaperItem.collecting &&
                      !wallpaperItem.downloading
                      "></i>
                    <n-spin v-show="wallpaperItem.collecting || wallpaperItem.downloading
                      " :size="14">
                      <i class="qianniu qianniu-add" @click.stop="collectAndCrawl(wallpaperItem)"
                        v-show="!wallpaperItem.collecting"></i>
                    </n-spin>
                  </div>
                </template>
                抓取并且采集
              </n-tooltip>
            </li>
          </ul>
        </section>
      </d-wallpaper-item>
    </ul>
    <n-space style="margin-top:20px;" justify="center">
      <n-pagination :item-count="wallpaperTotal" :page="wallpaperPage" :page-size="wallpaperLoadLimit" show-quick-jumper
        @update-page="getWallapers"></n-pagination>
    </n-space>
  </main>
</template>

<script lang="ts" setup>
import { useMessage, NTooltip, NPagination, NSpace } from "naive-ui";
import { onMounted, reactive, ref } from "vue";
import { TExternalWallpaper, TWallpaperItem, TCategory } from "../types/wallpaperTypes";
import DWallpaperItem from "../components/DWallpaperItem.vue";
import pexelsApi from "../api/thirdpart/pexelsApi";
import unsplashApi from "../api/thirdpart/unsplashApi";
import wallpaperApi from "../api/wallpaperApi";
import birdpaperApi from "../api/thirdpart/birdpaperApi";
import tenWallpaperApi, { TCategory as TTenWallpaperCategory } from "../api/thirdpart/tenWallpaperApi";
const NMessage = useMessage();

const currentUsedSource = ref<string>("birdpaper");

const pageMainEl = ref<HTMLElement | null>(null);
const wallpaperListLoading = ref<boolean>(false);
let wallpaperPage = ref<number>(1);
let wallpaperLoadLimit = ref<number>(12);
let wallpaperTotal = ref<number>(0);
let wallpaperLoadFinished = false;

const TenWallpaperCategories = ref<TTenWallpaperCategory[]>([]);
const categories = reactive<TCategory[]>([]);
const wallpapers = ref<TExternalWallpaper[]>([]);

const currentSelectedCategoryId = ref<string>("");
function getWallapers(page: number = wallpaperPage.value): void {
  if (wallpaperListLoading.value || wallpaperLoadFinished) {
    return;
  }

  wallpaperPage.value = page;
  wallpaperListLoading.value = true;
  const L = NMessage.loading("加载中", {
    duration: 0
  });
  new Promise<TExternalWallpaper[]>((resolve, reject) => {
    switch (currentUsedSource.value) {
      case "birdpaper":
        birdpaperApi
          .getListByCategory(currentSelectedCategoryId.value, page, wallpaperLoadLimit.value)
          .then(({ list, total_count }) => {
            wallpaperTotal.value = total_count;
            resolve(
              list.map((wallpaperItem) => {
                return {
                  author: "",
                  authorAvatar: "",
                  createdAt: "",
                  deletedAt: "",
                  description: wallpaperItem.tag,
                  fileid: "",
                  fileUrl: wallpaperItem.url,
                  thumbUrl:
                    wallpaperItem.url +
                    "?x-oss-process=image/resize,m_fill,h_200,w_302/format,webp",
                  id: wallpaperItem.id,
                  source: "Birdpaper",
                  tags: wallpaperItem.tag,
                  updatedAt: "",
                  uploadedBy: "小鸟壁纸",
                  downloading: false,
                  sourceUrl: "",
                  sourceId: wallpaperItem.id,
                  collecting: false,
                };
              })
            );
          })
          .catch(reject);
        break;
      case "wallpapersHome":
        wallpaperApi
          .getWallpaperHomeList(currentSelectedCategoryId.value, wallpaperPage.value, wallpaperLoadLimit.value)
          .then(({ list, pagination }) => {
            wallpaperTotal.value = pagination.total;
            return list.map((item) => {
              return {
                author: "",
                authorAvatar: "",
                createdAt: "",
                deletedAt: "",
                description: "",
                fileid: "",
                fileUrl: "",
                thumbUrl: item.cover,
                id: item.id,
                source: "WallpapersHome",
                tags: "",
                updatedAt: "",
                uploadedBy: "Wallpapers Home",
                downloading: false,
                sourceUrl: item.link,
                sourceId: item.id,
                collecting: false,
                crawlUrl: item.link,
              };
            });
          })
          .then(resolve)
          .catch(reject);
        break;
      case "10wallpaper":
        tenWallpaperApi.wallpapers(`https://10wallpaper.com/cn/List_wallpapers/page/${page}`).then(res => {
          wallpaperTotal.value = res.pagination.total;
          return res.list.map((item) => {
            return {
              author: "",
              authorAvatar: "",
              createdAt: "",
              deletedAt: "",
              description: "",
              fileid: "",
              fileUrl: "",
              thumbUrl: item.cover,
              id: item.link,
              source: "10wallpaper",
              tags: "",
              updatedAt: "",
              uploadedBy: "10wallpaper",
              downloading: false,
              sourceUrl: item.link,
              sourceId: item.link,
              collecting: false,
              crawlUrl: item.link,
            };
          });
        }).then(resolve)
          .catch(reject);
        break;
      default:
        resolve([]);
    }
  })
    .then((res) => {
      if (res.length === 0) {
        wallpaperLoadFinished = true;
        return;
      }
      wallpapers.value = res;
    })
    .finally(() => {
      wallpaperListLoading.value = false;
      L.destroy();
    });
}

async function getCategories(sourceKey: string) {
  if (sourceKey === currentUsedSource.value) {
    if (categories.length > 0) return;
  }
  if (sourceKey !== currentUsedSource.value) {
    categories.splice(0, categories.length);
  }
  switch (sourceKey) {
    case "birdpaper":
      await birdpaperApi.getCategory().then(res => {
        categories.push(...res.map(item => ({
          name: item.show_name,
          id: item.old_id
        })));
        if (!currentSelectedCategoryId.value) {
          currentSelectedCategoryId.value = categories[0].id;
        }
      });
      break;
    case "wallpapersHome":
      await wallpaperApi.getWallpaperHomeCategories().then(res => {
        categories.push(...res.map(item => ({
          name: item.name,
          id: item.link
        })));
        if (!currentSelectedCategoryId.value) {
          currentSelectedCategoryId.value = categories[0].id;
        }
      });
      break;
    // case "10wallpaper":
    //   tenWallpaperApi.categories().then(res => {
    //     TenWallpaperCategories.value = res;
    //     categories.push(...res.map(item => {
    //       return {
    //         id: item.key,
    //         name: item.name
    //       }
    //     }));
    //     if (!currentSelectedCategoryId.value) {
    //       currentSelectedCategoryId.value = categories[0].id;
    //     }
    //   });
    //   break;
  }
}

function collect(wallpaperItem: TExternalWallpaper): Promise<TWallpaperItem> {
  if (wallpaperItem.collecting) return Promise.reject(false);
  wallpaperItem.collecting = true;
  return wallpaperApi
    .collect(
      wallpaperItem.sourceId,
      wallpaperItem.author,
      wallpaperItem.description,
      wallpaperItem.fileUrl,
      wallpaperItem.source,
      wallpaperItem.sourceUrl
    )
    .then((res) => {
      NMessage.success("添加到收集队列成功");
      return res;
    })
    .catch((res) => {
      NMessage.error("添加到收集队列失败");
      return res;
    })
    .finally(() => {
      wallpaperItem.collecting = false;
    });
}
function collectAndCrawl(wallpaperItem: TExternalWallpaper) {
  switch (wallpaperItem.source) {
    case "WallpapersHome":
      if (wallpaperItem.crawlUrl) {
        const loading = NMessage.loading("", {
          duration: 0
        });
        wallpaperApi
          .crawlWallpapersHome(wallpaperItem.crawlUrl)
          .then(() => {
            NMessage.success("添加在采集队列成功");
          })
          .catch(() => NMessage.error("添加到队列失败"))
          .finally(loading.destroy);
      }
      break;
    case "10wallpaper":
      if (wallpaperItem.crawlUrl) {
        const loading = NMessage.loading("");
        tenWallpaperApi
          .crawl(wallpaperItem.crawlUrl)
          .then(() => {
            NMessage.success("添加在采集队列成功");
          })
          .catch(() => NMessage.error("添加到队列失败"))
          .finally(loading.destroy);
      }
      break;
  }
}

let scrollHandler: any | number = null;
function wallpaperListScrolling(payload: UIEvent) {
  // if (wallpaperListLoading.value || wallpaperLoadFinished) return;
  // if (scrollHandler) {
  //   clearTimeout(scrollHandler);
  // }
  // scrollHandler = setTimeout(async () => {
  //   const target: HTMLElement = payload.target as HTMLElement;
  //   const bottomDistance: number = target.scrollTop + target.clientHeight;
  //   if (target.scrollHeight - bottomDistance < 200) {
  //     await getWallapers();
  //   }
  //   clearTimeout(scrollHandler);
  // }, 150);
}

function switchCategory(e: MouseEvent) {
  const target = e.target as HTMLLIElement;
  if (target.dataset?.id) {
    currentSelectedCategoryId.value = target.dataset.id;
    wallpaperListLoading.value = false;
    wallpaperPage.value = 1;
    wallpaperLoadFinished = false;
    wallpapers.value = [];

    getWallapers();
  }
}
async function reload(sourceKey: string) {
  wallpaperListLoading.value = false;
  wallpaperPage.value = 1;
  wallpaperLoadFinished = false;
  wallpapers.value = [];
  currentSelectedCategoryId.value = "";
  categories.splice(0, categories.length);

  await getCategories(sourceKey);

  getWallapers();
}
async function switchSource(sourceKey: string) {
  currentSelectedCategoryId.value = "";
  currentUsedSource.value = sourceKey;

  reload(sourceKey);
}
function openLink(link: string) {
  window.wallpaper.openLink(link);
}

onMounted(() => {
  getCategories("birdpaper").then(() => {
    getWallapers();
  });
});
</script>

<style scoped>
.page-main {
  padding: 20px 0;
  height: calc(100vh - 43px);
  overflow-y: auto;
  box-sizing: border-box;
}

/* 分类 */
.wallpaper-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 0 20px;
  font-size: 14px;
  user-select: none;
}

.wallpaper-categories li {
  padding: 3px 8px;
  border-radius: calc(var(--radius-angle) / 2);
}

.wallpaper-categories li:hover {
  color: var(--primary-color);
  cursor: pointer;
}

.wallpaper-categories li.active {
  color: white;
  background-color: var(--primary-color);
}

/** 壁纸列表 */
.wallpaper-list {
  display: flex;
  flex-wrap: wrap;
  /* grid-template-columns: repeat(4, calc(25% - 15px)); */
  gap: 20px;
  margin: 20px 20px 0;
  box-sizing: border-box;
}

.wallpaper-list>li {
  flex-shrink: 0;
  width: calc(25% - 15px);
  height: 33.3%;
  border-radius: 8px;
}

/* @media screen and (min-width: 1400px) {
  .wallpaper-list {
    grid-template-columns: repeat(5, calc(20% - 15px));
  }
}

@media screen and (min-width: 2000px) {
  .wallpaper-list {
    grid-template-columns: repeat(6, calc(20.2vw - 15px));
  }
} */

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
  /* background-color: #fafafa; */
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
