<template>
  <div class="page">
    <!-- 用户登录 -->
    <common-header></common-header>

    <div class="page-wrap" v-if="select">
      <div class="wrap-center">
        <div class="login-wrap">
          <div class="login-title">
            选择登录方式 <button class="btn" type="primary" @click="back" v-show="!select">切换登录方式</button>
          </div>
          <div class="login-con">
            <div class="login-nav">
              <div class="nav-item" v-for="(item,index) in loginNav" :key="index" @click="showGif(item)"></div>
            </div>
          </div>
        </div>
		<div style="text-align: center;margin-top: -50px;margin-bottom: 40px;" @click="smsLogin">手机短信登录</div>
        <div class="login-tip">
          <div class="tip-content">
            <div class="tip-title"> <i class="ic ic-tip"></i> </div>
            <div class="tip-line"></div>
            <div class="tip-decr">
              <view>
                <span class="text-org">1.支持证件扫描登录，未带社保卡和身份证可选择微信扫码或人脸认证登录；</span>
                <span class="text-org"> 2.使用证件扫描登录后，请及时取回证件，以免遗失；</span>
                <span class="text-org"> 3.业务办理结束后，请点击退出按钮以免个人信息泄漏。</span>
              </view>

            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-wrap" v-else>
      <div class="wrap-center">
        <div class="login-wrap">
          <!-- <div class="login-title">手机号登录</div> -->
          <div class="login-title">测试用登录<button class="btn" type="primary" @click="back">切换登录方式</button></div>
          <div class="login-con">
            <div class="regist-form">
              <div class="form-group">
                <uni-forms ref="form" :modelValue="formInfo" :rules="rules">

                  <div class="form-item">
                    <uni-forms-item label="手机号:" name="username" required labelWidth="120">
                      <input class="input-box" type="number" maxlength="11" v-model="formInfo.username"
                        @input="binddata('username',$event.detail.value)" />
                    </uni-forms-item>

                  </div>
                </uni-forms>
              </div>
              <div style="display: flex;">
                <div class="form-group-btn">
                  <button class="btn btn-blue" type="primary">登录</button>
                </div>
                <div class="form-group-btn1">

                  <div class="form-tip" v-if="errorStatus">
                    <i class="ic ic-yellow-tip"></i>
                    <span>{{errorMsg}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--footer-->
    <common-footer :isLogin="false" :isRegist="true" nowPage="otherPage"></common-footer>



    <!--身份证-->
    <uni-popup ref="idCardPopup" type="center" :animation="false">
      <div class="popup-box">
        <div class="popup-img-box idCard-img">
          <image src="../../static/images/gif/idCard.gif" mode="aspectFill" class="popup-img"></image>
        </div>
        <button class="btn btn-blue" @click="closeIdCard" style="margin: 0 auto !important;">关闭</button>
      </div>
    </uni-popup>

    <!--社保卡-->
    <uni-popup ref="socialPopup" type="center" :animation="false">
      <div class="popup-box">
        <div class="popup-img-box social-img">
          <image src="../../static/images/gif/card.gif" mode="aspectFill" class="popup-img">
          </image>
        </div>
        <button class="btn btn-blue" @click="closeSocial" style="margin: 0 auto !important;">关闭</button>
      </div>
    </uni-popup>

    <!--电子社保卡 微信扫码-->
    <uni-popup ref="electronicSocialPopup" type="center" :animation="false">
      <div class="popup-box2">
        <div class="code-box">
          <image :src="qrCodeUrlXcxUrl" mode="aspectFit" v-if="statusId != '-1'" />

          <div v-if="statusId == '-1'" class="mask">
            <div class="el-icon-refresh-right" @click="syncQRCode">
              <span style="display: block;">二维码已失效</span>
              <span style="display: block;color: #fff;font-size: 18px;line-height: 30px;cursor: pointer;"><uni-icons
                  type="loop" size="18" color="#ffffff"></uni-icons>点击刷新</span>
            </div>
          </div>
        </div>

        <!-- <button class="btn btn-blue"  style="margin: 0 auto !important;" @click="timeRequest">手动获取</button> -->
        <button class="btn btn-blue" @click="close" style="margin: 0 auto !important;">关闭</button>
      </div>
    </uni-popup>

    <!-- 短信验证码认证 -->
    <uni-popup ref="smsAuth" type="center">
      <div class="popup-smsbox">
        <div>
          <image src="../../static/images/login/icon_close.png" mode="aspectFill" class="icon_close" @click="closeOpen()"></image>
        </div>
        <div class="sms-box">
          <view>短信认证</view>
          <view>
            <uni-easyinput prefixIcon="phone" v-model="phoneNumber" placeholder="请输入手机号码"></uni-easyinput>
          </view>
          <view>
            <uni-easyinput prefixIcon="email" v-model="smsCode" placeholder="请输入短信验证码">
              <template #right>
              		<view @click="getSmsCodeFunction" class="send-text">{{codeText}}</view>
              	</template>
            </uni-easyinput>
          </view>
          <button @click="submitAuth" class="btn-send">短信认证</button>
        </div>
        <div class="sms-bot">
          <image src="../../static/images/login/icon-tip.png" mode="aspectFill" class="icon-tip"></image>
          <span>温馨提示：</span>
          <span>请先进行短信验证</span>
        </div>
      </div>

    </uni-popup>



  </div>
</template>

<script>
  import QRCode from 'qrcode';
  export default {
    data() {
      return {
        smsTimer: null,
        name: '',
        aac147: '',
        phoneNumber: '',
        smsCode: '',
        getSmsCode: false,
        smsCodeTimer: 60,
        select: true,
        loginNav: [{
          logo: '../../static/images/login_nav3.png',
          name: '社保卡',
          gif: 3,
		  loginType: '社保卡登录'
        }, {
          logo: '../../static/images/login_nav3.png',
          name: '电子社保卡',
          gif: 4,
		  loginType: '电子社保卡登录'
        }, {
          logo: '../../static/images/login_nav2.png',
          name: '身份证',
          gif: 2,
		  loginType: '身份证登录'
        }, {
          logo: '../../static/images/login_nav2.png',
          name: '小程序',
          gif: 5,
		  loginType: '小程序登录'
        }],
        errorMsg: '',
        errorStatus: false,
        disabledCode: true,
        codeText: '发送验证码',
        disRegist: '',
        qrCodeUrl: '',
        qrCodeUrlXcxUrl: '',
        qrCodeUrlXcxId: '',
        statusId: '',
        formInfo: {
          acb501: '',
          username: '',
          checkCode: '',
        },
        rules: {

          username: {
            rules: [{
                required: true,
                errorMessage: '请输入电话号码',
              },
              {
                pattern: /^1[3456789]\d{9}$/,
                errorMessage: '请输入正确的电话号码',
              }
            ]
          }
        },
        loginId: '',
        isfocus: false,
        imgUrl: '',
        transactionId: '',
        interlTime: '',
        timer: '',
        openType: 1, // 1为电子社保卡，2为微信
        qrcodeId: '', // 微信ID
        loginQrCode: '', // 微信
        expire_status: null, //微信二维码状态  0无效 1有效
        login_status: null, //微信扫码登录状态 0未扫码 1扫码登录中 2确认登录 3扫码失败（未注册）
		tempType: 'auth'
      }
    },
    methods: {
		smsLogin() {
			this.tempType = 'login'
			this.$refs.smsAuth.open()
			uni.setStorageSync("loginType","短信验证码登录")
		},
      submitAuth() {
        if (!this.phoneNumber) {
          this.$utils.showToast("请输入手机号码!")
          return
        }
        if (!this.smsCode) {
          this.$utils.showToast("请输入验证码!")
          return
        }
        let params = {
          phoneNumber: this.phoneNumber,
          smsCode: this.smsCode,
          aac147: this.aac147,
          name: this.name
        }
		let url = this.tempType == 'auth' ? '/api/login/smsAuth.do' : '/api/login/smsAuthLogin.do'
        this.$utils.request(url, params, true, false).then(res => {
          uni.setStorageSync("userInfo", res.userInfo)
          uni.setStorageSync("setToken", res.token)
          this.$utils.showToast("登录成功")
          setTimeout(() => {
            this.$utils.redirectTo('/pages/index/index')
          }, 1000)
        })
      },
      getSmsCodeFunction() {
        if (!this.phoneNumber) {
          this.$utils.showToast("请输入手机号码!")
          return
        }
        if(this.getSmsCode){
          return
        }
        console.log(this.getSmsCode);
        this.getSmsCode = true
        let params = {
          phonenumber: this.phoneNumber
        }
        this.$utils.request('/api/login/sendCheckCodeSms.do', params, true, false).then(res => {
          this.$utils.showToast("短信发送成功!")
          this.smsTimer = setInterval(() => {
            if (this.smsCodeTimer > 0) {
              --this.smsCodeTimer
              this.codeText = this.smsCodeTimer + 's后重新获取'
            } else {
              this.getSmsCode = false
              this.smsCodeTimer = 60
              this.codeText = '发送验证码'
              clearInterval(this.smsTimer)
            }
          }, 1000)
        })

      },
      //动画
      showGif: function(item) {
		uni.setStorageSync("loginType",item.loginType)
        if (item.gif != undefined) {
          switch (item.gif) {
            case 2:
              this.$utils.showToast("该设备暂不支持，请切换其他方式登录")
              // this.$refs.idCardPopup.open()
              // this.idCard();
              break;
            case 3:
              this.$utils.showToast("该设备暂不支持，请切换其他方式登录")
              // this.$refs.socialPopup.open();
              // this.idCard();
              break;
            case 4:
              // 打开电子社保卡弹窗
              this.$refs.electronicSocialPopup.open()
              this.openType = 1
              this.electronicSocialCard('get_qrcode', '');
              // this.$utils.showToast("该设备暂不支持，无法登录")
              break;
            case 5:
              // 打开微信扫码窗口
              this.$refs.electronicSocialPopup.open()
              this.openType = 2
              this.electronicSocialCard('get_qrcode', '');
              // this.$utils.showToast("该设备暂不支持，无法登录")
              break;
            default:
              break;
          }
        }
      },


      binddata(name, value) {
        //通过 input 事件设置表单指定 name 的值
        this.$refs.form.setValue(name, value)
      },



      idCard: function() {
        this.readCard()
      },
      readCard() {
        // this.$cardUtil.callCard(2, "", ret => {
        // 	if (ret.data.resultFlag == '-1') {
        // 		this.closeIdCard();
        // 		this.$utils.showToast("获取身份信息失败，请把身份证放置在读卡区再点击刷卡")
        // 		return
        // 	}
        // 	let aac002 = ret.data.resultContent.certNumber;
        // 	this.closeIdCard();
        // 	this.loginByAac002(aac002);
        // })
        this.loginByAac002();
      },

      loginByAac002(aac002) {
        let params = {
          authType: 'CERT_NO',
          aac147: '',
          channelCode: 'jyyz'
        }
        this.$utils.request('/api/login/readCardLogin.do', params, true, false).then(res => {
          //console.log(res)
          uni.setStorageSync("userInfo", res.user.loginUser)
          uni.setStorageSync("setToken", res.token)
          this.$utils.showToast("登录成功")
          setTimeout(() => {
            this.$utils.redirectTo('/pages/index/index')
          }, 1000)

        })

      },



      closeIdCard: function() {
        this.$refs.idCardPopup.close()
      },
      closeSocial: function() {
        this.$refs.socialPopup.close()
      },
      back() {
        this.select = !this.select
      },
      close: function() {
        this.$refs.electronicSocialPopup.close();
        clearTimeout(this.timer); //清除延迟执行
      },

      syncQRCode() {
        if (this.openType === 1) {
          this.electronicSocialCard('get_qrcode', '');
          return
        }
        this.showQrCode()
      },
      // 计时器
      timeRequest() {
        this.timer = setTimeout(() => { //设置延迟执行
          this.getScanResult()
        }, 10000);

      },
      getScanResult() {
        this.electronicSocialCard('get_qrcode_scan_result', this.qrCodeUrlXcxId);
      },
      // 电子社保卡登录
      electronicSocialCard(requestType, codeId) {
        let params = {
          requestType: requestType,
          businessType: this.openType===1?'dzsbk':'wechat_scan_login',
          qrCodeId: codeId,
          yae100: '14',
          businessParam: JSON.stringify({
            userType: 'UT01',
            b: '14',
            c: 'UT01',
            d: '1',
          })
        }
        let loading = params.qrCodeId ? false : true
        this.$utils.request('/api/qrCode/commonQrCode', params, loading, false).then(res => {
          clearTimeout(this.timer); //首先执行清除定时器
          if (res.flag != 'success') {
            this.$utils.showToast("调用服务异常")
            return
          } else {
            if (codeId) {
              this.statusId = res.result.status ? res.result.status : ''
              if (this.statusId == '-1') {
              } else if (this.statusId == '0') {
                this.timeRequest(this.qrcodeId)
              } else if (this.statusId == '3') {
                this.aac147 = res.result.aac147
                this.name = res.result.aac003
				this.tempType = 'auth'
                this.$refs.smsAuth.open()
              } else {
                uni.setStorageSync("userInfo", res.result.userInfo)
                uni.setStorageSync("setToken", res.result.token)
                this.$utils.showToast("登录成功")
                setTimeout(() => {
                  this.$utils.redirectTo('/pages/index/index')
                }, 1000)
              }
            } else {
              this.statusId = ''
              if(this.openType===1){
                this.qrCodeUrlXcxId = res.result.qrcode
                this.createQRCodeBytext(res.result.qrcode);
              } else {
                this.qrCodeUrlXcxId = res.result.qrCodeId
                const idStr = `a=${res.result.qrCodeId}&b=14&c=UT01&d=1`
                this.createQRCodeBytext(idStr)
              }
              this.timeRequest()
            }

          }
        }).catch(err => {
          clearTimeout(this.timer);
        })

      },
      closeOpen () {
        this.$refs.smsAuth.close()
      },
      async createQRCodeBytext(text) {
        try {
          // 生成二维码
          this.qrCodeUrlXcxUrl = await QRCode.toDataURL(text);
        } catch (error) {}
      },

    }
  }
</script>

<style lang="less" scoped>
  /deep/ .uni-forms-item__label {
    height: 65px;
    line-height: 65px;

    .label-text {
      font-size: 24px;
      color: #666666;
    }
  }

  /deep/ .uni-input-input,
  /deep/ .is-input-border {
    font-size: 26px;
    height: 65px;
    line-height: 65px;
    color: #333333;
    background: #ffffff;
    padding: 0 10px;
    box-sizing: border-box;
  }

  /deep/ .uni-forms-item__inner {
    padding-bottom: 36px;
  }

  /deep/ .uni-error-message {
    bottom: 8px;

    .uni-error-message-text {
      font-size: 16px;
    }
  }

  .login-wrap {
    padding: 0 145px;
    box-sizing: border-box;
    height: 650px;
    width: 100%;
    overflow: hidden;

    .login-title {
      width: 100%;
      height: 45px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 30px;
      color: rgba(0, 0, 0, 0.9);
      line-height: 45px;
      text-align: center;
      font-style: normal;
      text-transform: none;
      margin: 40px auto;

    }

    .login-con {
      width: 100%;
      margin: 15px auto;

      .regist-form {
        padding-top: 60px;

        .form-group {
          display: flex;
          justify-content: center;
          align-items: center;

          .form-item {
            padding-left: 50px;
            position: relative;
            margin-bottom: 20px;

            .input-box {
              width: 480px;
              height: 65px;
              line-height: 65px;
              border: solid 2px #bed4e9;
              box-sizing: border-box;
            }

            .form-read {
              padding-left: 10px;
              position: absolute;
              right: 0;
              top: 15px;

              .btn-blue {
                padding: 0;
                width: 70px;
                height: 40px;
                line-height: 40px;
                font-size: 18px;
                color: #FFFFFF;
              }
            }

            .code {
              .input-box {
                padding-right: 140px;
                box-sizing: border-box;
              }

              .code-btn {
                position: absolute;
                top: 0;
                right: 20px;
                font-size: 22px;
                color: #0578ee;
                background: none;
                padding: 0;
                line-height: 65px;

                &:after {
                  border: none;
                }

                &[disabled] {
                  color: #333333;
                  opacity: 0.4;
                }
              }
            }

            .form-tip {
              position: absolute;
              left: 170px;
              bottom: 12px;

              span {
                display: inline-block;
                vertical-align: middle;
                font-size: 20px;
                color: #f7170b;
                padding-left: 12px;
              }
            }

          }
        }

        .form-group-btn {
          display: flex;
          justify-content: flex-end;
          width: 55%;
          align-items: center;
          // flex-wrap: wrap;
          padding: 16px 0px 40px 0px;

          .btn-blue {
            width: 170px;
            height: 60px;
            line-height: 60px;
            font-size: 24px;
            padding: 0;
            margin: 0 20px;
          }

          .form-tip {
            // width: 100%;
            text-align: center;
            padding-top: 20px;

            span {
              display: inline-block;
              vertical-align: middle;
              font-size: 20px;
              color: #f7170b;
              padding-left: 12px;
            }
          }
        }

        .form-group-btn1 {
          display: flex;
          justify-content: flex-start;
          width: 45%;
          align-items: center;
          // flex-wrap: wrap;
          padding: 16px 0px 40px 0px;

          .btn-blue {
            width: 170px;
            height: 60px;
            line-height: 60px;
            font-size: 24px;
            padding: 0;
            margin: 0 20px;
          }

          .form-tip {
            // width: 100%;
            text-align: center;
            padding-top: 20px;

            span {
              display: inline-block;
              vertical-align: middle;
              font-size: 20px;
              color: #f7170b;
              padding-left: 12px;
            }
          }
        }
      }

      .login-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .nav-item {
          width: 430px;
          height: 427px;
          text-align: center;
          box-sizing: border-box;
          cursor: pointer;

          &:first-child {
            margin-left: 0;
            background: url('../../static/images/login/card.png') center no-repeat;
            background-size: 100% 100%;
          }

          &:nth-child(2) {
            background: url('../../static/images/login/scan.png') center no-repeat;
            background-size: 100% 100%;
          }

          &:nth-child(3) {
            background: url('../../static/images/login/id.png') center no-repeat;
            background-size: 100% 100%;
          }

          &:nth-child(4) {
            background: url('../../static/images/login_nav4.png') center no-repeat;
            background-size: 100% 100%;
          }
        }
      }


    }
  }

  .login-tip {
    width: 100%;
    height: 110px;
    box-sizing: border-box;
    background: #E5EEFC;
    border-radius: 0px 0px 20px 20px;
    border: 1px solid #FFFFFF;

    .tip-content {
      width: 900px;
      height: 100%;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      margin: 0 auto;

      .tip-title {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 24px;
        color: #F34058;
        line-height: 28px;
        text-align: center;
        font-style: normal;
        text-transform: none;
      }

      .tip-line {
        width: 8px;
        height: 81px;
        background: url('../../static/images/login/vector.png') center no-repeat;
      }

      .tip-decr {
        font-size: 16px;
        line-height: 28px;
        color: #666666;

        .text-org {
          display: block;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          font-size: 16px;
          color: rgba(0, 0, 0, 0.6);
          line-height: 25px;
          text-align: left;
          font-style: normal;
          text-transform: none;

        }
      }
    }

  }



  .popup-box {
    background: #FFFFFF;
    border-radius: 14px;
    padding: 20px;

    .popup-img-box {
      margin-bottom: 40px;

      &.idCard-img {
        width: 494px;
        height: 448px;
      }

      &.social-img {
        width: 438px;
        height: 302px;
      }

      .popup-img {
        width: 100%;
        height: 100%;
      }
    }

    .btn {
      width: 160px;
    }
  }

  .popup-box1 {
    background: #FFFFFF;
    border-radius: 14px;
    padding: 20px;

    .textStyleHead {
      font-size: 26px;
      line-height: 36px;
      color: #333333;
      position: relative;
      margin-top: 20px;
      padding-left: 20px;
      margin-bottom: 20px;
    }

    .textStyle {
      font-size: 26px;
      line-height: 36px;
      color: #333333;
      position: relative;
      padding-left: 20px;
      margin-bottom: 40px;
    }

    .popup-img-box {
      margin-bottom: 40px;

      &.idCard-img {
        width: 494px;
        height: 448px;
      }

      &.social-img {
        width: 438px;
        height: 302px;
      }

      .popup-img {
        width: 100%;
        height: 100%;
      }
    }

    .btn {
      width: 160px;
    }
  }

  .popup-smsbox {
    width: 522px;
    height: 560px;
    border-radius: 20px;
    background: url('../../static/images/login/bg_top.png') center top no-repeat;
    background-color: #ffffff;
    background-size: contain;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    >div:first-child{
      text-align: right;
      padding: 20px 30px 0 30px;
    }
    .icon_close{
      width: 34px;
      height: 34px;
    }
    .sms-box {
      width: 402px;
      margin: 0 auto;
      >view:first-child {
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 34px;
        color: rgba(0,0,0,0.9);
        text-align: center;
      }

      >:nth-child(2) {
        margin-top: 60px;
        height: 57px;
        background: #FFFFFF;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #A2A7A9;
      }

      >:nth-child(3) {
        margin-top: 28px;
        height: 57px;
        background: #FFFFFF;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #A2A7A9;
      }
      /deep/ .uni-easyinput{
        height: 100%;
      }
      /deep/ .is-input-border{
        line-height: 57px;
        height: 57px !important;
      }
      .send-text{
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 18px;
        color: #0C6AF7;
      }
      .btn-send{
        margin-top: 48px;
        background-color: #0C6AF7;
        height: 60px;
        color: #FFFFFF;
        text-align: center;
        border-radius: 4px;
        font-weight: 600;
        font-size: 20px;
        line-height: 60px;
      }
    }
    .sms-bot{
      width: 100%;
      height: 64px;
      position: absolute;
      bottom: 0;
      left: 0;
      background: #E5EEFC;
      display: flex;
      align-items: center;
      justify-content: center;
      .icon-tip{
        width: 24px;
        height: 24px;
        margin-right: 12px;
      }
      >span:nth-of-type(1){
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 18px;
        color: #F34058;
      }
      >span:nth-of-type(2){
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 18px;
        color: rgba(0,0,0,0.5);
      }
    }

    // justify-content: space-around;
    // flex-direction: column;
  }

  .popup-box2 {
    width: 360px;
    height: 380px;
    background: #FFFFFF;
    border-radius: 14px;
    padding: 20px;
    display: flex;
    justify-content: space-around;
    flex-direction: column;

    .code-box {
      text-align: center;

      image {
        width: 220px;
        height: 220px;
        display: inline-block;
        overflow: hidden;
        position: relative;
        border: 2px dashed #ccc;
        margin: 20px;
      }
    }

    .login-code {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, .5);

      z-index: 99;
    }

    .code-dialog {
      background: #ffffff;
      border-radius: 8px;
      padding: 24px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .code-close {
      position: absolute;
      right: 10px;
      top: 10px;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: #666666;
      border: 1px solid #eeeeee;
      border-radius: 4px;
    }

    .mask {
      position: relative;
      width: 220px;
      height: 220px;
      margin: 20px auto;
      /* padding: 20px; */
      // /line-height: 240px;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 5px;
      color: #fff;
      font-size: 24px;

      .el-icon-refresh-right {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        height: 60px;
      }
    }


    .btn {
      width: 160px;
    }
  }
  /deep/ .uni-input-placeholder{
    z-index: 1;
  }
</style>
