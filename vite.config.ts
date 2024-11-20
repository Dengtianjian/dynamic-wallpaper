import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: "./",
  envDir: "envs",
  server: {
    port: 3000
  },
  build: {
    outDir: "dist/web"
  },
  resolve: {
    alias: {
      "PAGES": "/src/pages"
    }
  }
});