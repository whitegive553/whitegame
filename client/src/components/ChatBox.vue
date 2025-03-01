<template>
  <div>
    <h2>实时消息</h2>
    <ul>
      <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
    </ul>
    <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="输入消息" />
  </div>
</template>

<script>
export default {
  name: "ChatBox",   // 修改为多词形式
  data() {
    return {
      messages: [],
      newMessage: ''
    }
  },
  mounted() {
    this.$socket.on('message', (msg) => {
      this.messages.push(msg)
    })
  },
  methods: {
    sendMessage() {
      this.$socket.emit('message', this.newMessage)
      this.newMessage = ''
    }
  }
}
</script>

<style scoped>
input {
  width: 100%;
  padding: 8px;
  margin-top: 10px;
}
</style>
