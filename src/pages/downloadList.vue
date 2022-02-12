<template>
  <ul class="download-list">
    <li class="download-item" v-for="index in 220" :key="index">
      <img
        src="https://t7.baidu.com/it/u=2621658848,3952322712&fm=193&f=GIF"
        alt=""
        class="download_wallpaper-cover"
      />
      <div class="download-progress">55.5%</div>
    </li>
  </ul>
</template>

<script lang="ts" setup></script>

<style scoped>
.download-list {
  display: grid;
  grid-template-columns: repeat(4, calc(25% - 8.75px));
  justify-content: space-between;
  gap: 10px;
}
.download-item {
  position: relative;
}
.download_wallpaper-cover {
  display: block;
  width: 100%;
  height: 180px;
  object-fit: cover;
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
