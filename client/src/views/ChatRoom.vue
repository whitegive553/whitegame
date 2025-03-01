<template>
  <div>
    <h2>{{ roomName }} 聊天室</h2>
    <ul>
      <li v-for="(msg, index) in messages" :key="index">
        <strong>{{ msg.username }}:</strong> {{ msg.message }} <span>({{ formatTimestamp(msg.timestamp) }})</span>
      </li>
    </ul>
    <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="输入消息" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      roomName: this.$route.params.roomName,  // 获取路由参数中的房间名称
      username: localStorage.getItem('username'),
      newMessage: '',
      messages: []   // 存储消息列表
    }
  },
  mounted() {
    this.$socket.emit('joinRoom', this.roomName)

    // 加载历史消息
    this.$socket.on('loadMessages', (messages) => {
      this.messages = messages
    })

    // 实时接收消息
    this.$socket.on('receiveMessage', (msg) => {
      this.messages.push(msg)
    })
  },
  methods: {
    sendMessage() {
      const messageData = {
        roomName: this.roomName,
        username: this.username,
        message: this.newMessage
      }
      this.$socket.emit('sendMessage', messageData)
      this.newMessage = ''
    },
    formatTimestamp(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleString()
    }
  }
}
</script>
