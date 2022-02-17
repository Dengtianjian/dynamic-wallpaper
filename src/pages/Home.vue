<template>
  <section class="router-view">
    <router-view></router-view>
  </section>
  <nav class="navigator">
    <router-link
      class="navigator-item"
      v-for="navigatorItem in navigators"
      :key="navigatorItem.key"
      :to="navigatorItem.uri"
    >
      {{ navigatorItem.label }}
    </router-link>
  </nav>
</template>

<script lang="ts" setup>
const navigators: Array<{
  label: string;
  key: string;
  uri: string;
}> = [
  {
    label: "壁纸",
    key: "wallpapers",
    uri: "/",
  },
  {
    label: "下载列表",
    key: "downloadList",
    uri: "downloadList",
  },
  {
    label: "上传",
    key: "upload",
    uri: "upload",
  },
  {
    label: "设置",
    key: "settings",
    uri: "settings",
  },
  {
    label: "本地",
    key: "local",
    uri: "local",
  },
];
</script>

<style scoped>
.router-view {
  height: calc(100vh - 41px);
  overflow: hidden auto;
}

/** 导航 */
.navigator {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  column-gap: 10px;
  height: 40px;
  width: 100%;
  font-size: 12px;
  color: #666;
  /* background: red; */
  border-top: 1px solid #eee;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
  background-color: white;
  border-radius: var(--radius-angle) var(--radius-angle) 0 0;
}
.navigator-item {
  padding: 0 10px;
  color: #666;
  text-decoration: none;
}
.navigator-item:hover {
  color: var(--primary-color);
  cursor: pointer;
}
</style>
