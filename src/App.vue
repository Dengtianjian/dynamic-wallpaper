<script setup lang="ts">
import { NMessageProvider } from "naive-ui";
import "./foundation/database";
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
