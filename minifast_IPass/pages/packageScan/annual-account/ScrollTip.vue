<template>
  <cover-view class="scroll-tip" v-if="step > 1 && step < totalStep">
    <cover-image class="icon" :src="imageIconArrowUp" alt="" />
    <cover-view class="text">滑动继续</cover-view>
  </cover-view>
</template>
<script>
  import { IMAGE_ANNUAL_ACCOUNT } from '@/config/constants'

  const imageIconArrowUp = IMAGE_ANNUAL_ACCOUNT + '/icon-arrow-up.png'
  export default {
    name: 'annualAccountScrollTip',
    props: {
      /**
       * 当前页面步骤
       */
      step: {
        type: Number,
        required: true
      },
      /**
       * 总步骤
       */
      totalStep: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        imageIconArrowUp
      }
    },
    components: {},
    onLoad(e) {},
    methods: {},
    computed: {},
    mounted() {}
  }
</script>

<style lang="scss" scoped>
  @keyframes ab {
    0% {
      bottom: 80rpx;
      opacity: 0.6;
    }
    50% {
      bottom: 90rpx;
      opacity: 1;
    }
    100% {
      bottom: 80rpx;
      opacity: 0.6;
    }
  }
  .scroll-tip {
    position: fixed;
    z-index: 99;
    left: 50%;
    transform: translateX(-50%);
    bottom: 80rpx;
    font-size: 24rpx;
    line-height: 1;
    animation: ab 2s infinite linear;
    transition: all 0.3s;
    .icon {
      width: 26rpx;
      height: 26rpx;
      margin: 0 auto;
    }
    .text {
      color: #c6907b;
      padding-top: 14rpx;
    }
  }
</style>
