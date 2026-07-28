<template>
  <view class="ez-qr">
    <div class="fixed-QR d-f ai-c" @click="openPopupQR" :style="caclTop">
      <img :src="QRCodeImageMap[areaCode]" alt="" />
      <div>
        <div>扫码关注</div>
        <div>了解更多</div>
      </div>
    </div>
    <ComponentPopup type="center" ref="popup_qr">
      <div class="popup-content popup-content-qr">
        <img :src="QRCodeImageMap[areaCode]" alt="" />
        <div class="fllow-tip">关注惠民惠农“一卡通”了解更多</div>
        <div class="iconfont iconfont-close" @click="closePopupQR"></div>
      </div>
    </ComponentPopup>
  </view>
</template>

<script>
/**
 * 了解更多二维码
 * @description 了解更多二维码
 */
import image511000 from './images/511000.jpg'
import image511700 from './images/511700.jpg'
import image511800 from './images/511800.jpg' // 雅安

import ComponentPopup from '@/components/common/ez-popup/ez-popup.vue'

import config from '@/config'
export default {
  name: 'ezQR',
  props: {
    top: { type: [String], default: '162rpx' },
    open: { type: [Boolean], default: false },
  },
  components: {
    ComponentPopup,
  },
  data() {
    return {
      // 各地市小程序二维码图片
      QRCodeImageMap: {
        511000: image511000,
        511700: image511700,
        511800: image511800,
      },
      areaCode: config.areaCode,
    }
  },
  created() {},
  mounted() {
    const { areaCode } = config
    this.areaCode = areaCode
    if (this.open) {
      this.openPopupQR()
    }
  },
  methods: {
    // 打开弹窗
    openPopupQR() {
      this.$refs['popup_qr'].open()
    },
    // 关闭弹窗
    closePopupQR() {
      this.$refs['popup_qr'].close()
    },
  },
  computed: {
    caclTop() {
      let str = ''
      const top = this.top
      if (top) {
        str += `top: ${top}; `
      }
      return str
    },
  },
  watch: {},
}
</script>

<style lang="scss" scoped>
.ez-qr {
  .fixed-QR {
    position: fixed;
    top: 162rpx;
    right: 0;
    z-index: 99;
    background-color: #fff;
    font-size: 24rpx;
    line-height: 26rpx;
    color: #333;
    box-shadow: 0rpx 2rpx 10rpx 0rpx #ddd;
    padding: 16rpx;
    border-top-left-radius: 100rpx;
    border-bottom-left-radius: 100rpx;
    img {
      width: 52rpx;
      height: 52rpx;
      margin-right: 8rpx;
    }
  }
  .popup-content {
    background-color: #fff;
    border-radius: 8rpx 8rpx 0 0;
    border-radius: 8rpx;
    padding: 30rpx;
    position: relative;
    img {
      width: 400rpx;
      height: 400rpx;
      margin: 0 auto;
    }
    .fllow-tip {
      padding: 30rpx;
    }
    .iconfont-close {
      font-size: 36rpx;
      position: absolute;
      top: 0;
      right: 0;
      color: #f00;
      padding: 20rpx;
    }
  }
}
</style>
