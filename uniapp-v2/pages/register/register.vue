<template>
  <view class="register-page safe-page">
    <view class="register-card">
      <view class="brand">创建账号</view>
      <view class="subtitle">注册后即可发布、收藏和评论文章</view>

      <u-form :model="form" label-position="top">
        <u-form-item label="用户名" prop="username" :border-bottom="false">
          <u-input v-model="form.username" maxlength="20" placeholder="1-20 个字符" :disabled="submitting" border="surround" />
        </u-form-item>
        <u-form-item label="邮箱" prop="email" :border-bottom="false">
          <u-input v-model="form.email" type="text" placeholder="请输入邮箱" :disabled="submitting" border="surround" />
        </u-form-item>
        <u-form-item label="密码" prop="password" :border-bottom="false">
          <u-input v-model="form.password" type="password" maxlength="20" placeholder="6-20 个字符" :disabled="submitting" border="surround" />
        </u-form-item>
        <u-form-item label="确认密码" prop="confirmPassword" :border-bottom="false">
          <u-input v-model="form.confirmPassword" type="password" maxlength="20" placeholder="请再次输入密码" :disabled="submitting" border="surround" />
        </u-form-item>
      </u-form>

      <u-button type="primary" shape="circle" :loading="submitting" :disabled="submitting" @click="handleRegister">
        {{ submitting ? '注册中…' : '注册' }}
      </u-button>
      <view class="login-entry">
        <text>已有账号？</text>
        <text class="login-link" @click="openLogin">返回登录</text>
      </view>
    </view>
  </view>
</template>

<script>
const userApi = require('../../api/user')

export default {
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      submitting: false,
    }
  },
  methods: {
    showError(message) {
      uni.showToast({ title: message, icon: 'none' })
    },
    openLogin() {
      if (this.submitting) return
      this.navigateToLogin()
    },
    navigateToLogin() {
      uni.navigateBack({
        delta: 1,
        fail: () => uni.reLaunch({ url: '/pages/login/login' }),
      })
    },
    async handleRegister() {
      if (this.submitting) return

      const username = this.form.username.trim()
      const email = this.form.email.trim()
      const password = this.form.password
      const confirmPassword = this.form.confirmPassword
      if (!username) {
        this.showError('请输入用户名')
        return
      }
      if (username.length > 20) {
        this.showError('用户名长度不能超过 20 个字符')
        return
      }
      if (!email) {
        this.showError('请输入邮箱')
        return
      }
      if (!/^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/.test(email)) {
        this.showError('邮箱格式错误')
        return
      }
      if (password.length < 6 || password.length > 20) {
        this.showError('密码长度应为 6-20 个字符')
        return
      }
      if (password !== confirmPassword) {
        this.showError('两次输入的密码不一致')
        return
      }

      this.submitting = true
      try {
        await userApi.register(username, email, password)
        uni.showToast({ title: '注册成功，请登录', icon: 'success' })
        this.navigateToLogin()
      } catch (error) {
        this.showError((error && error.message) || '注册失败，请稍后重试')
      } finally {
        this.submitting = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 72rpx 32rpx 48rpx;
}

.register-card {
  padding: 48rpx 36rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 16rpx 48rpx rgba(31, 41, 55, 0.08);
}

.brand {
  color: #303133;
  font-size: 46rpx;
  font-weight: 700;
  line-height: 1.2;
}

.subtitle {
  margin: 16rpx 0 30rpx;
  color: #909399;
  font-size: 27rpx;
}

.login-entry {
  display: flex;
  justify-content: center;
  margin-top: 30rpx;
  color: #909399;
  font-size: 26rpx;
}

.login-link {
  margin-left: 10rpx;
  color: #3c9cff;
}
</style>
