<template>
  <div class="reset-password">
    <div class="tip-process">
      <div class="item" :class="[currentStep >= 0 ? 'active' : '']">
        <img :src="image01" alt="" />
        <p>账号确认</p>
      </div>
      <div class="line" :class="[currentStep > 0 ? 'active' : '']">
        <img :src="imageLine" alt="" />
      </div>
      <div class="item" :class="[currentStep > 0 ? 'active' : '']">
        <img :src="currentStep === 0 ? image02 : image02Active" alt="" />
        <p>密码重置</p>
      </div>
    </div>
    <div class="main">
      <div class="img-wrapper">
        <img :src="imageBg" alt="" />
        <div class="text">
          <div>{{ areaName_zh }}惠民惠农</div>
          <block v-if="type === '1'">
            <div>公共服务网密码重置</div>
          </block>
          <block v-if="type === '2'">
            <div>阳光审批平台密码重置</div>
          </block>
          <block v-if="type === '3'">
            <div>阳光发放系统密码重置</div>
          </block>
        </div>
      </div>
      <div class="form" v-if="currentStep === 0">
        <div class="input-cell-wrapper">
          <div class="label">
            <img :src="imageUsername" alt="" />
          </div>
          <div class="input">
            <input
              type="text"
              v-model="userName"
              maxlength="10"
              placeholder="请输入姓名"
            />
          </div>
        </div>
        <div class="input-cell-wrapper">
          <div class="label">
            <img :src="imagePassword" alt="" />
          </div>
          <div class="input">
            <input
              type="idcard"
              maxlength="18"
              v-model="idCard"
              placeholder="请输入身份证号"
            />
          </div>
        </div>
        <div class="checkbox-wrapper" style="display: none">
          <checkbox-group class="checkbox-group" @change="changeCheckbox">
            <label class="label" for="agree">
              <checkbox
                class="checkbox"
                id="agree"
                value="1"
                :checked="checkboxChecked"
              ></checkbox>
              <i class="icon" :class="[checkboxChecked ? 'checked' : '']"></i>
              <span>我已阅读并同意</span>
              <span class="link" @click.stop="handleClickAgree"
                >《身份验证服务协议》</span
              >
            </label>
          </checkbox-group>
        </div>
      </div>
      <div class="form" v-if="currentStep === 1">
        <div class="input-cell-wrapper">
          <div class="label">
            <img :src="imageUsername" alt="" />
          </div>
          <div class="input">
            <input
              type="password"
              v-model="password"
              placeholder="请输入新密码"
            />
          </div>
        </div>
        <div class="input-cell-wrapper">
          <div class="label">
            <img :src="imagePassword" alt="" />
          </div>
          <div class="input">
            <input
              type="password"
              v-model="passwordCopy"
              placeholder="请确认新密码"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="button-wrapper">
      <ComponentButton
        :name="buttonName"
        type="primary"
        :disabled="buttonDisabled"
        @click="handleClickBtn"
      >
      </ComponentButton>
    </div>
  </div>
</template>
<script>
import image01 from './images/01.png'
import image02Active from './images/02-active.png'
import image02 from './images/02.png'
import imageLine from './images/line.png'
import imageBg from './images/bg.png'
import imagePassword from './images/password.png'
import imageUsername from './images/username.png'

import ComponentButton from '@/components/common/ez-button/ez-button.vue'

import config from '@/config'
import { checkIDCard } from '@/utils/check'
import {
  startFacialRecognitionVerify,
  showModal,
  switchTab,
} from '@/utils/uni-api'
import { requestWXWxUpdatePassword } from '@/service/api'
import { requestB208, requestWXGetFaceInfo } from '@/service/api'
import { requestFFResetPassword } from '@/service/api'
export default {
  name: 'pageResetPassword',
  data() {
    return {
      image01,
      image02Active,
      image02,
      imageLine,
      imageBg,
      imagePassword,
      imageUsername,

      currentStep: 0, // 当前重置步骤 0 账号确认 1 密码重置
      checkboxChecked: true,
      password: '',
      passwordCopy: '',
      userName: '',
      idCard: '',
      areaName_zh: '四川',
      // 系统类别（1网厅、2审批、3发放）
      type: '1',
    }
  },
  components: {
    ComponentButton,
  },
  onLoad(e) {
    this.handleInit()

    // 获取系统类别（1网厅、2审批、3发放）
    // 网厅 https://www.scnjhrss.com/resetPassword?type=1
    // 审批 https://www.scnjhrss.com/resetPassword?type=2
    // 审批 https://www.scnjhrss.com/resetPassword?type=3
    const param = {}
    const url = decodeURIComponent(e.q)
    const queryString = url.substring(url.indexOf('?') + 1)
    const queryStringArray = queryString.split('&')

    for (var i = 0, len = queryStringArray.length; i < len; i++) {
      const item = queryStringArray[i]
      const item_arr = item.split('=')
      const item_key = item_arr[0]
      const item_val = item_arr[1]
      param[item_key] = item_val
    }

    const { type } = param
    if (type) {
      this.type = type
    }
  },
  methods: {
    // 初始化数据
    handleInit() {
      const { areaName_zh } = config
      if (areaName_zh) {
        this.areaName_zh = areaName_zh
      }
      this.currentStep = 0
      this.idCard = ''
      this.password = ''
      this.passwordCopy = ''
      this.userName = ''
    },
    // 再次通过后台接口确认人脸识别信息
    reconfirm(code) {
      requestWXGetFaceInfo(code).then((res) => {
        const { data } = res
        const { errcode, identify_ret } = data
        if (errcode == 0 && identify_ret == 0) {
          this.currentStep = 1
        } else {
          showModal('人脸识别信息认证出错，请重新认证！')
        }
      })
    },
    // 点击按钮 回调函数
    handleClickBtn() {
      const currentStep = this.currentStep
      const userName = this.userName
      const idCard = this.idCard
      if (currentStep === 0) {
        if (!userName) {
          showModal('请输入姓名')
          return
        }
        if (!idCard) {
          showModal('请输入身份证号')
          return
        } else {
          const checkResult = checkIDCard(idCard, '身份证号')
          if (checkResult.status === '0') {
            showModal(checkResult.msg)
            return
          }
        }
        // this.currentStep = 1
        // return
        // 开始人脸识别认证
        startFacialRecognitionVerify(userName, idCard).then((res) => {
          this.reconfirm(res)
        })
      }
      if (currentStep === 1) {
        const isOk = this.checkPassword()
        if (isOk) {
          // 网厅重置密码
          if (this.type == '1') {
            requestWXWxUpdatePassword(idCard, this.password).then(() => {
              this.handleInit()
              showModal('修改成功').then(() => {
                switchTab('home')
              })
            })
          }
          // 审批系统重置密码
          if (this.type == '2') {
            requestB208(idCard, this.password).then(() => {
              this.handleInit()
              showModal('修改成功').then(() => {
                switchTab('home')
              })
            })
          }
          // 发放系统重置密码
          if (this.type == '3') {
            requestFFResetPassword(idCard, this.password).then(() => {
              this.handleInit()
              showModal('修改成功').then(() => {
                switchTab('home')
              })
            })
          }
        }
      }
    },
    // 检测两次输入的密码是否一致
    checkPassword() {
      const password = this.password
      const passwordCopy = this.passwordCopy
      if (passwordCopy !== password) {
        showModal('两次输入的密码不一致，请重新输入')
        return false
      }
      return true
    },
    // 暂未使用
    handleClickAgree() {
      console.log('查看协议')
    },
    // 暂未使用
    changeCheckbox(e) {
      const value = e.target.value
      this.checkboxChecked = !this.checkboxChecked
      console.log(value)
    },
  },
  computed: {
    buttonDisabled() {
      let result = false
      const currentStep = this.currentStep
      const checkboxChecked = this.checkboxChecked
      const userName = this.userName
      const idCard = this.idCard
      const password = this.password
      const passwordCopy = this.passwordCopy

      if (currentStep === 0) {
        if (!checkboxChecked) {
          result = true
        }
        if (!userName.trim()) {
          result = true
        }
        if (!idCard.trim()) {
          result = true
        }
      }

      if (currentStep === 1) {
        if (!password.trim()) {
          result = true
        }
        if (!passwordCopy.trim()) {
          result = true
        }
      }
      return result
    },
    buttonName() {
      let str = ''
      const currentStep = this.currentStep
      if (currentStep === 0) {
        str = '人脸识别验证'
      }
      if (currentStep === 1) {
        str = '确定'
      }
      return str
    },
  },
  watch: {},
}
</script>
<style lang="scss" scoped>
.reset-password {
  width: 100%;
  position: relative;
  padding: $spacing;
  padding-bottom: 80rpx + 80rpx;
  .tip-process {
    width: 100%;
    height: 184rpx;
    background-color: #ffffff;
    border-radius: 16rpx;
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 28rpx 36rpx;
    margin-bottom: 32rpx;
    .line {
      position: absolute;
      top: 28rpx + 44rpx - 4rpx;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0.6;
      img {
        width: 398rpx;
        height: 8rpx;
      }
      &.active {
        opacity: 1;
      }
    }
    .item {
      text-align: center;
      font-size: 30rpx;
      line-height: 42rpx;
      color: #8ab6ff;
      &.active {
        color: $primary;
      }
      img {
        width: 88rpx;
        height: 88rpx;
        margin: auto;
      }
    }
  }
  .main {
    width: 100%;
    background-color: #fff;
    border-radius: 16rpx;
    padding-bottom: $spacing;
    .img-wrapper {
      position: relative;
      img {
        display: block;
        width: 658rpx;
        height: 370rpx;
        margin: auto;
      }
      .text {
        position: absolute;
        top: 120rpx;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        font-size: 30rpx;
        line-height: 44rpx;
        color: #fff;
      }
    }
    .form {
      padding: 20rpx 40rpx;
    }
    .input-cell-wrapper {
      position: relative;
      border-bottom: solid 1px $border-color;
      height: 104rpx;
      display: flex;
      align-items: center;
      .label {
        margin-right: 12rpx;
        img {
          width: 44rpx;
          height: 44rpx;
        }
      }
      .input {
        flex: 1;
        overflow: hidden;
      }
      input {
        display: block;
        width: 100%;
        height: 100%;
        line-height: 1.4;
        font-size: 28rpx;
        color: $color;
      }
    }
  }
  .checkbox-wrapper {
    width: 100%;
    padding-top: 120rpx;
    .label {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: #3d424d;
      line-height: 32rpx;
      position: relative;
      padding-left: 40rpx;
      .link {
        color: #3882ff;
      }
    }
    .checkbox {
      display: none;
    }
    .icon {
      position: absolute;
      top: 50%;
      left: -6rpx;
      transform: translateY(-50%);
      width: 44rpx;
      height: 44rpx;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYBAMAAACDuy0HAAAAMFBMVEUAAAA4gf9GjP85gv84g/84gv84gv87if8+gf86g/84g/84g/86g/83gv8+g/85h/8koDKRAAAAEHRSTlMAgAVLenJkDRVzbVxCMyUkrKt6AQAAAP1JREFUSMdjGAWjYBQMKqBvtkQQCrySP+FXW+woiAREzPGp1YGoRag+hFste6IgGhArwKm4VVBQ1K4JxtN4HCgoGIHT4EBByQvIArwTBUVxGa0mKLgJVURbUDAJh+KDgsLoQoaCMjhc4Si4AV2MW1AEuzuYBSUV0MWYJgoaYFWsIiiLKXhR0Amr4o+CAZiCrILyWBUbYrORGexpTJAo+ABTkE9QDKvihYINmIIcglJYFTsKKmAKMgmKYFUsKIhddFTxqOKhqBhX4ic3WxHOsOQWBYQLGXKLL8IFI+VFLuHCnHA1QXkFRLhqI1xpUlwdE67oCTchRsEoGAWDCQAAqGg7568tkPUAAAAASUVORK5CYII=)
        no-repeat center center;
      background-size: 100% 100%;
      transition: all 0.3s ease-in-out;
      &.checked {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAMAAABGS8AGAAAAe1BMVEUAAAA4gv9Aiv9Onf84g/84gv84gv84g/84g/84g/84gv85g/85hf87hP84gv/////1+f/5+//l7v+UvP+Gs/+nyP93qf9UlP9Fiv8/hv87g//v9f/S4/+40v9qof9Mjv/G2//B2P/d6f/c6f+dwv+00P9gm/9fm/9emv+753SzAAAADnRSTlMA8hgG9OPZx7+WlYJHLR9tpu4AAAF4SURBVFjD7dhZc4IwFIbhpiK7X5BNwQW3Lv//F7YYmxkcLTmEGbk4z1V78048Gkl8Y4wxxlhrFoe+K3BHuH4Yzyyy74HAUyJ4H7rayMG/nGg2aLkeenkDFr2Yw8B8QV6v6vaXiWueeTDk0eYcwVhEGoQDYw5lGAEIAsKEBQiE+ZRjkMTG4RAkoXHYB4lvHHbRa59uMty4xmGBPuVSSnmBIozD6JO3XZngZrRwJq92Y4eLW7e2CK/WuFfvVLcABoero0xydFUH1b3AInxsC1mnu96qbg6bcHL/mtGcZWtZwiKs3/2PWo88la1kD6uwLh8r9e/XRrY2n7AL650gt+vrNlajSVewD6NU5XOj/zw1sA53lplLvfhRwvhWg1V9eahgHe5+FPQ2Hi+M5vTXLYAxw3q7ZbAMCzz6gljmeExYPJrqIklLPOG+/mFKffy//sBCPWK9/lBIPMZO4eBNuipM43Jjfh2bzgXS7Mo7rUt6788KjDHGGPv1A1PCdYOHODhLAAAAAElFTkSuQmCC);
      }
    }
  }
  .button-wrapper {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 40rpx $spacing;
  }
}
</style>
