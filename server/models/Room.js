const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
    roomName: { type: String, required: true, unique: true },
    players: [{ type: String }],      // 在线玩家列表
    messages: [{                     // 消息记录
        username: String,
        message: String,
        timestamp: { type: Date, default: Date.now }
    }]
})

module.exports = mongoose.model('Room', RoomSchema)
