<template>
  <view id="loginBox">
    <image src="../../static/images/loginBack.png" class="loginBack"></image>
    <view class="content">
      <view class="logo">
        <img src="../../static/images/logo.png" alt="" />
        <view>
          <span>太原人力资源展位系统</span>
          <span>JIUYUAN YINHAI EMPLOYMENT INTELLIGENT BOOTH RECRUITMENT SYSTEM</span>
        </view>
      </view>
      <view class="leftCT">
        <view class="company_name">
          <!-- <image src="../../static/images/logo.png" class="bodyHead"></image> -->
          <div>
            <span>四川久远银海软件股份有限公司，您好!</span>
            <span>JIUYUAN YINHAI EMPLOYMENT INTELLIGENT BOOTH RECRUITMENT SYSTEM</span>
            <view @click="openSecondScreen">投屏</view>
            <view @click="closeOutScreen">关闭投屏</view>
          </div>
        </view>
        <view class="bodyBox">
          <!-- <view class="bodyLeft">
            <view>中心简介</view>
            <view><image src="../../static/images/icon_unit.png"></image></view>
            <view>{{value1}}</view>
          </view> -->
          <view class="bodyRight">
            <view class="rightHead">
              <view class="left_info">
                <view class="input_box">
                  <view>
                    <image src="../../static/images/userIcon.png" style="width: 24px; height: 24px"></image>
                  </view>
                  <div class="line"></div>
                  <view>
                    <input
                      class="uni-input"
                      @click="setIdName('inputUnit')"
                      placeholder="请输入您的账号"
                      id="inputUnit"
                      v-model="aab004"
                    />
                  </view>
                </view>
                <!-- <view>
                  <view>
                    <image src="../../static/images/pwdIcon.png" style="width: 35px;height: 25px;"></image>
                  </view>
                  <view>
                    <input class="uni-input" @click="setIdName('inputPerson')" password type="text" placeholder="请输入您的密码"  id='inputPerson' v-model ='aab005'/>
                  </view>
                </view> -->
              </view>

              <view class="loginBtn" @click="loginIndex">登录</view>
            </view>
            <view class="rightBody">
              <common-keyboard @getSearchValue="getSearchValue" :record="value" :idName="idName"></common-keyboard>
            </view>
            <view class="rightBtn">
              <view class="vx" @click="openpopQRCode">
                <img src="" alt="" />
                <div class="info">
                  <span>微信扫码登录</span>
                  <span>请选择此方式登录您的账号</span>
                </div>
              </view>
              <view class="mobile" @click="openpop">
                <img src="" alt="" />
                <div class="info">
                  <span>手机账号登录</span>
                  <span>请选择此方式登录您的账号</span>
                </div>
              </view>
              <view class="account" @click="goOtherPage">
                <img src="" alt="" />
                <div class="info">
                  <span>账号密码登录</span>
                  <span>请输入账号，无需输入密码</span>
                </div>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- <view class="rightCT">
        <view class="rightOne">
          <view>
            <view>19</view>
            <view>2022年11月28日</view>
          </view>
          <view>
            <view>天气</view>
            <view>SUNNY</view>
            <view>星期一</view>
          </view>
        </view>
        <view class="rightTew">
          <view>请选择</view>
          <view>
            <view class="line"></view>
            <view class="line"></view>
          </view>
          <view>
            您的登陆方式
          </view>
        </view>
        <view class="rightBtn">
          <view @click="goOtherPage">账号登录</view>
          <view>微信登录</view>
          <view @click="openpop">手机登录</view>
        </view>

      </view> -->
    </view>
    <uni-popup ref="popup" :mask-click="false">
      <view class="workHead">
        <view>手机验证码登录</view>
      </view>
      <view class="popupView">
        <view class="inputs">
          <view>*</view>
          <view>请输入手机号:</view>
          <input class="uni-input" v-model="consigneephone" type="number" maxlength="11" />
        </view>
        <button :disabled="sendMSGDisabled" @click="sendMSG" size="small" style="width: 170px">
          {{ sendMSGDisabled ? this.seconds + '秒后可重发' : '发送短信验证码' }}
        </button>
        <view class="inputs">
          <view>*</view>
          <view>请输入验证码:</view>
          <input class="uni-input" type="number" />
        </view>
        <view class="buttons">
          <button @click="searchNum">保存</button>
          <button @click="closepop">关闭</button>
        </view>
      </view>
    </uni-popup>

    <uni-popup ref="popupQRCode" :mask-click="true">
      <view class="workHead">
        <view>二维码登录</view>
      </view>
      <view class="popupView" @click="getFocus">
        <view>
          请勿点击屏幕，请打开hr单位码，在扫码处扫描
          <tk-input ref="scanTextbox" v-model="loginCodes" :allow-edit="false" style="opacity: 0"></tk-input>
        </view>

        <view class="buttons">
          <button @click.stop="closepopQRCode">关闭</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      seconds: 120, //短信倒计时
      consigneephone: '', //手机号
      smsCode: null, //短信验证码
      sendMSGDisabled: false, //发送短信按钮禁用
      aab004: 'hxxf',
      idName: 'inputUnit',
      aab005: '',
      value: '',
      value1:
        '四川久远银海软件股份有限公司(以下简称“银海”)1992年起源于国家“两弹一星”的摇篮—中国工程物理研究院，是中国工程物理研究院发展“军转民”事业在IT领域的重点支柱性企业。',

      systemInfo: {},

      //二维码读取信息
      loginCodes: '',
    }
  },

  watch: {
    loginCodes: {
      handler(val) {
        if (val) {
          if (this.$check.validateJson(val)) {
            //二维码
            uni.hideKeyboard()
            //this.getFocus()

            let aaa = plus.device.uuid
            this.$utils.showToast(aaa)
            let params = JSON.parse(val)
            if (params.user_id) {
              this.aab004 = params.user_id
              this.loginIndex()
            } else {
              this.getFocus()
              this.$utils.showToast('获取用户信息失败，请联系管理员')
            }

            setTimeout(() => {
              this.loginCodes = ''
            }, 1000)
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },

  onLoad() {
    //this.$utils.initWebsocket()
  },

  mounted() {
    let loginInfo = this.$loginConfig.getLoginInfo()
    // let acb33wTmp = loginInfo.acb33w
    let acb33wTmp = loginInfo.acb33w
    //console.log(loginInfo,"dsdasdadasdas")
    //console.log(acb33wTmp,"dsdasdadasdas")
    //如果账号账号信息完善，就自动登录，不行的话，就按照账号登录的提示
    if ('1' == acb33wTmp) {
      setTimeout(() => {
        this.loginIndex()
      }, 3000)
    }
  },

  methods: {
    //打开双屏
    openSecondScreen() {
      // 获取路由
      // let pages = getCurrentPages();
      // let route =  pages[pages.length - 1].$page.fullPath
      mdDonseeDevice.openOutScreen({
        screenSn: 0,
        name: 'secondScreen',
        url: 'pages/sysInfo/sysInfo',
      })
    },

    //关闭双屏
    closeOutScreen() {
      mdDonseeDevice.closeOutScreen({
        name: 'secondScreen',
      })
    },

    setIdName(value) {
      this.idName = value
      if (value === 'inputUnit') {
        this.value = this.aab004
      } else {
        this.value = this.aab005
      }
    },

    getSearchValue(value) {
      if (this.idName === 'inputUnit') {
        this.aab004 = value
      } else {
        this.aab005 = value
      }
    },
    goOtherPage() {
      uni.navigateTo({
        url: '/pages/uniCenter/index',
      })
    },

    //--------------------------hr二维码扫描登录相关接口 begin--------------------------

    //打开扫码窗口
    openpopQRCode() {
      this.$refs.popupQRCode.open('center')
      this.getFocus()
    },
    //设置input聚焦
    getFocus() {
      this.$nextTick(() => {
        this.$refs.scanTextbox.focus()
      })
    },
    //关闭扫码窗口
    closepopQRCode() {
      this.$refs.popupQRCode.close()
    },
    //--------------------------hr二维码扫描登录相关接口 end--------------------------

    openpop() {
      this.$refs.popup.open('center')
    },
    closepop() {
      this.$refs.popup.close()
    },
    searchNum() {
      let systemInfo = uni.getStorageSync('systemInfo')
      if (!systemInfo) {
        this.$utils.showToast('未获取到设备信息')
        return
      }
      let aab082 = this.consigneephone
      let ace711 = systemInfo.mainBoardSN + systemInfo.cpuSerial //摊位唯一硬件码使用主板序列号+cpu序列号
      let param2 = {
        apiCode: 'login_base006',
        method: 'login_base006',
        aab082: aab082,
        user_type: '1',
        ace711: ace711,
      }
      this.$http.request('/api/business/getData.do', 'post', param2, true).then((res) => {
        //console.log(res.data);
        if (res.errors.length > 0) {
          uni.showModal({
            content: res.errors[0].msg,
          })
        } else {
          uni.setStorageSync('loginInfo', res.data.data)
          uni.navigateTo({
            url: '/pages/uniCenter/index',
          })
        }
      })
    },
    fnCheckPhone: function (phone) {
      //定义校验规则
      var myreg = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/
      if (!myreg.test(phone)) {
        return false
      }
      return true
    },
    sendMSG() {
      //判断手机号为11位
      this.smsCode = null
      if (this.consigneephone == '' || this.consigneephone == null) {
        uni.showToast({
          title: '请填写11位收件人手机号',
          icon: 'none',
          duration: 2500,
        })
        return
      }
      if (!this.fnCheckPhone(this.consigneephone)) {
        uni.showModal({
          content: '请输入正确的11位手机号',
        })
        return
      }
      this.sendMSGDisabled = true
      let that = this
      const timeInterval = setInterval(() => {
        if (that.seconds == 0) {
          clearInterval(timeInterval)
          that.sendMSGDisabled = false
          that.seconds = 120
          //console.log('if', that.seconds)
        } else {
          that.seconds--
          //console.log('else', that.seconds)
        }
      }, 1000)
    },
    loginIndex() {
      uni.setStorageSync('loginInfo', {
        aab001: 9365940,
        acb330: 1431381,
        aab004: '久远银海股份有限公司',
        user_id: '1',
        acb340: 1795147,
        acb00p: 1040303,
        acb00s: '1,2,3,4,5,6,7,8,9,10',
      })
      uni.navigateTo({
        url: '/pages/uniCenter/index',
      })
      //获取设备类型  phone、pad、tv、car、watch、vr、appliance、undefined、unknown
      //let ace769 = uni.getSystemInfoSync().deviceType
      // let systemInfo = uni.getStorageSync('systemInfo')
      // if(!systemInfo){
      // 	this.$utils.showToast('未获取到设备信息')
      // 	return
      // }
      // let ace711 = systemInfo.mainBoardSN + systemInfo.cpuSerial//摊位唯一硬件码使用主板序列号+cpu序列号
      // //let ace711 = '777'

      // let systemInfo = uni.getStorageSync('systemInfo')
      // if(!systemInfo){
      // 	this.$utils.showToast('未获取到设备信息')
      // 	return
      // }
      // let ace711 = systemInfo.mainBoardSN + systemInfo.cpuSerial//摊位唯一硬件码使用主板序列号+cpu序列号
      // let ace711 = '12212'
      // this.$http.request('/api/business/getData.do','post',{
      //     apiCode: 'login_base004',
      // 	method: 'login_base004',
      // 	user_name:this.aab004,
      // 	user_type:'1',
      // 	password:this.aab005,
      // 	//ace769:ace769,
      // 	ace711:ace711
      // },true).then((res)=>{
      // 	if(res.data.data){
      // 		uni.setStorageSync('loginInfo',res.data.data)
      // 		uni.navigateTo({
      // 			url:'/pages/uniCenter/index'
      // 		})
      // 	}else{
      // 		this.$utils.showToast(res.errors[0].msg)

      // 		//如果是二维码登录报错 需要重新聚焦
      // 		if(this.loginCodes){
      // 			this.getFocus()
      // 		}
      // 	}
      // })
    },
  },
}
</script>

<style lang="scss" scoped>
#loginBox {
  width: 1366px;
  height: 765px;
  position: relative;
  z-index: 0;
}

.workHead {
  width: 650px;
  height: 68px;
  background: #0682fe;
  display: flex;
  align-items: center;
  padding: 0px 24px 0px 24px;

  > image {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }

  > view {
    font-size: 24px;
    font-weight: 500;
    min-width: 780px;
    color: #ffffff;
    margin: 0px 100px 0px 12px;
    white-space: nowrap;
  }
}

.popupView {
  width: 650px;
  height: 250px;
  padding: 24px;
  background-color: #ffffff;

  .inputs {
    width: 450px;
    float: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    margin-left: 12px;

    > view:first-child {
      color: #ff0000;
    }

    > view {
      height: 54px;
      font-size: 18px;
      font-weight: 400;
      color: #333333;
      line-height: 54px;
    }

    > input {
      width: 280px;
      height: 54px;
      border-radius: 4px;
      border: 1px solid #eeeeee;
      font-size: 18px;
      padding: 4px;
    }
  }

  .buttons {
    clear: both;
    display: flex;
    justify-content: space-around;

    > button {
      width: 150px;
      height: 42px;
      background: linear-gradient(180deg, #098fff 0%, #0064ff 100%);
      border-radius: 4px;
      font-size: 18px;
      font-weight: bold;
      color: #ffffff;
      margin: 32px auto 0px auto;
      text-align: center;
      line-height: 42px;
      cursor: pointer;
    }
  }
}

.loginBack {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
}

.content {
  border: 1px solid red;
  width: 1366px;
  height: 765px;
  padding: 20px 30px;
  box-sizing: border-box;

  > .logo {
    color: #fff;
    display: flex;
    align-items: center;

    > img {
      width: 500px;
      height: 100px;
      margin-right: 16px;
    }

    > view {
      // height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      line-height: 20px;

      > span:nth-of-type(1) {
        font-size: 16px;
        font-weight: bold;
        // letter-spacing: 1px;
      }

      > span:nth-of-type(2) {
        font-size: 10px;
      }
    }
  }
}

.leftCT {
  width: 100%;
  height: 640px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > .company_name {
    // margin-bottom: 30px;
    display: flex;
    align-items: center;

    > .bodyHead {
      width: 300px !important;
      height: 85px !important;
      margin-right: 16px;
    }

    > div {
      height: 85px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      color: #fff;

      > span:nth-of-type(1) {
        font-size: 20px;
        font-weight: bold;
        letter-spacing: 1px;
      }

      > span:nth-of-type(2) {
        font-size: 14px;
      }
    }
  }
}

.bodyBox {
  width: 80%;
}

// .bodyLeft{
// 	width: 216px;
// 	height: 584px;
// 	background-image: url('../../static/images/loginLeft.png');
// 	background-size: cover;
// 	float: left;
// 	>view:first-child{
// 		width: 100px;
// 		font-size: 24px;
// 		font-weight: bold;
// 		color: #FFFFFF;
// 		margin: 0 auto;
// 		padding-top: 40px;
// 	}
// 	>view:nth-child(2){
// 		width: 96px;
// 		height: 96px;
// 		background: #0362E3;
// 		border-radius: 50%;
// 		margin: 43px auto 0 auto;
// 		display: flex;
// 		align-items: center;
// 		justify-content: center;
// 		>image{
// 			width: 47px;
// 			height: 43px;
// 		}
// 	}
// 	>view:last-child{
// 		width: 184px;
// 		font-size: 16px;
// 		font-weight: 400;
// 		color: #FFFFFF;
// 		line-height: 24px;
// 		margin: 27px auto 0px auto;
// 	}
// }
.bodyRight {
  height: 500px;
  width: 100%;
  // background: #FFFFFF;
  border-radius: 8px;
  padding: 20px 30px;
  box-sizing: border-box;
  background-color: rgb(133, 162, 238);
}

.rightHead {
  // padding-top: 12px;
  // padding-left: 24px;
  // margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  > .left_info {
    width: calc(100% - 180px);
    display: flex;
    align-items: center;
    justify-content: space-between;

    > .input_box {
      width: 50%;
      display: flex;
      align-items: center;
      padding-bottom: 10px;
      box-sizing: border-box;
      border-bottom: 1px solid #fff;

      > view {
        > input {
          font-size: 16px;
          // width: 500px;
          width: calc(100% - 40px);
          border: none;
          color: #fff;
        }
      }

      > view:nth-of-type(1) {
        width: 35px;
        height: 30px;
        text-align: center;
        padding-top: 8px;
      }

      > .line {
        width: 2px;
        height: 24px;
        margin: 0 8px 0 5px;
        background-color: #fff;
      }
    }
  }
}

.rightBody {
  width: 100%;
  margin-bottom: 10px;

  /deep/ .vitualKeyboard {
    width: 100%;

    .keyboardBox {
      font-size: 18px;
      width: 100%;
      height: auto;

      .one_and_two {
        padding: 3px;
        box-sizing: border-box;
        background-color: rgba(255, 255, 255, 0.2) !important;
        margin-bottom: 5px;
      }

      .line {
        height: auto;
        display: flex;
        justify-content: space-between;
      }

      .gap_t {
        margin-top: 0px;
        margin-bottom: 10px;

        .keys_d {
          width: calc(100% / 16);
          height: 60px;
        }
      }

      .second {
        div {
          width: calc(100% / 16);
          height: 60px;
          margin-top: 0px;
        }
      }

      .third,
      .fourth {
        box-sizing: border-box;
        margin-bottom: 10px;

        div {
          background: #fff;
          height: 60px;
        }

        .keys {
          width: calc(100% / 16);
          border-radius: 10px;
        }

        .keysCmd {
          width: calc(2 * (100% / 12));
        }
      }

      .keys_d,
      .keys,
      .keysCmd {
        font-size: 18px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        line-height: 1;
        margin: 3px;
      }
    }
  }
}

.loginBtn {
  width: 140px !important;
  height: 50px;
  background: linear-gradient(180deg, #008bff 0%, #0064ff 100%);
  border-radius: 4px;
  font-size: 18px;
  font-weight: 500;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-right: 16px;
  box-shadow: 0 0 10px #fff;
}

.loginBtn:active {
  background: linear-gradient(180deg, #007add 0%, #005fed 100%);
  line-height: 68px;
}

.rightCT {
  float: right;
  width: 368px;
  height: 1080px;
  background: linear-gradient(180deg, #0824b5 0%, rgba(0, 40, 166, 0.3) 100%);
}

.rightOne {
  height: 265px;
  display: flex;
  align-items: center;
  justify-content: space-around;

  > view:first-child {
    > view:first-child {
      font-size: 128px;
      font-weight: 400;
      color: #ffffff;
      line-height: 192px;
    }

    > view:nth-child(2) {
      font-size: 20px;
      font-weight: 400;
      color: #ffffff;
      line-height: 30px;
    }
  }

  > view:last-child {
    > view {
      font-size: 30px;
      font-weight: 400;
      color: #ffffff;
      line-height: 45px;
      margin-bottom: 50px;
    }

    > view:last-child {
      font-size: 20px;
      font-weight: 400;
      color: #ffffff;
      line-height: 30px;
      margin-bottom: 0px;
    }
  }
}

.rightTew {
  width: 288px;
  margin: 113px auto 54px auto;

  > view:first-child,
  > view:last-child {
    font-size: 30px;
    font-weight: 400;
    color: #ffffff;
    line-height: 42px;
    text-align: center;
  }

  > view:nth-child(2) {
    overflow: hidden;

    > .line {
      width: 38px;
      height: 2px;
      background-color: #ffffff;
    }

    > .line:first-child {
      float: left;
    }

    > .line:last-child {
      float: right;
    }
  }
}

.rightBtn {
  display: flex;
  justify-content: space-between;
  gap: 1%;
  padding: 0 3px;

  > view {
    width: 32%;
    height: 90px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    > img {
      width: 50px;
      height: 50px;
      margin-right: 16px;
    }

    > .info {
      height: 50px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      font-size: 16px;

      > span:nth-of-type(1) {
        font-size: 18px;
        font-weight: bold;
      }

      > span:nth-of-type(2) {
        color: #999;
      }
    }

    // background-image: url('../../static/images/btnBack.png');
    // width: 312px;
    // height: 125px;
    // background-size: cover;
    // text-align: center;
    // line-height: 125px;
    // font-size: 28px;
    // font-weight: 400;
    // color: #FFFFFF;
  }

  > .vx {
    .info {
      > span:nth-of-type(1) {
        color: rgb(86, 187, 64);
      }
    }
  }

  > .mobile {
    .info {
      > span:nth-of-type(1) {
        color: rgb(72, 131, 243);
      }
    }
  }

  > .account {
    .info {
      > span:nth-of-type(1) {
        color: rgb(246, 163, 57);
      }
    }
  }
}
</style>
