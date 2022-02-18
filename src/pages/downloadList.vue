<template>
  <ul class="download-list">
    <d-wallpaper-item
      :data="downloadItem[1]"
      v-for="downloadItem in download.getAll()"
    >
      <div class="download-progress">{{ downloadItem[1].download.progress }}%</div>
    </d-wallpaper-item>
  </ul>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import DWallpaperItem from "../components/DWallpaperItem.vue";
import download from "../foundation/download";
</script>

<style scoped>
.download-list {
  display: grid;
  grid-template-columns: repeat(4, calc(25% - 8.75px));
  justify-content: space-between;
  gap: 10px;
}
.download-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 3px 0;
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
