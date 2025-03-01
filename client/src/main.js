import { createApp } from 'vue'
import App from './App.vue'
import router from './router'  // 引入 Vue Router
import { io } from 'socket.io-client'

// 配置 Socket.IO 客户端
const socket = io('http://localhost:3000')  // 确保与后端地址一致

// 创建 Vue 应用
const app = createApp(App)

// 全局注入 Socket.IO 实例
app.config.globalProperties.$socket = socket

// 使用 Vue Router
app.use(router)

// 挂载应用
app.mount('#app')
