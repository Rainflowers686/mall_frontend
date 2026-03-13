import { createApp } from 'vue'
import './style.css' // 刚才被我们清空的样式表
import App from './App.vue'
import router from './router' // 引入我们刚写的路由

// 引入 Element Plus 和它的样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 🌟 1. 引入所有的 Element Plus 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

// 🌟 2. 遍历并全局注册所有图标！(这句是魔法的核心)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


app.use(router)       // 挂载路由
app.use(ElementPlus)  // 挂载 UI 库
app.mount('#app')     // 渲染页面