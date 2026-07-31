<template>
  <div class="page">
    <!-- 用户登录111 -->
    <common-header></common-header>
    <div class="page-wrap">
      <div class="wrap-center">
        <div class="wrap-box">
          <div class="left-box">
            <div
              :class="{ 'type-box': true, loginItem: typeLogin === 1|| typeLogin === 7? true : false }"
              @click="changeType(7, '微信登录')"
            >
              <div>微信/小程序登录</div>
              <div>使用微信/原圆小程序扫码，快捷登录</div>
            </div>
            <div
              :class="{ 'type-box': true, loginItem: typeLogin === 2 ? true : false }"
              @click="changeType(2, '电子社保卡登录')"
            >
              <div>电子社保卡登录</div>
              <div>使用电子社保卡APP扫码登录</div>
            </div>
            <div
              :class="{ 'type-box': true, loginItem: typeLogin === 3 ? true : false }"
              @click="changeType(3, '短信验证码登录')"
            >
              <div>短信登录</div>
              <div>输入手机号进行短信验证登录</div>
            </div>
            <div class="text-type" @click="changeType(6)">更多登录方式</div>
          </div>
          <div class="right-box">
            <div v-if="typeLogin === 1||typeLogin==7" class="wx-box">
              <div><span>{{typeLogin=='7'?'微信':'原圆小程序'}}扫码</span><span>·安全登录</span></div>
              <div>
                <image :src="qrCodeUrlXcxUrl" mode="aspectFit" v-if="statusId != 'EXPIRED' && statusId != 'INVALID'" />
              </div>
              <div>
                <span v-if="statusId == 'EXPIRED' || statusId == 'INVALID'">二维码失效了，请点击按钮刷新</span>
                <span v-if="statusId != 'EXPIRED' && statusId != 'INVALID'" class="liveText"
                  >请您打开{{typeLogin==7?'微信':'小程序'}}扫一扫功能扫码登录</span
                >
              </div>
              <div v-if="statusId == 'EXPIRED' || statusId == 'INVALID'" @click="changeType(typeLogin, '小程序登录')" class="resetBtn">
                立即刷新
              </div>
			  <div class="toggle-box">
				  <div :class="typeLogin==7?'active':''" @click="changeType(7, '微信登录')">微信登录</div>
				  <div :class="typeLogin==1?'active':''" @click="changeType(1, '小程序登录')">小程序登录</div>
			  </div>
            </div>
            <div v-else-if="typeLogin === 2" class="wx-box">
              <div><span>电子社保卡</span><span>扫码登录</span></div>
              <div>
                <image :src="qrCodeUrlXcxUrl" mode="aspectFit" v-if="statusId != 'EXPIRED' && statusId != 'INVALID'" />
              </div>
              <div>
                <span v-if="statusId != 'EXPIRED' && statusId != 'INVALID'" class="liveText"
                  >请您打开电子社保卡程序扫一扫登录</span
                >
                <span v-if="statusId == 'EXPIRED' || statusId == 'INVALID'">二维码失效了，请点击按钮刷新</span>
              </div>
              <div @click="changeType(2, '电子社保卡登录')" v-if="statusId == 'EXPIRED' || statusId == 'INVALID'" class="resetBtn">
                立即刷新
              </div>
            </div>
            <div v-else-if="typeLogin === 3" class="sms-box">
              <view>手机短信认证登录</view>
              <view>
                <uni-easyinput prefixIcon="phone" v-model="phoneNumber" placeholder="请输入手机号码"></uni-easyinput>
              </view>
              <view>
                <uni-easyinput prefixIcon="email" v-model="smsCode" placeholder="请输入短信验证码">
                  <template #right>
                    <view @click="getSmsCodeFunction" class="send-text">{{ codeText }}</view>
                  </template>
                </uni-easyinput>
              </view>
              <button @click="submitAuth" class="btn-send">短信认证</button>
            </div>
            <div v-else-if="typeLogin === 4 || typeLogin === 5" class="idCard-box">
              <div>
                <div :class="typeLogin === 5 ? 'active' : ''" @click="changeType(5)">身份证刷卡登录</div>
                <div :class="typeLogin === 4 ? 'active' : ''" @click="changeType(4)">社保卡刷卡登录</div>
              </div>
              <div>
                <div>
                  <image src="../../static/images/login/idCard.gif" mode="aspectFit" v-if="typeLogin === 5"></image>
                  <image src="../../static/images/login/card.gif" mode="aspectFit" v-if="typeLogin === 4"></image>
                </div>
              </div>
              <div>
                请使用<span>{{ typeLogin === 5 ? '身份证' : '社保卡' }}</span
                >刷卡登录
              </div>
              <div>请您按照上方动画图片提示进行{{ typeLogin === 5 ? '身份证' : '社保卡' }}刷卡登录</div>
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
	<uni-popup ref="popup" type="center" border-radius="10px 10px 0 0" :mask-click="false">
		<view class="sms-boxs">
			<view class="sms-box">
				<view>手机短信认证登录</view>
				<view>
				  <uni-easyinput prefixIcon="phone" v-model="phoneNumber" placeholder="请输入手机号码"></uni-easyinput>
				</view>
				<view>
				  <uni-easyinput prefixIcon="email" v-model="smsCode" placeholder="请输入短信验证码">
				    <template #right>
				      <view @click="getSmsCodeFunction" class="send-text">{{ codeText }}</view>
				    </template>
				  </uni-easyinput>
				</view>
				<view class="footer-btn">
					<button @click="submitCancel" class="btn-send">取消</button>
					<button @click="submitAuth" class="btn-send">认证</button>
				</view>
			</view>
		</view>
	</uni-popup>
    <common-footer :isLogin="false" :isRegist="true" nowPage="otherPage"></common-footer>
  </div>
</template>

<script>
import QRCode from 'qrcode'
export default {
  data() {
    return {
      typeLogin: 1, // 登陆方式 1.微信2.电子社保卡
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
      scanStatus: '',
	  qrCodeId: '', // 电子社保卡扫码id
    }
  },
  mounted() {
    this.changeType(7, '微信登录')
  },
  methods: {
    changeType(type, loginType) {
      uni.setStorageSync('loginType', loginType)
	  if(this.timer){
		  clearTimeout(this.timer) //首先执行清除定时器
	  }
      switch (type) {
        case 1:
          // 打开微信小程序扫码窗口
          this.typeLogin = type
          this.qrCodeUrlXcxUrl = ''
          this.qrCodeUrlXcxId = ''
          this.electronicSocialCard('get_qrcode', '')
          break
        case 2:
          // 电子社保卡
          this.typeLogin = type
          this.qrCodeUrlXcxUrl = ''
          this.qrCodeUrlXcxId = ''
          this.electronicSocialCard('get_qrcode', '')
          break
        case 3:
          // 短信登录
		  this.qrCodeId = ''
          this.typeLogin = type
          this.tempType = 'login'
          break
        case 4:
          this.$utils.showToast('该设备暂不支持，请切换其他方式登录')
          // this.typeLogin = type
          break
        case 5:
          this.$utils.showToast('该设备暂不支持，请切换其他方式登录')
          // this.typeLogin = type
          break
		case 7:
		// 微信登录
          this.typeLogin = type
          this.qrCodeUrlXcxUrl = ''
          this.qrCodeUrlXcxId = ''
          this.electronicSocialCard('get_qrcode', '')
		break
        default:
          this.typeLogin = 6
          break
      }
    },
    submitAuth() {
      if (!this.phoneNumber) {
        this.$utils.showToast('请输入手机号码!')
        return
      }
      if (!this.smsCode) {
        this.$utils.showToast('请输入验证码!')
        return
      }
      let params = {
        phoneNumber: this.phoneNumber,
        smsCode: this.smsCode,
        aac147: this.aac147,
        name: this.name,
      }
      // const params2 = {
      //   authType: 'MESSAGE',
      //   userType: 'UT01',
      //   mobile: '13882974941',
      //   checkCode: '1',
      // }
      const params2 = {
        authType: 'MESSAGE',
        userType: 'UT01',
        mobile: this.phoneNumber,
        checkCode: this.smsCode,
		qrCodeId: this.qrCodeId,
      }
      let url = this.tempType == 'auth' ? '/api/login/smsAuth.do' : '/api/login/loginAuth.do'
      this.$utils.request(url, params2, true, false).then((res) => {
        const userInfo = {
          ...res.user.loginUser.customMap,
          customMap: res.user.loginUser.customMap,
        }
        uni.setStorageSync('userInfo', userInfo)
        uni.setStorageSync('setToken', res.token)
		uni.setStorageSync('isNotifyed',false)
        this.$utils.showToast('登录成功')
        setTimeout(() => {
          this.$utils.redirectTo('/pages/index/index')
        }, 1000)
      })
    },
    // 发送短信验证码
    getSmsCodeFunction() {
      if (!this.phoneNumber) {
        this.$utils.showToast('请输入手机号码!')
        return
      }
      if (this.getSmsCode) {
        return
      }
      this.getSmsCode = true
      let params = {
        phonenumber: this.phoneNumber,
      }
      this.$utils.request('/api/login/sendCheckCodeSms.do', params, true, false).then((res) => {
        this.$utils.showToast('短信发送成功!')
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
	scanQRCodeWx(qRCodeId){
		let params = {
		  path: 'pages/personPages/homeScan/index',
		  scene: qRCodeId,
		  env_version: 'trial',
		  aae400: '14',
		}
		this.$utils
		  .request('/api/wechat/getCodeUnlimit', params, true, false)
		  .then((res) => {
			  if(res.data.base64){
				  this.qrCodeUrlXcxUrl = res.data.base64
			  } else{
				  this.$utils.showToast('调用服务异常')
			  }
		  })
		  .catch((err) => {
					this.$utils.showToast(err.message)
					if(err.message&&err.message.includes('个人信息')&&err.code=='-1'){
						// 没有个人信息，需要弹框手机号和验证码登录
						this.$refs.popup.open()
						this.tempType = 'login'
					}
		    if(this.timer){
		    	clearTimeout(this.timer) //首先执行清除定时器
		    }
		  })
	},
    // 电子社保卡登录 微信小程序扫码登录
    electronicSocialCard(requestType, codeId) {
      let params = {
        requestType: requestType,
        businessType: this.typeLogin === 2 ? 'e_social_card' : 'we_chat_applet',
        qrCodeId: codeId,
        aae400: '14',
		isCode: true,
      }
	  if(!codeId){
		  params.businessParam = JSON.stringify({
          userType: 'UT01'
        })
	  } else{
		  // 先保存社保卡二维码id
		  this.qrCodeId = codeId
	  }
      let loading = params.qrCodeId ? false : true
      this.$utils
        .request('/api/login/commonQrCode', params, loading, false)
        .then((res) => {
          if(this.timer){
          	clearTimeout(this.timer) //首先执行清除定时器
          }
          if (res.flag != 'success') {
            this.$utils.showToast('调用服务异常')
            return
          } else {
            if (codeId) {
              this.statusId = res.result.qrCodeStatusEnum ? res.result.qrCodeStatusEnum : ''
              // EXPIRED PENDING SCANEND CONFIRMED INVALID
              if (this.statusId == 'EXPIRED' || this.statusId == 'INVALID') {
                // this.scanStatus = 'EXPIRED'
              } else if (this.statusId === 'SCANEND') {
                // this.scanStatus = 'SCANEND'
              } else if (this.statusId == 'PENDING') {
                this.timeRequest()
              } else if (this.statusId == '3') {
                // this.aac147 = res.result.aac147
                // this.name = res.result.aac003
                // this.tempType = 'auth'
                // this.$refs.smsAuth.open()
              } else if (this.statusId == 'CONFIRMED') {
                const userInfo = {
                  ...res.result.customInfo.user.loginUser.customMap,
                  customMap: res.result.customInfo.user.loginUser.customMap,
                }
                uni.setStorageSync('userInfo', userInfo)
                uni.setStorageSync('setToken', res.result.customInfo.token)
				uni.setStorageSync('isNotifyed',false)
                this.$utils.showToast('登录成功')
                setTimeout(() => {
                  this.$utils.redirectTo('/pages/index/index')
                }, 1000)
              }
            } else {
              this.statusId = ''
              if (this.typeLogin === 2) {
                // 电子社保卡
                if (!res.result) {
                  this.$utils.showToast('获取二维码失败，请重新获取!')
                } else {
                  this.qrCodeUrlXcxId = res.result.qRCodeId
                  this.qrCodeUrlXcxUrl = res.result.qRCodeBase64Src
                }
                // this.createQRCodeBytext(res.result.qrcode)
              } else if(this.typeLogin === 7){
				this.qrCodeUrlXcxId = res.result.qRCodeId
                // 微信扫码
                this.scanQRCodeWx(this.qrCodeUrlXcxId)
              } else{
				  // 微信小程序二维码
				  if (!res.result) {
				    this.$utils.showToast('获取二维码失败，请重新获取!')
				  } else {
				    this.qrCodeUrlXcxId = res.result.qRCodeId
				    this.qrCodeUrlXcxUrl = res.result.qRCodeBase64Src
				  }
			  }
              this.timeRequest()
            }
          }
        })
        .catch((err) => {
			this.$utils.showToast(err.message)
			if(err.message&&err.message.includes('个人信息')&&err.code=='-1'){
				// 没有个人信息，需要弹框手机号和验证码登录
				this.$refs.popup.open()
				this.tempType = 'login'
			}
          if(this.timer){
          	clearTimeout(this.timer) //首先执行清除定时器
          }
        })
    },
    // 计时器
    timeRequest() {
      this.timer = setTimeout(() => {
        //设置延迟执行
        this.getScanResult()
      }, 4000)
    },
	submitCancel(){
		this.$refs.popup.close()
	},
    getScanResult() {
      this.electronicSocialCard('get_qrcode_scan_result', this.qrCodeUrlXcxId)
    },
    async createQRCodeBytext(text) {
      try {
        // 生成二维码
        this.qrCodeUrlXcxUrl = await QRCode.toDataURL(text)
        console.log(this.qrCodeUrlXcxUrl)
      } catch (error) {}
    },
  },
}
</script>

<style lang="less" scoped>
.wrap-box {
  display: flex;
}

.left-box {
  width: 690px;
  height: 760px;
  background: #f4f8fe;
  border-radius: 20px 0px 0px 20px;
  box-sizing: border-box;
  padding-top: 90px;

  .type-box {
    width: 480px;
    height: 160px;
    margin: 0px auto 30px auto;
    position: relative;
    background-size: cover;
    background-repeat: no-repeat;
    box-sizing: border-box;
    padding: 42px 0 0 69px;

    > div:first-child {
      font-weight: 600;
      font-size: 30px;
      color: rgba(0, 0, 0, 0.9);
      margin-bottom: 10px;
    }

    > div:last-child {
      font-weight: 400;
      font-size: 18px;
      color: rgba(0, 0, 0, 0.6);
    }
  }

  .type-box:nth-child(1) {
    background-image: url('../../static/images/login/bg_weixin.png');
  }

  .type-box:nth-child(2) {
    background-image: url('../../static/images/login/bg_dianzishebao.png');
  }

  .type-box:nth-child(3) {
    background-image: url('../../static/images/login/bg_duanxin.png');
  }

  .type-box::after {
    transition: all 0.3s linear;
    content: '';
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
    background-image: url('../../static/images/login/icon_right_green.png');
  }
  .type-box:nth-child(2)::after {
    background-image: url('../../static/images/login/icon_right_blue.png');
  }
  .type-box:nth-child(3)::after {
    background-image: url('../../static/images/login/icon_right_orange.png');
  }

  .loginItem::after {
    opacity: 1;
  }

  .text-type {
    font-weight: 400;
    font-size: 20px;
    color: #0c6af7;
    text-align: center;
  }
}

.right-box {
  flex: 1;

  .wx-box {
    width: 100%;
    text-align: center;
    padding-top: 100px;

    > div:first-child {
      font-weight: 600;
      font-size: 36px;
      margin-bottom: 25px;

      > span:first-child {
        color: #0c6af7;
      }

      > span:last-child {
        color: #000000;
      }
    }

    > div:nth-child(2) {
      width: 300px;
      height: 300px;
      border: 1px solid #e5e5e5;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;

      > image {
        width: 260px;
        height: 260px;
      }
    }

    > div:nth-child(3) {
      margin-top: 25px;
      font-weight: 400;
      font-size: 18px;
      color: rgba(0, 0, 0, 0.6);

      > span.liveText {
        font-weight: 500;
        font-size: 22px;
        color: rgba(0, 0, 0, 0.9);
      }
    }

    > div.resetBtn {
      margin: 40px auto 0 auto;
      width: 181px;
      height: 45px;
      border-radius: 24px 24px 24px 24px;
      border: 1px solid #0c6af7;
      font-weight: 400;
      font-size: 18px;
      color: #0c6af7;
      text-align: center;
      line-height: 45px;
    }
	.toggle-box{
		width: 400px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding-top: 24px;
		>div{
			width: 140px;
			height: 50px;
			border: 1px solid #999999;
			border-radius: 30px;
			text-align: center;
			line-height: 50px;
			transition:all .3s linear; 
			
		}
		>div.active{
			border: 1px solid #0c6af7;
			background-color: #0c6af7;
			color: white;
		}
	}
  }

  .other-type {
    padding-top: 100px;
    margin: 0 auto;

    > div:first-child {
      font-weight: 600;
      font-size: 36px;
      color: rgba(0, 0, 0, 0.9);
      text-align: center;
      margin-bottom: 60px;
    }

    > div:nth-child(2) {
      display: flex;
      justify-content: center;

      > div {
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

    > div:first-child {
      width: 380px;
      margin: 0 auto 20px auto;
      display: flex;
      height: 54px;
      line-height: 54px;
      font-weight: 400;
      font-size: 20px;
      color: #000000;

      > div {
        width: 188px;
        border: 1px solid #a2a7a9;
      }

      > div:first-child {
        border-radius: 4px 0px 0px 4px;
        border-right: none;
      }

      > div:last-child {
        border-radius: 0px 4px 4px 0px;
        border-left: none;
      }

      > div.active {
        border: 1px solid #0c6af7;
        background: #ddf0fd;
        color: #0c6af7;
      }
    }

    > div:nth-child(2) {
      width: 480px;
      height: 360px;
      margin: 0 auto;
      position: relative;

      > div {
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

    > div:nth-child(3) {
      font-weight: 600;
      font-size: 32px;
      color: rgba(0, 0, 0, 0.9);

      span {
        color: #0c6af7;
      }
    }

    > div:last-child {
      margin-top: 12px;
      font-weight: 400;
      font-size: 20px;
      color: rgba(0, 0, 0, 0.6);
    }
  }
}
  .sms-box {
    width: 402px;
    margin: 0 auto;
    padding-top: 150px;

    > view:first-child {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 34px;
      color: rgba(0, 0, 0, 0.9);
      text-align: center;
    }

    > :nth-child(2) {
      margin-top: 60px;
      height: 57px;
      background: #ffffff;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #a2a7a9;
    }

    > :nth-child(3) {
      margin-top: 28px;
      height: 57px;
      background: #ffffff;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #a2a7a9;
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
      color: #0c6af7;
    }

    .btn-send {
      margin-top: 48px;
      background-color: #0c6af7;
      height: 60px;
      color: #ffffff;
      text-align: center;
      border-radius: 4px;
      font-weight: 600;
      font-size: 20px;
      line-height: 60px;
    }
  }
  .sms-boxs{
	  width: 650px;
	  height: 420px;
	  border-radius: 25px;
	  background-color: #ffffff;
	  .sms-box{
		  padding-top: 32px;
		  .footer-btn{
			  display: flex;
			  align-items: center;
			  justify-content: space-between;
			  .btn-send{
				  height: 45px;
				  line-height: 45px;
				  width: 100px;
			  }
			  .btn-send:nth-child(1){
				  background-color: #999999;
			  }
		  }
	  }
  }
</style>
