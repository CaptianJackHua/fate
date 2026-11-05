import { createSSRApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

// 全局样式
import './styles/main.scss'

// Pinia状态管理
const pinia = createPinia()

export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia)
  return {
    app,
    pinia
  }
}
