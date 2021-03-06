import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: "./",
  plugins: [vue()],
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      "PAGES": "/src/pages"
    }
  }
});