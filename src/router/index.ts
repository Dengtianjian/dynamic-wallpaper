import { RouteRecordRaw, createWebHistory, createRouter, createWebHashHistory } from "vue-router";

import Home from "PAGES/Home.vue";

const routes: RouteRecordRaw[] = [
  {
    path: '/', component: Home, children: [
      {
        path: "/", component: () => import("PAGES/WallpaperList.vue")
      },
      {
        path: "/downloadList", component: () => import("PAGES/DownloadList.vue")
      },
      {
        path: "/publish", component: () => import("PAGES/Publish.vue")
      },
      {
        path: "/settings", component: () => import("PAGES/Settings.vue")
      },
      {
        path: "/local", component: () => import("PAGES/Local.vue")
      }
    ]
  }
];


export default createRouter({
  history: createWebHashHistory(),
  routes
});