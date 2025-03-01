const express = require('express')
const router = express.Router()
const roomController = require('../controllers/roomController')

// 获取房间列表
router.get('/list', roomController.getRoomList)

// 创建房间
router.post('/create', roomController.createRoom)

// 加入房间
router.post('/join', roomController.joinRoom)

module.exports = router
