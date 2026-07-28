<template>
  <div class="login h5-page">
    <div class="container">
      <div class="top d-f ai-c jc-c fd-c">
        <img :src="imageLogin" mode="widthFix" />
        <div>请您进行人脸识别身份验证</div>
        <span>信息将与当前微信绑定（用于身份验证）</span>
      </div>
      <div class="form">
        <div class="input-wrapper">
          <label for="username" class="label">姓名</label>
          <div class="input">
            <input
              id="username"
              class="input"
              type="text"
              placeholder="请输入您的姓名"
              v-model="userName"
              maxlength="20" />
          </div>
        </div>
        <div class="input-wrapper">
          <label for="username" class="label">身份证</label>
          <div class="input">
            <input
              id="username"
              type="idcard"
              placeholder="请输入您的身份证号码"
              v-model="idCard"
              maxlength="18"
              @blur="handleCheckIdCard" />
          </div>
        </div>
        <div class="input-wrapper">
          <label for="tel" class="label">手机号</label>
          <div class="input d-f ai-c">
            <!-- #ifdef MP-WEIXIN -->
            <input
              class="f-1 disabled"
              id="tel"
              type="number"
              placeholder="请点击右侧按钮获取您的手机号"
              disabled
              v-model="tel"
              maxlength="11" />
            <!-- #endif -->
            <!-- #ifdef H5 -->
            <input class="f-1" id="tel" type="number" placeholder="请输入您的手机号" v-model="tel" maxlength="11" />
            <!-- #endif -->
            <!-- #ifdef MP-WEIXIN -->
            <div class="button-wrapper">
              <ComponentButton
                width="170rpx"
                type="primary"
                name="获取手机号"
                openType="getPhoneNumber"
                :showAnimation="false"
                @getphonenumber="getPhoneNumber"></ComponentButton>
            </div>
            <!-- #endif -->
          </div>
        </div>
        <div class="input-wrapper checkbox">
          <label class="label" for="cb">
            <checkbox-group @change="handleCheckboxChange">
              <checkbox id="cb" class="checkbox" :checked="checkboxChecked" value="checkbox" />
            </checkbox-group>
            <div class="icon-checkbox" :class="[checkboxChecked ? 'checked' : '']">
              <div class="icon"></div>
            </div>
            <div class="d-f">我同意惠农惠民一卡通平台收集、保存、使用/转交我所提交的信息用于快捷登录</div>
            <div class="d-f ai-c">
              查看
              <span @click.stop="handleJumpRoute('user-agreement', 'packageCommon')">《用户服务协议》</span>
              及
              <span @click.stop="handleJumpRoute('privacy-policy', 'packageCommon')">《隐私条款》</span>
            </div>
          </label>
        </div>
      </div>
      <div class="button-wrapper">
        <!-- #ifdef MP-WEIXIN -->
        <ComponentButton
          type="primary"
          name="立即登录"
          open-type="chooseAvatar"
          :disabled="buttonDisabled"
          @chooseavatar="onChooseAvatar"></ComponentButton>
        <!-- #endif -->
        <!-- #ifdef H5 -->
        <ComponentButton type="primary" name="立即注册登录" :disabled="buttonDisabled" @click="handleFaceByMini">
        </ComponentButton>
        <!-- #endif -->
      </div>
      <div class="footer">本服务由久远银海股份有限公司提供数据支持</div>
    </div>
  </div>
</template>
<script>
  import imageLogin from './images/01.png'

  import ComponentButton from '@/components/common/ez-button/ez-button.vue'

  import { checkIDCard } from '@/utils/check'
  import { getIsDev } from '@/utils/get'
  import {
    navigateTo,
    showModal,
    startFacialRecognitionVerify,
    hideLoading,
    showLoading,
    setStorage
  } from '@/utils/uni-api'
  import { requestWXCheckIdCard, requestWXGetRealPhone, requestWXLogin, requestWXGetFaceInfo } from '@/service/api'
  import { USER_INFO, M_UPDATE_USER_INFO } from '@/store/constants' // 常量
  import { mapGetters } from 'vuex'

  import config from '@/config'
  import { useGetUserInfo } from '@/hooks/useGetUserInfo'

  const { areaCode } = config

  export default {
    name: 'pageLogin',
    data() {
      return {
        imageLogin,
        userName: '',
        idCard: '',
        tel: '',
        avatarUrl: '', // 用户头像
        checkboxChecked: false // 用户是否是否同意协议
      }
    },
    components: {
      ComponentButton
    },
    onLoad(e) {
      // 成都h5跳转登录
      // #ifdef H5
      if (areaCode == '510100') {
        location.href =
          'https://cdpre.tfsmy.com/api/oauth/authorize?client_id=ce90a07b-a045-4e40-a89f-340b3bed24df&response_type=code&redirect_uri=http://yangzhong.natapp1.cc/ta404/localPath/tfsm/tfsm.html&scope=read'
      }
      // #endif
    },
    methods: {
      // 跳转路由
      handleJumpRoute(name, packageName, params) {
        navigateTo(name, packageName, params)
      },
      // checkbox change
      handleCheckboxChange(e) {
        const { value } = e.target
        if (value.length > 0) {
          this.checkboxChecked = true
        } else {
          this.checkboxChecked = false
        }
      },
      // 输入框失去焦点校验身份证号
      handleCheckIdCard(e) {
        let { value } = e.target
        value = value.trim().toUpperCase()
        const checkResult = checkIDCard(value)
        // 校验身份证失败
        if (checkResult.status === '0') {
          showModal(checkResult.msg).then((res) => {
            this.idCard = ''
          })
        } else {
          // 校验身份证成功
          this.requestWXCheckIdCard(value)
        }
      },
      // 验证身份证号是否已经被其他用户绑定
      requestWXCheckIdCard(idCard) {
        requestWXCheckIdCard(idCard)
          .then(() => {})
          .catch(() => {
            this.idCard = ''
          })
      },
      // 获取手机号
      getPhoneNumber(e) {
        const { code, errMsg } = e.target
        if (errMsg === 'getPhoneNumber:ok') {
          requestWXGetRealPhone(code).then((res) => {
            const { data } = res
            if (data && data.phoneNum) {
              this.tel = data.phoneNum
            } else {
              this.tel = ''
            }
          })
        } else {
          showModal('请点击允许按钮，才能获取您的电话号码！')
        }
      },
      // 再次通过后台接口确认人脸识别信息
      reconfirm(code) {
        requestWXGetFaceInfo(code).then((res) => {
          const { data } = res
          const { errcode, identify_ret } = data
          if (errcode == 0 && identify_ret == 0) {
            this.handleLogin()
          } else {
            showModal('人脸识别信息认证出错，请重新认证！')
          }
        })
      },
      // 人脸识别
      handleStartFacialRecognitionVerify() {
        const isDev = getIsDev()
        // #ifdef MP-WEIXIN
        if (isDev) {
          this.handleLogin()
        } else {
          const idCard = this.idCard
          const userName = this.userName
          startFacialRecognitionVerify(userName, idCard).then((res) => {
            this.reconfirm(res)
          })
        }
        // #endif
        // #ifdef H5
        this.handleLogin()
        // #endif
      },
      // 人脸核身验证开始
      handleFaceByMini() {
        const userName = this.userName
        const idCard = this.idCard
        const tel = this.tel

        if (!userName) {
          showModal('请输入您的姓名')
          return false
        }
        if (!idCard) {
          showModal('请输入您的身份证号')
          return false
        } else {
          const checkResult = checkIDCard(idCard)
          // 校验身份证失败
          if (checkResult.status === '0') {
            showModal(checkResult.msg)
            return false
          }
        }
        if (!tel) {
          showModal('请点击获取手机号按钮')
          return false
        }
        this.handleStartFacialRecognitionVerify()
      },
      async onChooseAvatar(e) {
        const { avatarUrl } = e.detail
        if (avatarUrl) {
          const imgBase64 = await this.urlTobase64(avatarUrl)
          this.avatarUrl = imgBase64
        }
        this.handleFaceByMini()
      },
      // 图片转 base64
      urlTobase64(url) {
        return new Promise((resolve, reject) => {
          const fs = wx.getFileSystemManager()
          let suffix = url.substr(url.lastIndexOf('.') + 1)
          let base64 = ''
          try {
            let base64Data = fs.readFileSync(url, 'base64')
            base64 = 'data:image/' + suffix + ';base64,' + base64Data
            resolve(base64)
          } catch (err) {
            showModal('获取头像数据失败')
            reject(err)
          }
        })
      },
      // 绑定用户信息/请求登录
      handleLogin() {
        showLoading()
        const { openid } = this.userInfo
        const idCard = this.idCard
        const userName = this.userName
        const avatarUrl = this.avatarUrl
        const tel = this.tel
        requestWXLogin(openid, idCard, userName, tel, avatarUrl, false)
          .then((res) => {
            const { userId, sessionId, token, tel } = res.data
            useGetUserInfo(
              {
                userId,
                sessionId,
                user_id: userId,
                idCard,
                userName,
                tel,
                token,
                avatarUrl
              },
              'login'
            )
          })
          .catch(() => {
            hideLoading()
          })
      }
    },
    computed: {
      ...mapGetters([USER_INFO]),
      // 是否可以开始人脸识别
      buttonDisabled() {
        const userName = this.userName
        const idCard = this.idCard
        const tel = this.tel
        const checkboxChecked = this.checkboxChecked

        let result = false
        if (!userName) {
          return true
        }
        if (!idCard) {
          return true
        }
        if (!tel) {
          return true
        }
        if (!checkboxChecked) {
          return true
        }
        return result
      }
    },
    watch: {}
  }
</script>
<style lang="scss" scoped>
  .login {
    padding: 30rpx;
    background-color: $primary;

    .container {
      flex: 1;
      width: 100%;
      background-color: #fff;
      position: relative;
      padding: 36rpx 32rpx 40rpx;
      border-radius: 8rpx;
    }

    .top {
      img {
        width: 174rpx;
        height: 156rpx;
      }

      div {
        font-size: 32rpx;
        font-weight: 700;
        line-height: 1;
        color: #3d424d;
        padding-top: 30rpx;
      }

      span {
        font-size: 26rpx;
        font-weight: 500;
        line-height: 1;
        padding-top: 32rpx;
        color: #abaeb3;
      }
    }

    .form {
      padding-top: 40rpx;

      .input-wrapper {
        margin-bottom: 26rpx;

        .label {
          display: block;
          font-size: 24rpx;
          font-weight: 700;
          line-height: 34rpx;
          color: #777a82;
          font-weight: 700;
          margin-bottom: 6rpx;
        }

        .input {
          input {
            display: block;
            width: 100%;
            height: 78rpx;
            background-color: #f5f6f9;
            border-radius: 12rpx;
            font-size: 28rpx;
            line-height: 1.4;
            padding: 0 16rpx;
            font-weight: 500;
            color: #333;

            &.disabled {
              color: rgba(0, 0, 0, 0.25);
              background-color: #ddd;
              opacity: $opacity-disabled;
            }
          }

          .button-wrapper {
            margin-left: 30rpx;
          }
        }

        &.checkbox {
          position: relative;
          margin-top: 60rpx;
          margin-bottom: 60rpx;
          padding-left: 32rpx;

          .label {
            color: #8d8f94;
            font-weight: 400;

            .checkbox {
              display: none;
            }

            span {
              color: $primary;
            }

            .icon-checkbox {
              $size: 24rpx;
              position: absolute;
              top: 4rpx;
              left: 0;
              width: $size;
              height: $size;
              border: 1px solid #8d8f94;
              border-radius: 2px;
              display: flex;
              transition: all 0.3s;

              .icon {
                margin: auto;
                width: 0;
                height: 10rpx;
                border: 2px solid #fff;
                border-radius: 1px;
                border-top: none;
                border-right: none;
                background: transparent;
                transform: rotate(-45deg);
                position: relative;
                top: -2rpx;
                opacity: 0;
                transition: all 0.3s;
              }

              &.checked {
                background-image: linear-gradient(135deg, #6ba5fc 0%, #3a86fb 100%);
                border: 0;

                .icon {
                  opacity: 1;
                  width: 20rpx;
                }
              }
            }
          }
        }
      }
    }

    .footer {
      padding-top: 60rpx;
      width: 100%;
      text-align: center;
      font-weight: 500;
      font-size: 24rpx;
      line-height: 1;
      color: #c8c9cc;
    }
  }
</style>
