<template>
  <li class="wallpaper-item">
    <img :src="data.thumbUrl" alt="" class="wallpaper-cover" />

    <section class="wallpaper-info" @click.stop>
      <slot />
      <!-- <div class="wallpaper-title">{{ data.description }}</div>
      <div class="wallpaper-author">
        来自 {{ data.source }} 的
        <img
          :src="data.authorAvatar"
          :alt="data.author"
          class="wallpaper-author_avatar"
          v-if="data.authorAvatar"
        />
        {{ data.author }}
      </div> -->
    </section>
  </li>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import {
  TWallpaperDownloadItem,
  TWallpaperItem,
} from "../types/wallpaperTypes";

defineProps({
  data: {
    type: Object as PropType<TWallpaperItem | TWallpaperDownloadItem>,
    default: null,
  },
});
</script>

<style scoped>
.wallpaper-item {
  position: relative;
  height: 26vh;
  /* width: 212px; */
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
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.6));
  box-sizing: border-box;
  transition: bottom 0.15s ease-in-out;
}
.wallpaper-item:hover .wallpaper-info {
  bottom: 0;
}
.wallpaper-title {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
</style>
