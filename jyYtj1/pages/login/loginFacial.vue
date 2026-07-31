<template>
  <div class="page">
    <!-- 用户登录 -->
    <common-header></common-header>
    <div class="page-wrap">
      <div class="wrap-center">
        <div class="wrap-box">
          <div class="left-box">
            <div :class="{'type-box':true,'loginItem':typeLogin===0?true:false,}" @click="changeType(0,'人脸识别')">
              <div>人脸识别</div>
              <div>面部识别，一键登录</div>
            </div>
            <div :class="{'type-box':true,'loginItem':typeLogin===1?true:false,}" @click="changeType(1,'微信登录')">
              <div>微信登录</div>
              <div>使用微信扫码，快捷登录</div>
            </div>
            <div :class="{'type-box':true,'loginItem':typeLogin===2?true:false,}" @click="changeType(2,'电子社保卡登录')">
              <div>电子社保卡登录</div>
              <div>使用电子社保卡APP扫码登录</div>
            </div>
            <div :class="{'type-box':true,'loginItem':typeLogin===3?true:false,}" @click="changeType(3,'短信验证码登录')">
              <div>短信登录</div>
              <div>输入手机号进行短信验证登录</div>
            </div>
            <div class="text-type" @click="changeType(6)">更多登录方式</div>
          </div>
          <div class="right-box">
            <div v-if="typeLogin===0" class="face-box">
              <div><span>点击扫脸</span><span>·一键登录</span></div>
              <div>
                <image src="../../static/images/login/faceIdentification.png" mode="aspectFit"></image>
              </div>
              <div>
                <span class="liveText">请您点击下方按钮进行面部识别登录</span>
                <div>首次使用，请通过信息授权申请</div>
              </div>
              <div @click="faceLogin">扫脸登录</div>
            </div>
            <div v-else-if="typeLogin===1" class="wx-box">
              <div><span>微信扫码</span><span>·安全登录</span></div>
              <div>
                <image :src="qrCodeUrlXcxUrl" mode="aspectFit" v-if="statusId != '-1'" />
              </div>
              <div>
                <span v-if="statusId == '-1'">二维码失效了，请点击按钮刷新</span>
                <span v-else class="liveText">请您打开微信扫一扫功能扫码登录</span>
              </div>
              <div v-if="statusId == '-1'" @click="changeType(1,'微信登录')">立即刷新</div>
            </div>
            <div v-else-if="typeLogin===2" class="wx-box">
              <div><span>电子社保卡</span><span>扫码登录</span></div>
              <div>
                <image :src="qrCodeUrlXcxUrl" mode="aspectFit" v-if="statusId != '-1'" />
              </div>
              <div>
                <span v-if="statusId == '-1'" class="liveText">请您打开电子社保卡程序扫一扫登录</span>
                <span v-else>二维码失效了，请点击按钮刷新</span>
              </div>
              <div @click="changeType(2,'电子社保卡登录')" v-if="statusId == '-1'">立即刷新</div>
            </div>
            <div v-else-if="typeLogin===3" class="sms-box">
              <view>手机短信认证登录</view>
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
            <div v-else-if="typeLogin===4||typeLogin===5" class="idCard-box">
              <div>
                <div :class="typeLogin===5?'active':''" @click="changeType(5)">身份证刷卡登录</div>
                <div :class="typeLogin===4?'active':''" @click="changeType(4)">社保卡刷卡登录</div>
              </div>
              <div>
                <div>
                  <image src="../../static/images/login/idCard.gif" mode="aspectFit" v-if="typeLogin===5"></image>
                  <image src="../../static/images/login/card.gif" mode="aspectFit" v-if="typeLogin===4"></image>
                </div>
              </div>
              <div>
                请使用<span>{{typeLogin===5?'身份证':'社保卡'}}</span>刷卡登录
              </div>
              <div>请您按照上方动画图片提示进行{{typeLogin===5?'身份证':'社保卡'}}刷卡登录</div>
            </div>
            <div v-else class="other-type">
              <div>其他登录方式</div>
              <div>
                <div @click="changeType(4)">
                  <image src="../../static/images/login/card.png" mode="aspectFit"></image>
                </div>
                <div @click="changeType(5)">
                  <image src="../../static/images/login/id.png" mode="aspectFit"></image>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--footer-->
    <common-footer :isLogin="false" :isRegist="true" nowPage="otherPage"></common-footer>
  </div>
</template>

<script>
  import QRCode from 'qrcode';
  export default {
    data() {
      return {
        typeLogin: 0, // 登陆方式 0.人脸识别1.微信2.电子社保卡
        wxTimer: 60,
        timer: '',
        codeText: '发送验证码',
        phoneNumber: '',
        smsCode: '',
        smsCodeTimer: 60,
        getSmsCode: false,
        statusId: '',
        aac147: '',
        name: '',
        tempType: 'auth',
        qrCodeUrlXcxUrl: '',
        qrCodeUrlXcxId: '',
      }
    },
    mounted() {
      this.changeType(0)
    },
    methods: {
      changeType(type, loginType) {
        uni.setStorageSync("loginType", loginType)
        clearTimeout(this.timer); //首先执行清除定时器
        switch (type) {
          case 0:
            // 打开人脸识别窗口
            this.typeLogin = type
            break;
          case 1:
            // 打开微信扫码窗口
            this.typeLogin = type
            this.qrCodeUrlXcxUrl = ''
            this.electronicSocialCard('get_qrcode', '');
            break;
          case 2:
            // 电子社保卡
            this.typeLogin = type
            this.qrCodeUrlXcxUrl = ''
            this.electronicSocialCard('get_qrcode', '');
            break;
          case 3:
            // 短信登录
            this.typeLogin = type
            this.tempType = 'login'
            break;
          case 4:
            this.$utils.showToast("该设备暂不支持，请切换其他方式登录")
            // this.typeLogin = type
            break;
          case 5:
            this.$utils.showToast("该设备暂不支持，请切换其他方式登录")
            // this.typeLogin = type
            break;
          default:
            this.typeLogin = 6
            break;
        }
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
      // 发送短信验证码
      getSmsCodeFunction() {
        if (!this.phoneNumber) {
          this.$utils.showToast("请输入手机号码!")
          return
        }
        if (this.getSmsCode) {
          return
        }
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
      // 电子社保卡登录 微信扫码登录
      electronicSocialCard(requestType, codeId) {
        let params = {
          requestType: requestType,
          businessType: this.typeLogin === 1 ? 'wechat_scan_login' : 'dzsbk',
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
              if (this.statusId == '-1') {} else if (this.statusId == '0') {
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
              if (this.typeLogin === 2) {
                // 电子社保卡
                this.qrCodeUrlXcxId = res.result.qrcode
                this.createQRCodeBytext(res.result.qrcode);
              } else {
                // 微信二维码
                this.qrCodeUrlXcxId = res.result.qrCodeId
                const idStr = `a=${res.result.qrCodeId}&b=14&c=UT01&d=1`
                this.createWxUrl(idStr)
              }
              this.timeRequest()
            }

          }
        }).catch(err => {
          clearTimeout(this.timer);
        })
      },
      // 生成微信扫码二维码
      createWxUrl(idStr) {
        const params = {
          page: 'pages/siteHome/service/homeScan/index',
          scene: idStr,
          responseType: 'arraybuffer',
          isCode: true,
        }
        this.$utils.request('/api/flexmini/getunlimitedqrcode', params, true, false).then(res => {
          console.log('res', res)
          const arrayBuffer = new Uint8Array(res)
          console.log('arrayBuffer', arrayBuffer)
          const base64 = uni.arrayBufferToBase64(arrayBuffer)
          const code = 'data:image/jpeg;base64,' + base64
          let obj = {
            serviceSuccess: true,
            code: code
          }
          this.qrCodeUrlXcxUrl = obj.code
          // this.getBase64(res).then((URl)=>{
          //   console.log(URl);
          //   this.qrCodeUrlXcxUrl = URl
          // })
        })
      },
      // 二进制流转换为base64 格式。
      getBase64(data) {
        return new Promise((resolve, reject) => {
          const blob = new Blob([data], {
            type: "image/jpeg"
          }); //类型一定要写！！！
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
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
      async createQRCodeBytext(text) {
        try {
          // 生成二维码
          this.qrCodeUrlXcxUrl = await QRCode.toDataURL(text);
          console.log(this.qrCodeUrlXcxUrl);
        } catch (error) {}
      },

      //人脸登录
      faceLogin() {
        let faceIp = uni.getStorageSync('faceIp')
        if (!faceIp) {
          this.$utils.showToast("未获取到刷脸服务ip，请联系管理员配置后重新注册!")
          return false
        }
        fetch(faceIp, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'pwd=myaPHC9vSZcZ5W+wHLiCJA=='
          })
          .then(res => res.json())
          .then(data => {
            console.log('POST 响应:', data)
            if (data.code == '200') {
              console.log('authCode', data.authCode)
              let authCode = data.authCode
              ////调登录接口
              this.handleFaceLogin(authCode)
            } else if (data.code == '500') {
              this.$utils.showToast("faceAuth: code=='500!")
            } else {
              this.$utils.showToast("faceAuth调用失败!")
            }
          })
          .catch(err => console.error('POST 错误:', err));
      },

      handleFaceLogin(authCode) {
        let url = "/api/login/loginAuth.do"
        let params = {
          authCode,
          user_type: "UTO1",
          authType: "AUTH_CODE"
        }
        this.$utils.request(url, params, true, false).then(res => {
          console.log('人脸登录成功-获取信息', res)
          uni.setStorageSync("userInfo", res.user.loginUser)
          uni.setStorageSync("setToken", res.token)
          this.$utils.showToast("登录成功")
          setTimeout(() => {
            this.$utils.redirectTo('/pages/index/index')
          }, 1000)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .wrap-box {
    display: flex;
  }

  .left-box {
    width: 690px;
    height: 760px;
    background: #F4F8FE;
    border-radius: 20px 0px 0px 20px;
    box-sizing: border-box;
    padding-top: 56px;

    .type-box {
      width: 420px;
      height: 140px;
      margin: 0px auto 20px auto;
      position: relative;
      background-size: cover;
      background-repeat: no-repeat;
      box-sizing: border-box;
      padding: 42px 0 0 69px;

      >div:first-child {
        font-weight: 600;
        font-size: 30px;
        color: rgba(0, 0, 0, 0.9);
        margin-bottom: 10px;
      }

      >div:last-child {
        font-weight: 400;
        font-size: 18px;
        color: rgba(0, 0, 0, 0.6);
      }
    }

    .type-box:nth-child(1) {
      background-image: url('../../static/images/login/bg_faceLogin.png');
    }

    .type-box:nth-child(2) {
      background-image: url('../../static/images/login/bg_weixin.png');
    }

    .type-box:nth-child(3) {
      background-image: url('../../static/images/login/bg_dianzishebao.png');
    }

    .type-box:nth-child(4) {
      background-image: url('../../static/images/login/bg_duanxin.png');
    }

    .type-box::after {
      transition: all .3s linear;
      content: "";
      position: absolute;
      right: -35px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 36px;
      background-size: cover;
      background-repeat: no-repeat;
      opacity: 0;
    }

    .type-box:nth-child(1)::after {
      background-image: url('../../static/images/login/icon_right_purple.png');
    }

    .type-box:nth-child(2)::after {
      background-image: url('../../static/images/login/icon_right_green.png');
    }

    .type-box:nth-child(3)::after {
      background-image: url('../../static/images/login/icon_right_blue.png');
    }

    .type-box:nth-child(4)::after {
      background-image: url('../../static/images/login/icon_right_orange.png');
    }

    .loginItem::after {
      opacity: 1;
    }

    .text-type {
      font-weight: 400;
      font-size: 20px;
      color: #0C6AF7;
      text-align: center;
    }
  }

  .right-box {
    flex: 1;

    .wx-box,
    .face-box {
      width: 100%;
      text-align: center;
      padding-top: 100px;

      >div:first-child {
        font-weight: 600;
        font-size: 36px;
        margin-bottom: 25px;

        >span:first-child {
          color: #0C6AF7;
        }

        >span:last-child {
          color: #000000;
        }
      }

      >div:nth-child(2) {
        width: 300px;
        height: 300px;
        border: 1px solid #E5E5E5;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;

        >image {
          width: 260px;
          height: 260px;
        }
      }

      >div:nth-child(3) {
        margin-top: 25px;
        font-weight: 400;
        font-size: 18px;
        color: rgba(0, 0, 0, 0.6);

        >span.liveText {
          font-weight: 500;
          font-size: 22px;
          color: rgba(0, 0, 0, 0.9);
        }
      }

      >div:nth-child(4) {
        margin: 40px auto 0 auto;
        width: 181px;
        height: 45px;
        border-radius: 24px 24px 24px 24px;
        border: 1px solid #0C6AF7;
        font-weight: 400;
        font-size: 18px;
        color: #0C6AF7;
        text-align: center;
        line-height: 45px;
      }
    }

    .face-box {
      >div:nth-child(2) {
        border: none;
      }

      >div:nth-child(3) {
        >div {
          padding-top: 8px;
        }
      }

      >div:nth-child(4) {
        margin: 24px auto 0 auto;
        width: 192px;
        height: 66px;
        background: #0C6AF7;
        border-radius: 66px 66px 66px 66px;
        font-size: 24px;
        color: #fff;
        line-height: 66px;
      }
    }

    .sms-box {
      width: 402px;
      margin: 0 auto;
      padding-top: 150px;

      >view:first-child {
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 34px;
        color: rgba(0, 0, 0, 0.9);
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

      /deep/ .uni-easyinput {
        height: 100%;
      }

      /deep/ .is-input-border {
        line-height: 57px;
        height: 57px !important;
        padding-right: 5px;
      }

      .send-text {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 18px;
        color: #0C6AF7;
      }

      .btn-send {
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

    .other-type {
      padding-top: 100px;
      margin: 0 auto;

      >div:first-child {
        font-weight: 600;
        font-size: 36px;
        color: rgba(0, 0, 0, 0.9);
        text-align: center;
        margin-bottom: 60px;
      }

      >div:nth-child(2) {
        display: flex;
        justify-content: center;

        >div {
          width: 350px;
          height: 370px;

          image {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .idCard-box {
      padding-top: 100px;
      text-align: center;

      >div:first-child {
        width: 380px;
        margin: 0 auto 20px auto;
        display: flex;
        height: 54px;
        line-height: 54px;
        font-weight: 400;
        font-size: 20px;
        color: #000000;

        >div {
          width: 188px;
          border: 1px solid #A2A7A9;
        }

        >div:first-child {
          border-radius: 4px 0px 0px 4px;
          border-right: none;
        }

        >div:last-child {
          border-radius: 0px 4px 4px 0px;
          border-left: none;
        }

        >div.active {
          border: 1px solid #0C6AF7;
          background: #DDF0FD;
          color: #0C6AF7;
        }
      }

      >div:nth-child(2) {
        width: 480px;
        height: 360px;
        margin: 0 auto;
        position: relative;

        >div {
          position: absolute;
          width: 500px;
          height: 360px;
          left: 50%;
          top: 50%;
          transform: translateX(-50%) translateY(-50%);
          -webkit-transform: translateX(-50%) translateY(-50%);
        }

        image {
          width: 100%;
          height: 100%;
        }
      }

      >div:nth-child(3) {
        font-weight: 600;
        font-size: 32px;
        color: rgba(0, 0, 0, 0.9);

        span {
          color: #0C6AF7;
        }
      }

      >div:last-child {
        margin-top: 12px;
        font-weight: 400;
        font-size: 20px;
        color: rgba(0, 0, 0, 0.6);
      }
    }
  }
</style>