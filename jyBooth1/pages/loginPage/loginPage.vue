<template>
  <xu-common-shell :title="!disabled ? companyInfo.aab004 : $defaultData.defaultCompanyInfo.title" type="2">
    <div class="login-center">
      <!-- <div class="company-title">
        <image class="company-logo" :src="$utils.getRealImgUrl('loginPage/logo-1.png')" mode="aspectFit" />
        <view>
          <view>{{ !disabled ? companyInfo.aab004 : $defaultData.defaultCompanyInfo.aab004 }}</view>
        </view>
      </div> -->
      <div class="company-info">
        <div class="info-left" v-if="false">
          <div class="top-line"></div>
          <div class="center">
            <div class="default-ompany-pic">
              <swiper indicator-dots autoplay circular v-if="ce23s.length">
                <swiper-item v-for="item in ce23s" :key="item.aae707">
                  <view class="swiper-item">
                    <video
                      class="pic_first"
                      :src="$utils.getFileLoadUrl(item.aae707)"
                      controls
                      v-if="item.aae523 == 'mp4'"
                      style="object-fit: cover"
                    />
                    <img class="pic_first" :src="$utils.getFileLoadUrl(item.aae707)" v-else />
                  </view>
                </swiper-item>
              </swiper>
              <img class="pic_first" :src="$defaultData.defaultCompanyInfo.defaultImg" v-else />
            </div>
          </div>
          <div class="bottom-line"></div>
          <div class="bottom">
            <div class="company-name">{{ companyInfo.aab004 }}</div>
            <div class="company-type">
              <view
                >所属行业：{{
                  companyInfo.aab022 ? $codeConfig.getCodeLabel('AAB022', companyInfo.aab022) : '未知行业'
                }}
              </view>
              <view
                >单位规模：{{
                  companyInfo.aab056 ? $codeConfig.getCodeLabel('AAB056', companyInfo.aab056) : '未知规模'
                }}
              </view>
              <view>单位性质：{{ companyInfo.aab020_desc ? companyInfo.aab020_desc : '未知性质' }}</view>
            </div>
            <div class="company-desc">
              <view class="title">【公司简介】：</view>
              <view class="desc">
                <i v-dompurify-html="companyInfo.aab092 ? companyInfo.aab092 : '暂无简介'"></i>
              </view>
            </div>
          </div>
        </div>
        <!-- <default-info v-else></default-info> -->
        <div class="info-right">
          <div class="login-type">
            <view
              class="accout"
              @click="changeType('1')"
              :style="{ 'border-bottom': type == 1 ? '3px solid #0682FE' : 'none' }"
              >验证码登录</view
            >
            <view
              class="phone"
              @click="changeType('2')"
              :style="{ 'border-bottom': type == 2 ? '3px solid #0682FE' : 'none' }"
              >电子社保卡</view
            >
            <view
              class="code"
              @click="changeType('3')"
              :style="{ 'border-bottom': type == 3 ? '3px solid #0682FE' : 'none' }"
              >二维码登录</view
            >
          </div>
          <div class="account-login" v-if="type == '1'">
            <div>
              <view>使用短信验证码登录</view>
            </div>
            <el-form :model="accountForm" :rules="accountFormRules" ref="accountForm">
              <el-form-item prop="mobile">
                <el-input
                  prefix-icon="el-icon-user"
                  v-model="accountForm.mobile"
                  placeholder="请输入手机号"
                  :disabled="disabled"
                ></el-input>
              </el-form-item>
              <el-form-item prop="checkCode">
                <el-input
                  style="width: 73%"
                  prefix-icon="el-icon-setting"
                  v-model="accountForm.checkCode"
                  placeholder="请输入验证码"
                  :disabled="disabled"
                ></el-input>
                <a @click="getVerifyCode">{{ isGetVerifyCode ? `${verifyCodeCount}秒后重新获取` : '获取验证码' }}</a>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="accountLogin" :disabled="disabled">登录</el-button>
              </el-form-item>
              <!-- <el-form-item style="text-align: center">
                <a @click="zmLogin">账号密码登录</a>
              </el-form-item> -->
            </el-form>
          </div>
          <div class="dzsbk-login" v-else-if="type == '2'">
            <div class="top-text">
              <view>使用 电子社保卡</view>
              <view>扫码登录</view>
            </div>
            <div class="center-code">
              <image :src="qrCodeUrl" mode="aspectFit" v-if="qrCodeId && !scanStatus" />
              <div v-if="!qrCodeId" class="mask">
                <i class="el-icon-refresh-right" @click="createQRCode">
                  <view>二维码获取失败</view>
                </i>
              </div>
              <div v-if="scanStatus == 'expired'" class="mask">
                <i class="el-icon-refresh-right" @click="createQRCode">
                  <view>二维码已失效</view>
                </i>
              </div>
            </div>
          </div>
          <div class="code-login" v-else="type == '3'">
            <div class="top-text">
              <view>使用 原圆就业 小程序</view>
              <view>扫码登录</view>
            </div>
            <div class="center-code">
              <image :src="qrCodeUrl" mode="aspectFit" v-if="qrCodeId && !scanStatus" />
              <div v-if="!qrCodeId" class="mask">
                <i class="el-icon-refresh-right" @click="createQRCode">
                  <view>二维码获取失败</view>
                </i>
              </div>
              <div v-if="scanStatus == 'expired'" class="mask">
                <i class="el-icon-refresh-right" @click="createQRCode">
                  <view>二维码已失效</view>
                </i>
              </div>
            </div>
          </div>
          <div class="code-text" v-if="type != '1' && type != '4'">
            <view>提示：一分钟后自动过期</view>
            <view @click="createQRCode">
              <i class="el-icon-refresh-right"></i>
              刷新二维码
            </view>
          </div>
        </div>
      </div>
    </div>
    <div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="40%"
        top="15%"
        :modal-append-to-body="false"
        :append-to-body="true"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
      >
        <el-form label-width="280px">
          <el-form-item label="请选择展位机设备" required>
            <el-select style="width: 340px" ref="select" v-model="ace711_dsc" placeholder="请选择展位机设备">
              <el-option :value="treeDataValue" style="overflow-y: scroll; height: 100%; max-height: 300px">
                <el-tree
                  default-expand-all
                  ref="tree"
                  :data="data"
                  node-key="label"
                  :props="defaultProps"
                  @node-click="handleNodeClick"
                ></el-tree>
              </el-option>
            </el-select>
            <el-button style="margin-left: 20px" type="primary" @click="queryDeviceInfo">刷新</el-button>
          </el-form-item>
          <el-form-item label="请输入校验码" required>
            <el-input placeholder="请输入校验码" v-model="ace772" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="chooseDevice">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        title="账号密码登录"
        :visible.sync="zmLoginVisible"
        width="30%"
        top="15%"
        :modal-append-to-body="false"
        :append-to-body="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
      >
        <el-form :model="zmLoginData">
          <el-form-item prop="account">
            <el-input :disabled="disabled" v-model="zmLoginData.account" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input type="password" v-model="zmLoginData.pwd" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%" :disabled="disabled" @click="loginTest">登录</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </xu-common-shell>
</template>

<script>
import moment from 'moment'
import QRCode from 'qrcode'
import defaultInfo from './component/defaule-info.vue'

export default {
  name: 'loginPage',
  components: {
    defaultInfo,
  },
  data() {
    return {
      zmLoginData: {
        account: '91510705708959823E',
        pwd: '91510705708959823E',
      },
      zmLoginVisible: false,
      options: [],
      ace711: '', //设备id
      dialogVisible: false,
      qrCodeNormal: true,
      disabled: true,
      countdown: 0,
      timer: null,
      isGetPhoneCode: false,
      companyInfo: {},
      ce23s: [],
      type: '1',
      qrCodeBase64: '',
      isGetVerifyCode: false,
      verifyCodeTimer: null,
      verifyCodeCount: 60,
      accountForm: {
        mobile: '',
        checkCode: '',
      },
      accountFormRules: {
        mobile: [
          {
            required: true,
            message: '请输入手机号!',
            trigger: 'change',
          },
        ],
      },
      verifyCodeForm: {
        mobile: '',
        verifyCode: '',
      },
      verifyCodeFormRules: {
        mobile: [
          {
            required: true,
            message: '请输入手机号码!',
            trigger: 'change',
          },
        ],
        // verifyCode: [{ required: true, message: '请输入验证码!', trigger: 'change' }]
      },
      qrCodeUrl: '',
      qrCodeId: '',
      varifyCodeId: '',
      varifyCodeImageUrl: '',
      treeDataValue: '',
      data: [],
      ace711_dsc: '',
      ace772: '', //设备校验码

      scanStatus: '',
	  timerResult: null
    }
  },
  computed: {
    defaultProps() {
      return {
        children: 'children',
        label: 'label',
      }
    },
  },
  created() {},
  mounted() {
    //清空登录信息，避免加载上一场招聘会参会单位信息
    this.$nextTick(() => {
      if (this.$loginConfig.isLogin()) {
        uni.navigateTo({
          url: '/pages/uniCenter/index',
        })
      }
    })
  },
  onShow() {
    console.log('登录页面显示')

    //清空登录信息，避免加载上一场招聘会参会单位信息
    this.$nextTick(() => {
      this.type = '1'
      this.queryDeviceInfo()
    })
    let deviceInfo_1 = uni.getStorageSync('deviceInfo_1')
    if (!deviceInfo_1) {
      this.dialogVisible = true
      this.companyInfo = {}
    }
  },

  methods: {
    moment,
    loginTest() {
      if (!this.zmLoginData.account) {
        this.$message.error('请输入账号!')
        return
      }
      if (!this.zmLoginData.pwd) {
        this.$message.error('请输入密码!')
        return
      }
      const accountForm = {
        voucher: this.zmLoginData.account,
        wordpass: this.zmLoginData.pwd,
      }
      this.$http.loginAuthRequestByAcount(accountForm)
      // this.$message.error('账号或者密码错误!')
    },

    zmLogin() {
      this.zmLoginVisible = true
    },
    chooseDevice() {
      if (!this.ace711) {
        this.$message.error('请选择设备!')
        return
      }
      if (!this.ace772) {
        this.$message.error('请输入检验码!')
        return
      }

      //验证展位机编号和校验码
      let param = {
        ace711: this.ace711,
        ace772: this.ace772,
      }
      this.$http.post(this.$requestConstant.commonRequestType, 'jy204_hrm267', null, param, true).then((res) => {
        if (res?.data?.result?.code === '0') {
          this.$message.error(res.data.result.message)
        } else {
			
          this.$message.success(res.data.result.message)
          uni.setStorageSync('deviceInfo_1', {
            ace769: '1',
            ace711: this.ace711,
            ace772: res.data.result.ace772,
          })
		  console.log(deviceInfo_1)
		  console.log(res.data.result.ace772)
		  console.log(this.ace711)
          this.dialogVisible = false
          this.disabled = true
          this.companyInfo = {}
          uni.removeStorageSync('reLanch_times')
          this.getCompanyInfo()
        }
      })
    },
    queryDeviceInfo() {
      let deviceInfo = uni.getStorageSync('deviceInfo_1')
      if (!deviceInfo) {
        this.dialogVisible = true
        this.$http
          .post(
            this.$requestConstant.commonRequestType,
            'jy204_hrm262',
            null,
            {
              ace769: '1',
            },
            true,
          )
          .then((res) => {
            this.data = res.data.ce31Pos
          })
      } else {
        this.dialogVisible = false
        this.companyInfo = {}
        this.disabled = true
        this.getCompanyInfo()
      }
    },
    getVerifyCode() {
      this.$refs.accountForm.validate((valid) => {
        if (valid) {
          this.$http
            .post(this.$requestConstant.sendCheckCodeSmsRequestType, null, null, this.accountForm, true)
            .then((res) => {
              this.isGetVerifyCode = true
              this.verifyCodeTimer = setInterval(() => {
                if (this.verifyCodeCount > 0) {
                  this.verifyCodeCount--
                } else {
                  this.isGetVerifyCode = false
                  this.verifyCodeCount = 60
                  clearInterval(this.verifyCodeTimer)
                }
              }, 1000)
            })
        }
      })
    },
    async createQRCodeBytext(text) {
      try {
        this.qrCodeUrl = await QRCode.toDataURL(text)
        console.log(this.qrCodeUrl, 'qrCodeUrl')
      } catch (error) {
        console.error(error, 'error')
      }
    },
    getScanResult() {
      const businessType = this.type == '2' ? 'dzsbk' : 'wechat_scan_login'
      const requestType = this.type == '2' ? this.$qrCodeConfig.dzsbk : this.$qrCodeConfig.wxScanLogin
      this.$loginConfig.recursionGetScanResult('get_qrcode_scan_result', businessType, this.qrCodeId, requestType)
    },
    createQRCode() {
      this.qrCodeId = ''
      this.qrCodeUrl = ''
      this.scanStatus = ''
      const businessType = this.type == '2' ? 'e_social_card' : 'we_chat_applet'
      const requestType = this.type == '2' ? this.$qrCodeConfig.dzsbk : this.$qrCodeConfig.wxScanLogin
      this.$loginConfig.getQrCode('get_qrcode', businessType, null, requestType).then((result) => {
        if (result) {
          this.qrCodeId = result.id
          this.qrCodeUrl = result.url
		  if(this.timerResult){
			  clearTimeout(this.timerResult)
		  }
		  // 循环获取展位绑定的单位id，有个接口在返回这个jy204_hrm259
		  this.timerResult = setInterval(()=>{
			  const aab001 = uni.getStorageSync('aab001')
			  if(aab001&&aab001.length>0){
				  clearTimeout(this.timerResult)
				  const businessParam = JSON.stringify({legalId:aab001})
				  this.$loginConfig
				    .recursionGetScanResult('get_qrcode_scan_result', businessType, this.qrCodeId, requestType,businessParam)
				    .then((resScan) => {
				      console.log(resScan, 'resScan')
				      if (resScan.status === 'expired') {
				        this.scanStatus = 'expired'
				      } else if (resScan.status === 'authed') {
				        this.getUserInfo(resScan)
				      }
				    })
			  }
		  },100)
        }
      })
    },
    getUserInfo({ token, accountId, userId, aab001, aac001 }) {
      let loginInfo = this.$loginConfig.getLoginInfo()
      this.$loginConfig.setToken(token)
      loginInfo.accountId = accountId
      loginInfo.user_id = userId
      loginInfo.aab001 = aab001
      loginInfo.aac001 = aac001
      this.$loginConfig.setLoginInfo(loginInfo)
      this.$http
        .post(
          this.$requestConstant.businessRequestType,
          'jy201_hrm503',
          null,
          {
            aab001: aab001,
            // aac147: user.aac147,
            aac001: aac001,
            pageNumber: 1,
            pageSize: 100,
          },
          true,
        )
        .then((data) => {
          let hr = data.data.pageBean.list[0]
          if (!hr) {
            Message.error('未查询到单位联系人信息，请到xxx网站企业中心进行hr绑定!')
            this.$http.logOut()
            return
          }
          hr.user_id = hr.acb00p
          let newUserInfo = Object.assign(loginInfo, hr)
          loginInfo.loginId = hr.acb00p
          loginInfo.name = hr.acb224
          loginInfo.mobile = hr.acb225
          this.$loginConfig.setLoginInfo(newUserInfo)
          uni.navigateTo({
            url: '/pages/uniCenter/index',
          })
        })
    },
    changeType(value) {
      if (!this.disabled) {
        this.type = value
        if (this.type != '1') {
          this.createQRCode()
        }
      }
    },
    accountLogin() {
      this.$refs.accountForm.validate((valid) => {
        if (valid) {
          if (!this.accountForm.checkCode) {
            this.$message.error('请输入验证码!')
            return
          }
          this.$http.loginAuthRequest(this.accountForm)
        }
      })
    },
    verifyCodeLogin() {
      this.$refs.verifyCodeForm.validate((valid) => {
        if (valid) {
          this.companyInfo.user_id = '1160891'
          uni.setStorageSync('loginInfo', this.companyInfo)
          this.$message.success('登录成功')
          uni.navigateTo({
            url: '/pages/uniCenter/index',
          })
        }
      })
    },
    getPhoneCode() {
      this.$refs.verifyCodeForm.validate((valid) => {
        if (valid) {
          this.isGetPhoneCode = true
          this.startCountdown()
          this.verifyCodeFormRules.verifyCode = [
            {
              required: true,
              message: '请输入验证码!',
              trigger: 'change',
            },
          ]
        }
      })
    },
    startCountdown() {
      this.countdown = 60 // 重置倒计时时间
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown -= 1
        } else {
          this.isGetPhoneCode = false
          clearInterval(this.timer)
        }
      }, 1000)
    },
    getCompanyInfo() {
      // 获取设备唯一编码
      let param = {
        ace711: uni.getStorageSync('deviceInfo_1').ace711,
        ace769: '1',
        yae100: 19,
      }
      this.$http.post(this.$requestConstant.commonRequestType, 'jy204_hrm257', null, param, false).then((res) => {
        console.log(res)

        this.companyInfo = res.data.Ab01VO
        if (this.companyInfo) {
          this.companyInfo.aab092 = this.$utils.htmlDecode(this.companyInfo.aab092)
          this.disabled = false
          // 处理头像
          this.companyInfo.aae707 = this.getFileLoadUrlOrDefault(this.companyInfo.aae707, 'header_center.png')
          // 处理宣传图片
          this.ce23s = []
          this.ce23s = res.data.Ab01VO.ce23s
          this.$loginConfig.setLoginInfo({
            aab001: this.companyInfo.aab001,
            acb330: this.companyInfo.acb330,
            acb340: this.companyInfo.acb340,
            aab004: this.companyInfo.aab004,
            aab998: this.companyInfo.aab998,
          })
        } else{
			// 没有单位信息
			this.$utils.showMessageModal('提示','该展位无参展信息')
		}
      })
    },
    handleNodeClick(data, node, nodeData) {
      if (!data.children) data.children = []
      if (!data.children.length) {
        //非最后一层 为城市，不可选为值
        this.treeDataValue = data
        this.ace711 = data.value
        this.ace711_dsc = data.label
        this.$refs.select.blur() //收起下拉框
      }
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .el-radio__inner {
  width: 25px;
  height: 25px;
  display: none;
}

/deep/ .el-dialog__body {
  padding: 30px 20px 10px;
}

/deep/ .el-radio__label {
  font-size: 22px;
}

/deep/ .el-form-item__content {
  > a {
    margin-left: 10px;
    color: #409eff;
    border-bottom: 1px solid #409eff;
    cursor: pointer;
  }

  > span {
    margin-left: 10px;
    color: #409eff;
  }
}

.mask {
  width: 298px;
  height: 294px;
  background-color: #666666;

  > i {
    width: 298px;
    height: 294px;
    font-size: 52px;
    text-align: center;
    color: #ffffff;
    cursor: pointer;
    margin: 40% auto;

    > view {
      font-size: 12px;
    }
  }
}

.login-center {
  width: 100%;
  height: 100%;

  .company-title {
    width: 834px;
    height: 81px;
    margin-left: 543px;
    display: flex;

    > image {
      width: 94px;
      height: 72px;
    }

    > view {
      margin-left: 8px;
      width: 720px;

      > view {
        height: 40px;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: bold;
        font-size: 40px;
        color: #ffffff;
        line-height: 80px;
        text-align: left;
        font-style: normal;
      }
    }
  }

  .company-info {
    width: 1836px;
    height: 784px;
    background: #ffffff;
    border-radius: 6px;
    display: flex;
    justify-content: center;

    .info-left {
      width: 1164px;
      height: 720px;
      padding: 32px 42px;

      .top-line {
        width: 1080px;
        height: 6px;
        background: #0682fe;
        border-radius: 6px;
        margin-bottom: 32px;
      }

      .center {
        width: 1080px;
        display: flex;

        .company-vedio {
          width: 648px;
          height: 389px;

          .pic_first {
            width: 648px;
            height: 389px;
          }
        }

        .default-ompany-pic {
          width: 100%;
          height: 389px;

          .pic_first {
            width: 100%;
            height: 100%;
          }
          .swiper-item {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .swiper-item image {
            width: 100%;
            height: 100%;
            border-radius: 10rpx;
          }
        }

        // .company-pic0 {
        //   display: none;
        // }

        // .company-pic1 {
        //   width: calc(100% - 304px);
        //   height: 389px;
        //   margin-left: 20px;

        //   >img {
        //     width: 100%;
        //     height: 100%;
        //   }
        // }

        // .company-pic2 {
        //   width: calc(100% - 304px);
        //   height: 389px;
        //   margin-left: 20px;

        //   >img {
        //     width: 100%;
        //     height: 49%;
        //   }
        // }

        // .company-pic3 {
        //   width: calc(100% - 304px);
        //   height: 389px;
        //   margin-left: 20px;

        //   >img:first-child {
        //     width: 100%;
        //     height: 49%;
        //   }

        //   >img:nth-child(2) {
        //     width: 49%;
        //     height: 49%;
        //   }

        //   >img:nth-child(3) {
        //     margin-left: 8px;
        //     width: 49%;
        //     height: 49%;
        //   }
        // }

        // .company-pic4 {
        //   width: calc(100% - 304px);
        //   height: 389px;
        //   margin-left: 20px;

        //   >img {
        //     width: 49%;
        //     height: 49%;
        //   }

        //   >img:nth-child(2) {
        //     margin-left: 8px;
        //   }

        //   >img:nth-child(4) {
        //     margin-left: 8px;
        //   }
        // }
      }

      .bottom-line {
        width: 1080px;
        height: 6px;
        background: #0682fe;
        border-radius: 6px;
        margin: 32px 0;
      }

      .bottom {
        width: 1080px;

        .company-name {
          width: 100%;
          height: 28px;
          font-family: SourceHanSansCNBold, SourceHanSansCNBold;
          font-weight: bold;
          font-size: 28px;
          color: #333333;
          line-height: 42px;
          text-align: left;
          font-style: normal;
        }

        .company-type {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 28px;

          > view {
            width: 320px;
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: 400;
            font-size: 20px;
            color: #666666;
            text-align: left;
            font-style: normal;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .company-desc {
          width: 1080px;
          height: 125px;
          margin-top: 26px;
          overflow: hidden;

          .title {
            width: 1080px;
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: bold;
            font-size: 20px;
            color: #666666;
            line-height: 39px;
            font-style: normal;
            display: inline;
          }

          .desc {
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-size: 16px;
            color: #666666;
            font-style: normal;
            display: inline;
          }
        }
      }
    }

    .info-right {
      width: calc(1836px - 1164px);

      .login-type {
        width: 526px;
        height: 55px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 92px 0 0 78px;
        border-bottom: 1px solid #eeeeee;

        > view {
          width: 160px;
          height: 55px;
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 400;
          font-size: 24px;
          color: #999999;
          line-height: 36px;
          text-align: center;
          font-style: normal;
          cursor: pointer;
        }
      }

      .account-login {
        width: 426px;
        height: 200px;
        border: 1px solid #eeeeee;
        padding: 50px 50px 200px 50px;
        margin: 22px 0 0 78px;
        border-radius: 8px;

        > div:first-child {
          margin-bottom: 50px;
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 400;
          font-size: 24px;
          color: #999999;
          line-height: 36px;
          text-align: center;
          font-style: normal;
        }

        .el-form-item {
          margin-bottom: 40px;
        }

        .el-button {
          width: 100%;
        }
      }

      .dzsbk-login {
        margin-top: 55px;
        width: 100%;

        .top-text {
          max-width: 400px;
          margin: 0 auto;
          display: flex;

          > view:first-child {
            margin-left: 70px;
            height: 24px;
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: 500;
            font-size: 24px;
            color: #666666;
            line-height: 36px;
            font-style: normal;
            margin-right: 10px;
          }

          > view:last-child {
            height: 24px;
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: 500;
            font-size: 24px;
            color: #0682fe;
            line-height: 36px;
            font-style: normal;
          }
        }

        .center-code {
          width: 298px;
          height: 294px;
          margin-left: 187px;
          margin-top: 75px;

          > image {
            width: 298px;
            height: 294px;
          }
        }
      }

      .code-login {
        margin-top: 55px;
        width: 100%;

        .top-text {
          max-width: 390px;
          margin: 0 auto;
          display: flex;

          > view:first-child {
            margin-left: 30px;
            height: 24px;
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: 500;
            font-size: 24px;
            color: #666666;
            line-height: 36px;
            font-style: normal;
            margin-right: 10px;
          }

          > view:last-child {
            height: 24px;
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: 500;
            font-size: 24px;
            color: #0682fe;
            line-height: 36px;
            font-style: normal;
          }
        }

        .center-code {
          width: 298px;
          height: 294px;
          margin-left: 187px;
          margin-top: 75px;

          > image {
            width: 298px;
            height: 294px;
          }
        }
      }

      .code-text {
        margin-left: 30px;

        > view {
          text-align: center;
          font-size: 18px;
          margin-top: 20px;
        }

        > view:last-child {
          color: #0682fe;
          cursor: pointer;
        }
      }
    }
  }
}

/deep/.el-form {
  .el-form-item {
    margin-bottom: 20px;

    .el-form-item__label {
      font-size: 24px;
    }

    .el-form-item__content {
      .el-form-item__error {
        font-size: 20px;
      }

      .el-input {
        font-size: 22px;
      }

      .el-button {
        font-size: 22px;
      }
    }
  }
}

/deep/.el-tree {
  height: 100%;
}
/deep/ uni-swiper {
  height: 389px;
}
</style>
