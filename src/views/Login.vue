<template>
  <div class="login-container">
    <el-card class="login-card" shadow="hover">
      <h2>极客商城 - 开发者登录</h2>

      <el-form :model="loginForm" label-width="0px">
        <el-form-item>
          <el-input
            v-model="loginForm.username"
            placeholder="请输入测试账号 (如: testuser)"
            prefix-icon="User" />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" style="width: 100%;" @click="handleLogin">
            登 录
          </el-button>
        </el-form-item>

        <div class="tips">
          <span>还没有账号？</span>
          <el-link type="primary">立即注册</el-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'  // 引入网络大杀器
import { useRouter } from 'vue-router' // 引入路由跳转工具

const router = useRouter() // 实例化路由

const loginForm = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    ElMessage.warning('账号和密码不能为空哦！')
    return
  }

  try {
    // 1. 向 Django 发起真正的 POST 登录请求！
    const res = await axios.post('http://127.0.0.1:8000/api/login/', {
      username: loginForm.username,
      password: loginForm.password
    })

    // 2. 如果成功，Django 会返回一长串字符串
    ElMessage.success('登录成功！拿到门禁卡啦！')

    // 3. 把门禁卡 (Token) 妥善保管在浏览器的本地保险箱里
    localStorage.setItem('access_token', res.data.access)
    localStorage.setItem('refresh_token', res.data.refresh)

    // 4. 登录成功后，一键飞越回首页！
    router.push('/')

  } catch (error) {
    // 如果密码错了，或者服务器没开，精准拦截报错
    console.error(error)
    ElMessage.error('登录失败，请检查账号密码或网络状态！')
  }
}
</script>

<style scoped>
/* 简单的居中和美化样式 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

h2 {
  margin-bottom: 30px;
  color: #303133;
}

.tips {
  margin-top: 15px;
  font-size: 14px;
  text-align: right;
}
</style>