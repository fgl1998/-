<!-- 无贷款时的展示 -->
<template>
  <view class="no_loan">
    <view class="no_loan_left">
      <text class="left_txt">无<br />贷<br />款</text>
    </view>
    <view class="no_loan_right">
      <view class="right_main">
        <view class="main_row">
          <text class="main_label">公积金最高贷款额：</text>
          <text class="main_val">￥780000</text>
        </view>
        <view class="main_des">5年以上贷款利率（首套房）：<text class="des_val">2.6%</text></view>
        <view class="main_des">5年以上贷款利率（二套房）：<text class="des_val">3.075%</text></view>
        <view class="main_footer">
          <text class="link" @click="goComputeLoan">详细计算</text>
        </view>
      </view>
      <view class="right_tags">
        <view class="tag_item"><view class="tag_icon" />手续简</view>
        <view class="tag_item"><view class="tag_icon" />渠道多</view>
        <view class="tag_item"><view class="tag_icon" />利率低</view>
        <view class="tag_item"><view class="tag_icon" />抵个税</view>
        <view class="tag_item"><view class="tag_icon" />还款易</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'loanNoInfo',
  methods: {
    goComputeLoan () {
      uni.showToast({ title: '功能开发中', icon: 'none' })
    },
  },
}
</script>

<style scoped lang="scss">
.no_loan {
  margin-top: 24rpx;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  display: flex;

  .no_loan_left {
    width: 80rpx;
    background: #1492ff;
    padding: 48rpx 0;
    text-align: center;

    .left_txt {
      font-size: 32rpx;
      font-weight: bold;
      color: #fff;
      line-height: 1.5;
    }
  }

  .no_loan_right {
    flex: 1;
    padding: 32rpx 24rpx;
    display: flex;
    flex-direction: column;
    gap: 24rpx;

    .right_main {
      .main_row {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 16rpx;
        .main_val { color: #1492ff; font-weight: 600; }
      }
      .main_des {
        font-size: 26rpx;
        color: #666;
        line-height: 40rpx;
        .des_val { color: #ff9841; }
      }
      .main_footer {
        margin-top: 16rpx;
        .link {
          font-size: 26rpx;
          color: #1492ff;
        }
      }
    }

    .right_tags {
      display: flex;
      flex-wrap: wrap;
      gap: 24rpx;

      .tag_item {
        display: flex;
        align-items: center;
        gap: 8rpx;
        font-size: 24rpx;
        color: #666;

        .tag_icon {
          width: 12rpx;
          height: 12rpx;
          border-radius: 50%;
          background: #1492ff;
        }
      }
    }
  }
}
</style>
