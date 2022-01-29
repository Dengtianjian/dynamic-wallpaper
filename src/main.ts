import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import { create, NSpin, NButton } from "naive-ui";
const naive = create({
  components: [NSpin, NButton]
})

const app = createApp(App)
app.use(router);
app.use(naive);
app.mount('#app')
