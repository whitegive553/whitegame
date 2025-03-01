// 引入依赖
const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
const mongoose = require('mongoose')
require('dotenv').config()

// 初始化 Express 应用
const app = express()

// 中间件配置
app.use(cors())
app.use(express.json())

// MongoDB Atlas 数据库连接
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:your_password@cluster0.mongodb.net/cardgame?retryWrites=true&w=majority'
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB 云服务器连接成功'))
    .catch(err => console.log('MongoDB 云服务器连接失败', err))

// 路由配置
const authRoutes = require('./routes/authRoutes')
const roomRoutes = require('./routes/roomRoutes')
app.use('/api/auth', authRoutes)
app.use('/api/room', roomRoutes)

// 引入游戏逻辑
const { shuffleDeck, dealCards, playCard } = require('./controllers/gameController')

// Socket.IO 配置
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:8080",   // Vue 前端的地址
        methods: ["GET", "POST"]
    }
})

// Socket.IO 事件监听和处理
io.on('connection', (socket) => {
    console.log('用户已连接:', socket.id)

    // 用户加入房间
    socket.on('joinRoom', async (roomName, username) => {
        socket.join(roomName)
        console.log(`用户 ${username} 加入房间：${roomName}`)

        // 加载房间信息
        const Room = require('./models/Room')
        let room = await Room.findOne({ roomName })

        // 如果房间不存在，则创建新房间
        if (!room) {
            room = new Room({ roomName, players: [{ username, hand: [] }] })
            await room.save()
        } else {
            // 如果房间存在，则加入玩家
            if (!room.players.find(player => player.username === username)) {
                room.players.push({ username, hand: [] })
                await room.save()
            }
        }

        io.to(roomName).emit('roomData', room)
    })

// 开始游戏
    socket.on('startGame', async (roomName) => {
        const Room = require('./models/Room')
        const room = await Room.findOne({ roomName })

        if (room) {
            // 洗牌并发牌
            console.log(`开始游戏，房间：${roomName}`)
            const deck = shuffleDeck()
            const hands = dealCards(deck, room.players.length)

            room.players.forEach((player, index) => {
                player.hand = hands[index]
            })

            room.currentTurn = room.players[0].username  // 设置第一个玩家为当前回合

            await room.save()
            io.to(roomName).emit('gameStarted', room)
        }
    })


// 玩家出牌
    socket.on('playCard', async ({ roomName, username, card }) => {
        try {
            const room = await playCard(roomName, username, card)
            io.to(roomName).emit('updateGame', room)

            // 游戏结束判定
            if (room.winner) {
                io.to(roomName).emit('gameOver', room.winner)
            }
        } catch (error) {
            socket.emit('errorMessage', error.message)
        }
    })

    // 用户断开连接
    socket.on('disconnect', () => {
        console.log('用户已断开连接:', socket.id)
    })
})

// 启动服务器
const PORT = 3000
server.listen(PORT, () => console.log(`服务器运行在 http://localhost:${PORT}`))
