<template>
  <header class="page-header">
    <n-menu
      v-model:value="menuActiveKey"
      mode="horizontal"
      :options="menuOptions"
    />
    <section class="page-header_user">
      <i class="shoutao st-settings"></i>
    </section>
  </header>
</template>

<script lang="ts" setup>
import { NMenu, MenuOption } from "naive-ui";
import { ref } from "vue";
const menuActiveKey = ref<string>("wallpaper");
const menuOptions: MenuOption[] = [
  {
    label: "壁纸",
    key: "wallpaper",
  },
  {
    label: "设置",
    key: "settings",
  },
];
</script>

<style scoped>
.page-header {
  display: grid;
  grid-template-columns: calc(80vw - 10px) 20vw;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-bottom: 1px solid #eee;
}
.page-header_user {
  padding-right: 10px;
  justify-self: flex-end;
}
</style>
