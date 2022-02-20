<script setup lang="ts">
import { NMessageProvider } from "naive-ui";
import { onMounted } from "vue";
import systemService from "./service/systemService";

onMounted(() => {
  systemService.init();
});
</script>

<template>
  <n-message-provider>
    <router-view></router-view>
  </n-message-provider>
</template>

<style>
@import url("./assets/css/reset.css");
@import url("./assets/common.css");
@import url("./assets/iconfont/iconfont.css");
</style>
