import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  envDir: "envs",
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      "PAGES": "/src/pages"
    }
  }
});