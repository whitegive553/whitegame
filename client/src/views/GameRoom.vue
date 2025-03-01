<template>
  <div>
    <h2>{{ roomName }} - 游戏房间</h2>
    <h3>当前回合：{{ currentTurn }}</h3>
    <h4>当前出的牌：</h4>
    <div v-if="currentCard" class="current-card">
      {{ currentCard.value }}{{ currentCard.suit }}
    </div>
    <ul class="hand">
      <li v-for="(card, index) in hand" :key="index"
          :class="{ disabled: currentTurn !== username }"
          @click="playCard(card)">
        {{ card.value }}{{ card.suit }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roomName: this.$route.params.roomName,   // 获取路由参数中的房间名称
      username: localStorage.getItem('username'),   // 当前玩家用户名
      hand: [],              // 当前玩家手牌
      currentCard: null,     // 当前出的牌
      currentTurn: ''        // 当前回合玩家
    }
  },
  mounted() {
    this.$socket.emit('joinRoom', this.roomName, this.username)

    // 加载房间数据
    this.$socket.on('roomData', (room) => {
      this.updateGameState(room)
    })

    // 游戏开始
    this.$socket.on('gameStarted', (room) => {
      this.updateGameState(room)
    })

    // 更新游戏状态
    this.$socket.on('updateGame', (room) => {
      this.updateGameState(room)
    })

    // 错误信息
    this.$socket.on('errorMessage', (message) => {
      alert(message)
    })
  },
  methods: {
    // 更新游戏状态
    updateGameState(room) {
      const player = room.players.find(p => p.username === this.username)
      this.hand = player ? player.hand : []
      this.currentCard = room.currentCard
      this.currentTurn = room.currentTurn
    },

    // 出牌操作
    playCard(card) {
      if (this.currentTurn !== this.username) {
        alert('现在不是你的回合！')
        return
      }
      this.$socket.emit('playCard', {
        roomName: this.roomName,
        username: this.username,
        card
      })
    }
  }
}
</script>

<style scoped>
.hand {
  display: flex;
  gap: 10px;
}

.hand li {
  list-style: none;
  padding: 10px;
  background: lightblue;
  cursor: pointer;
  border-radius: 5px;
}

.hand li.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.current-card {
  font-size: 24px;
  font-weight: bold;
}
</style>
