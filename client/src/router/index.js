import { createRouter, createWebHistory } from 'vue-router'
import RegisterBox from '../views/RegisterBox.vue'
import LoginBox from '../views/LoginBox.vue'
import RoomList from '../views/RoomList.vue'
import GameRoom from '../views/GameRoom.vue'

const routes = [
    { path: '/register', component: RegisterBox },
    { path: '/login', component: LoginBox },
    { path: '/rooms', component: RoomList },
    { path: '/game/:roomName', component: GameRoom, name: 'GameRoom' },
    { path: '/', redirect: '/register' }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
