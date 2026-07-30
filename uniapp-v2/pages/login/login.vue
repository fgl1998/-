<template>
  <view class="login-container">
    <view class="login-form">
      <u-form :model="form" ref="uForm">
        <u-form-item label="身份证号" prop="idCard" :border-bottom="true">
          <u-input
            v-model="form.idCard"
            placeholder="请输入身份证号"
            maxlength="18"
          />
        </u-form-item>
        <u-form-item label="姓名" prop="name" :border-bottom="true">
          <u-input
            v-model="form.name"
            placeholder="请输入姓名"
          />
        </u-form-item>
        <u-form-item label="电话" prop="phone" :border-bottom="true">
          <u-input
            v-model="form.phone"
            placeholder="请输入电话"
            type="number"
            maxlength="11"
          />
        </u-form-item>
      </u-form>

      <view class="login-btn">
        <u-button type="primary" @click="handleLogin">登录</u-button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {
        idCard: '',
        name: '',
        phone: ''
      }
    }
  },
  methods: {
    handleLogin() {
      const { idCard, name, phone } = this.form
      if (!idCard) {
        uni.showToast({ title: '请输入身份证号', icon: 'none' })
        return
      }
      if (!name) {
        uni.showToast({ title: '请输入姓名', icon: 'none' })
        return
      }
      if (!phone) {
        uni.showToast({ title: '请输入电话', icon: 'none' })
        return
      }
      uni.setStorageSync('userInfo', this.form)
      uni.showToast({ title: '登录成功', icon: 'success' })
      setTimeout(() => {
        uni.navigateBack()
      }, 800)
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  padding: 40rpx 30rpx;
}

.login-btn {
  margin-top: 60rpx;
}
</style>
