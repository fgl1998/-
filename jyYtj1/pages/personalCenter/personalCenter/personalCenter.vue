<template>
  <div class="page" style="position: relative">
    <!-- 用户中心 -->
    <common-header :key="key"></common-header>

    <div class="page-wrap">
      <div class="wrap-center">
        <div class="leftPart">
          <div class="leftPart-center">
            <div class="leftPart-title">
              <div class="title-name">
                来到太原就业自助服务
                <span style="color: #f3ea0f">个人中心</span>
              </div>
              <div class="title-text">
                您可以查看我的个人信息，完善简历，我的收藏、我的投递、我的面试，及业务办理进度
              </div>
            </div>

            <div class="code">
              <image src="../../../static/images/personalCenter/code-2.jpg" mode="aspectFit"></image>
            </div>
          </div>
        </div>
        <div class="rightPart">
          <div class="personal-wrap">
            <div class="personal-con">
              <div class="personal-lt">
                <div class="personal-head">
                  <image :src="userInfo.imgUrl" mode="scaleToFill" class="head-img"></image>
                </div>
                <div class="personal-info">
                  <div class="info-title">
                    <span class="info-name">{{ userInfo.aac003 }}</span>
                    <i :class="['ic', userInfo && userInfo.aac004 == '2' ? 'ic-girl' : 'ic-boy']"></i>
                    <span class="info-tags">{{
                      userInfo.customMap && userInfo.customMap.aae008 == '0' ? '在职' : '待岗'
                    }}</span>
                    <div style="color: #0c6af7; margin-left: 30px" @click="modifyPhone">修改手机号码</div>
                  </div>
                  <div class="info-con">
                    <div>
                      工作经验：{{
                        userInfo.customMap && userInfo.customMap.aac027
                          ? $utils.queryCodeDesc('ACC217', userInfo.customMap.aac027)
                          : '暂无'
                      }}
                    </div>

                    <div>
                      最高学历：{{
                        userInfo && userInfo.aac011 ? $utils.queryCodeDesc('AAC011', userInfo.aac011) : '暂无'
                      }}
                    </div>
                    <div>
                      联系电话：
                      <span>
                        {{
                          userInfo && userInfo.aae005
                            ? userInfo.aae005.substr(0, 3) + '****' + userInfo.aae005.substr(7, 11)
                            : '暂无'
                        }}
                      </span>
                    </div>
                    <div>工作地址：{{ userInfo && userInfo.aae006 ? userInfo.aae006 : '暂无' }}</div>
                    <div>登录方式：{{ loginType }}</div>
                  </div>
                </div>
              </div>
              <div class="personal-rt">
                <div class="file-title">
                  <span class="title-border"></span>
                  <span class="title-text">
                    <text style="color: #0c6af7">我的</text>
                    简历
                  </span>
                </div>
                <div class="file-bag">
                  <div class="bag-schedule">
                    <div class="bag-schedule-name">
                      <span class="bag-schedule-name-1">个人简历</span>
                      <span class="bag-schedule-name-2">完成度：{{ resumeCompleteness }}%</span>
                    </div>
                    <div class="bag-schedule-border">
                      <view class="progress-box">
                        <progress :percent="percent" stroke-width="8" activeColor="#379FFF;" />
                      </view>
                    </div>
                  </div>
                  <div class="bag-info">
                    <div class="bag-operation">
                      <div class="edit" @click="toEdit">编辑简历</div>
                      <div class="view" @click="toView">查看</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="personal-nav">
            <div class="nav-list">
              <div
                class="nav-item"
                v-for="(item, index) in personalNav"
                :key="index"
                @click="toPage(item, index)"
                v-show="item.type"
              >
                <div :class="['nav-img', 'nav-bg' + index]">
                  <div v-if="index == 4" class="custom">
                    <image :src="item.logo" mode="aspectFit" class="nav-logo"></image>
                  </div>
                  <div v-else-if="index == 5" class="custom5">
                    <image :src="item.logo" mode="aspectFit" class="nav-logo"></image>
                  </div>
                  <div v-else-if="index == 6" class="custom6">
                    <image :src="item.logo" mode="aspectFit" class="nav-logo"></image>
                  </div>
                  <image :src="item.logo" mode="aspectFit" class="nav-logo" v-else></image>
                </div>
                <div class="nav-name">{{ item.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div  class="projectBox">
			<uni-popup ref="popup" background-color="#fff" type="dialog">
				<uni-popup-dialog title="设备管理" border-radius="20px" :before-close="true" @confirm="dialogInputConfirm" @close="closePopup">
					<picker mode="selector" :range="pickerRange" @change="onChange" style="border:2px solid #0062cc;padding: 10px;border-radius: 5px;height: 30px">
						<view class="picker" style="font-size: 18px;">
							{{ selectValue }}
						</view>
					</picker>
				</uni-popup-dialog>
			</uni-popup>
		</div> -->

    <common-footer :userName="userInfo.aac003" :isLogin="isLogin"></common-footer>

    <common-modal-check ref="checkPopup" :tipInfo="titleTip" @triggerClick="triggerClick"></common-modal-check>

    <!-- 短信验证码认证 -->
    <uni-popup ref="smsAuth" type="center">
      <div class="popup-smsbox">
        <div>
          <image
            src="../../../static/images/login/icon_close.png"
            mode="aspectFill"
            class="icon_close"
            @click="closeOpen()"
          ></image>
        </div>
        <div class="sms-box">
          <view>短信认证</view>
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
        <div class="sms-bot">
          <image src="../../../static/images/login/icon-tip.png" mode="aspectFill" class="icon-tip"></image>
          <span>温馨提示：</span>
          <span>请先进行短信验证</span>
        </div>
      </div>
    </uni-popup>

    <div id="detailBox" v-if="showDetail">
      <div class="detailContent">
        <div class="top">
          <div class="title">办理进度查看</div>
          <div class="close" @click="showDetail = false">x</div>
        </div>
        <div class="bottom">
          <div class="wrap-list-top">
            <div class="title">事项名称</div>
            <div class="title">申请时间</div>
            <div class="title">审核结果</div>
            <div class="title">审核人</div>
            <div class="title">审核时间</div>
          </div>

          <div class="wrap-list-bottom">
            <template v-if="itemDetail.length > 0">
              <div class="content">
                <div class="text">1</div>
                <div class="text">2</div>
                <div class="text">3</div>
                <div class="text">4</div>
                <div class="text">5</div>
              </div>
              <div class="content next">
                <div class="text">1</div>
                <div class="text">2</div>
                <div class="text">3</div>
                <div class="text">4</div>
                <div class="text">5</div>
              </div>
            </template>

            <template v-else>
              <div class="nodata">
                <div class="nodata-pic">
                  <image src="../../../static/images/personalCenter/noData.png" mode="aspectFit" class="pic-img" />
                  <div class="nodata-text">暂无办理进度的数据~</div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginType: uni.getStorageSync('loginType'),
      phoneNumber: '',
      smsCode: '',
      codeText: '发送验证码',
      getSmsCode: false,
      smsCodeTimer: 60,
      resumeCompleteness: '0',
      percent: '0',
      ace711: '',
      isPopupShow: false, // 控制弹出层显示的变量
      selectedIndex: 0, // 下拉框的当前选中索引
      pickerRange: [],
      selectValue: '',
      key: 0,
      userInfo: {},
      isLogin: false,
      titleTip: '尚未创建个人简历信息,是否创建个人简历信息?',
      intent: {},
      showDetail: false,
      itemDetail: [],
      personalNav: [
        {
          logo: '../../../static/images/personalCenter/icon-1.png',
          name: '我的收藏',
          url: '/pages/personalCenter/myCollection/myCollection',
          type: true,
        },
        {
          logo: '../../../static/images/personalCenter/icon-2.png',
          name: '我的投递',
          url: '/pages/personalCenter/myApplication/myApplication',
          type: true,
        },
        {
          logo: '../../../static/images/personalCenter/icon-3.png',
          name: '我的面试',
          url: '/pages/personalCenter/myInterview/myInterview',
          type: true,
        },
        {
          logo: '../../../static/images/personalCenter/icon-4.png',
          name: '业务办理进度',
          url: '/pages/personalCenter/myProgress/myProgress',
          type: true,
        },
        {
          logo: '../../../static/images/personalCenter/icon-5.png',
          name: '职业指导记录查询',
          type: true,
          // url: '/pages/personalCenter/myProgress/myProgress'
        },
        {
          logo: '../../../static/images/personalCenter/icon-5.png',
          name: '个人参保信息',
          type: true,
          // url: '/pages/personalCenter/myProgress/myProgress'
        },
        // {
        // 	logo: '../../../static/images/personalCenter/icon-5.png',
        // 	name: '系统设置',
        // 	type: false
        // 	// url: '/pages/personalCenter/myProgress/myProgress'
        // },
        // {
        // 	logo: '../../../static/images/personalCenter/icon-5.png',
        // 	name: '设备管理',
        // 	type: true
        // }
      ],
    }
  },
  onShow: async function () {
    //用onLoad不加载
    // console.info(uni.getStorageSync('codeCacheMap'))
    this.key++
    this.userInfo = uni.getStorageSync('userInfo')
    this.ace711 = uni.getStorageSync('deviceInfo')
    if (this.ace711) {
      this.selectValue = this.ace711
    }
    if (this.userInfo.customMap && this.userInfo.customMap.aae707) {
      this.userInfo.imgUrl = this.$downLoadImgSrc + this.userInfo.customMap.aae707
    } else {
      if (this.userInfo.customMap && this.userInfo.customMap.aac004 == '2') {
        this.userInfo.imgUrl = '../../../static/images/personalCenter/head-woman.png'
      } else {
        this.userInfo.imgUrl = '../../../static/images/personalCenter/head-man.png'
      }
    }
    this.isLogin = true
    await this.getResumeInfo()
    // this.showCustom()
    this.getResumeCompleteness()
  },
  methods: {
    getSmsCodeFunction() {
      if (!this.phoneNumber) {
        this.$utils.showToast('请输入手机号码!')
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
    submitAuth() {
      if (!this.phoneNumber) {
        this.$utils.showToast('请输入手机号码!')
        return
      }
      this.getSmsCode = true
      let params = {
        phoneNumber: this.phoneNumber,
        smsCode: this.smsCode,
      }
      this.$utils.request('/api/login/authSms.do', params, true, false).then((res) => {
        this.$utils.showToast('修改手机号成功,请前往原圆就业网站或者微信小程序进行实名认证!')
        uni.setStorageSync('userInfo', '')
        uni.setStorageSync('resumeInfo', '')
        uni.setStorageSync('setToken', '')
        setTimeout(() => {
          this.$utils.navigateTo('/pages/index/index')
        }, 2000)
        clearInterval(uni.getStorageSync('timerTask'))
      })
    },
    modifyPhone() {
      this.$refs.smsAuth.open()
    },
    closeOpen() {
      this.$refs.smsAuth.close()
    },
    getResumeInfo() {
      const url = '/api/business/invoke'
      let param = {
        aac001: this.userInfo.aac001,
        isSelf: '1',
        method: 'jy202_hrm1194',
      }
      return this.$utils.request(url, param, true, true, 'cipher').then((res) => {
        this.acc200 = res.resumeMap?.baseInfo?.acc200
        const { aac011Desc, aac003, aac011, aae005, aae006, aac004 } = res?.resumeMap?.baseInfo
        this.userInfo = { ...this.userInfo, aac011Desc, aac003, aac011, aae005, aae006, aac004 }
        return this.acc200
      })
    },
    getResumeCompleteness() {
      if (!this.acc200) {
        return
      }
      let param = {
        acc200: this.acc200,
        method: 'jy202_hrm157',
      }
      this.$utils.request('/api/business/invoke', param, true, true, 'cipher').then((res) => {
        if (res && res.result) {
          this.resumeCompleteness = res.result.rate
          this.percent = res.result.rate
        } else {
          this.resumeCompleteness = 0
        }
      })
    },
    getDeviceInfo() {
      this.pickerRange = []
      let param = {
        ace769: '7',
        apiCode: 'jy204_hrm262',
      }
      this.$utils.request(null, param, true, false, null).then((res) => {
        let result = res.data.data
        result.forEach((item) => {
          this.pickerRange.push(item.label + '(' + item.value + ')')
        })
        this.selectValue = this.pickerRange[this.selectedIndex]
      })
    },
    dialogInputConfirm() {
      if (this.selectValue) {
        let ace711 = this.selectValue.split('(')[1].split(')')[0]
        uni.setStorageSync('ace711', ace711)
      }
      this.closePopup()
    },
    onChange(e) {
      this.selectedIndex = e.detail.value
      this.selectValue = this.pickerRange[this.selectedIndex]
    },
    showPopup() {
      // this.isPopupShow = true; // 显示弹出层
      this.$refs.popup.open()
      this.getDeviceInfo()
    },
    closePopup() {
      this.$refs.popup.close()
    },
    onPickerChange(e) {
      this.pickerIndex = e.detail.value // 更新下拉框的选中索引
    },
    toPage: function (item, index) {
      if (index == '3') {
        // this.showDetail = true
        // this.itemDetail = item
        this.$utils.showToast('一体机暂无政务服务的功能，请登录微信小程序或者网站查看')
        //this.$utils.showToast('该功能正在开发中，请耐心等候');
      } else if (index == '2') {
        this.$utils.showToast('该功能正在开发中，请耐心等候')
      } else if (index == '4') {
        //系统设置
        // Intent intent = new Intent(Settings.ACTION_SETTINGS);
        // startActivity(intent);
        // var main = plus.android.runtimeMainActivity();

        // // 通过反射获取Android的Intent对象
        // var Intent = plus.android.importClass('android.content.Intent');
        // // 通过宿主上下文创建 intent
        // this.intent = new Intent('android.settings.SETTINGS'); // 设置要开启的Activitv包类路径
        // main.startActivity(this.intent);
        // var main = plus.android.runtimeMainActivity()
        // var Context = plus.android.importClass('android.content.Context')
        // var PackageManager = plus.android.importClass('android.content.pm.PackageManager')
        // var Settings = plus.android.importClass('android.provider.Settings')
        this.$utils.showToast('该功能正在开发中，请耐心等候')
      } else if (index == '5') {
        //this.showPopup();
        this.$utils.showToast('该功能正在开发中，请耐心等候')
      } else if (index == '6') {
        this.showPopup()
      } else {
        this.$utils.navigateTo(item.url)
      }
    },

    toView: function () {
      if (!this.acc200) {
        this.$utils.showToast('暂无简历，请前往微信小程序或者网站创建简历')
        return
      }
      this.$utils.navigateTo('/pages/personalCenter/myResume/myResume')
    },
    triggerClick() {
      this.$utils.navigateTo('/pages/personalCenter/resumeEdit/resumeEdit')
    },

    showCustom() {
      let param = {
        aac147: this.userInfo.customMap.aac147,
        method: 'jy204_hrm260',
      }
      this.$utils.request('/api/business/invoke', param, true, true, 'cipher').then((res) => {
        if (typeof res.data == 'object' && res.data.data) {
          this.personalNav[4].type = true
          this.personalNav[5].type = true
        }
      })
    },

    toEdit() {
      if (!this.acc200) {
        this.$utils.showToast('暂无简历，请前往微信小程序或者网站创建简历')
        return
      }
      let _this = this
      let param = {
        aac001: this.userInfo.aac001,
        isSelf: '1',
        method: 'jy202_hrm1194',
      }
      this.$utils.request('/api/business/invoke', param, true, true, 'cipher').then((res) => {
        if (res.message == '尚未创建个人简历信息') {
          //尚未创建个人简历信息
          this.$refs.checkPopup.open()
          return
        }
        this.$utils.navigateTo(
          '/pages/personalCenter/resumeEdit/resumeEdit?isEdit=true&item=' +
            encodeURIComponent(JSON.stringify(res.resumeMap)),
        )
      })
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .uni-popup__wrapper {
  width: 500px;
  //height: 200px;
  font-size: 26px;
  border-radius: 20px;
}
/deep/ .uni-dialog-title {
  width: 500px;
}
/deep/ .uni-dialog-content {
  width: 500px;
  height: 100px;
  padding: 0;
}
/deep/ .uni-dialog-button-group {
  width: 500px;
}
.leftPart {
  width: 340px;
  height: 760px;
  background: url('../../../static/images/personalCenter/left-bg.png') center no-repeat;
  float: left;
  position: relative;
  .leftPart-center {
    position: absolute;
    top: 169px;
    left: 30px;
    width: 260px;
    height: 493px;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    .leftPart-title {
      .title-name {
        width: 100%;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 18px;
        color: #ffffff;
        line-height: 21px;
        text-align: center;
        font-style: normal;
        text-transform: none;
      }
      .title-text {
        margin-top: 20px;
        width: 100%;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        line-height: 20px;
        text-align: center;
        font-style: normal;
        text-transform: none;
      }
    }
    .code {
      width: 160px;
      height: 160px;
      border-radius: 4px 4px 4px 4px;
      box-sizing: border-box;
      padding: 10px;
      margin: 0 auto;
      overflow: hidden;
      image {
        width: 140px;
        height: 140px;
      }
    }
  }
}
.rightPart {
  width: 1420px;
  height: 760px;
  float: right;
  box-sizing: border-box;
  padding: 0 90px;
  .personal-wrap {
    width: 100%;
    height: 426px;
    padding: 90px 0 56px;
    box-sizing: border-box;

    .personal-title {
      font-family: MicrosoftYaHei;
      font-size: 26px;
      line-height: 36px;
      position: relative;
      padding-left: 20px;
      margin-bottom: 38px;

      &:before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        width: 8px;
        height: 8px;
        background: #999999;
        border-radius: 50%;
      }

      span {
        color: #2778ff;
        margin-left: 10px;
      }
    }

    .personal-con {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .personal-lt {
        display: flex;
        justify-content: space-between;

        width: 900px;
        overflow: hidden;
        .personal-head {
          width: 220px;
          height: 280px;
          border: dashed 1px #666;

          .head-img {
            width: 100%;
            height: 100%;
          }
        }

        .personal-info {
          width: 610px;
          .info-title {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 38px;

            .info-name {
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              font-size: 36px;
              color: rgba(0, 0, 0, 0.9);
              line-height: 42px;
              text-align: left;
              font-style: normal;
              text-transform: none;
              margin-right: 10px;
            }

            .info-tags {
              margin-left: 20px;
              width: 60px;
              padding: 0 10px;
              height: 24px;
              background: #ffe0e0;
              border-radius: 4px 4px 4px 4px;
              border: 1px solid #ffd3cf;
              width: 36px;
              height: 25px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 400;
              font-size: 18px;
              color: #eb3527;
              line-height: 25px;
              text-align: center;
              font-style: normal;
              text-transform: none;
            }
          }

          .info-con {
            div {
              font-size: 24px;
              line-height: 38px;
              color: #404040;
              padding-bottom: 16px;

              span {
                color: #188cf8;
              }
            }
          }
        }
      }

      .personal-rt {
        width: 320px;
        height: 100%;
        .file-title {
          width: 100%;
          height: 35px;
          margin-bottom: 20px;
          .title-border {
            display: inline-block;
            width: 8px;
            height: 23px;
            background: #0c6af7;
            border-radius: 2px 2px 2px 2px;
            vertical-align: middle;
            margin-right: 10px;
          }
          .title-text {
            display: inline-block;
            width: 200px;
            height: 35px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 600;
            font-size: 24px;
            color: #333;
            line-height: 35px;
            text-align: left;
            font-style: normal;
            text-transform: none;
            vertical-align: middle;
          }
        }

        .file-bag {
          width: 320px;
          height: 173px;
          background: #eff6ff;
          border-radius: 6px 6px 6px 6px;
          box-sizing: border-box;
          padding: 30px;

          .bag-schedule {
            height: 65px;
            .bag-schedule-name {
              width: 100%;
              display: flex;
              justify-content: space-between;
              height: 40px;
              .bag-schedule-name-1 {
                width: calc(100% - 110px);
                height: 28px;
                font-family: PingFang SC, PingFang SC;
                font-weight: 600;
                font-size: 20px;
                color: rgba(0, 0, 0, 0.9);
                line-height: 28px;
                text-align: left;
                font-style: normal;
                text-transform: none;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .bag-schedule-name-2 {
                width: 100px;
                height: 28px;
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                font-size: 14px;
                color: rgba(0, 0, 0, 0.6);
                line-height: 28px;
                text-align: right;
                font-style: normal;
                text-transform: none;
              }
            }
          }

          .bag-info {
            text-align: center;
            width: 100%;
            font-size: 16px;
            line-height: 30px;
            color: #704607;
            .bag-operation {
              width: 100%;
              display: flex;
              justify-content: space-around;
              .view {
                width: 120px;
                height: 48px;
                background: #0c6af7;
                border-radius: 4px 4px 4px 4px;
                border: 1px solid #a2a7a9;
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                font-size: 18px;
                color: #fff;
                line-height: 48px;
                text-align: center;
                font-style: normal;
                cursor: pointer;
              }
              .edit {
                width: 120px;
                height: 48px;
                background: #ffffff;
                border-radius: 4px 4px 4px 4px;
                border: 1px solid #a2a7a9;
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                font-size: 18px;
                color: rgba(0, 0, 0, 0.9);
                line-height: 48px;
                text-align: center;
                font-style: normal;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
}

.personal-nav {
  border-top: 1px dashed #dddddd;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  padding: 80px 0;
  .nav-list {
    display: flex;
    justify-content: space-around;
    align-items: center;

    .nav-item {
      text-align: center;
      cursor: pointer;
      .nav-img {
        display: inline-block;
        width: 120px;
        height: 120px;
        line-height: 120px;
        margin-bottom: 10px;
        text-align: center;
        .custom {
          width: 100px;
          height: 100px;
          background: #f00;
          margin: 5px auto;
          border-radius: 50%;
          padding: 10px;
          box-sizing: border-box;
          box-shadow: 0 9px 10px 1px #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          image {
            width: 60px;
            height: 60px;
          }
        }
        .custom5 {
          width: 100px;
          height: 100px;
          background: #188cf8;
          margin: 5px auto;
          border-radius: 50%;
          padding: 10px;
          box-sizing: border-box;
          box-shadow: 0 9px 10px 1px #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          image {
            width: 60px;
            height: 60px;
          }
        }
        .custom6 {
          width: 100px;
          height: 100px;
          background: orange;
          margin: 5px auto;
          border-radius: 50%;
          padding: 10px;
          box-sizing: border-box;
          box-shadow: 0 9px 10px 1px #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          image {
            width: 60px;
            height: 60px;
          }
        }
        .nav-logo {
          width: 100%;
          height: 100%;
          display: inline-block;
          vertical-align: middle;
        }
      }

      .nav-name {
        width: 100%;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 26px;
        color: rgba(0, 0, 0, 0.9);
        line-height: 40px;
        text-align: center;
        font-style: normal;
        text-transform: none;
      }
    }
  }
}
.popup-smsbox {
  width: 522px;
  height: 560px;
  border-radius: 20px;
  background: url('../../../static/images/login/bg_top.png') center top no-repeat;
  background-color: #ffffff;
  background-size: contain;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  > div:first-child {
    text-align: right;
    padding: 20px 30px 0 30px;
  }
  .icon_close {
    width: 34px;
    height: 34px;
  }
  .sms-box {
    width: 402px;
    margin: 0 auto;
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
  .sms-bot {
    width: 100%;
    height: 64px;
    position: absolute;
    bottom: 0;
    left: 0;
    background: #e5eefc;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon-tip {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }
    > span:nth-of-type(1) {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 18px;
      color: #f34058;
    }
    > span:nth-of-type(2) {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 18px;
      color: rgba(0, 0, 0, 0.5);
    }
  }

  // justify-content: space-around;
  // flex-direction: column;
}
.projectBox /deep/ .uni-popup__wrapper {
  width: 500px;
  // height: 500px;
}

#detailBox {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  .detailContent {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    width: 1200px;
    height: 800px;
    background: #fff;
    border-radius: 15px;
    .top {
      width: 100%;
      height: 60px;
      line-height: 60px;
      display: flex;
      justify-content: space-between;
      justify-items: center;
      align-items: center;
      background: #0c6af7;
      border-radius: 15px 15px 0 0;
      .title {
        width: 80%;
        font-size: 26px;
        height: 60px;
        text-indent: 30px;
        font-weight: bold;
        color: #fff;
      }
      .close {
        width: 30px;
        height: 30px;
        line-height: 25px;
        margin-right: 20px;
        color: #fff;
        font-size: 30px;
        border-radius: 50%;
        text-align: center;
        border: 2px solid #fff;
        cursor: pointer;
      }
    }
    .bottom {
      height: calc(100% - 100px);
      width: calc(100% - 40px);
      margin: 20px;
      box-sizing: border-box;
      border: 1px solid #f0f2f5;
      .wrap-list-top {
        width: 100%;
        height: 60px;
        box-sizing: border-box;
        //padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #eaeaea;
        .title {
          width: 20%;
          height: 60px;
          line-height: 60px;
          text-align: center;
          color: #333;
          font-size: 20px;
          font-weight: bold;
        }
      }
      .wrap-list-bottom {
        width: 100%;
        height: calc(100% - 120px);
        //	border: 1px solid #f0f2f5;
        .content {
          width: 100%;
          height: 55px;
          line-height: 55px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .text {
            width: 20%;
            height: 100%;
            text-align: center;
            font-size: 18px;
            color: #333;
          }
        }
        .next {
          background: #f0f2f5;
          color: #333;
        }
      }
    }
  }
}

.pic-img {
  width: 100%;
}
</style>
