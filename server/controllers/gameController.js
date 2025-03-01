const Room = require('../models/Room')

const suits = ['♠', '♥', '♣', '♦']
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

// 洗牌函数
const shuffleDeck = () => {
    const deck = []
    suits.forEach(suit => {
        values.forEach(value => {
            deck.push({ suit, value })
        })
    })
    // 洗牌算法：Fisher-Yates 洗牌算法
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            [deck[i], deck[j]] = [deck[j], deck[i]]
    }
    return deck
}

// 发牌函数
const dealCards = (deck, numPlayers) => {
    const hands = Array.from({ length: numPlayers }, () => [])
    let currentIndex = 0

    while (deck.length) {
        hands[currentIndex].push(deck.pop())
        currentIndex = (currentIndex + 1) % numPlayers
    }
    return hands
}

// 出牌和回合制管理
const playCard = async (roomName, username, card) => {
    const room = await Room.findOne({ roomName })
    if (!room) throw new Error('房间不存在')

    // 判断是否为当前玩家的回合
    if (room.currentTurn !== username) throw new Error('不是你的回合')

    // 将牌从玩家手牌中移除
    const playerIndex = room.players.findIndex(player => player.username === username)
    const playerHand = room.players[playerIndex].hand
    const cardIndex = playerHand.findIndex(c => c.suit === card.suit && c.value === card.value)

    if (cardIndex === -1) throw new Error('无效的出牌')
    playerHand.splice(cardIndex, 1)

    // 更新当前出的牌
    room.currentCard = card

    // 更新下一回合的玩家
    const nextIndex = (playerIndex + 1) % room.players.length
    room.currentTurn = room.players[nextIndex].username

    await room.save()
    return room
}

module.exports = { shuffleDeck, dealCards, playCard }
