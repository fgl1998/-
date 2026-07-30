<template>
  <view class="step_container" style="padding-top: 24rpx;">
    <view class="menu-list">
      <van-cell v-for="item in menuList" :key="item.path" is-link @click="goToPage(item)">
        <template #title>
          <view class="menu-item">
            <van-icon :name="item.icon" size="22" color="#1677ff" class="menu-icon" />
            <text class="menu-text">{{ item.title }}</text>
          </view>
        </template>
      </van-cell>
    </view>
    <view class="tip-box">
      <view class="tip-title">
        <van-icon name="info-o" size="16" color="#fa8c16" />
        <text>温馨提示</text>
      </view>
      <view class="tip-content">
        <text>1. 部分提前还款、提前结清可与按月还款、逾期还款一起办理</text>
        <text>2. 存在逾期还款计划的，不能选择按月还款</text>
        <text>3. 还款业务提交后将自动办结生效</text>
        <text>4. 日终（日切）进行时，不允许办理还款业务</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'RepaymentMenu',
  data() {
    return {
      menuList: [
        { title: '按月还款', path: '/pages/person/repayment/monthly/index', icon: 'balance-o' },
        { title: '逾期还款', path: '/pages/person/repayment/overdue/index', icon: 'warning-o' },
        { title: '部分提前还款', path: '/pages/person/repayment/advance/index', icon: 'coupon-o' },
        { title: '提前结清', path: '/pages/person/repayment/settle/index', icon: 'completed' },
      ],
    }
  },
  methods: {
    goToPage(item) {
      uni.navigateTo({ url: item.path })
    },
  },
}
</script>

<style lang="less" scoped>
.menu-list {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 24rpx;
}
.menu-item {
  display: flex;
  align-items: center;
}
.menu-icon {
  margin-right: 16rpx;
}
.menu-text {
  font-size: 30rpx;
  color: #333;
}
.tip-box {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}
.tip-title {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #fa8c16;
  text {
    margin-left: 8rpx;
  }
}
.tip-content {
  text {
    display: block;
    font-size: 24rpx;
    color: #666;
    line-height: 40rpx;
  }
}
</style>
