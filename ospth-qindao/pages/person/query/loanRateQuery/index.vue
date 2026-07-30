<template>
    <view class="loan-rate-wrap">
      <view class="page_title">贷款利率查询</view>

      <view class="rate_list">
        <view class="rate_item" v-for="(item, index) in tableData" :key="index">
          <van-cell title="公积金贷款房屋套数" :value="item.houseType" />
          <van-cell title="贷款年限" :value="item.term" />
          <van-cell title="执行利率" :value="item.rate" />
        </view>
      </view>

      <view v-if="!tableData || tableData.length === 0" class="empty_tip">
        <van-empty description="暂无数据" />
      </view>
    </view>
</template>

<script>
export default {
  name: 'loanRateQuery',
  data() {
    return {
      tableData: [
        { houseType: '首套房', term: '1-5年期', rate: '2.1' },
        { houseType: '首套房', term: '5年期以上', rate: '2.6' },
        { houseType: '二套房', term: '1-5年期', rate: '2.525' },
        { houseType: '二套房', term: '5年期以上', rate: '3.075' }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.loan-rate-wrap {
  padding: 24rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page_title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 24rpx;
  padding-left: 8rpx;
}

.rate_list {
  .rate_item {
    background: #ffffff;
    border-radius: 16rpx;
    padding: 12rpx 0;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
    border: 1rpx solid #e5e6eb;
    overflow: hidden;

    /deep/ .van-cell {
      padding: 20rpx 32rpx;
      &::after {
        left: 32rpx;
        right: 32rpx;
      }
    }
    
    /deep/ .van-cell__title {
      color: #666;
      font-size: 28rpx;
    }
    
    /deep/ .van-cell__value {
      color: #333;
      font-size: 28rpx;
      font-weight: 500;
    }
  }
}

.empty_tip {
  padding: 100rpx 0;
}
</style>
