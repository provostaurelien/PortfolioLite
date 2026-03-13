import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'
import { VueReCaptcha } from 'vue-recaptcha-v3'
const app = createApp(App)
app.use(router)
app.mount('#app')
