<template>
  <view class="workBlack">
    <view id="commonWork">
      <view class="workHead">
        <image src="../../static/images/icon_head1.png"></image>
        <view
          >岗位信息情况:<span>{{ workInfo.title }}</span></view
        >
        <image src="../../static/images/close.png" @click="closeWork"></image>
      </view>
      <view class="workBox">
        <view>
          <view class="top">
            <view><image :src="imageUrl"></image></view>
            <view class="infoWork">
              <view>
                <view>{{ workInfos.aab004 }}</view>
                <view>{{ workInfos.acb21h }}-{{ workInfos.acb21j }}</view>
              </view>
              <view>
                <view>
                  <view>薪资福利:</view>
                  <view v-for="(item, index) in workInfos.acb214List" :key="index" v-show="index < 4">
                    {{ item }}
                  </view>
                </view>
                <view @click="openValue(workInfos.acb217, 621)">
                  <image src="../../static/images/potion.png"></image>
                  <view>{{ workInfos.acb217 }}</view>
                </view>
                <view @click="openValue(workInfos.acc217_dsc, 750)">
                  <image src="../../static/images/jingyan.png"></image>
                  <view>{{ workInfos.acc217_dsc }}</view>
                </view>
                <view @click="openValue(workInfos.aac011_dsc, 846)">
                  <image src="../../static/images/xueli.png"></image>
                  <view>{{ workInfos.aac011_dsc }}</view>
                </view>
              </view>
              <view
                >职位介绍:<span>{{ workInfos.acb216 }}</span></view
              >
              <view class="model" :style="widthNum" v-show="modelShow">{{ modelValue }}</view>
            </view>
          </view>
          <view class="content">
            <view>
              <view class="header">
                <view>
                  <image src="../../static/images/tittle@2x.png"></image>
                  <view>方法一</view>
                </view>
                <view> 手动录入或使用<span>身份证/社保卡</span>进行录入 </view>
              </view>
              <view class="line">
                <view></view>
                <view></view>
              </view>
              <view class="inputs">
                <view>姓名:</view>
                <input
                  class="uni-input"
                  v-model="personName"
                  @input="onKeyInput"
                  placeholder="请输入您的姓名"
                  placeholder-class="placeholder_text"
                />
              </view>
              <view class="inputs">
                <view>身份证号码:</view>
                <input
                  class="uni-input"
                  v-model="personCard"
                  type="idcard"
                  placeholder="请输入您的身份证号"
                  placeholder-class="placeholder_text"
                />
              </view>
              <view class="inputs">
                <view>联系电话:</view>
                <input
                  class="uni-input"
                  v-model="personPhone"
                  type="number"
                  placeholder="请输入您的联系电话"
                  placeholder-class="placeholder_text"
                />
              </view>
              <view class="inputs">
                <view>最高学历:</view>
                <input
                  class="uni-input"
                  v-model="personClass"
                  @input="onKeyInput"
                  placeholder="请输入您的学历信息"
                  placeholder-class="placeholder_text"
                />
              </view>
              <view class="btnBox">
                <view>
                  <image src="../../static/images/idCard.png"></image>
                  <view @click="getInfo">身份证录入</view>
                </view>
                <view>
                  <image src="../../static/images/shebao.png"></image>
                  <view @click="getInfo">社保卡录入</view>
                </view>
              </view>
            </view>
            <view class="line1"></view>
            <view>
              <view class="header">
                <view>
                  <image src="../../static/images/tittle@2x.png"></image>
                  <view>方法二</view>
                </view>
                <view> 微信扫描<span>二维码</span>投递该岗位 </view>
              </view>
              <view class="line">
                <view></view>
                <view></view>
              </view>
              <view id="weima">
                <image src="../../static/images/erweima.png"></image>
              </view>
            </view>
          </view>
          <view class="bottom" @click="resumeOk"> 确认投递 </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'commonWork',
  props: ['workInfos', 'workFLag'],
  data() {
    return {
      workInfo: {
        title: '中级JAVA开发工程师',
        company: '四川久远银海软件股份有限公司',
        xinzi: '17-30K·14薪',
        fuli: ['五险一金', '带薪年假', '餐费补助', '年度旅游'],
        dizhi: '成都市',
        jingyan: '3-5年',
        xueli: '本科',
        infomation:
          '1.负责产品核心功能模块的代码开发工作； 2.参与需求调研、需求分析、概要设计、详细设计；3.为公司发展尽心尽力，不留余力，成为一代英豪。',
      },
      personName: '',
      personCard: '',
      personPhone: '',
      personClass: '',
      widthNum: 'left: 700px;',
      modelShow: false,
      modelValue: '',
      timer: '',
      imageUrl: require('../../static/images/logo@2x.png'),
    }
  },
  watch: {
    workFLag: function (value) {
      // //console.log(this.workInfos);
      if (value) {
        if (this.workInfos.aae707) {
          this.imageUrl =
            this.$host +
            '/api/base/downloadBusinessFile.do?fileId=' +
            this.workInfos.aae707 +
            '&channelCode=sc&sysCode=jyplat'
        }
      }
    },
  },
  onLoad() {},
  methods: {
    onKeyInput() {},
    closeWork() {
      this.$emit('closeWork', false)
      this.personName = ''
      this.personCard = ''
      this.personPhone = ''
      this.personClass = ''
    },
    getInfo() {
      this.personName = '朱元璋'
      this.personCard = '510521199805091254'
      this.personPhone = '13018276501'
      this.personClass = '本科'
    },
    openValue(value, num) {
      clearTimeout(this.timer)
      this.widthNum = 'left: ' + num + 'px;'
      this.modelShow = true
      this.modelValue = value
      this.timer = setTimeout(() => {
        this.modelShow = false
      }, 2000)
    },
    resumeOk() {
      let aac002 = this.personCard
      let flag = this.$check.getIdCardMsg(aac002)
      if (!flag.pass) {
        this.$utils.showToast('身份证格式有误！')
        return
      }

      let loginInfo = this.$loginConfig.getLoginInfo()
      const params = {
        apiCode: 'jy201_hrm208',
        method: 'jy201_hrm208',
        aac002: this.personCard,
        aac003: this.personName,
        acb210: this.workInfos.acb210,
        acc04u: 1,
        yae100: 19,
        acb330: loginInfo.acb330,
      }
      this.$http.request('/api/business/getData.do', 'post', params, true).then((res) => {
        // //console.log(res);
        if (res.errors.length > 0) {
          uni.showToast({
            title: res.errors[0].msg,
            duration: 2000,
            icon: 'none',
          })
        } else {
          uni.showToast({
            title: '简历投递成功',
            duration: 2000,
          })
          this.closeWork()
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.workBlack {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  top: 0;
  left: 0;
  z-index: 100;
}
#commonWork {
  position: absolute;
  width: 1136px;
  height: 788px;
  border-radius: 8px;
  z-index: 99;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translateX(-50%) translateY(-50%);
  background-color: #ffffff;
}
.workHead {
  width: 1088px;
  height: 68px;
  background: #0682fe;
  border-radius: 8px 8px 0px 0px;
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
    margin: 0px 251px 0px 12px;
    white-space: nowrap;
  }
}
.workBox {
  > view {
    width: 1088px;
    margin: 23px auto 0px auto;
  }
}
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  > view:first-child {
    width: 127px;
    height: 114px;
    border-radius: 8px;
    border: 1px solid #eeeeee;
    text-align: center;
    padding-top: 12px;
    > image {
      width: 113px;
      height: 103px;
    }
  }
  > view:last-child {
    width: 935px;
  }
}
.infoWork {
  position: relative;
  > view:first-child {
    display: flex;
    align-items: center;
    justify-content: space-between;
    > view:first-child {
      font-size: 32px;
      font-weight: bold;
      color: #172e61;
    }
    > view:last-child {
      height: 24px;
      font-size: 24px;
      font-weight: bold;
      color: #fe2d17;
      line-height: 36px;
    }
  }
  > view:nth-child(2) {
    display: flex;
    align-items: center;
    margin-top: 12px;
    > view:first-child {
      width: 484px;
      display: flex;
      align-items: center;
      > view {
        width: 80px;
        height: 32px;
        background: #f8f8f8;
        border-radius: 4px;
        text-align: center;
        line-height: 32px;
        font-size: 16px;
        font-weight: 400;
        color: #666666;
        margin-right: 20px;
      }
      > view:first-child {
        width: 100px;
        height: 20px;
        background-color: #ffffff;
        text-align: left;
        line-height: 20px;
        margin-right: 0px;
      }
    }
    > view:nth-child(2) {
      display: flex;
      align-items: center;
      margin-left: 70px;
      > image {
        width: 17px;
        height: 19px;
        margin-right: 8px;
      }
      > view {
        width: 85px;
        height: 30px;
        font-size: 20px;
        font-weight: 400;
        color: #333333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    > view:nth-child(3) {
      display: flex;
      align-items: center;
      margin-left: 40px;
      > image {
        width: 20px;
        height: 18px;
        margin-right: 8px;
      }
      > view {
        width: 72px;
        height: 30px;
        font-size: 20px;
        font-weight: 400;
        color: #333333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    > view:nth-child(4) {
      display: flex;
      align-items: center;
      margin-left: 40px;
      > image {
        width: 20px;
        height: 17px;
        margin-right: 8px;
      }
      > view {
        width: 62px;
        height: 30px;
        font-size: 20px;
        font-weight: 400;
        color: #333333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  > view:nth-child(3) {
    margin-top: 8px;
    width: 918px;
    font-size: 20px;
    font-weight: 400;
    color: #999999;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  > view.model {
    position: absolute;
    background-color: #f3f7ff;
    color: #0682fe;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    padding: 0px 20px 0px 20px;
    border-radius: 10px;
    white-space: nowrap;
    top: 21px;
    left: 100px;
  }
}
.content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 2px dashed #eeeeee;
  border-bottom: 2px dashed #eeeeee;
  margin-top: 29px;
  > .line1 {
    width: 1px;
    height: 422px;
    border-radius: 4px;
    background-color: #eeeeee;
  }
  > view {
    height: 398px;
    padding-top: 24px;
    > .line {
      margin-top: 12px;
      > view:first-child {
        width: 76px;
        height: 4px;
        background: #0682fe;
        border-radius: 2px;
      }
      > view:last-child {
        width: 512px;
        height: 2px;
        background-color: #eeeeee;
      }
    }
  }
  > view:first-child {
    .line {
      margin-bottom: 24px;
    }
  }

  > view {
    width: 512px;
  }
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  > view:first-child {
    display: flex;
    align-items: center;
    > image {
      width: 7px;
      height: 19px;
      margin-right: 8px;
    }
    > view {
      font-size: 20px;
      font-weight: bold;
      color: #333333;
    }
  }
  > view:last-child {
    font-size: 20px;
    font-weight: 400;
    color: #999999;
    > span {
      font-weight: bold;
      color: #0682fe;
      margin: 0px 12px 0px 12px;
    }
  }
}
.inputs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  > view {
    height: 54px;
    font-size: 18px;
    font-weight: 400;
    color: #333333;
    line-height: 54px;
  }
  > input {
    width: 380px;
    height: 54px;
    border-radius: 4px;
    border: 1px solid #eeeeee;
    font-size: 18px;
  }
}
.btnBox {
  width: 100%;
  display: flex;
  align-items: center;
  > view {
    width: 178px;
    height: 38px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    cursor: pointer;
    > view {
      height: 38px;
      font-size: 18px;
      font-weight: 400;
      color: #ffffff;
      line-height: 38px;
    }
  }
  > view:first-child {
    background: linear-gradient(180deg, #feb838 0%, #f36103 100%);
    margin-left: 130px;
    > image {
      width: 19px;
      height: 15px;
      margin-left: 31px;
      margin-right: 7px;
    }
  }
  > view:last-child {
    background: linear-gradient(180deg, #00e7fb 0%, #00a9c0 100%);
    margin-left: 24px;
    > image {
      width: 14px;
      height: 18px;
      margin-left: 33px;
      margin-right: 8px;
    }
  }
}
#weima {
  width: 100%;
  height: 344px;
  text-align: center;
  margin-top: 14px;
  > image {
    width: 320px;
    height: 320px;
  }
}
.bottom {
  width: 200px;
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
</style>
<style>
.placeholder_text {
  margin-left: 20px;
}
</style>
