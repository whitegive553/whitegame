const Room = require('../models/Room')

// 扑克牌数据
const suits = ['♠', '♥', '♣', '♦']
const values = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2']

// 洗牌函数
const shuffleDeck = () => {
    const deck = []
    suits.forEach(suit => {
        values.forEach(value => {
            deck.push({ suit, value })
        })
    })
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

// 牌型判断：判断出牌是否合法
const isValidPlay = (currentCard, newCard) => {
    if (!currentCard) return true  // 如果没有当前牌，任何牌都可以出
    const currentValueIndex = values.indexOf(currentCard.value)
    const newValueIndex = values.indexOf(newCard.value)

    // 简单规则：必须比当前牌大
    return newValueIndex > currentValueIndex
}

// 回合结束判定：判断是否游戏结束
const isGameOver = (room) => {
    return room.players.some(player => player.hand.length === 0)
}

// 出牌和回合制管理
const playCard = async (roomName, username, card) => {
    const room = await Room.findOne({ roomName })
    if (!room) throw new Error('房间不存在')

    // 判断是否为当前玩家的回合
    if (room.currentTurn !== username) throw new Error('不是你的回合')

    // 判断出牌是否合法
    if (!isValidPlay(room.currentCard, card)) {
        throw new Error('出牌不合法，必须大于当前牌')
    }

    // 将牌从玩家手牌中移除
    const playerIndex = room.players.findIndex(player => player.username === username)
    const playerHand = room.players[playerIndex].hand
    const cardIndex = playerHand.findIndex(c => c.suit === card.suit && c.value === card.value)

    if (cardIndex === -1) throw new Error('无效的出牌')
    playerHand.splice(cardIndex, 1)

    // 更新当前出的牌
    room.currentCard = card

    // 检查回合结束和游戏结束
    if (isGameOver(room)) {
        room.winner = username
        room.currentTurn = null
    } else {
        // 更新下一回合的玩家
        const nextIndex = (playerIndex + 1) % room.players.length
        room.currentTurn = room.players[nextIndex].username
    }

    await room.save()
    return room
}

module.exports = { shuffleDeck, dealCards, playCard }
