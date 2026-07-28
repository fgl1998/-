<template>
  <div class="ocr">
    <div class="ez-camera-title" :style="setYhCameraTitleStyle">
      身份证正面识别
    </div>
    <i
      class="iconimg iconimg-camera-flash"
      @click="changeFlash"
      :class="[flash === 'off' ? 'off' : '']"
    ></i>
    <div
      class="camera-wrapper"
      :style="setCameraWrapperStyle"
      v-if="!takePhotoSrc"
    >
      <camera
        class="camera"
        mode="normal"
        resolution="medium"
        device-position="back"
        frame-size="medium"
        :flash="flash"
        @stop="stop"
        @error="error"
        @initdone="initdone"
        @scancode="scancode"
      >
        <cover-view class="cover-view-wrapper">
          <cover-image
            class="cover-view-bg"
            src="/static/images/common/bg-carmera.png"
          ></cover-image>
        </cover-view>
      </camera>
    </div>
    <div class="image-wrapper" :style="setCameraWrapperStyle" v-else>
      <img :src="takePhotoSrc" alt="" />
    </div>
    <div class="ez-camera-tip" :style="setYhCameraTipStyle">
      拍摄要求: 清晰完整，避免缺边、模糊、反光。
    </div>
    <div class="operation-button">
      <i class="iconimg iconimg-camera-close" @click="backPrevPage"></i>
      <i class="iconimg iconimg-camera-take-photo" @click="takePhoto"></i>
      <i class="iconimg iconimg-camera-photo-album" @click="choosePhoto"></i>
    </div>
  </div>
</template>
<script>
import {
  getSystemInfo,
  navigateBack,
  showModal,
  showToast,
  hideLoading,
  showLoading,
  chooseImage,
  uploadFile,
} from '@/utils/uni-api'

import { UPDATE_OCR_INFO } from '@/store/constants' // 常量

export default {
  data() {
    return {
      // 拍照的零时储存地址
      takePhotoSrc: '',
      statusBarHeight: 0,
      // 闪光灯，值为 auto 自动 on 打开 off 关闭 torch 常亮
      flash: 'off',
    }
  },
  components: {},
  onLoad(e) {
    this.takePhotoSrc = ''
    getSystemInfo().then((res) => {
      const { statusBarHeight } = res
      this.statusBarHeight = statusBarHeight
    })
  },
  onShow() {},
  onHide() {},
  methods: {
    // 摄像头在非正常终止时触发，如退出后台等情况
    stop(e) {
      // console.log('摄像头在非正常终止', e)
    },
    // 用户不允许使用摄像头时触发
    error(e) {
      // console.log('用户不允许使用摄像头', e)
    },
    // 相机初始化完成时触发
    initdone(e) {
      // console.log('相机初始化完成', e)
    },
    // 在扫码识别成功时触发，仅在 mode="scanCode" 时生效
    scancode(e) {
      // console.log('扫码识别成功', e)
    },
    // 改变 闪光灯
    changeFlash() {
      const flash = this.flash
      if (flash === 'off') {
        this.flash = 'torch'
      }
      if (flash === 'torch') {
        this.flash = 'off'
      }
    },
    // 上传照片
    requestUploadFile(path) {
      //  frontOcrRestService
      uploadFile('/frontOcrRestService/uploadCard', path, 'file')
        .then((res) => {
          const data = JSON.parse(res.data)
          const resultData = data.data.resultData
          const { code } = resultData || {}
          // console.log(res, data, resultData, 1234)
          if (code === '-1') {
            hideLoading()
            showModal('识别失败，请重新拍摄').then((res) => {
              this.takePhotoSrc = ''
            })
          } else {
            // aac002: "511902199708236534"
            // aac003: "张三"
            // aac005Desc: "汉族"
            // aac006: "1995-07-23"
            // aac010: "四川省遂宁市安居区白马镇长沟村2社"
            // filedata: {__ob__: Observer}
            // imgSrc: "http://tmp/LB5Tb07UBMUs15b3932664527d94a31867624a21a5c.jpg"
            // sac004_desc: "男
            const resultObj = { ...resultData.data, imgSrc: path }
            // console.log('resultObj', resultObj)
            hideLoading()
            this.$store.commit(UPDATE_OCR_INFO, resultObj)
            showToast('识别成功').then(() => {
              this.backPrevPage()
            })
          }
        })
        .catch((err) => {
          // console.log(err, 12345)
          hideLoading()
          showModal('识别失败，请重新拍摄').then((res) => {
            this.takePhotoSrc = ''
          })
        })
    },
    // 拍照
    takePhoto() {
      const _this = this
      const ctx = uni.createCameraContext()
      ctx.takePhoto({
        quality: 'high',
        success(res) {
          const { tempImagePath } = res
          _this.takePhotoSrc = tempImagePath
          showLoading('正在识别')
          _this.requestUploadFile(tempImagePath)
        },
      })
    },
    // 选择照片
    choosePhoto() {
      chooseImage(1, ['original', 'compressed'], ['album']).then((res) => {
        const tempFiles = res.tempFiles
        const tempFile = tempFiles[0]
        showLoading('正在识别')
        this.takePhotoSrc = tempFile.path
        this.requestUploadFile(tempFile.path)
      })
    },
    // 返回上一页
    backPrevPage() {
      this.takePhotoSrc = ''
      navigateBack(1)
    },
  },
  computed: {
    setYhCameraTitleStyle() {
      let str = ''
      const statusBarHeight = this.statusBarHeight
      str += `padding-top: ${statusBarHeight * 2}rpx`
      return str
    },
    setCameraWrapperStyle() {
      let str = ''
      const statusBarHeight = this.statusBarHeight
      str += `top: ${184 + 88 + statusBarHeight * 2}rpx`
      return str
    },
    setYhCameraTipStyle() {
      let str = ''
      const statusBarHeight = this.statusBarHeight
      str += `top: ${184 + 88 + 434 + statusBarHeight * 2}rpx`
      return str
    },
  },
}
</script>
<style lang="scss" scoped>
.ocr {
  width: 100%;
  height: 100%;
  height: 100vh;
  text-align: center;
  color: #fff;
  position: relative;
  background-color: #000;
  .ez-camera-title {
    width: 100%;
    font-size: 36rpx;
    font-weight: 700;
    line-height: 88rpx;
  }
  .ez-camera-tip {
    position: absolute;
    left: 0;
    width: 100%;
    font-size: 26rpx;
    line-height: 40rpx;
    padding-top: 18rpx;
  }
  .operation-button {
    position: absolute;
    left: 0;
    bottom: 190rpx;
    width: 100%;
    height: 112rpx;
    display: flex;
    align-items: center;
    padding: 0 112rpx;
    justify-content: space-between;
    .iconimg-camera-take-photo {
      width: 112rpx;
      height: 112rpx;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAMAAAAt85rTAAAAaVBMVEX///8AAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9ThU/0AAAAInRSTlNNAEX5PgUkXBIsOBUxH/DVzrulGufEn5R9eGRRDquGst9vCoZk6QAABv5JREFUeNrsmomymzAMRS+2MTtkIQtZ3qL//8im7euQedMGC9tgz/T8wRlZukgJEu/cqkYXdanEAzwQD1RZF7qpbol3fAqmla6VwEuEqnWVJr7wJvhwKwWMEaUnSy+C6b5QmIEq9s4l3QvmWsECpR22pXvBvBCwRhR54hB7QQM7vqNlHd0LplrBKaqx6EfngnkND9QWT9WpYKXgCVUlTDwI7p/1AlS0FGwUPKP2CQPHgo3AAogmYeBQUP9LLyjF2YK5woIo3kS1F0xrLEzByEV7wUZgcQRj2lgK3hRWobwlfPiCaQEGq79TtmAusCKCOWz4ghoroxMGbMG0xOqUjGfKFawEAmB8pgzBOJ4n65mOghE9z/GZ8gTDn57cZ8oX3CMwKreCDYJjbygY13h5RrsTLBAkhSvBGoFSmwhGFQ/fKR0IpgrWZMPpvj1suo++lbLtP7rNYXs/DRmsUSlD0Iff9Xzcdi39g7bbHs9XO0NbwdJCbth1kiaR3W64+nul8DRfLseNJGPk5njxNGngIx+yU0dsulPmIy3gPt/fDpJmIQ9v7hMfjr/PsntLFrT3zPFXG5x+X2fvkiyR7zMUqzmCObhctpIcILcXcMn5gqmw0FtcUaRswZIZejtJDpG7q6M4hJsBeu7JMf0ZLDRPsAKH7EAeOGQu2hAOGvAoyQvy6KANYd2A2Ya8scms2xC2DTj05JF+sG1DWCbgTpJX5M6yDfG3BgzieY7P1KoNYbNCfLa0AO0nTClMBG/m4SdpEaR5JN4MBBUMeZO0EPJt/iTF7B3pRAtymr05Ye6E2dGi7ObOGcw8wrzTwrzDjOK1YB5m/Tg1vL0UVAH2H7MP1StBbTg/aRUMZ2nzQlAElX8z81B8E2RHxKeklZCf/BKCXcCspdVoM3YJwS7ghlZkw077Z0EVaECww0I9CzIPvYOkVZED8xAMXgGznlamz3glHAWr4BuQ0YbVKMgq4JEC4Mham8D5Cs0kBYDMOOcZcNaIAwXBAdPU3wVTTHOmQDhjmvSboMYk19Un6B/6KyZpvgmq4COeGfdqFDQcMZcgJsxv5MV48YXxLXRLAbE1u12MgiKqAhqVUDwL5pEV0KiE+ZNgEUnGs9K+eBIU4Z0J7c+IYhTMoyvgWMKpOQqzlL9TcNzNfhCFWcq3FBwtplB/BNNQD6G2Z9L0S3AfyxrBXSr2X4JFfCPGbMwUX4IqyJ8ipjmZNCFMWrCjIOlMmhAG16YLBcoFE1S/BHUUp6ZZ5yf9S7CM4FY484JY/hIUeM01yBn6E3md/hzF9IwZKFiG6SmDpIroFsO+zVQPQR1pSBgFhX4I1tG2oEET1g9BFcu5d84JWD0ERawpaJKE4iEY2bWJeXtKcIt4xhhMmRuqCJd5xlpfocFrMgqaDK9poOP9jjH5ltEo4lx2TZfeAnV8B0PO8bBGGXNKTOdECRXjQc38tKYgYt12zXZeARFzzhN11oIfFDQf1oLB/LXi7/RTgjH+7PJMC1sCXnd/Iv8L/iDvzm0AAIEgBiYIXUJE/71SB+MeEM/e2vBLlN9k8scEf9B/f1XjL9v8c4l/8PKRBR868bEhH/zy0T0/fPHHZ/wAlB9h8yUEvkbCF4H4KpdfxuPrlHwhlq8086V0HyvgwRAe7eHhLB+vQwHJ6SCuPqTMY+a8KMBXPYCyjmnpVjxhzq4pj3hpla8ds8Rxq6j+4+WNkn7zNgWqjgL3VCXGvoaaF4kbKvhdlvkL3zEM/qHGa+8OshsEoSgM34tAQEGT2iRNk/R0/6usM0c9LQ9I1fTbwX8EHN7w7JMoax+1iRufJdL/w1JPMA22/XG3zc/zbX9gcfsTmdsfOV3jTG33PzT8XFPR2x/73vxc+6oG90dKAhkhSLz3OXn9XZCHSFkgLSQ+jo3w4x0/IGEpDaSHyO48pOcN5x1EPOWBDBB6P+2bhG+3P71DKDAnkC3ErpeXoflF3PByuUKsZV6g0chxfTsdhv7bJ2U4nN6uyKGNOHAuzLa7nO+H4374fO2bpn/9HPbHw/182WEm78sNpGmxWK2hPHAWsFCBLBJIj0XyLBVIiwWyLBfIiMWJLBnIEQszsmwgncKCKMfUwFX9LlrDxMB1PTWWrBLIbhHHVHWcJAau6JjOxzMtcC3H1DINOFvBa6ocE4GpjMef8YapwHQ3jT+hb0wHSkSFh1OREqCICXiwYCgCCjmNB9KOQqCYVXgQZZlAEJh6FRdx+ebAHFGjMh2ZBcw0Vk3UIzOB2bpqibpjNrAAF1BBcCwALMJYjaK0NSwCLMV5hUKUd8xSPHBuXFbdBCzLWZ13Mh3LAoszo9eiOD8aFgdWYTrbKvyaam1nWAVYz1QZtPohTYe5rQawulsXrQ+tVhNM1ES3wdvY3VjdF+6io3Gh1TNOAAAAAElFTkSuQmCC)
        no-repeat center center;
      background-size: 100% 100%;
    }
    .iconimg-camera-close {
      width: 112rpx;
      height: 112rpx;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAA0CAMAAABCWc3rAAAAY1BMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+aRQ2gAAAAIHRSTlMA7Pvz5BfYMvk5JlgdT90h9kpFQCwQYc/KaHCov6SEB6mc6fcAAAFRSURBVFjDtdbJbsJAFETRMp7ANB6B2DFD//9XhrApK5ZSIe9RK6/OlayWugFM8zzBf/k1y+YA3Mf42Jh7+2Xy7SYBt/hckbv7z80oIgv+fkyQRhb8/ZjhElnw9+MV5YaF4OMf6Sc5cGahDt5+CaiC3Qf2noWKfvrwV4Ws8fN3gCiYffdClf3wucOiUHn6LGxFweLrgt23FxrlAx0LydHiD4BnQftc36qC9lv6olD+3Q8Lv8ev69N/FEItfW4QBYMvC9rfdoDeLl0eaLlc+NZCXmhfF+y+Lmj/8OLDgwWjrwuD1dcF6W+ELwptr/w9YCwI3/yEaruV/2H1WeAh504Wn6uWBekbL/LtQfv2wto/A+6F0+jjs8Df4ehzzbKgfHvB02ehJlrwc4LbAgvCdyzQ9ykUDr6+fLlPwL8gfLcCff/CO31eMhv67rvfivQy4JV9AeuTdkMWGFlZAAAAAElFTkSuQmCC)
        no-repeat center center;
      background-size: 48rpx 26rpx;
    }
    .iconimg-camera-photo-album {
      width: 112rpx;
      height: 112rpx;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHIAAABeCAMAAADIbbACAAAAmVBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VHQRUAAAAMnRSTlMA9yAEqvTwDYFC+/nQEgjgAdp2O+nKxExHNSbUu6ZK452NVhizZFxElW1PLHovHd2uiKeEfsMAAAKtSURBVGje7dppc6JAEAbgBsJ9KHjifcXEI2Z3/v+PWyshjWOvGdiFttbl/WRB6SPOTPdUOXBOlPQswRCrl0TwkU4s2BJ34JyBJxjjDQBCS7DGCsERzHEgEMwJwPx8oTHkUzIhs3WoPXpGNWRDNmRDNiT8I6TtBKYZODYf6bbER1ouF+kKjMtD2q2cbNkspCPtcFjI4JIMWEjzkjQflZR/2EedPtUtktF0vJmxloKVL85JGAve1sOxYSrrO/GVJVPzSkSe1zYH6YjLLNq1k+2lkDM1aibbC3GdJ6NW0piiNNFElk1UIxltLsbQNVGPaiOjibQ6Ohaadk2k3b+qzymafbsWMuyhmABcmb2wBnI9Flm8Z7z41sVWGFZO6jGKK8hzQHO8rpgczUUWbQ8Y6UZ8qpTMH8Z0AW6YLb1CMp8mVoe+Cfv+fAQ3s07tMmQHxe4b0OjvePtwA7SnnvB+GoXJoal4jFMsfSUafYzVuBC590WWdzJYZAFZKdCkXewAhcitJy0DpUkHe6VJXUdJPnuFCkwY3JzSR7nTKclEKMooLYfaUGp3i+vuqiAdUbhB2f3fFYsQr+bmt2TekH/kotr0V1gnYoEXiUnI8hscG9upt8UFja3A1YhJyPJbx2giN5stPpk5A5BMFblUYnSjsoN2PhG6KYBsKsgjFI6Rm8cnfBnrAMT8jtxBiRgI5enjgn4hJiFxVJSh204y2YlJSZzvJc0FnXq3TUpqAyWh2NAngCEmIbFeljZfEfS35O5QMgn5An+W5VdbcQEUJi3rf2XODwAKszoSdv75A08ASrM6Euw0BAC1OaqIxKjNPhcJMzQZSDQZSTT5SDR9RhJNdhIGPiOJJiOJJjsJe5+dhNWj/LPXkP8byX/E6B4HqfiPi93hUBz/0b+7HHDkP8b5C1HsrxOuUlArAAAAAElFTkSuQmCC)
        no-repeat center center;
      background-size: 56rpx 46rpx;
    }
  }
  .iconimg-camera-flash {
    width: 70rpx;
    height: 64rpx;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAABcCAQAAACR6r7ZAAADOklEQVR42r3a2UtVURTH8eOUNlnZaFFCkRTNYVQQDdhDqUUFzehD0fBQhBHUQwMhWAgSRQNFPmRlkFAUQkkjRBGVQdFgk5naoFba/ge+4R3k3us995x77157rT/gw37ZZ+3fOpaltVhsmSzmctwkN4avrDXH9eUJihGmuAQuo3hu7nwHUCjKTHErPJwi3ww3lVYP18kAE9xQ3vnOd98E14s7Pk5x0AR4qptTzJfndgZw7aRKc7l0BoA3pbnxNAdwimJZbgB1QZxipiSXxLUQrplESfBICKeokuQ29uAUW+S42fwOA2ZLcaP4Eob7IMX15lEYTnFWCrwQllOsl+H22nCKkRJcgS1XJ8FN4qctWK6fG8wbW05RoJtL4XYE7h8DdYMnInCKh7q5bRE5xWG93AI6HMCFOrmxfHPg2knTx/XnuQOnqNHHJXLVkVPs0QeWuOAUObq4ta64FpL0cDm0uwI/s5re8XOZfHTFefs7J5kbD5fGwyg4f79iH1mxgedj4Px9i0L6RcftjoPzdivnWOhySmUp/+IGvf2eQ46THBP4oYnz9z02M8iOy+CVZs7bv6lkCcmhXDI1Ipy/v1DK5ECwXJTz92M2e7lNRriuLuzi5vHXEFfaxWXRaIi77rnqqTTEveye7pjFMZqEuZaQa4BUVlLtODDF2p02STHD2OlJPXX3Dqew7igNGrkzbq7xZPK4xB8N3N0oEioy2MKDuLh6hkX/Sc7mMB9i4tqYHvuUmksFbVGCq+Idr9IpotY1t1/XzDrDFXeFBF3gMhfc0yiHqYig87ezMcaR0Qasc+D+Mk8nl+l4vk1638QbHDjdIQpnIz9Qe8xncYP1EbjXZOjmsiNwP5ioP5PaGiEgypPI3Kpswd0SXKLt7FMhk5jOtIu/NKY1QWBxWO4TmVIR9I2wWVSOFJca9gO8Tm5jMT8MVyK5kTnYg6uW3TjdC+FekC7JpQetJxVNjJPdGOYHcR0skt6IlgWB2y3p4lkAd1KeGx7A1ZIiD67p5t4yxJIvTvu4X0yxTBRvfeByM9w4H7fPMlO+4OiitteCI1jpia36mOISaKSB0ZapYhp/mGOZK3ZRZJksvb///QfFDGuHqqbYmQAAAABJRU5ErkJggg==)
      no-repeat center center;
    background-size: 28rpx 46rpx;
    margin: 60rpx 52rpx;
    transition: all 0.3s ease-in-out;
    &.off {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAACCCAMAAACjFNB8AAACglBMVEUAAAD///8rKyssLCwvLy8qKiovLy8yMjI+Pj7///8qKiorKysuLi5PT08rKysqKioqKioqKiosLCwrKysxMTEqKioqKir///////81NTX///////8rKysrKysrKyssLCwrKyssLCz///////+QkJD///////////////8rKyv///+BgYH///////////////////////8qKir///8sLCz///8tLS3///////////////9ra2uurq6hoaG7u7vR0dHj4+P6+vr29vb///////8qKioqKir///8rKyv+/v7///////8rKyv///////////////////8qKir///9UVFRjY2OTk5PHx8fb29vw8PD9/f0qKioqKir///////////8qKir///////////8rKysqKir///////////////8qKir///8rKyssLCz///////////////8sLCxYWFh3d3eGhoaDg4Pq6ur///8rKysuLi7///////////8qKir///8sLCz5+fn///9hYWF6enrExMTY2Njr6+vp6enx8fFsbGz///8rKysrKyv///////8qKir///8rKysuLi44ODj7+/vv7+80NDT9/f1GRkZCQkLy8vLr6+syMjLQ0NC5ubmioqJqampNTU1KSko/Pz89PT0tLS339/fg4OBfX1/k5OTZ2dnX19eMjIyFhYWAgIB0dHRbW1tXV1f5+fn09PTi4uLExMS+vr6urq6rq6udnZ14eHhTU1M2Njb29vbo6Ojd3d3U1NTMzMzIyMjCwsKnp6eYmJiTk5NlZWVWVlbm5ubHx8e1tbWxsbFtbW1iYmKHh4d9fX16enpvb2/x8fGwsLCuExmVAAAAkHRSTlMA8vszFsQeEAUD9+on/vHi2beqiwnzz0oSDQfxeWxmWk1AJgH+3ta/iH8YAu7s5OLFopuVSkM9LR0OCvj39/b08/Ly6ufe1Lqemo5+dGZiXVpPRzgD+/j19PPy7OTazcvLtbGsl4+Cc3BtXVZWT0A9NDEs/Pr5+fPRurSmpZ2GeDorI/v69fTz8/LkzqOfkXcMl3PSAAAGrElEQVR42u2a5VsUURTGz7EQu5Ayd0URC0QEbEVBQAm7u7u7u2VQQcAOVGzs7u76f5zZvWe5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);
      background-size: 100% 100%;
    }
  }
  .camera-wrapper {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 638rpx;
    height: 434rpx;
    border-radius: 4rpx;
    overflow: hidden;
    .camera {
      width: 100%;
      height: 100%;
    }
    .cover-view-wrapper {
      width: 100%;
      height: 100%;
      position: relative;
    }
    .cover-view-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  .image-wrapper {
    width: 638rpx;
    height: 434rpx;
    margin: 0 auto;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
