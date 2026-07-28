<template>
  <div class="annual-account-page-start">
    <div class="bg">
      <img :src="imageBgPageStart" alt="" />
    </div>
    <div class="con" :style="getConStyle">
      <div class="title">
        <img :src="imageTitleText" class="text" alt="" />
        <img :src="imageTitle02" class="icon" alt="" />
      </div>
      <div class="footer" v-if="userInfo.scene !== 1154">
        <div class="btn-con" @click="onClickOpen">
          <img :src="imageOpenBtn" class="btn" alt="" />
          <div class="text">开启盘点</div>
        </div>
        <label class="agreemment label" for="ndzd">
          <checkbox-group @change="onChangeCheckbox">
            <checkbox id="ndzd" class="checkbox" :checked="isAgree" value="ndzd" />
          </checkbox-group>
          <img :src="imageCheckboxChecked" class="checkbox-icon" alt="" v-if="isAgree" />
          <img :src="imageCheckbox" class="checkbox-icon" alt="" v-else />

          <div class="text">
            <span>我已阅读并同意</span>
            <span class="val" @click.stop="onClickAgreemment">《2023年度盘点客户查看须知》</span>
          </div>
        </label>
      </div>
    </div>
    <div class="tips" v-if="userInfo.scene === 1154">点击“前往小程序”开启年度盘点</div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  import { getSystemInfoSync, navigateTo, showModal } from '@/utils/uni-api'
  import { USER_INFO } from '@/store/constants' // 常量
  import { useJumpToLogin } from '@/hooks'
  import { IMAGE_ANNUAL_ACCOUNT } from '@/config/constants'

  const imageBgPageStart = IMAGE_ANNUAL_ACCOUNT + '/bg-page-start.png'
  const imageTitleText = IMAGE_ANNUAL_ACCOUNT + '/title-text.png'
  const imageTitle02 = IMAGE_ANNUAL_ACCOUNT + '/title-02.png'
  const imageOpenBtn = IMAGE_ANNUAL_ACCOUNT + '/openBtn.png'
  const imageCheckboxChecked = IMAGE_ANNUAL_ACCOUNT + '/checkbox-checked.png'
  const imageCheckbox = IMAGE_ANNUAL_ACCOUNT + '/checkbox.png'
  export default {
    name: 'annualAccountPageStart',
    props: {},
    data() {
      return {
        // 是否同意开启
        isAgree: false,
        imageBgPageStart,
        imageTitleText,
        imageTitle02,
        imageOpenBtn,
        imageCheckboxChecked,
        imageCheckbox
      }
    },
    components: {},
    onLoad(e) {},
    methods: {
      /**
       * checkbox 改变
       */
      onChangeCheckbox(e) {
        const { value } = e.target
        if (value.length) {
          this.isAgree = true
        } else {
          this.isAgree = false
        }
      },
      /**
       * 点击协议
       */
      onClickAgreemment() {
        navigateTo('annual-account-agreement', 'packageScan')
      },
      /**
       * 开启账单
       */
      onClickOpen() {
        const { user_id } = this.userInfo
        // 用户已登录
        if (user_id) {
          if (this.isAgree) {
            this.$emit('clickOpen')
          } else {
            showModal('您已阅读并同意《2023年度盘点客户查看须知》？', '提示', true).then(() => {
              this.isAgree = true
              this.$emit('clickOpen')
            })
          }
        } else {
          useJumpToLogin()
        }
      }
    },
    computed: {
      ...mapGetters([USER_INFO]),
      getConStyle() {
        let str = ''
        const sysInfo = getSystemInfoSync()
        const { statusBarHeight, screenHeight } = sysInfo
        const { scene } = this.userInfo

        if (screenHeight <= 667) {
          str = `padding-top: ${statusBarHeight * 2 + 160}rpx;`
        } else if (screenHeight <= 736) {
          str = `padding-top: ${statusBarHeight * 2 + 180}rpx;`
        } else {
          str = `padding-top: ${statusBarHeight * 2 + 354}rpx;`
        }

        if (scene === 1154) {
          str = `padding-top: ${statusBarHeight * 2 + 160}rpx;`
        }
        return str
      }
    }
  }
</script>

<style lang="scss" scoped>
  @keyframes ab {
    0% {
      bottom: 30rpx;
      opacity: 0.6;
    }
    50% {
      bottom: 40rpx;
      opacity: 1;
    }
    100% {
      bottom: 30rpx;
      opacity: 0.6;
    }
  }
  .annual-account-page-start {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    img {
      display: block;
    }
    .bg {
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .con {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      .title {
        width: 100%;
        .text {
          width: 671rpx;
          height: 327rpx;
          margin: 0 auto;
        }
        .icon {
          width: 100%;
          height: 448rpx;
          margin-top: 40rpx;
        }
      }
      .footer {
        position: absolute;
        left: 0;
        bottom: 108rpx;
        width: 100%;
        .btn-con {
          position: relative;
          .btn {
            width: 392rpx;
            height: 121rpx;
            margin: 0 auto;
          }
          .text {
            position: absolute;
            left: 50%;
            top: 15%;
            transform: translateX(-50%);
            font-size: 42rpx;
            color: #fff;
          }
        }
        .agreemment {
          display: flex;
          align-items: center;
          font-size: 26rpx;
          color: #5e191a;
          justify-content: center;
          margin-top: 50rpx;
          .checkbox {
            display: none;
          }
          .checkbox-icon {
            width: 28rpx;
            height: 28rpx;
          }
          .text {
            padding-left: 16rpx;
            .val {
              color: #cf1214;
            }
          }
        }
      }
    }
    .tips {
      position: absolute;
      right: 26rpx;
      bottom: 30rpx;
      background-color: #ff7f02;
      padding: 20rpx 30rpx;
      line-height: 1.2;
      color: #fff;
      border-radius: 12rpx;
      font-size: 30rpx;
      animation: ab 3s infinite linear;
      transition: all 0.3s;
      &::after {
        content: '';
        width: 32rpx;
        height: 32rpx;
        position: absolute;
        bottom: -20rpx;
        right: 80rpx;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAABX1JREFUeF7tnEmPHEUQheP1CPnKASH5yC/gwMkSB25ImAMHhNk3YzazGjBg8HRngs2+g9kx+yrhE5aQECcOnPgFIHFE8i8AUZnIBktgGKaqMqOqouLNtTNeRrz3dfSUZtQQ/rh2AK6n5/BCAJxDQAAIgHMHnI/PDUAAnDvgfHxuAALg3AHn43MDEADnDjgfnxuAADh3wPn43AAEwLkDzsfnBiAAzh1wPj43AAFw7oDz8bkBCIBzB5yPzw1AAJw74Hx8bgAC4NwB5+NzAxAA5w44H58bgAA4d8D5+NwABMC5A87H5wYgAM4dcD4+NwABcO6A8/G5AQiAcwecj88NQACcO+B8fG4AAlDHgby+tlOQLhTBeSJyeh1VqpziwI8i8q0IvkZovqzhTvEGyAdkq/yGwyI4v0ZD1GjrQD6KkLe3Pb3RuXIAljgigotKG2F9HwewHaE52qfyZE0RAHm5doFI/qqkAdaWOIDvEZptRQolxXl9bZcgv1GiwdpCB7akM7FPjvVVKdwAi70i8kTfy1lXw4F0DoL80FepDID1tR2C/Gnfy1lX7MAvCGlriUoZAPvlbFksvhGRM0qaYG1vBw4hpN29q0XKvy2cvweU2F9Qm+WYnJa2Yb/8VKBSDsDxy/P6YiWQZUkjrO3owAKXYNl80bHqX8eLPgL+rkYISqPoUo8dCM3nXSo2OlsNAG6CGnG00FjgUiybz1qcbHWkKgCEoJXn/Q8Bl2HVVH3qqg4AIeif7/9WZlyO2HxSW10FAEJQOSbgCqyajyurnpBTA4AQVIor40rE5qNKanpPARs1yKeDkuhwFULzYYnCZrWqG+Dk5YRgsxj+4/WMqxGbD3pUdioZBAB+HHTKRAS4Bqvm/Y5VvY4PBgAhaJlPxrWIzXstTxcfGxQAQrBZXrgOoXl3s1M1Xx8cAEKwQXwZ1yM2h2uG20ZrFAAIwanRYCdC806bwGqfGQ0AQvBXlBk3IDZv1w62rd6oABAC7EJo3moblsa50QFwC0HGjYjNmxqhdtGcBAAOIbgJIU3iv6knA4AbCLLcjJhe7/Iu1Tw7KQAcQHALQnpNM9Cu2pMDYLYQZLkVMb3aNSDt85MEYIYQ7EZIh7TD7KM/WQBmA0GW2xDTK33CGaJm0gDMAILbEdLLQwTZ947JA2AWgix3IKaX+gYzVJ0JAMxBALkTq/TiUCGW3GMGADMQZLkLMb1QEsqQtaYAMADB3Qjp+SEDLL3LHACThSDLHsT0XGkgQ9ebBGCCENyDkJ4dOrwa95kFYDIQZLkXMT1TI4wxNEwDMDoEkPuwSk+PEVytO80DMBoEWfYipqdqBTGWziwAGAGC+xHSk2OFVvPe2QAwGARZHkBMs/lmtFkBMAAEDyKkx2u+A8fWmh0AahBk2YeYHhs7sNr3zxIABQgeQkgHa5s/Bb3ZAlANgiwPI6YDUwhLo4dZA1AMAWQ/VulRDeOnojl7AHpDkGUdMT0ylaC0+nABQA8Ilggpapk+JV03ALSGIMsKMYUphaTZiysATkCwXOwRyEHJsuUfxkJ+leOPekb/qtcXEncA/AmBnCuyuFgknyUiv4vgZ5F0BEG+62uk1TqXAFgNS6NvAqDhqiFNAmAoLI1WCYCGq4Y0CYChsDRaJQAarhrSJACGwtJolQBouGpIkwAYCkujVQKg4aohTQJgKCyNVgmAhquGNAmAobA0WiUAGq4a0iQAhsLSaJUAaLhqSJMAGApLo1UCoOGqIU0CYCgsjVYJgIarhjQJgKGwNFolABquGtIkAIbC0miVAGi4akiTABgKS6NVAqDhqiFNAmAoLI1WCYCGq4Y0CYChsDRaJQAarhrSJACGwtJolQBouGpIkwAYCkujVQKg4aohzT8ALCszkD/Z0xMAAAAASUVORK5CYII=)
          no-repeat center center;
        background-size: 100% 100%;
      }
    }
  }
</style>
