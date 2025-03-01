<template>
  <div>
    <h2>登录</h2>
    <input v-model="username" placeholder="用户名" />
    <input v-model="password" type="password" placeholder="密码" />
    <button @click="login">登录</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async login() {
      try {
        const res = await axios.post('http://localhost:3000/api/auth/login', {
          username: this.username,
          password: this.password
        })
        localStorage.setItem('token', res.data.token)
        alert(res.data.message)
        this.$router.push('/rooms')
      } catch (err) {
        alert('登录失败')
      }
    }
  }
}
</script>
