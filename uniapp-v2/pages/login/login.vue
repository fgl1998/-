<template>
  <view class="login-page safe-page">
    <view class="login-card">
      <view class="brand">RealWorld</view>
      <view class="subtitle">登录后阅读与参与讨论</view>

      <u-form :model="form" label-position="top">
        <u-form-item label="用户名" prop="username" :border-bottom="false">
          <u-input v-model="form.username" placeholder="请输入用户名" :disabled="submitting" border="surround" />
        </u-form-item>
        <u-form-item label="密码" prop="password" :border-bottom="false">
          <u-input v-model="form.password" type="password" placeholder="请输入密码" :disabled="submitting" border="surround" />
        </u-form-item>
      </u-form>

      <u-button type="primary" shape="circle" :loading="submitting" :disabled="submitting" @click="handleLogin">
        {{ submitting ? '登录中…' : '登录' }}
      </u-button>
      <view class="register-entry">
        <text>还没有账号？</text>
        <text class="register-link" @click="openRegister">去注册</text>
      </view>
    </view>
  </view>
</template>

<script>
const userApi = require('../../api/user')
const session = require('../../common/session')

export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      submitting: false,
    }
  },
  methods: {
    openRegister() {
      if (this.submitting) return
      uni.navigateTo({ url: '/pages/register/register' })
    },
    showError(message) {
      uni.showToast({ title: message, icon: 'none' })
    },
    async handleLogin() {
      if (this.submitting) return

      const username = this.form.username.trim()
      const password = this.form.password
      if (!username) {
        this.showError('请输入用户名')
        return
      }
      if (!password) {
        this.showError('请输入密码')
        return
      }

      this.submitting = true
      try {
        const result = await userApi.login(username, password)
        session.set({ token: result.token, user: result.user })
        uni.showToast({ title: '登录成功', icon: 'success' })
        uni.switchTab({ url: '/pages/index/index' })
      } catch (error) {
        this.showError((error && error.message) || '登录失败，请稍后重试')
      } finally {
        this.submitting = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 140rpx 32rpx 48rpx;
}

.login-card {
  padding: 48rpx 36rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 16rpx 48rpx rgba(31, 41, 55, 0.08);
}

.brand {
  color: #303133;
  font-size: 52rpx;
  font-weight: 700;
  line-height: 1.2;
}

.subtitle {
  margin: 16rpx 0 36rpx;
  color: #909399;
  font-size: 28rpx;
}

.register-entry {
  display: flex;
  justify-content: center;
  margin-top: 30rpx;
  color: #909399;
  font-size: 26rpx;
}

.register-link {
  margin-left: 10rpx;
  color: #3c9cff;
}
</style>
