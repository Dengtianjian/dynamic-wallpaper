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
          <li>详情</li>
          <li @click="previous">上一个</li>
          <li @click="next">下一个</li>
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
import { NPopover } from "naive-ui";
import { onMounted, onUnmounted, ref } from "vue";
import wallpaperApi from "../api/wallpaperApi";
import attachment from "../foundation/attachment";
import { TWallpaperItem } from "../types/wallpaperTypes";
let page: number = 1;
const currentWallpaper = ref<TWallpaperItem>();
const loading = ref<boolean>(false);
const imageLoading = ref<boolean>(false);
let total: number = 0;
let switchHandler: NodeJS.Timer | null = null;

function getWallpaper() {
  if (loading.value || imageLoading.value) return;
  loading.value = true;
  wallpaperApi
    .getWallpapers(page, 1)
    .then(({ pagination, wallpapers }) => {
      total = pagination.total;
      if (wallpapers.length === 0) {
        page = genRandomPage();
        return;
      }

      page++;
      currentWallpaper.value = wallpapers[0];
      currentWallpaper.value.fileUrl = attachment.genDownloadUrl(
        wallpapers[0].fileid
      );
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
  page--;
  if (page <= 0) {
    page = genRandomPage();
  }
  getWallpaper();
}
function next() {
  page++;
  if (page > total) {
    page = genRandomPage();
  }
  getWallpaper();
}
function imageLoaded() {
  imageLoading.value = false;
}

onMounted(() => {
  if (switchHandler) clearInterval(switchHandler);
  getWallpaper();
  switchHandler = setInterval(getWallpaper, 50000);
});
onUnmounted(() => {
  if (switchHandler) clearInterval(switchHandler);
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
