import { RouteRecordRaw, createWebHistory, createRouter, createWebHashHistory } from "vue-router";

import Home from "PAGES/Home.vue";

const routes: RouteRecordRaw[] = [
  {
    path: '/', component: Home, children: [
      {
        path: "/", component: () => import("PAGES/Story.vue"),
        meta: {
          keepAlive: true
        }
      },
      {
        path: "/list", component: () => import("PAGES/WallpaperList.vue"),
        meta: {
          keepAlive: true
        }
      },
      {
        path: "/downloadList", component: () => import("PAGES/DownloadList.vue"),
        meta: {
          keepAlive: true
        }
      },
      {
        path: "/publish", component: () => import("PAGES/Publish.vue"),
        meta: {
          keepAlive: true
        }
      },
      {
        path: "/settings", component: () => import("PAGES/Settings.vue"),
        meta: {
          keepAlive: true
        }
      },
      {
        path: "/local", component: () => import("PAGES/Local.vue"),
        meta: {
          keepAlive: true
        }
      }
    ]
  }
];


export default createRouter({
  history: createWebHashHistory(),
  routes
});