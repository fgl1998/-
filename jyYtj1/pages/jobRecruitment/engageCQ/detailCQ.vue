<template>
  <div class="page">
    <!-- 职位详情 -->
    <common-header></common-header>

    <div class="page-wrap">
      <div class="wrap-center">

        <div class="work-wrap wrap-box">
          <div class="wrap-con" style="height: 65px;">
            <div class="wrap-title">
              <div class="title-lt">
                <div class="lt-text"> <span><text style="color:#0C6AF7 ">重庆</text> 招聘专区 </span> /职位详情介绍，原圆就业伴你行
                </div>
              </div>
              <div class="title-rt rt-address">
                <div>
                  <image src="../../../static/images/findWork/icon_home.png" mode="aspectFit" class="icon_home"></image>
                  <span>首页&nbsp;&gt;&nbsp;重庆招聘专区&nbsp;&gt;&nbsp;工作详情</span>
                </div>
              </div>
            </div>
          </div>
          <div class="work-top">
            <div class="top-lt">
              <div class="work-title">
                <div class="work-name">{{workInfo.postName}}</div>
                <div class="work-money" v-if="workInfo.moneyFlag">
                  薪资待遇：
                  <span>薪资面议</span>
                </div>
                <div class="work-money" v-else>
                  薪资待遇：
                  <span>{{(workInfo.salaryMin&&workInfo.salaryMax) ?  (workInfo.salaryMin != workInfo.salaryMax) ? workInfo.salaryMin + '~' + workInfo.salaryMax : workInfo.salaryMin : ''}}</span>
                  <span>{{workInfo.salaryMin&&!workInfo.salaryMax ? workInfo.salaryMin + '以上':''}}</span>
                  <span>{{!workInfo.salaryMin&&workInfo.salaryMax ? workInfo.salaryMax + '以下':''}}</span>
                  <span>{{!workInfo.salaryMin&&!workInfo.salaryMax ? '薪资面议' :''}}</span>
                  <label>{{workInfo.salaryMin||workInfo.salaryMax ? '元/月' : ''}}</label>
                </div>
              </div>
              <div class="work-address">
                <span v-show="workInfo.townshipAreaName">{{workInfo.townshipAreaName}}</span>
                <span v-show="workInfo.headcount">|</span>
                <span v-show="workInfo.headcount">招聘人数:{{workInfo.headcount}}</span>
                <span v-show="workInfo.monthSalary">|</span>
                <span v-show="workInfo.monthSalary">{{workInfo.monthSalary}}薪</span>
              </div>
            </div>
            <div class="top-rt">
              <div class="work-operation">
                <div>
                  <div class="btn-div btn-send" @click="openSend" style="margin: 0 0 0 20px !important;"
                    v-if="acc300">
                    <image src="../../../static/images/findWork/icon_vector.png" mode="aspectFit" class="icon_vector">
                    </image>
                    <span>取消投递</span>
                  </div>
                  <div class="btn-div btn-send" @click="sendOpen" v-else style="margin: 0 0 0 20px !important;">
                    <image src="../../../static/images/findWork/icon_vector.png" mode="aspectFit" class="icon_vector">
                    </image>
                    <span>投递简历</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="work-bottom">
            <div :class="isAab001 ? 'bottom-lt' : 'bottom-lt-none'">
              <div class="main-title">
                <div>职位信息</div>
              </div>
              <div class="bottom-box">
                <div class="bottom-title">
                  <div class="title-blt">岗位描述：</div>
                </div>
                <div class="bottom-con2" v-if="workInfo.postRemark">
                  <common-scroll>
                    <div class="decr-box">
                      <p v-dompurify-html="workInfo.postRemark"></p>
                    </div>
                  </common-scroll>
                </div>
                <div class="no-data" v-else>
                  <img src="../../../static/images/ic_no_data.png" />
                  <p>发布者还未录入</p>
                </div>
                <div class="person-bot">
                  <div class="bottom-title">
                    <div class="title-blt">发布时间：</div>
                    <div class="bottom-con3" v-if="workInfo.releaseTime">
                      <common-scroll>
                        <div class="decr-box">
                          <p>{{workInfo.releaseTime}}</p>
                        </div>
                      </common-scroll>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bottom-rt" v-if="isAab001">
              <div class="main-title">
                <div>企业信息</div>
              </div>
              <div class="bottom-box h40">
                <div class="bottom-con">
                  <div class="unit-box">
                    <div class="unit-info">
                      <div class="uinfo-lt">
                        <div class="uinfo-logo">
                          <image :src="unitInfo.enterpriseLogo" mode="aspectFill" class="headImg"></image>
                        </div>
                      </div>
                      <div class="uinfo-rt">
                        <div class="unit-title">
                          <div class="unit-name">{{unitInfo.enterpriseName}}</div>
                        </div>
                        <p>统一社会信用代码：{{unitInfo.enterpriseUnifiedCreditCode?unitInfo.enterpriseUnifiedCreditCode:'未知'}}
                        </p>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bottom-box h40" style="padding-top: 0;">
                <div class="bottom-con">
                  <div class="bottom-title">
                    <div class="title-blt">企业简介：</div>
                  </div>
                  <div class="bottom-con2" v-if="workInfo.enterpriseBasic">
                    <div class="decr-box right-unit">
                      <p v-dompurify-html="workInfo.enterpriseBasic"></p>
                    </div>
                  </div>
                  <div class="no-data" v-else>
                    <img src="../../../static/images/ic_no_data.png" />
                    <p>暂无企业简介信息</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <common-footer :userName="userInfo.aac003" :isLogin="isLogin"></common-footer>
    <common-modal ref="modalPopup"></common-modal>
    <common-modal-check ref="checkPopup" :tipInfo='titleTip' :typeCheck="typeCheck"
      @triggerClick="triggerClick"></common-modal-check>
  </div>
</template>

<script>
  export default {
    name: 'detailCQ',
    onLoad(option) {
      const objValue = JSON.parse(option.item)
      if (objValue) {
        this.workInfo = {
          ...objValue
        }
        this.unitInfo = {
          ...objValue
        }
        if (objValue.enterpriseName) {
          this.isAab001 = true
        }
      }
      this.userInfo = uni.getStorageSync("userInfo");
      if (this.userInfo) {
        this.isLogin = true;
        this.init();
      } else {
        this.isLogin = false;
      }
    },
    data() {
      return {
        userInfo: {},
        workInfo: {},
        unitInfo: {},
        isLogin: false,
        isAab001: false,
        acc300: '',
        titleTip: '',
        typeCheck: '1',
      }
    },
    methods: {
      init() {
        const param = {
          aac001: this.userInfo.aac001,
          acb210: this.workInfo.postInformationId,
        };
        this.$utils.request('/api/businessCommon/getData/jy291_service03', param, true, false, 'cipher').then(res => {
          if (!res.serviceSuccess) {
            this.$utils.showToast("调用服务异常")
            return
          } else {
            if (res.data.delivered) {
              this.acc300 = res.data.acc300
            }
          }
        })
      },
      sendOpen() {
        if (!this.isLogin) {
          this.$refs.modalPopup.open()
          return
        }
        if (!this.workInfo.acb210 && !this.userInfo.aac001) {
          this.$utils.showToast("未获取到职位详情，不可投递");
          return
        }
        if (!this.userInfo.customMap.acc200) {
          this.titleTip = '尚未创建个人简历信息,是否创建个人简历信息?'
          this.typeCheck = '2'
          this.$refs.checkPopup.open()
          return
        }
        this.send()
      },
      // 投递简历
      send() {
        let param = {
          aac001: this.userInfo.aac001,
          acb210: this.workInfo.postInformationId,
          acc200: this.userInfo.customMap.acc200,
          yae100: "14"
        };
        console.log(this.workInfo);
        this.$utils.request('/api/businessCommon/getData/jy291_service04', param, true, false, 'cipher').then(res => {
          if (!res.serviceSuccess) {
            this.$utils.showToast("投递失败，请重试");
          } else {
            this.titleTip = '投递成功'
            this.typeCheck = '3'
            this.$refs.checkPopup.open()
          }
        })
      },
      cancelSend () {
        let param = {
          // aac001: this.userInfo.aac001,
          // acb210: this.workInfo.postInformationId,
          acc300: this.acc300,
          // yae100: "14"
        };
        console.log(this.workInfo);
        this.$utils.request('/api/businessCommon/getData/jy291_service05', param, true, false, 'cipher').then(res => {
          if (!res.serviceSuccess) {
            this.$utils.showToast("取消投递失败，请重试");
          } else {
            this.titleTip = '取消投递成功'
            this.typeCheck = '3'
            this.acc300 = ''
            this.$refs.checkPopup.open()
          }
        })
      },
      openSend() {
        this.titleTip = '确认是否撤销投递岗位'
        this.typeCheck = '1'
        this.$refs.checkPopup.open()
      },
      triggerClick(type) {
        if (type == '1') { //取消投递
          this.cancelSend()
        } else if (type == '2') { //跳转创建简历
          this.$utils.navigateTo('/pages/personalCenter/resumeEdit/resumeEdit')
        } else {
          this.init();
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .right-unit::-webkit-scrollbar {
    display: none;
    /* Chrome Safari */
  }

  .right-unit {
    height: 120px;
    scrollbar-width: none;
    /* firefox */
    -ms-overflow-style: none;
    /* IE 10+ */
    overflow-x: hidden;
    overflow-y: auto;
  }

  .rt-address {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .icon_home {
      width: 30px;
      height: 30px;
    }

    >div {
      display: flex;
      align-items: center;

      >span {
        height: 30px;
        display: inline-block;
        line-height: 30px;
        font-weight: 400;
        font-size: 18px;
        color: rgba(0, 0, 0, 0.6);
        letter-spacing: 2px;
        margin-left: 6px;
      }
    }
  }

  .main-title {
    width: 100%;
    height: 60px;
    box-sizing: border-box;
    border-bottom: 1px solid #D9D9D9;
    padding: 0 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    >div:first-child {
      height: 60px;
      box-sizing: border-box;
      font-weight: 600;
      font-size: 24px;
      color: rgba(0, 0, 0, 0.9);
      border-bottom: 4px solid #0C6AF7;
      border-radius: 2px;
      line-height: 60px;
    }

    >div:nth-child(2) {
      width: 96px;
      height: 38px;
      border-radius: 2px 2px 2px 2px;
      border: 1px solid #0C6AF7;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 16px;
      color: #0C6AF7;
      text-align: center;
      line-height: 38px;
    }
  }

  .work-wrap {
    height: 100%;

    .work-top {
      height: 160px;
      width: 1640px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      background: url('../../../static/images/findWork/bg_top.png') center no-repeat;
      background-size: cover;
      margin: 20px auto 0 auto;
      padding: 0px 60px 0 30px;

      .top-lt {
        .work-title {
          display: flex;
          align-items: center;

          .work-name {
            font-family: PingFang SC, PingFang SC;
            font-weight: 600;
            font-size: 30px;
            color: rgba(0, 0, 0, 0.9);
            text-align: left;
            margin-right: 150px;
          }

          .work-money {
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            font-size: 24px;
            color: #EB3527;
          }
        }

        .work-address {
          margin: 8px 0;

          span {
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 18px;
            color: rgba(0, 0, 0, 0.6);
            letter-spacing: 2px;
            margin: 0 6px;
          }

          >span:first-child {
            margin-left: 0;
          }
        }

        .work-tip {
          padding-top: 13px;

          >span {
            display: inline-block;
            padding: 4px 10px;
            box-sizing: border-box;
            background: #C0E0FC;
            border-radius: 2px 2px 2px 2px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 16px;
            color: #0C6AF7;
            margin-right: 12px;
          }
        }
      }

      .top-rt {
        .work-operation {
          >div {
            min-width: 350px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
          }
        }
      }
    }

    .btn-div {
      width: 158px;
      height: 52px;
      border-radius: 4px 4px 4px 4px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;

      .icon_vector {
        width: 20px;
        height: 20px;
        padding-top: 10px;
        margin-right: 3px;
      }
    }

    .btn-cancel {
      background-color: #E19613;
      color: #ffffff;
    }

    .btn-add {
      border: 1px solid #0C6AF7;
      color: #0C6AF7;
    }

    .btn-send {
      background-color: #0C6AF7;
      color: #ffffff;
    }

    .work-bottom {
      display: flex;
      justify-content: space-between;
      height: calc(100% - 212px);
      width: 1640px;
      margin: 30px auto 0 auto;
      box-sizing: border-box;
      overflow: hidden;

      .bottom-lt {
        height: 430px;
        width: calc(100% - 660px);
        margin-right: 60px;
        box-sizing: border-box;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #D9D9D9;
      }

      .bottom-lt-none {
        height: 430px;
        width: 100%;
        padding-right: 60px;
        box-sizing: border-box;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #D9D9D9;
      }

      .bottom-rt {
        width: 600px;
        height: 430px;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #D9D9D9;
        box-sizing: border-box;
      }
    }
  }

  .bottom-box {
    height: calc(100% - 65px);
    box-sizing: border-box;
    overflow: hidden;
    padding: 20px 30px 10px 30px;

    &.h40 {
      height: 42%;
    }

    &.h60 {
      height: 58%;
    }

    .no-data {
      padding: 10px;

      img {
        width: 160px;
        height: 160px;
      }
    }

    .person-bot {
      display: flex;
      justify-content: space-between;
      padding-top: 20px;
    }

    .bottom-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .title-blt {
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 20px;
        color: rgba(0, 0, 0, 0.9);
      }

      .title-brt {
        .btn-refresh {
          height: 40px;
          line-height: 40px;
          font-size: 16px;
        }
      }
    }

    .bottom-con {
      height: calc(100% - 40px);
      padding-left: 14px;

      .scroll {
        padding-left: 0;
      }

    }

    .bottom-con2 {
      height: 65%;
      padding-left: 14px;
      margin-bottom: 30px;

      .scroll {
        padding-left: 0;
      }

    }

    .bottom-con3 {
      padding-left: 14px;

      .scroll {
        padding-left: 0;
      }

    }
  }


  .decr-box {
    font-size: 18px;
    color: #666666;
    line-height: 32px;
  }

  .unit-box {
    .unit-title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 10px;

      .unit-name {
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 24px;
        color: #000000;
        line-height: 26px;
        color: #404040;
        display: inline-block;
        max-width: 420px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .unit-tags {
        padding-left: 10px;

        span {
          display: inline-block;
          padding: 0 12px;
          height: 24px;
          line-height: 24px;
          background: #F3FAFF;
          border-radius: 4px;
          border: solid 1px rgba(17, 148, 255, 0.24);
          font-size: 14px;
          color: #1194ff;
        }
      }
    }

    .unit-info {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;

      .uinfo-lt {
        width: 110px;
        height: 110px;
        position: relative;

        .uinfo-logo {
          position: absolute;
          left: 0;
          bottom: 0;
          z-index: 1;
          width: 100%;
          height: 100%;
          border-radius: 50%;

          .headImg {
            width: 100%;
            height: 100%;
          }
        }

        .logo-text {
          position: absolute;
          z-index: 2;
          width: 96px;
          height: 32px;
          left: 50%;
          /* 居中 */
          bottom: -7px;
          /* 靠底部 */
          transform: translateX(-50%);

          /* 水平居中 */
          .icon_good {
            width: 100%;
            height: 100%;
          }
        }
      }

      .uinfo-rt {
        padding-left: 20px;

        p {
          color: #666666;
          font-size: 16px;
          line-height: 32px;

          span {
            &.text-blue {
              color: #2778ff;
            }

            &.text-org {
              color: #ff7e00;
            }
          }
        }
      }
    }
  }

  .jobBox {
    width: 526px;
    height: 170px;
    box-sizing: border-box;
    overflow: hidden;
  }

  .work-list {
    width: 300%;
    display: flex;
    transition: all .3s ease-in-out;

    .work-item {
      width: 526px;
      height: 146px;
      padding: 20px 26px;
      box-sizing: border-box;
      background-color: #F5F5F5;

      .item-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        .item-name {
          font-size: 18px;
          color: #404040;
          font-weight: bold;
          max-width: 340px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .item-money {
          color: #666666;
          font-size: 16px;

          span {
            color: #ff7e00;
            font-size: 18px;
          }
        }
      }

      .item-decr {
        margin-top: 40px;

        span {
          padding-right: 8px;
          white-space: nowrap;
          color: #666666;
          font-size: 16px;
        }
      }
    }
  }

  .code-box {
    min-width: 400px;
    background: #FFFFFF;
    border-radius: 8px;

    .code-title {
      border-bottom: 1px solid #CCCCCC;
      line-height: 40px;
      padding: 8px 24px;

      .ic-user-tip {
        width: 24px;
        height: 24px;
      }

      span {
        display: inline-block;
        vertical-align: middle;
        font-size: 16px;
        color: #666666;
        padding-left: 8px;
      }
    }

    .code-center {
      padding: 24px;

      .code-name {
        /deep/ .uni-list-item__content-title {
          font-size: 16px;
          color: #007AFF;
        }
      }
    }

    .code-btn {
      padding: 24px;
      display: flex;
      justify-content: center;
      align-items: center;

      .btn {
        display: inline-block;
        width: 158px;
      }
    }

  }

  .botItem {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 12px;

    >div {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-image: url('../../../static/images/waitPage/Rectangle9.png');
      transition: all .3s ease-in-out;
      margin-right: 8px;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }

    >div:last-child {
      margin-right: 0px;
    }

    >div.numActive {
      width: 18px;
      border-radius: 3px;
      background-image: url('../../../static/images/waitPage/Rectangle8.png');
    }
  }

  .wrap-box .wrap-con .wrap-title .title-rt {
    width: 1210px;
  }
</style>