const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    const { username, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const newUser = new User({ username, password: hashedPassword })
        await newUser.save()
        res.status(201).json({ message: '用户注册成功' })
    } catch (error) {
        res.status(400).json({ message: '用户注册失败', error })
    }
}

const login = async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })

    if (!user) return res.status(404).json({ message: '用户不存在' })

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return res.status(401).json({ message: '密码错误' })

    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' })
    res.status(200).json({ token, message: '登录成功' })
}

module.exports = { register, login }
