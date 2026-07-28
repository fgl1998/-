<template>
  <div class="guide-attention page-wrapper">
    <img class="img" :src="image511800" alt="" />
    <div class="text">扫码上方二维码</div>
    <div class="text">关注惠民惠农“一卡通”了解更多</div>
  </div>
</template>
<script>
  import image511800 from '@/components/project/ez-qr/images/511800.jpg'
  export default {
    name: 'guideAttention',
    data() {
      return { image511800 }
    },
    computed: {},
    components: {},
    onLoad(e) {},
    onReady() {},
    onShow() {},
    methods: {},
    watch: {}
  }
</script>
<style lang="scss" scoped>
  .guide-attention {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .img {
      width: 580rpx;
      height: 580rpx;
    }
    .text {
      width: 100%;
      text-align: center;
      color: #333;
      font-size: 32rpx;
      line-height: 1;
      margin-top: 20rpx;
    }
  }
</style>
