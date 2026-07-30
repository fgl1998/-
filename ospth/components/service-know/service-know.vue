<template>
  <view class="service-know">
    <view class="know-box">
      <image class="img" src="../../static/commonImage/panel1.png" mode="widthFix"></image>
      <view class="text">
        <slot></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    htmlText: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.service-know {
  padding: 32rpx;

  .know-box {
    background-color: #ffffff;
    border-radius: 16rpx;
    font-size: 28rpx;
    min-height: 650rpx;

    .img {
      width: 100%;
      height: 200rpx;
    }

    .text {
      color: #9c9c9c;
      padding: 14rpx 8rpx 40rpx;
    }
  }
}
</style>