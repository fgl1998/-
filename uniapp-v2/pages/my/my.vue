<template>
  <view class="my-container">
    <!-- 未登录 -->
    <view v-if="!isLogin" class="not-login">
      <text class="tip">暂未登录</text>
      <u-button type="primary" @click="goLogin">去登录</u-button>
    </view>

    <!-- 已登录 -->
    <view v-else class="logged-in">
      <view class="info-list">
        <view class="info-item">
          <text class="label">姓名</text>
          <text class="value">{{ userInfo.name }}</text>
        </view>
        <view class="info-item">
          <text class="label">身份证号</text>
          <text class="value">{{ userInfo.idCard }}</text>
        </view>
        <view class="info-item">
          <text class="label">电话</text>
          <text class="value">{{ userInfo.phone }}</text>
        </view>
      </view>

      <view class="logout-btn">
        <u-button type="warning" @click="handleLogout">退出登录</u-button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isLogin: false,
      userInfo: {
        name: '',
        idCard: '',
        phone: ''
      }
    }
  },
  onShow() {
    const info = uni.getStorageSync('userInfo')
    if (info) {
      this.isLogin = true
      this.userInfo = info
    } else {
      this.isLogin = false
      this.userInfo = { name: '', idCard: '', phone: '' }
    }
  },
  methods: {
    goLogin() {
      uni.navigateTo({
        url: '/pages/login/login'
      })
    },
    handleLogout() {
      uni.removeStorageSync('userInfo')
      this.isLogin = false
      this.userInfo = { name: '', idCard: '', phone: '' }
    }
  }
}
</script>

<style lang="scss" scoped>
.my-container {
  padding: 40rpx 30rpx;
}

.not-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;

  .tip {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 40rpx;
  }
}

.info-list {
  background: #fff;
  border-radius: 12rpx;
  padding: 0 30rpx;
  margin-bottom: 40rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  .label {
    font-size: 30rpx;
    color: #333;
  }

  .value {
    font-size: 28rpx;
    color: #666;
  }
}

.logout-btn {
  margin-top: 60rpx;
}
</style>
