import { RouteRecordRaw, createWebHistory, createRouter, createWebHashHistory } from "vue-router";

import Home from "PAGES/Home.vue";

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home },
];


export default createRouter({
  history: createWebHashHistory(),
  routes
});