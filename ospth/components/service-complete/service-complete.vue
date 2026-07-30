<template>
  <view class="service-complete">
    <view class="complete-box">
      <image class="img" src="" mode="widthFix"></image>
      <view class="text">办理成功</view>
      <view class="tips">温馨提示</view>
      <view class="tip">业务申请成功后请等待业务工作人员的审核。</view>
      <view class="btn" @click="backPage">返回首页</view>
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
  methods:{
	  backPage(){
		     uni.navigateBack();
	  }
  }
};
</script>

<style lang="scss" scoped>
.service-complete {
  padding: 32rpx 0 0;
  .complete-box{
    background-color: #ffffff;
    padding: 20rpx 60rpx 50rpx;
    text-align: center;
    .img{
      width: 400rpx;
      height: 260rpx;
    }
    .tips{
      text-align: left;
      color: #999;
      margin: 10rpx 0 4rpx;
    }
    .tip{
      text-align: left;
      color: red;
      font-weight: bold;
    }
    .btn{
      width: 260rpx;
      border-radius: 30rpx;
      color: #ffffff;
      padding: 10rpx 0;
      background-color: #4372fe;
      margin: 120rpx auto 0;
    }
  }
}
</style>