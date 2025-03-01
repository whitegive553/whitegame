<template>
  <div id="app">
    <h1>线上纸牌游戏</h1>
    <ChatBox />  <!-- 确保在模板中使用 -->
    <router-view></router-view>
  </div>
</template>

<script>
import ChatBox from './components/ChatBox.vue'

export default {
  components: {
    ChatBox
  }
}
</script>
