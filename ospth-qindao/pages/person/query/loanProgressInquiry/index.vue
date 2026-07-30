<template>
  <view class="container">
    <view class="content">
      <view class="header-card">
        <text class="label">贷款申请表编号</text>
        <text class="value">20250916957968</text>
      </view>
      <view class="timeline">
        <view v-for="(item, index) in steps" :key="index" class="timeline-item">
          <view class="left-side">
            <text class="step-name">{{ item.name }}</text>
          </view>
          <view class="middle-side">
            <view class="circle">
              <van-icon name="success" color="#fff" size="16px" />
            </view>
            <view v-if="index !== steps.length - 1" class="line"></view>
          </view>
          <view class="right-side">
            <view class="result">办理结果:{{ item.result }}</view>
            <view class="time">创建时间：{{ item.time }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      steps: [
        { name: '已受理', result: '已完成', time: '2025-09-16 16:28:27' },
        { name: '机审', result: '已完成', time: '2025-09-19 10:51:09' },
        { name: '初审', result: '已完成', time: '2025-09-19 10:51:16' },
        { name: '已受理', result: '已完成', time: '2025-09-19 16:08:31' },
        { name: '机审', result: '已完成', time: '2025-09-23 09:43:09' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #fff;
}
.content {
  padding: 0 20rpx;
}
.header-card {
  display: flex;
  justify-content: space-between;
  padding: 40rpx 30rpx;
  border-bottom: 1rpx solid #eee;
  margin-bottom: 40rpx;
  .label {
    font-size: 34rpx;
    color: #333;
    font-weight: 500;
  }
  .value {
    font-size: 34rpx;
    color: #999;
  }
}
.timeline {
  padding: 0 20rpx;
}
.timeline-item {
  display: flex;
  min-height: 180rpx;
}
.left-side {
  width: 160rpx;
  text-align: right;
  padding-right: 40rpx;
  padding-top: 10rpx;
  .step-name {
    font-size: 32rpx;
    color: #4788fe;
    font-weight: 500;
  }
}
.middle-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 60rpx;
  .circle {
    width: 48rpx;
    height: 48rpx;
    background-color: #4788fe;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
  }
  .line {
    flex: 1;
    width: 2rpx;
    background-color: #4788fe;
    margin: 10rpx 0;
  }
}
.right-side {
  flex: 1;
  padding-left: 40rpx;
  padding-bottom: 60rpx;
  .result {
    font-size: 32rpx;
    color: #4788fe;
    margin-bottom: 16rpx;
    font-weight: 500;
  }
  .time {
    font-size: 28rpx;
    color: #4788fe;
  }
}
</style>
