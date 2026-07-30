<template>
  <view class="title_box" @click="click">
    <view class="title_style"></view>
    <view class="title_text">{{ title }}</view>
  </view>
</template>
<script>
export default {
  name: 'boxTitle',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    click() {
      this.$emit('click')
    }
  },
}
</script>
<style scoped lang="scss">
.title_box {
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  padding: 48rpx 0 24rpx;

  .title_style {
    width: 6rpx;
    height: 32rpx;
    border-radius: 6rpx;
    background-color: #3883ff;
    margin-right: 12rpx;
    margin-left: 16rpx;
  }

  .title_text {
    font-size: 34rpx;
    color: #005fe2;
    height: 32rpx;
    line-height: 32rpx;
    font-weight: 500;
  }
}
</style>
