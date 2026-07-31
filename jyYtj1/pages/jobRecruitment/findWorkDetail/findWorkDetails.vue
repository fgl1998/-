<template>
  <div class="page">
    <!-- 职位详情 -->
    <common-header></common-header>

    <div class="page-wrap">
      <div class="wrap-center">
        <div class="work-wrap wrap-box">
          <div class="wrap-con" style="height: 65px">
            <div class="wrap-title">
              <div class="title-lt">
                <div class="lt-text">
                  <span><text style="color: #0c6af7">零工</text> 市场 </span> /零工介绍，原圆就业伴你行
                </div>
              </div>
              <div class="title-rt rt-address">
                <div>
                  <image src="../../../static/images/findWork/icon_home.png" mode="aspectFit" class="icon_home"></image>
                  <span>首页&nbsp;&gt;&nbsp;零工市场&nbsp;&gt;&nbsp;零工信息</span>
                </div>
              </div>
            </div>
          </div>
          <div class="work-top">
            <div class="top-lt">
              <div class="work-title">
                <div class="work-name">{{ workInfo.acb213 }}</div>
              </div>
              <div class="work-address">
                <span v-show="workInfo.acb303">工作地点：{{ workInfo.acb303 ? workInfo.acb303 : '未知' }}</span>
                <span>|</span>
                <span v-show="workInfo.acb2a4Desc"
                  >结算方式：{{ workInfo.acb2a4Desc ? workInfo.acb2a4Desc : '未知' }}</span
                >
                <span>|</span>
                <span v-show="workInfo.acb21g">招聘人数：{{ workInfo.acb21g ? workInfo.acb21g : '未知' }}</span>
              </div>
              <div class="work-tip">
                <span v-if="workInfo.acb2ac">{{ workInfo.acb2ac_dsc }}</span>
                <span v-if="workInfo.acb2a1_par">{{ workInfo.acb2a1_par }}</span>
                <template v-if="workInfo.acb2a1_desc">
                  <span v-for="item in workInfo.acb2a1_desc.split(',')" :key="item">{{ item }}</span>
                </template>
                <span v-if="workInfo.ycb201_desc">{{ workInfo.ycb201_desc }}</span>
              </div>
            </div>
            <div class="top-rt">
              <div class="work-operation">
                <div>
                  <div class="work-money">
                    薪资待遇：<span>{{ workInfo.money }}</span>
                  </div>
                  <div disabled class="btn-div btn-send" style="margin: 0 0 0 20px !important" v-if="isSend">
                    <image src="../../../static/images/findWork/icon_vector.png" mode="aspectFit" class="icon_vector">
                    </image>
                    <span>已投意愿</span>
                  </div>
                  <div class="btn-div btn-send" @click="sendOpen" v-else style="margin: 0 0 0 20px !important">
                    <image src="../../../static/images/findWork/icon_vector.png" mode="aspectFit" class="icon_vector">
                    </image>
                    <span>投递意愿</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="work-bottom">
            <div class="bottom-lt">
              <div class="main-title">
                <div>职位信息</div>
              </div>
              <div class="bottom-box">
                <div class="bottom-title">
                  <div class="title-blt">岗位描述：</div>
                </div>
                <div class="bottom-con2" v-if="workInfo.acb216">
                  <common-scroll>
                    <div class="decr-box">
                      <p v-dompurify-html="workInfo.acb216_dsc"></p>
                    </div>
                  </common-scroll>
                </div>
                <div class="no-data" v-else>
                  <img src="../../../static/images/ic_no_data.png" />
                  <p>发布者还未录入</p>
                </div>
              </div>
            </div>
            <div class="bottom-rt">
              <div class="main-title">
                <div>{{ workInfo.acb2a7 === '1' ? '个人雇主' : '企业雇主' }}</div>
              </div>
              <div class="bottom-box" style="height: 25%">
                <div class="bottom-con">
                  <div class="unit-box">
                    <div class="user-info">
                      <div class="uinfo-lt">
                        <div class="uinfo-logo">
                          <image :src="workInfo.headImg" mode="aspectFill" class="headImg"></image>
                        </div>
                      </div>
                      <div class="uinfo-rt">
                        <div class="unit-title">
                          <span>{{ workInfo.aae004 }}</span>
                          <span v-if="workInfo.acb2a7 === '2'">&bull;</span>
                          <span v-if="workInfo.acb2a7 === '2'">{{ workInfo.aab004 }}</span>
                        </div>
                        <div class="img-unit">
                          <div>
                            <image
                              :src="baseImgSrc + '/findWork/icon_person.png'"
                              mode="aspectFill"
                              class="icon_person"
                            >
                            </image>
                          </div>
                          <div>
                            <image
                              v-if="workInfo.acb2a7 === '2' && workInfo.aab001"
                              :src="baseImgSrc + '/findWork/icon_company.png'"
                              mode="aspectFill"
                              class="icon_person"
                            ></image>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div @click.stop="getPhone(workInfo)">电话联系</div>
                  </div>
                </div>
              </div>
              <div class="line"></div>
              <div class="bottom-box h60">
                <div class="bottom-con">
                  <div class="unit-box">
                    <div class="unit-info" v-if="workInfo.acb2a7 === '2'">
                      <div class="uinfo-lt">
                        <div class="uinfo-logo">
                          <image :src="unitInfo.headImg" mode="aspectFill" class="headImg"></image>
                        </div>
                      </div>
                      <div class="uinfo-rt">
                        <div class="unit-title">
                          <div class="unit-name">{{ unitInfo.aab004 }}</div>
                        </div>
                        <p>
                          所属行业：
                          <span class="text-blue">{{
                            unitInfo.aab022 ? $utils.queryCodeDesc('aab022', unitInfo.aab022) : '未知'
                          }}</span>
                        </p>
                        <p>
                          统一社会信用代码：<span>{{ unitInfo.aab998 ? unitInfo.aab998 : '未知' }}</span>
                        </p>
                        <p>
                          公司规模：<span>{{
                            unitInfo.aab056 ? $utils.queryCodeDesc('aab056', unitInfo.aab056) : '未知'
                          }}</span>
                        </p>
                      </div>
                      <div class="itemBtn" @click="toPage()">企业详情</div>
                    </div>
                    <div v-else class="person-bg">
                      <image
                        src="../../../static/images/personalCenter/code-2.jpg"
                        mode="aspectFit"
                        class="code"
                      ></image>
                    </div>
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
    <!--联系方式-->
    <uni-popup ref="phonePopup" type="dialog">
      <uni-popup-dialog
        type="info"
        title="联系方式"
        :content="messageText"
        @confirm="openClose"
        :showClose="true"
      ></uni-popup-dialog>
    </uni-popup>
    <common-modal-check
      ref="checkPopup"
      :tipInfo="titleTip"
      :typeCheck="typeCheck"
      @triggerClick="triggerClick"
    ></common-modal-check>
  </div>
</template>

<script>
export default {
  onLoad(option) {
    this.userInfo = uni.getStorageSync('userInfo')
    if (option) {
      this.workInfo = JSON.parse(option.item)
      if (this.workInfo.acc034l !== undefined && this.workInfo.acc034h !== undefined) {
        this.workInfo.money = this.workInfo.acc034l + '~' + this.workInfo.acc034h + '元'
      } else if (this.workInfo.acc034l || this.workInfo.acc034l === 0) {
        this.workInfo.money = this.workInfo.acc034l + '元以上'
      } else if (this.workInfo.acc034h || this.workInfo.acc034h === 0) {
        this.workInfo.money = this.workInfo.acc034h + '元以下'
      } else {
        this.workInfo.money = '薪资面议'
      }
      this.workInfo.acb2ac_dsc = this.$utils.queryCodeDesc('acb2a4', this.workInfo.acb2a4) + '发放'

      if (this.workInfo.aae707) {
        this.workInfo.headImg = this.$downLoadImgSrc + this.workInfo.aae707
      } else {
        this.workInfo.headImg = this.baseImgSrc + '/zero/ic_head_man.png'
      }
      if (this.workInfo.acb2a7 === '2' && this.workInfo.aab001) {
        this.queryCompany()
      } else {
        this.unitInfo = {
          aab004: this.workInfo.aab004 ? this.workInfo.aab004 : '未知企业',
          headImg: this.baseImgSrc + '/findWork/icon_unit.png',
        }
      }
      if (this.workInfo.acb216) {
        this.workInfo.acb216_dsc = decodeURIComponent(this.workInfo.acb216)
        this.workInfo.acb216_dsc = this.$xssUtils.decodeSafeHTML(this.workInfo.acb216_dsc)
      } else {
        this.workInfo.acb216_dsc = '暂无岗位描述'
      }
      if (this.workInfo.acc3a1 == '0' || this.workInfo.acc3a1 == '1') {
        this.isSend = true
      }
	  //添加查看零工浏览记录
	  this.cz29Param.acz01w = this.workInfo.acb2a0; //业务信息
	  this.cz29Param.acz01x = this.workInfo.acb213; //业务信息
	  this.cz29Param.acz01s = '27' //足迹类型:查看零工
	  this.cz29Param.acz01q = this.userInfo.aac001; //主体信息
	  this.cz29Param.acz01r = this.userInfo.aac003; //主体信息
	  this.$utils.addFootprint(this.cz29Param)
    }
    if (this.userInfo) {
      this.isLogin = true
    } else {
      this.isLogin = false
    }
  },
  data() {
    return {
      titleTip: '',
      typeCheck: '1',
      baseImgSrc: this.$baseImgSrc,
      userInfo: {},
      workInfo: {},
      unitInfo: {},
      numIndex: 1,
      messageText: '',
      isSend: false,
	  isLogin: false,
	  cz29Param: {
	  	method: "jy202_hrm109",
	  	acz01p: "1", //用户主体类型：求职者
	  	acz01u: '', //被浏览主体编号 招聘会或者直播过来的参数
	  	acz01v: '', // 被浏览主体名称 招聘会或者直播过来的参数
	  	acz01t: "", //被浏览主体类型：默认没有 招聘会或者直播过来的参数
	  },
    }
  },
  methods: {
    getPhone(item) {
      if (this.userInfo && this.userInfo.aac001) {
        const url = '/api/business/invoke'
        const param = {
          aac001_per: item.aac001,
          aab001_per: item.aab001,
          acb2a0: item.acb2a0,
          zpType: '2',
          aac001: this.userInfo.aac001,
          zpID: item.acb2a0,
          method: 'jy202_hrm156',
        }
        this.$utils.request(url, param, true, true, 'cipher').then((res) => {
          if (res && res.result && res.result.aae005) {
            this.messageText = res.result.aae005
            this.openPhone()
          } else {
            this.$utils.showToast('该人员暂未提供准确的联系方式')
          }
        })
      } else {
        this.$refs.modalPopup.open()
      }
    },
    openPhone() {
      this.$refs.phonePopup.open()
    },
    queryCompany() {
      let param = {
        method: 'jy202_hrm111',
        aab001: this.workInfo.aab001,
      }
      this.$utils.request(null, param, true).then((res) => {
        this.unitInfo = res.ab01VO
        if (this.unitInfo.aae707) {
          this.unitInfo.headImg = this.$downLoadImgSrc + this.unitInfo.aae707
        } else {
          this.unitInfo.headImg = '../../../static/images/findWork/icon_unit.png'
        }
      })
    },
    sendOpen() {
      if (!this.isLogin) {
        this.$refs.modalPopup.open()
        return
      }
      if (!this.workInfo.acb2a0 || !this.userInfo.aac001) {
        this.$utils.showToast('未获取到职位详情，不可投递')
        return
      }
      this.send()
    },
    // 投递简历
    send() {
      let param = {
        acb2a0: this.workInfo.acb2a0,
        aac001: this.userInfo.aac001,
        aab001: this.unitInfo.aab001,
        yae100: '14',
        method: 'jy217_flex110',
      }
      this.$utils
        .request('/api/business/invoke', param, true, true, 'cipher')
        .then((res) => {
          this.titleTip = '投递成功'
          this.typeCheck = '3'
          this.$refs.checkPopup.open()
          this.isSend = true
		  //添加投递零工浏览记录
		  this.cz29Param.acz01s = '57' //足迹类型:查看零工
		  this.$utils.addFootprint(this.cz29Param)
        })
        .catch(() => {
          console.log(222222)

          this.$utils.showToast('投递失败，请稍后再试')
        })
    },
    triggerClick() {},
    toPage() {
      if (this.unitInfo.aab001) {
        this.$utils.navigateTo(
          '/pages/jobRecruitment/findUnitDetail/findUnitDetail?item=' +
            encodeURIComponent(JSON.stringify(this.unitInfo)),
        )
      } else {
        this.$utils.showToast('该企业信息不完善不支持查看')
      }
    },
    closeWxCode() {
      this.$refs.popup.close()
    },
  },
}
</script>

<style lang="scss" scoped>
.line {
  width: 90%;
  height: 1px;
  background-color: #d9d9d9;
  margin: 20px auto 0 auto;
}

.person-bg {
  width: 540px;
  height: 190px;
  background-image: url('../../../static/images/findWork/bg_person.png');
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  .code {
    width: 135px;
    height: 135px;
    position: absolute;
    right: 32px;
    bottom: 29px;
  }
}

.rt-address {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .icon_home {
    width: 30px;
    height: 30px;
  }

  > div {
    display: flex;
    align-items: center;

    > span {
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
  border-bottom: 1px solid #d9d9d9;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  > div:first-child {
    height: 60px;
    box-sizing: border-box;
    font-weight: 600;
    font-size: 24px;
    color: rgba(0, 0, 0, 0.9);
    border-bottom: 4px solid #0c6af7;
    border-radius: 2px;
    line-height: 60px;
  }

  > div:nth-child(2) {
    width: 96px;
    height: 38px;
    border-radius: 2px 2px 2px 2px;
    border: 1px solid #0c6af7;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #0c6af7;
    text-align: center;
    line-height: 38px;
  }
}

.work-wrap {
  height: 100%;

  .work-money {
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 24px;
    color: #eb3527;
    margin-right: 20px;
  }

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

        > span:first-child {
          margin-left: 0;
        }
      }

      .work-tip {
        padding-top: 13px;

        > span {
          display: inline-block;
          padding: 4px 10px;
          box-sizing: border-box;
          background: #c0e0fc;
          border-radius: 2px 2px 2px 2px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          font-size: 16px;
          color: #0c6af7;
          margin-right: 12px;
        }
      }
    }

    .top-rt {
      .work-operation {
        > div {
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
    background-color: #e19613;
    color: #ffffff;
  }

  .btn-add {
    border: 1px solid #0c6af7;
    color: #0c6af7;
  }

  .btn-send {
    background-color: #0c6af7;
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
      border: 1px solid #d9d9d9;
    }

    .bottom-rt {
      width: 600px;
      height: 430px;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #d9d9d9;
    }
  }
}

.bottom-box {
  height: calc(100% - 65px);
  box-sizing: border-box;
  overflow: hidden;
  padding: 35px 30px 10px 30px;

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
    position: relative;

    .itemBtn {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 96px;
      height: 38px;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #0c6af7;
      text-align: center;
      line-height: 38px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 16px;
      color: #0c6af7;
    }

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
  display: flex;
  align-items: center;
  justify-content: space-between;

  > div:nth-child(2) {
    width: 96px;
    height: 38px;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #0c6af7;
    text-align: center;
    line-height: 38px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #0c6af7;
  }

  .unit-info {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    .unit-name {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 24px;
      color: #000000;
      margin-bottom: 7px;
    }

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
    }

    .uinfo-rt {
      padding-left: 20px;

      p {
        color: #666666;
        font-size: 16px;
        line-height: 32px;

        > span {
          color: #000000;
        }
      }
    }
  }

  .user-info {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .uinfo-lt {
      width: 48px;
      height: 48px;
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
    }

    .uinfo-rt {
      padding-left: 20px;

      .unit-title {
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 18px;
        color: rgba(0, 0, 0, 0.9);
      }
    }

    .img-unit {
      display: flex;
      align-items: center;
      padding-top: 6px;

      .icon_person {
        width: 86px;
        height: 22px;
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
  transition: all 0.3s ease-in-out;

  .work-item {
    width: 526px;
    height: 146px;
    padding: 20px 26px;
    box-sizing: border-box;
    background-color: #f5f5f5;

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
  background: #ffffff;
  border-radius: 8px;

  .code-title {
    border-bottom: 1px solid #cccccc;
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
        color: #007aff;
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

  > div {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-image: url('../../../static/images/waitPage/Rectangle9.png');
    transition: all 0.3s ease-in-out;
    margin-right: 8px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  > div:last-child {
    margin-right: 0px;
  }

  > div.numActive {
    width: 18px;
    border-radius: 3px;
    background-image: url('../../../static/images/waitPage/Rectangle8.png');
  }
}
</style>
