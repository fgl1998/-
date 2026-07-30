<template>
  <div class="layout-container">
<!--    <van-nav-bar title="办理结果" fixed class="custom-nav-bar" />-->
    <div class="result-content">
      <van-icon name="success-circle" size="80" color="#07c160"/>
      <div class="result-title">提交成功</div>
      <div class="result-desc">该业务需要审核，请耐心等待通知</div>
      <div class="result-link" @click="toQueryRecord">查询办理记录</div>
    </div>
    <view class="button-group">
      <van-button color='#1492ff' style="width: 100%" class='btnStyle' @click="toHome" type="info">返回首页</van-button>
    </view>
  </div>
</template>
<script>
export default {
  name: 'handleComplete',
  methods: {
    toQueryRecord() {
      alert('跳转查询记录页面')
    },
    toHome() {

    }
  },
}
</script>
<style scoped lang="scss">
.result-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f5f7fa;
  z-index: 200;
}

.custom-nav-bar {
  background-color: #1677ff !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.result-content {
  padding-top: 120px;
  text-align: center;
}

.result-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.result-desc {
  font-size: 15px;
  color: #666;
  margin-bottom: 20px;
}

.result-link {
  font-size: 15px;
  color: #1677ff;
  cursor: pointer;
}

.button-group {
  display: flex;
  gap: 20rpx;
  margin-top: auto;
  padding-top: 32rpx;

  /* 按钮上方加一条细线，高级感立刻来 */

  &::before {
    content: '';
    position: absolute;
    left: 24rpx;
    right: 24rpx;
    top: 0;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.06);
  }

  position: relative;
}
</style>
