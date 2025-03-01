const Room = require('../models/Room')

// 获取房间列表
const getRoomList = async (req, res) => {
    try {
        const rooms = await Room.find().select('roomName players')
        res.status(200).json(rooms)
    } catch (error) {
        res.status(500).json({ message: '获取房间列表失败', error })
    }
}

// 创建房间
const createRoom = async (req, res) => {
    const { roomName } = req.body
    try {
        const newRoom = new Room({ roomName, players: [] })
        await newRoom.save()
        res.status(201).json({ message: '房间创建成功', room: newRoom })
    } catch (error) {
        res.status(500).json({ message: '房间创建失败', error })
    }
}

// 加入房间（如果不存在则创建）
const joinRoom = async (req, res) => {
    const { roomName, username } = req.body
    try {
        let room = await Room.findOne({ roomName })

        // 如果房间不存在，则自动创建
        if (!room) {
            room = new Room({ roomName, players: [username] })
            await room.save()
            return res.status(201).json({ message: '房间已创建并加入', room })
        }

        // 房间已存在，加入房间
        if (!room.players.includes(username)) {
            room.players.push(username)
            await room.save()
        }
        res.status(200).json({ message: '加入房间成功', room })
    } catch (error) {
        res.status(500).json({ message: '加入房间失败', error })
    }
}

module.exports = { getRoomList, createRoom, joinRoom }
