<template>
  <div>
    <h2>{{ roomName }} - 游戏房间</h2>
    <h3 v-if="winner">游戏结束，赢家：{{ winner }}</h3>
    <h3 v-else>当前回合：{{ currentTurn }}</h3>
    <h4>当前出的牌：</h4>
    <div v-if="currentCard" class="current-card">
      {{ currentCard.value }}{{ currentCard.suit }}
    </div>

    <!-- 添加 开始游戏 按钮，仅房主可见 -->
    <button @click="startGame">开始游戏</button>

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
      roomName: this.$route.params.roomName,
      username: localStorage.getItem('username'),
      hand: [],
      currentCard: null,
      currentTurn: '',
      winner: '',
      isRoomOwner: false  // 新增：判断是否为房主
    }
  },
  mounted() {
    this.$socket.emit('joinRoom', this.roomName, this.username)

    this.$socket.on('roomData', (room) => {
      this.updateGameState(room)
    })

    this.$socket.on('gameStarted', (room) => {
      this.updateGameState(room)
    })

    this.$socket.on('updateGame', (room) => {
      this.updateGameState(room)
    })

    this.$socket.on('gameOver', (winner) => {
      this.winner = winner
      alert(`游戏结束，赢家：${winner}`)
    })

    this.$socket.on('errorMessage', (message) => {
      alert(message)
    })
  },
  methods: {
    updateGameState(room) {
      const player = room.players.find(p => p.username === this.username)
      this.hand = player ? player.hand : []
      this.currentCard = room.currentCard
      this.currentTurn = room.currentTurn
      this.isRoomOwner = room.players[0].username === this.username  // 房主为第一个加入房间的玩家
    },

    // 开始游戏
    startGame() {
      this.$socket.emit('startGame', this.roomName)
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
