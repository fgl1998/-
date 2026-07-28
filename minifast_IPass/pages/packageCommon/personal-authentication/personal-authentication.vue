<template>
  <div class="my-home-face h5-page">
    <div class="face">
      <img :src="imagePeople" alt="" />
      <div class="scan"></div>
    </div>
    <div class="basic-info">
      <div class="cell d-f ai-c">
        <label for="" class="label">姓名：</label>
        <input
          :disabled="isDisabledName"
          placeholder="请输入您的姓名"
          type="text"
          maxlength="20"
          v-model="userName" />
      </div>
      <div class="cell d-f ai-c">
        <label for="" class="label">身份证号：</label>
        <input
          disabled
          placeholder="请输入您的身份证号码"
          type="idcard"
          maxlength="18"
          v-model="idCard" />
      </div>
      <div class="button-wrapper">
        <ComponentButton
          name="开始人脸识别验证"
          type="primary"
          borderRadius="12rpx"
          height="72rpx"
          @click="handleFaceByMini"></ComponentButton>
      </div>
    </div>
  </div>
</template>
<script>
import ComponentButton from '@/components/common/ez-button/ez-button.vue'

import { getIsDev } from '@/utils/get'
import { showModal, startFacialRecognitionVerify, switchTab } from '@/utils/uni-api' // 封装过后的api，推荐使用。方便以后统一修改，便于维护。
import { requestWXAddScanLoginLog, requestWXGetFaceInfo } from '@/service/api'

import { IMAGE_PACKAGE_HOME } from '@/config/constants'

export default {
  name: 'personalAuthentication',
  data() {
    return {
      imagePeople: IMAGE_PACKAGE_HOME + 'icon-01.png',
      userName: '',
      idCard: '',
      param: {},
      isDisabledName: true,
    }
  },
  components: { ComponentButton },
  onLoad(e) {
    let { q } = e
    const param = {}
    // 手机扫码
    if (q) {
      const url = decodeURIComponent(q)
      const queryString = url.substring(url.indexOf('?') + 1)
      const queryStringArray = queryString.split('&')

      for (var i = 0, len = queryStringArray.length; i < len; i++) {
        const item = queryStringArray[i]
        const item_arr = item.split('=')
        const item_key = item_arr[0]
        const item_val = item_arr[1]
        param[item_key] = item_val
      }

      const { aac002, aac003 } = param
      if (aac002) {
        this.idCard = aac002
      }
      if (aac003) {
        this.userName = aac003
      } else {
        this.isDisabledName = false
      }
      this.param = { ...param }
    } else {
      // 测试
      const { aac002, aac003 } = e
      if (aac002) {
        this.idCard = aac002
      }
      if (aac003) {
        this.userName = aac003
      } else {
        this.isDisabledName = false
      }
      this.param = { ...e }
    }
  },
  methods: {
    // 人脸识别通过，确认通过
    confirmToPass() {
      const { id, type, encryptKey, aac002 } = this.param
      requestWXAddScanLoginLog(id, aac002, this.userName, '', type, encryptKey).then(() => {
        showModal('认证成功！').then(() => {
          switchTab('home')
        })
      })
    },
    // 人脸核身验证开始
    handleFaceByMini() {
      const isDev = getIsDev()
      const userName = this.userName
      const idCard = this.idCard
      const { id, type, encryptKey } = this.param
      if (!userName) {
        showModal('请输入姓名！')
        return false
      }
      if (!idCard) {
        showModal('身份证号获取失败！请重新扫码！').then(() => {
          switchTab('home')
        })
        return false
      }
      if (!id || !type || !encryptKey) {
        showModal('二维码参数获取失败！请重新扫码！').then(() => {
          switchTab('home')
        })
        return false
      }

      // 开发环境下 关闭人脸认证
      if (isDev) {
        this.confirmToPass()
        return
      }
      // #ifdef MP-WEIXIN
      startFacialRecognitionVerify(userName, idCard).then((res) => {
        this.reconfirm(res)
      })
      // #endif
      // #ifdef H5
      this.confirmToPass()
      // #endif
    },
    // 再次通过后台接口确认人脸识别信息
    reconfirm(code) {
      const userName = this.userName
      const idCard = this.idCard
      const familyId = this.familyId
      requestWXGetFaceInfo(code).then((res) => {
        const { data } = res
        const { errcode, identify_ret } = data
        if (errcode == 0 && identify_ret == 0) {
          this.confirmToPass()
        } else {
          showModal('人脸识别信息认证出错，请重新认证！')
        }
      })
    },
  },
  watch: {},
  onShow() {},
  onUnload() {},
}
</script>
<style lang="scss" scoped>
@keyframes scan1 {
  0% {
    height: 120rpx;
  }
  50% {
    height: 230rpx;
  }
  100% {
    height: 120rpx;
  }
}
.my-home-face {
  background-color: #f5f5f5;
  padding: $spacing $spacing;
  .face {
    height: 356rpx;
    background-color: #fff;
    box-shadow: 0rpx 2rpx 24rpx 0rpx rgba(8, 76, 192, 0.15);
    border-radius: 12rpx;
    padding: 40rpx 20rpx 20rpx;
    text-align: center;
    width: 100%;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABWQAAALIBAMAAAAK2uSZAAAAG1BMVEUAAAA5gv84g/85g/85gv86g/87if84g/84gv+DL9mmAAAACHRSTlMA89DggUINf4t0MwUAAATISURBVHja7NrNSUNBFIbh2cQaUoALG9ACXLkU0oCQJtzeIHjKVvfmhMC9yXzwPDW8zJm/AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQ4eF1X2csjx8DZnOoxvOAyeyq9T5grml+rNbLgLmm+Vu1vgbMNc2fqnUa0LjDNN9XaxnQWGuaS5bJXJrmNgZMZsWl8dPxi3/kJuuSi7CNgacEbnH8+r5qwfZgy/aO6yVbv3yLYWu7ap2uT3bApg7VWSTLbP6+xTQkSwrJEkayhJEsYSRLGMkSRrKEkSxhJEsYyRJGsoSRLGEkSxjJEkayhJEsYSRLGMkSRrKEkSxhJEsYyRJGsoSRLGEk+8NeHZsgEERRFJ1EczMLMLABLcDIULABwUoUg1+2TAcrzMA+OaeGC5cwkiWMZAkjWcJIljCSJYxkCSNZwkiWMJIljGQJI1nCSJYwkiWMZAkjWcJIljC/B7iv7tVgiRUke6zu3WCJFSR7re7TYJypm39Wd24wztTNb6q7NRhn7ubvVXVqMNDczW8vu8OjwUA2zx+zecLYPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8GUPDgQAAAAAgPxfG0FVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVdiDAwEAAAAAIP/XRlBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFfbgQAAAAAAAyP+1EVRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVhT04EAAAAAAA8n9tBFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVYZeOTRAKoiiIvkRzMwswsAEtwMhQsAHBShSDLVtcGxAW9nvhnHyyAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWNb6tNndCn7zBwNeW2uHgjnGB1y1j0vBFOMD3ntxLJhifMBzL14FU4wPuO/Fs2CK8QG3vXgUTDE+YPsqWET7siwpLEsYyxLGsoSxLGEsSxjLEsayhLEsYSxLGMsSxrKEsSxh3uzawWkDMRCGUV3sGraAHNxAUoBPPgbcQMBN5LohYJXtDsaLVwj/8F4NH0LSjGQJI1nCSJYwkiWMZAkjWcJIljCSJYxkCSNZwkiWMJIljGQJI1nCSJYwkiWMZAkjWcJIljCSJYxkCSNZwkiWMJIljGQJI1nCSJYwkiWMZAnzQrKF9eOnwRDH89ILbbulVz4bDHHtlbVtd+ql7wYDHHrpr23320tfDQa49dJ9XLL/DQa4jEv29OzAhsr8zpZeWhsURnUmWd7Ms85cDHgzAzu7eH6xx/zObj652GN+ZwejBHaZ39nVwJY95nd2PC/WYniFzgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHi0B4cEAAAAAIL+v/aEEQAAADgFbItYp0xLbCUAAAAASUVORK5CYII=)
      no-repeat center center;
    background-size: 100% 100%;
    position: relative;
    img {
      width: 276rpx;
      height: 276rpx;
      border-radius: 50%;
      margin: auto;
    }
    .scan {
      position: absolute;
      left: 40rpx;
      top: 40rpx;
      width: 610rpx;
      height: 220rpx;
      background-image: linear-gradient(
        180deg,
        rgba(0, 85, 255, 0.02) 0%,
        rgba(0, 85, 255, 0.03) 40%,
        rgba(#3882ff, 0.2) 100%
      );
      margin: auto;
      animation: scan1 4s infinite;
      &::after {
        content: '';
        left: 0;
        bottom: 0;
        position: absolute;
        width: 100%;
        height: 6rpx;
        background-image: linear-gradient(
          90deg,
          rgba(69, 149, 241, 0) 0%,
          #3882ff 51%,
          rgba(69, 149, 241, 0) 100%
        );
      }
    }
  }
  .cell {
    height: 92rpx;
    background-color: #fff;
    box-shadow: 0rpx 2rpx 24rpx 0rpx rgba(8, 76, 192, 0.07);
    border-radius: 12rpx;
    margin-top: $spacing;
    padding: 0 $spacing;
    font-size: 30rpx;
    font-weight: 500;
    line-height: 42rpx;
    color: $color;
    input {
      flex: 1;
      overflow: hidden;
      height: 100%;
      font-weight: 500;
      line-height: 42rpx;
      font-size: 30rpx;
      padding-left: 12rpx;
      color: rgba($color: $color, $alpha: 0.8);
    }
  }
  .button-wrapper {
    padding: $spacing * 2 0 0;
  }
}
</style>
