import { createRouter, createWebHistory } from 'vue-router'
import RegisterBox from '../views/RegisterBox.vue'
import LoginBox from '../views/LoginBox.vue'
import RoomList from '../views/RoomList.vue'
import ChatRoom from '../views/ChatRoom.vue'

const routes = [
    { path: '/register', component: RegisterBox },
    { path: '/login', component: LoginBox },
    { path: '/rooms', component: RoomList },
    { path: '/chat/:roomName', component: ChatRoom, name: 'ChatRoom' },
    { path: '/', redirect: '/register' }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
