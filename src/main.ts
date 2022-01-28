import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import { create, NSpin } from "naive-ui";
const naive = create({
  components: [NSpin]
})

const app = createApp(App)
app.use(router);
app.use(naive);
app.mount('#app')
