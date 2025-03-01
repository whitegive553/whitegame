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

// Socket.IO 配置
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
})

// Socket.IO 事件监听和处理
io.on('connection', (socket) => {
    console.log('用户已连接:', socket.id)

    // 用户加入房间
    socket.on('joinRoom', async (roomName) => {
        socket.join(roomName)
        console.log(`用户加入房间：${roomName}`)

        // 加载历史消息
        const Room = require('./models/Room')
        const room = await Room.findOne({ roomName }).select('messages')
        if (room) {
            socket.emit('loadMessages', room.messages)
        }
    })

    // 消息广播并存储到数据库
    socket.on('sendMessage', async ({ roomName, username, message }) => {
        const chatMessage = { username, message, timestamp: new Date() }
        io.to(roomName).emit('receiveMessage', chatMessage)

        // 存入数据库
        const Room = require('./models/Room')
        const room = await Room.findOne({ roomName })
        if (room) {
            room.messages.push(chatMessage)
            await room.save()
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
