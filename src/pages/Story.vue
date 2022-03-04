<template>
  <img
    :src="currentWallpaper?.fileUrl"
    class="wallpaper-image"
    @load="imageLoaded"
  />
  <section class="wallpaper">
    <n-popover trigger="hover" :show-arrow="false" :raw="true">
      <template #trigger>
        <ul class="wallpaper-operations">
          <li v-show="imageLoading || loading"><n-spin :size="14" /></li>
          <li
            class="qianniu qianniu-suspend"
            @click="stopPlay"
            v-show="!stopSwitch"
          ></li>
          <li
            class="qianniu qianniu-play"
            @click="continuePlay"
            v-show="stopSwitch"
          ></li>
          <li class="shoutao st-down" @click="downloadToLocal"></li>
          <li class="qianniu qianniu-setup" @click="setScreenWallpaper"></li>
          <li class="qianniu qianniu-browse"></li>
          <li class="qianniu qianniu-return" @click="previous"></li>
          <li class="qianniu qianniu-enter" @click="next"></li>
        </ul>
      </template>
      <div class="wallpaper-details">
        <div class="wallpaper-description">
          {{ currentWallpaper?.description }}
        </div>
        <div class="wallpaper-copyright">© {{ currentWallpaper?.author }}</div>
      </div>
    </n-popover>
  </section>
</template>

<script lang="ts" setup>
import { NPopover, useMessage } from "naive-ui";
import { onMounted, onUnmounted, ref } from "vue";
import wallpaperApi from "../api/wallpaperApi";
import attachment from "../foundation/attachment";
import wallpaperService from "../service/wallpaperService";
import { TWallpaperItem } from "../types/wallpaperTypes";
const NMessage = useMessage();
let page: number = 1;
const currentWallpaper = ref<TWallpaperItem>();
const loading = ref<boolean>(false);
const imageLoading = ref<boolean>(false);
let total: number = 0;
let switchHandler: NodeJS.Timer | null = null;
const stopSwitch = ref<boolean>(false);

function getWallpaper() {
  if (loading.value || imageLoading.value) return;
  loading.value = true;
  wallpaperApi
    .randomGetWallpapers(1)
    .then((wallpapers) => {
      if (wallpapers.length === 0) return;
      const wallpaper = wallpapers[0];
      wallpaper.fileUrl = attachment.genImageThumbUrl(
        wallpapers[0].fileid,
        window.innerWidth,
        window.innerHeight
      );

      currentWallpaper.value = wallpaper;

      imageLoading.value = true;
    })
    .finally(() => {
      loading.value = false;
    });
}

function genRandomPage(): number {
  return 1 + Math.round(Math.random() * total);
}
function previous() {
  if (loading.value || imageLoading.value) return;
  page--;
  if (page <= 0) {
    page = genRandomPage();
  }
  getWallpaper();
}
function next() {
  if (loading.value || imageLoading.value) return;
  page++;
  if (page > total) {
    page = genRandomPage();
  }
  getWallpaper();
}
function imageLoaded() {
  imageLoading.value = false;
}

function stopPlay() {
  if (switchHandler) clearInterval(switchHandler);
  stopSwitch.value = true;
}
function continuePlay() {
  if (switchHandler) clearInterval(switchHandler);
  getWallpaper();
  switchHandler = setInterval(getWallpaper, 50000);
  stopSwitch.value = false;
}

function setScreenWallpaper() {
  if (loading.value || imageLoading.value || !currentWallpaper.value) {
    return;
  }
  imageLoading.value = true;

  wallpaperService
    .setWallpaper(
      attachment.genImageThumbUrl(
        currentWallpaper.value.fileid,
        window.screen.width,
        window.screen.height
      ),
      currentWallpaper.value.id
    )
    .then(() => {
      NMessage.success("设置成功");
    })
    .catch(() => {
      NMessage.success("设置失败");
    })
    .finally(() => {
      imageLoading.value = false;
    });
}
function downloadToLocal() {
  if (!currentWallpaper.value || loading.value || imageLoading.value) {
    return;
  }
  imageLoading.value = true;

  window.wallpaper
    .downloadWallpaper(
      attachment.genImageThumbUrl(
        currentWallpaper.value.fileid,
        window.screen.width,
        window.screen.height
      ),
      currentWallpaper.value.id
    )
    .then((res) => {
      NMessage.success("下载完成");
      new Notification("壁纸下载完成");
    })
    .catch((err) => {
      NMessage.error("下载失败");
    })
    .finally(() => {
      imageLoading.value = false;
    });
}

onMounted(() => {
  continuePlay();
});
onUnmounted(() => {
  stopPlay();
});
</script>

<style scoped>
.wallpaper-image {
  display: block;
  width: 100vw;
  height: calc(100vh - 41px);
  object-fit: cover;
}
.wallpaper {
  position: fixed;
  bottom: 60px;
  right: 60px;
  font-size: 14px;
  color: white;
  opacity: 0.5;
  transition: opacity 0.2s ease-in-out;
}
.wallpaper:hover {
  opacity: 1;
}
.wallpaper-operations {
  display: flex;
  align-items: center;
  gap: 10px;
}
.wallpaper-operations li {
  padding: 6px 14px;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: var(--radius-angle);
}
.wallpaper-details {
  margin-bottom: 10px;
  min-width: 250px;
  padding: 8px 14px;
  color: white;
  font-size: 16px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: var(--radius-angle);
}
.wallpaper-copyright {
  margin-top: 4px;
  font-size: 14px;
}
</style>
