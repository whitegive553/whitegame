<template>
  <div>
    <h2>房间列表</h2>
    <button @click="createRoom">创建房间</button>
    <ul>
      <li v-for="(room, index) in rooms" :key="index">
        {{ room.roomName }} - 在线玩家: {{ room.players.length }}
        <button @click="joinRoom(room.roomName)">加入房间</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      rooms: []  // 房间列表
    }
  },
  created() {
    this.getRooms()
  },
  methods: {
    // 获取房间列表
    async getRooms() {
      try {
        const res = await axios.get('/room/list')
        this.rooms = res.data
      } catch (err) {
        console.error('获取房间列表失败', err)
      }
    },

    // 创建房间
    async createRoom() {
      const roomName = prompt("请输入房间名称")
      if (roomName) {
        try {
          await axios.post('/room/create', {roomName})
          this.getRooms()  // 刷新房间列表
        } catch (err) {
          console.error('创建房间失败', err)
        }
      }
    },

    // 加入房间
    async joinRoom(roomName) {
      const username = localStorage.getItem('username') || prompt("请输入用户名")
      localStorage.setItem('username', username)
      this.$socket.emit('joinRoom', roomName, username)

      try {
        await axios.post('/room/join', { roomName, username })
        this.$router.push({ name: 'GameRoom', params: { roomName } })
      } catch (err) {
        console.error('加入房间失败', err)
      }
    }
  }
}
</script>
