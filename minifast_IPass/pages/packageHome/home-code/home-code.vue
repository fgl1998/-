<template>
  <div class="my-home-scan h5-page">
    <div class="qr-wrapper">
      <div class="avatar-wrapper">
        <div class="avatar">
          <ComponentAvatar size="184rpx"></ComponentAvatar>
        </div>
        <div class="name">{{ userInfo.userName }}</div>
      </div>
      <div class="desc">打开微信“扫一扫”，申请加入“我的家”</div>
      <div class="qr">
        <div class="bg" :class="isScanSuccess ? 'scaned' : ''">
          <canvas
            class="canvas"
            id="erweima"
            canvas-id="erweima"
            bindlongtap="save"
          ></canvas>
        </div>
        <div class="scan-success" v-if="isScanSuccess">
          <div class="iconimg iconimg-scan-success"></div>
          <div class="hit">扫码成功</div>
          <div class="desc">请在微信中进行人脸识别加入</div>
          <div class="re-scan" @click="isScanSuccess = false">重新扫码</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ComponentAvatar from '@/components/common/ez-avatar/ez-avatar.vue'
import config from '@/config'
import QR from '@/utils/weapp-qrcode.min.js'
import { USER_INFO } from '@/store/constants' // 常量
import { mapGetters } from 'vuex'
export default {
  name: 'myHomeScan',
  data() {
    return {
      // 扫码是否成功
      isScanSuccess: false,
    }
  },
  components: {
    ComponentAvatar,
  },
  onLoad(e) {
    const { familyId } = e
    this.getImg(familyId)
  },
  created() {},
  mounted() {},
  methods: {
    getImg(familyId) {
      var query = uni.createSelectorQuery().in(this)
      query
        .select('#erweima')
        .boundingClientRect((data) => {
          var qrcode = new QR('erweima', {
            width: data.width,
            height: data.width,
          })
          qrcode.makeCode(
            config.requestUrl + '/addMyfamily?familyId=' + familyId
          )
        })
        .exec()
    },
  },
  computed: {
    ...mapGetters([USER_INFO]),
  },
  watch: {},
  onShow() {},
  onUnload() {},
}
</script>
<style lang="scss" scoped>
.my-home-scan {
  width: 100%;
  padding: 120rpx $spacing $spacing;
  .qr-wrapper {
    width: 100%;
    background-color: #fff;
    box-shadow: 0px 2px 24px 0px rgba(8, 76, 192, 0.15);
    border-radius: 12px;
    padding: 0 30rpx;
    font-size: 32rpx;
    color: $color;
    font-weight: 500;
    line-height: 1.4;
    text-align: center;
    position: relative;
    padding-top: 230rpx;
    padding-bottom: 140rpx;
    .avatar-wrapper {
      position: absolute;
      top: -76rpx;
      left: 50%;
      transform: translateX(-50%);
      .avatar {
        box-shadow: 0rpx 2rpx 22rpx 0rpx rgba(56, 130, 255, 0.42);
        border: solid 10rpx #fff;
        border-radius: 50%;
        overflow: hidden;
      }
      .name {
        font-size: 30rpx;
        padding-top: $spacing;
        line-height: 1.2;
        font-weight: 500;
        text-align: center;
      }
    }

    .desc {
      line-height: 44rpx;
      font-weight: 700;
    }
    .qr {
      padding-top: 28rpx;
      position: relative;
      .bg {
        width: 424rpx;
        height: 424rpx;
        background: url(data:image/png;base64,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)
          no-repeat center center;
        background-size: 100%;
        padding: 60rpx 56rpx 56rpx 60rpx;
        margin: auto;
        .canvas {
          width: 100%;
          height: 100%;
        }
        &.scaned {
          opacity: 0.1;
        }
      }
      .scan-success {
        position: absolute;
        top: 58rpx;
        left: 50%;
        width: 100%;
        transform: translateX(-50%);
        font-weight: 700;
        font-size: 48rpx;
        color: #00cc99;
        .iconimg {
          width: 306rpx;
          height: 298rpx;
          background: url(data:image/png;base64,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)
            no-repeat center center;
          background-size: 100% 100%;
          margin: auto;
        }
        .hit {
          position: absolute;
          width: 100%;
          top: 264rpx;
          line-height: 62rpx;
        }
        .desc {
          font-size: 28rpx;
          line-height: 40rpx;
          color: #4e5767;
          padding-top: 80rpx;
        }
        .re-scan {
          margin-top: 34rpx;
          font-size: 32rpx;
          line-height: 44rpx;
          color: #3882ff;
        }
      }
    }
  }
}
</style>

