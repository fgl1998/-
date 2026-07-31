<template>
  <div class="page">
    <!-- 公司详情 -->
    <common-header></common-header>

    <div class="page-wrap">
      <div class="wrap-center">
        <div class="unit-wrap wrap-box">
          <div class="wrap-con" style="height: 65px">
            <div class="wrap-title">
              <div class="title-lt">
                <div class="lt-text">
                  <span><text style="color: #0c6af7">公司</text> 介绍 </span>/了解公司，放心投递简历
                </div>
              </div>
              <div class="title-rt rt-address">
                <div>
                  <image src="../../../static/images/findWork/icon_home.png" mode="aspectFit" class="icon_home"></image>
                  <span>首页&nbsp;&gt;&nbsp;找单位&nbsp;&gt;&nbsp;单位详情</span>
                </div>
              </div>
            </div>
          </div>
          <div class="unit-bottom">
            <div class="unit-left">
              <div class="unit-top">
                <div class="top-lt">
                  <image :src="headImg" mode="scaleToFill" class="logo"></image>
                </div>
                <div class="top-rt">
                  <div class="unit-info">
                    <div class="info-title">
                      <div class="unit-name">{{ companyInfo.aab004 }}</div>
                      <div class="unit-tags">
                        <span>{{
                          companyInfo.aab019 ? $utils.queryCodeDesc('aab019', companyInfo.aab019) : '未知'
                        }}</span>
                        <span>{{
                          companyInfo.aab022 ? $utils.queryCodeDesc('aab022', companyInfo.aab022) : '未知'
                        }}</span>
                      </div>
                    </div>
                    <div class="info-decr">
                      <span
                        >公司规模：<span>{{
                          companyInfo.aab056 ? $utils.queryCodeDesc('aab056', companyInfo.aab056) : '未知'
                        }}</span></span
                      >
                      <span
                        >统一社会信用代码：<span>{{ companyInfo.aab998 ? companyInfo.aab998 : '未知' }}</span></span
                      >
                    </div>
                    <div class="info-decr">
                      <span
                        >邮箱：<span>{{ companyInfo.aae159 ? companyInfo.aae159 : '未知' }}</span></span
                      >
                      <span
                        >电话：<span>{{ companyInfo.aae005 ? companyInfo.aae005 : '未知' }}</span></span
                      >
                    </div>
                    <div class="info-decr">
                      <span
                        >公司地址：<span>{{ companyInfo.aab060 ? companyInfo.aab060 : '未知' }}</span></span
                      >
                    </div>
                  </div>
                </div>
                <!-- <div class="unit-recruit">
                  热度:<span>{{ companyInfo.aab094 ? companyInfo.aab094 : 0 }}</span>
                </div> -->
                <div class="unit-add" v-if="isCollect" @click="cancelCollectOpen">
                  <image src="../../../static/images/findWork/icon_vector2.png" mode="aspectFill" class="icon_vector">
                  </image>
                  <span>取消收藏</span>
                </div>
                <div class="unit-add" v-else @click="collect">
                  <image src="../../../static/images/findWork/icon_vector2.png" mode="aspectFill" class="icon_vector">
                  </image>
                  <span>收藏企业</span>
                </div>
              </div>
              <div class="bottom-box">
                <div class="bottom-title">
                  <div class="title-blt">公司简介：</div>
                </div>
                <div class="bottom-con">
                  <common-scroll>
                    <div class="brief" v-if="companyInfo.aab092 || companyInfo.aab093">
                      <p v-dompurify-html="companyInfo.aab092"></p>
                      <p>{{ companyInfo.aab093 }}</p>
                    </div>
                    <div class="brief" v-else>暂无</div>
                  </common-scroll>
                </div>
              </div>
            </div>
            <div class="unit-right">
              <div class="bottom-box">
                <div class="bottom-title" style="border-bottom: 1px solid #d9d9d9; padding-bottom: 15px">
                  <div class="title-blt">招聘岗位：</div>
                  <div class="title-brt">
                    <button class="btn btn-dblue" @click="tapList">查看全部</button>
                  </div>
                </div>
                <div class="bottom-con">
                  <div class="job-list" v-if="jobList.length > 0">
                    <div class="list-item" v-for="(item, index) in jobList" :key="index">
                      <div class="item-top">
                        <div class="item-hot" v-show="item.acb212 > 10"><i class="ic ic-hot"></i></div>
                        <div class="item-title">
                          <div class="title-name" @click="toPage(item)">{{ item.acb213 }}</div>
                          <div class="info-money">
                            <span>{{ item.acb21h && item.acb21j ? item.acb21h + '~' + item.acb21j : '' }}</span>
                            <span>{{ item.acb21h && !item.acb21j ? item.acb21h + '以上' : '' }}</span>
                            <span>{{ !item.acb21h && item.acb21j ? item.acb21j + '以下' : '' }}</span>
                            <span>{{ !item.acb21h && !item.acb21j ? '薪资面议' : '' }}</span>
                            <label style="padding-left: 6px">{{ item.acb21h || item.acb21j ? '元/月' : '' }}</label>
                          </div>
                        </div>
                        <div class="item-info">
                          <div class="info-type">
                            <span v-if="item.aac011">{{
                              item.aac011 ? $utils.queryCodeDesc('aac011', item.aac011) : '未知'
                            }}</span>
                            <span v-if="item.acb00r">{{
                              item.acb00r ? $utils.queryCodeDesc('acb00r', item.acb00r) : ''
                            }}</span>
                            <span v-if="item.acb469">{{
                              item.acb469 ? $utils.queryCodeDesc('acb469', item.acb469) : ''
                            }}</span>
                            <span v-if="item.aab056">{{
                              item.aab056 ? $utils.queryCodeDesc('aab056', item.aab056) : ''
                            }}</span>
                          </div>
                          <div class="info-bot">
                            <div>
                              已投递人数：<span>{{ item.deliveryCount ? item.deliveryCount : 0 }}</span
                              >人
                            </div>
                            <div v-if="item.cc30Count && item.cc30Count == '1'">已投简历</div>
                            <div @click="sendOpen(item)" v-else>投递简历</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="no-data" v-else>
                    <img src="../../../static/images/ic_no_data.png" />
                    <p>发布者还未录入</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <common-footer :userName="userInfo.aac003" :isLogin="isLogin" @login="login"></common-footer>
    <common-modal ref="modalPopup"></common-modal>
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
    if (option) {
		if(option.acb330){
			this.acb330 = option.acb330
			this.cz29Param.acz01v = option.acz01v
			this.cz29Param.acz01t = option.acz01t
		}
      this.userInfo = uni.getStorageSync('userInfo')
      if (this.userInfo) {
        this.isLogin = true
        this.getResumeInfo()
      } else {
        this.isLogin = false
      }
      this.companyInfo = JSON.parse(option.item)
      this.init()
    }
  },
  data() {
    return {
      acb330: '',
      userInfo: {},
      loading: false,
      companyInfo: {},
      jobList: [],
      headImg: '',
      isCollect: false,
      typeCheck: '1',
      titleTip: '',
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
    init() {
      let param = {
        method: 'jy202_hrm111',
        aab001: this.companyInfo.aab001,
        acb231: this.userInfo.aac001,
        aac001: this.userInfo.aac001,
      }
      this.$utils.request(null, param, true).then((res) => {
        let companyInfo = res.ab01VO
        this.companyInfo = companyInfo
        if (this.companyInfo.acb230 && this.companyInfo.acb230 != 0) {
          this.isCollect = true
        } else {
          this.isCollect = false
        }
        if (this.companyInfo.aae707) {
          this.headImg = this.$downLoadImgSrc + this.companyInfo.aae707
        } else {
          this.headImg = '../../../static/images/findWork/icon_unit.png'
        }
        this.query()
		//添加查看单位浏览记录
		this.cz29Param.acz01w = this.companyInfo.aab001; //业务信息
		this.cz29Param.acz01x = this.companyInfo.aab002; //业务信息
		this.cz29Param.acz01s = '27' //足迹类型:查看单位
		this.cz29Param.acz01q = this.userInfo.aac001; //主体信息
		this.cz29Param.acz01r = this.userInfo.aac003; //主体信息
		this.$utils.addFootprint(this.cz29Param)
      })
    },
    getResumeInfo() {
      const url = '/api/business/invoke'
      let param = {
        aac001: this.userInfo.aac001,
        isSelf: '1',
        method: 'jy202_hrm1194',
      }
      this.$utils.request(url, param, true, true, 'cipher').then((res) => {
        this.acc200 = res.resumeMap?.baseInfo?.acc200
      })
    },
    sendOpen(value) {
      if (!this.isLogin) {
        this.$refs.modalPopup.open()
        return
      }
      if (!value.acb210 && !value.aac001) {
        this.$utils.showToast('未获取到职位详情，不可投递')
        return
      }
      if (!this.acc200) {
        this.titleTip = '尚未创建个人简历信息,是否创建个人简历信息?'
        this.typeCheck = '2'
        this.$refs.checkPopup.open()
        return
      }
      this.send(value)
    },

    // 投递简历
    send(value) {
      let param = {
        aac001: this.userInfo.aac001,
        acb210: value.acb210,
        acc200: this.acc200,
        aab001: value.aab001,
        aae400: '19',
        method: 'jy202_hrm100',
      }
      this.$utils.request('/api/business/invoke', param, true, true, 'cipher').then((res) => {
        this.titleTip = '投递成功'
        this.typeCheck = '3'
        this.$refs.checkPopup.open()
      })
    },
    cancelCollect() {
      let param = {
        aac001: this.userInfo.aac001,
        acb231: this.userInfo.aac001,
        acb235: this.companyInfo.aab001,
        acb230: this.companyInfo.acb230,
        acb234: '5',
        acb237: '1',
        method: 'collect_com02',
      }
      this.$utils.request('/api/business/invoke', param, true, true, 'cipher').then((res) => {
        this.$utils.showToast('取消收藏成功')
        setTimeout(() => {
          this.init()
        }, '1000')
      })
    },
    collect() {
      if (!this.isLogin) {
        this.$refs.modalPopup.open()
        return
      }
      let that = this
      let param = {
        aac001: this.userInfo.aac001,
        acb231: this.userInfo.aac001,
        acb235: this.companyInfo.aab001,
        acb237: '1',
        acb234: '5',
        // yae100: this.workInfo.yae100,
        aae400: '19',
        method: 'collect_com01',
      }

      this.$utils.request('/api/business/invoke', param, true, true, 'cipher').then((res) => {
        this.$utils.showToast('收藏成功')
        setTimeout(() => {
          that.init()
        }, '1000')
      })
    },
    triggerClick(type) {
      if (type == '3') {
        this.init()
      } else {
        this.cancelCollect()
      }
    },
    cancelCollectOpen() {
      this.titleTip = '请您确认是否需要取消收藏呢？'
      this.typeCheck = '1'
      this.$refs.checkPopup.open()
    },
    query() {
      let param = {
        method: 'jy202_hrm101',
        aab001: this.companyInfo.aab001,
        // ycb211: "0",//上线的
        acb468: '1', //岗位是否上线（1：上线，0：下线）
        AAE100: '1', //岗位是否有效（1：有效，0：无效）
        audit_status: '0', //岗位审核通过的
        pageNumber: '1',
        pageSize: '3',
        paginationModel: 'mostCount',
        aac001: this.userInfo.aac001,
      }
      if (this.acb330 != 'undefined' && this.acb330 != '') {
        param.acb330 = this.acb330
      }
      this.$utils.request(null, param).then((res) => {
        //console.log(res,'岗位数据')
        this.jobList = res?.pageBean?.list
      })
    },
    clickCollect(item) {
      this.jobList.forEach((temp) => {
        if (item.id == temp.id) {
          temp.isCollect = !item.isCollect
        }
      })
    },
    tapList() {
      this.$utils.navigateTo(
        '/pages/jobRecruitment/findUnitDetail/companyWork?aab001=' + this.companyInfo.aab001 + '&acb330=' + this.acb330+'&acz01v='+this.acz01v+'&acz01t='+this.acz01t
      )
    },
    toPage(item) {
      this.$utils.navigateTo(
        '/pages/jobRecruitment/findWorkDetail/findWorkDetail?item=' +
          encodeURIComponent(JSON.stringify(item)) +
          '&acb330=' +
          this.acb330,
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.unit-wrap {
  height: 100%;
  overflow: hidden;

  .unit-top {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    background: url('../../../static/images/service_rt_bg.png') left bottom repeat-x;
    background-size: 20px 12px;
    height: 184px;
    padding: 0 25px;
    position: relative;

    .top-lt {
      width: 126px;

      .logo {
        width: 126px;
        height: 126px;
        border: 1px solid #dddddd;
        border-radius: 50%;
      }
    }

    .top-rt {
      padding: 0 20px;
      width: 100%;

      .unit-info {
        .info-title {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          line-height: 50px;

          .unit-name {
            font-size: 26px;
            color: #333333;
            font-weight: bold;
          }

          .unit-tags {
            span {
              display: inline-block;
              margin-left: 10px;
              height: 30px;
              line-height: 30px;
              border-radius: 4px;
              font-size: 18px;
              padding: 0 14px;
              color: #1194ff;
              background: #f3faff;
              border: 1px solid rgba(17, 148, 255, 0.24);

              &:nth-child(2n) {
                color: #ff7e00;
                background: #fff8f2;
                border: 1px solid rgba(255, 126, 0, 0.24);
              }
            }
          }
        }

        .info-decr {
          max-width: 640px;
          display: flex;

          > span {
            display: inline-block;
            font-size: 16px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.6);

            span {
              color: rgba(0, 0, 0, 0.9);
            }
          }

          > span:first-child {
            flex: 1;
          }

          > span:nth-child(2) {
            width: 400px;
          }
        }
      }
    }

    .unit-recruit {
      position: absolute;
      top: 30px;
      right: 0;
      background: url('../../../static/images/ic_tag_bg.png') left center no-repeat;
      background-size: 100% 100%;
      color: #2778ff;
      font-size: 18px;
      padding: 14px 16px 14px 60px;

      span {
        color: #ff7e00;
        padding: 0 4px;
      }
    }

    .unit-add {
      position: absolute;
      bottom: 20px;
      right: 50px;
      width: 145px;
      height: 45px;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #0c6af7;
      color: #0c6af7;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;

      .icon_vector {
        width: 25px;
        height: 25px;
        padding-top: 8px;
      }
    }
  }

  .unit-bottom {
    display: flex;
    justify-content: space-around;
    height: calc(100% - 184px);
    padding: 30px 0 18px 0;
    box-sizing: border-box;

    .unit-left {
      width: 1024px;
      height: 639px;
      background: linear-gradient(180deg, #ffffff 0%, #ffffff 100%);
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #d9d9d9;
    }

    .unit-right {
      width: 586px;
      height: 639px;
      background: #ffffff;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #d9d9d9;
    }
  }
}

.bottom-box {
  height: 100%;
  padding: 20px;

  .bottom-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .title-blt {
      position: relative;
      color: #333333;
      font-size: 20px;
      padding-left: 14px;

      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 20px;
        background: #cccccc;
      }
    }

    .title-brt {
      .btn-dblue {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
      }
    }
  }

  .bottom-con {
    height: calc(100% - 40px);
    overflow: hidden;
    .scroll {
      padding-left: 0;
    }
  }
}

.brief {
  padding: 10px;
  font-size: 18px;
  line-height: 34px;
  color: #666666;
  overflow: hidden;
  box-sizing: border-box;

  p {
    text-indent: 32px;
    margin-bottom: 6px;
  }
}

.job-list {
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-wrap: wrap;
  overflow: hidden;
  height: 100%;

  .list-item {
    width: 526px;
    height: 154px;
    background: #f5f5f5;
    border-radius: 0px 0px 0px 0px;
    margin-bottom: 24px;
    &:last-child {
      margin-bottom: 0;
    }
    .item-top {
      height: 120px;
      padding: 14px 26px 8px;
      position: relative;
      box-sizing: border-box;

      .item-hot {
        position: absolute;
        top: 0;
        left: 0;
      }

      .item-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        position: relative;

        .info-money {
          color: #eb3527;
          margin-bottom: 8px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 600;
          font-size: 18px;
          color: #eb3527;

          span {
            font-size: 18px;
            line-height: 24px;
            color: #eb3527;
          }
        }

        .title-name {
          width: 210px;
          font-size: 18px;
          line-height: 32px;
          color: #404040;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .title-tag {
          background: url('../../../static/images/ic_tag_bg.png') left center no-repeat;
          background-size: 100% 100%;
          width: 100px;
          height: 32px;
          line-height: 32px;
          font-size: 16px;
          color: #2778ff;
          opacity: 0.99;
          padding-right: 16px;
          text-align: right;
          box-sizing: border-box;
          position: absolute;
          top: 0;
          right: -26px;
        }
      }

      .item-info {
        .info-type {
          font-size: 16px;
          line-height: 24px;
          color: #666666;
          height: 38px;
          opacity: 0.99;
          overflow: hidden;

          > span {
            display: inline-block;
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 4px 12px;
            background-color: #e4e8eb;
            border-radius: 2px;
            margin-right: 10px;
          }

          > span:last-child {
            margin-right: 0;
          }
        }

        .info-bot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 6px;

          > div:first-child {
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 18px;
            color: rgba(0, 0, 0, 0.6);

            span {
              color: #0c6af7;
            }
          }

          > div:nth-child(2) {
            width: 120px;
            height: 41px;
            border-radius: 4px 4px 4px 4px;
            border: 1px solid #0c6af7;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 18px;
            color: #0c6af7;
            text-align: center;
            line-height: 41px;
          }
        }
      }
    }
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
</style>
