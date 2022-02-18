<template>
  <main class="page-main" @scroll="wallpaperListScrolling" ref="pageMainEl">
    <n-spin :show="wallpaperListLoading">
      <ul class="wallpaper-list">
        <d-wallpaper-item
          :data="wallpaperItem"
          v-for="wallpaperItem in wallpapers"
          :key="wallpaperItem.id"
        >
          <section @click.stop>
            <div class="wallpaper-title">{{ wallpaperItem.description }}</div>
            <div class="wallpaper-author">
              来自 {{ wallpaperItem.source }} 的
              <!-- <img
                :src="wallpaperItem.authorAvatar"
                :alt="wallpaperItem.author"
                class="wallpaper-author_avatar"
                v-if="wallpaperItem.authorAvatar"
              /> -->
              {{ wallpaperItem.author }}
            </div>
            <ul class="wallpaper-operations">
              <li>
                <n-tooltip>
                  <template #trigger>
                    <i
                      class="shoutao st-link"
                      @click.stop="openLink(wallpaperItem.fileUrl)"
                    ></i>
                  </template>
                  浏览器打开
                </n-tooltip>
              </li>
              <li>
                <n-tooltip>
                  <template #trigger>
                    <i
                      class="shoutao st-check"
                      @click.stop="setWallpaper(wallpaperItem)"
                    ></i>
                  </template>
                  设置为桌面壁纸
                </n-tooltip>
              </li>
              <li>
                <n-tooltip>
                  <template #trigger>
                    <i
                      class="shoutao st-down"
                      @click.stop="downloadWallpaper(wallpaperItem)"
                    ></i>
                  </template>
                  下载到本地
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
import { useRouter } from "vue-router";
import wallpaperApi from "../api/wallpaperApi";
import attachment from "../foundation/attachment";
import { TWallpaperItem } from "../types/wallpaperTypes";
import DWallpaperItem from "../components/DWallpaperItem.vue";
import download from "../foundation/download";
const Router = useRouter();
const NMessage = useMessage();

const currentShowCategoriteKey = ref<string>("all");
const categorites: {
  label: string;
  key: string;
}[] = [
  {
    label: "全部",
    key: "all",
  },
];
const pageMainEl = ref<HTMLElement | null>(null);
const wallpaperListLoading = ref<boolean>(false);
let wallpaperSetting = false;
let wallpaperPage = 1;
let wallpaperLoadLimit = 28;
let wallpaperLoadFinished = false;

const wallpapers = ref<TWallpaperItem[]>([]);
// const wallpapersDownloadList = ref<TWallpaperItem[]>([]);

function getWallapers(): void {
  if (wallpaperListLoading.value || wallpaperLoadFinished) {
    return;
  }
  wallpaperListLoading.value = true;
  wallpaperApi
    .getWallpapers()
    .then(({ pagination, wallpapers: data }) => {
      if (data.length < wallpaperLoadLimit) {
        wallpaperLoadFinished = true;
        if (data.length === 0) return;
      }
      wallpaperPage++;
      data.forEach((dataItem) => {
        dataItem.fileUrl = attachment.genDownloadUrl(dataItem.fileid);
        dataItem.downloading = false;
      });
      wallpapers.value.push(...data);
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
    .set(wallpaperItem.fileUrl)
    .then((res: any) => {
      NMessage.success("设置成功");
    })
    .catch((err: any) => {
      console.log(err);
      NMessage.error("设置失败");
    })
    .finally(() => {
      wallpaperSetting = false;
      wallpaperListLoading.value = false;
    });
}
function downloadWallpaper(wallpaperItem: TWallpaperItem) {
  // download.add(wallpaperItem);
  wallpaperItem.downloading = true;
  window.wallpaper
    .download(wallpaperItem.fileUrl, (total, downloadedSize, progress) => {
      download.updateProgress(wallpaperItem.id, progress);
      console.log(total, downloadedSize, progress);
    })
    .then((res) => {
      NMessage.success("下载完成");
      new Notification("壁纸下载完成");
    })
    .catch((err) => {
      console.log(err);
      NMessage.error("下载失败");
    })
    .finally(() => {
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
  if (
    wallpaperListLoading.value ||
    wallpaperSetting ||
    !(payload.target as HTMLElement).dataset
  ) {
    return;
  }
  let key: string | undefined = (payload.target as HTMLElement).dataset.key;
  if (!key) return;

  currentShowCategoriteKey.value = key;
  wallpaperListLoading.value = false;
  wallpaperPage = 1;
  wallpaperLoadFinished = false;
  wallpapers.value = [];

  getWallapers();
}
function openLink(link: string) {
  window.link.openLink(link);
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
    grid-template-columns: repeat(6, calc(16.6% - 15px));
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
</style>
