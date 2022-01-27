import { RouteRecordRaw, createWebHistory, createRouter } from "vue-router";

import Home from "PAGES/Home.vue";

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home },
];


export default createRouter({
  history: createWebHistory(),
  routes
});