<template>
  <div class="page">
    <!-- 培训班级详情 -->
    <common-header></common-header>

    <div class="page-wrap">
      <div class="wrap-center">
        <div class="work-wrap wrap-box">
          <div class="wrap-con" style="height: 65px">
            <div class="wrap-title">
              <div class="title-lt">
                <div class="lt-text">
                  <span><text style="color: #0c6af7">培训</text> 班级 </span> /点击马上预约参与报名
                </div>
              </div>
              <div class="title-rt rt-address">
                <div>
                  <image src="../../../static/images/findWork/icon_home.png" mode="aspectFit" class="icon_home"></image>
                  <span>首页&nbsp;&gt;&nbsp;培训计划&nbsp;&gt;&nbsp;计划详情</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 上:培训班级基本信息 -->
          <div class="work-top">
            <div class="top-lt">
              <div>
                <image v-if="classInfo.coverImg" :src="classInfo.coverImg" mode="scaleToFill" />
                <image v-else src="../../../static/images/trainClass/class_default.png" mode="scaleToFill" />
              </div>
              <div>
                <div class="class-name">
                  <span
                    :class="
                      classInfo.status == 0
                        ? 'status0'
                        : classInfo.status == 1
                        ? 'status1'
                        : classInfo.status == 2
                        ? 'status2'
                        : ''
                    "
                  >
                    {{
                      classInfo.status == 0
                        ? '报名中'
                        : classInfo.status == 1
                        ? '培训中'
                        : classInfo.status == 2
                        ? '已结束'
                        : ''
                    }}
                  </span>
                  {{ classInfo.adf077 }}
                </div>
                <div class="info-item">培训机构：{{ classInfo.aaf011 }}</div>
                <div class="info-item">培训地址：{{ classInfo.adf081 }}</div>
                <div class="info-item">联系电话：{{ classInfo.adf023 }}</div>
              </div>
            </div>
            <div class="top-rt">
              <div>
                <span>{{ orderNum }}人</span>已预约
              </div>
              <template v-if="classInfo.status == 0">
                <div class="btn" :class="isLogin && isOrder ? 'status1' : 'status0'" @click="toAppoint">
                  <image src="../../../static/images/trainClass/icon_frame.png" mode="scaleToFill" />
                  <span>{{ isLogin && classInfo.signed != 0 ? '已预约' : '马上预约' }}</span>
                </div>
                <div class="btn status2" v-if="isLogin && classInfo.signed != 0" @click="cancelAppoint">取消预约</div>
              </template>
              <template v-if="classInfo.status != 0">
                <div class="btn status3">预约结束</div>
              </template>
            </div>
          </div>
          <!-- 下:课程简介和机构介绍 -->
          <div class="work-bottom">
            <!--  -->
            <div class="bottom-lt">
              <div class="main-title">
                <div>课程介绍</div>
              </div>
              <div class="bottom-box">
                <div class="bottom-con2" v-if="classInfo.summary">
                  <common-scroll>
                    <div class="decr-box" v-dompurify-html="classInfo.summary"></div>
                  </common-scroll>
                </div>
                <div class="no-data" v-else>
                  <img src="../../../static/images/ic_no_data.png" />
                  <p>暂无课程介绍</p>
                </div>
              </div>
            </div>
            <!--  -->
            <div class="bottom-rt">
              <div class="main-title">
                <div>培训机构</div>
                <div @click="toPage">机构详情</div>
              </div>
              <div class="bottom-box h40">
                <div class="bottom-con">
                  <div class="unit-box">
                    <div class="unit-info">
                      <div class="uinfo-lt">
                        <div class="uinfo-logo">
                          <image v-if="orgInfo.logoSrc" :src="orgInfo.logoSrc" mode="scaleToFill" class="headImg" />
                          <image
                            v-else
                            src="../../../static/images/trainClass/avatar_trainorg.png"
                            mode="aspectFill"
                            class="headImg"
                          />
                        </div>
                      </div>
                      <div class="uinfo-rt">
                        <div class="unit-title">
                          <div class="unit-name">{{ classInfo.aaf011 }}</div>
                        </div>
                        <p>
                          单位性质：{{
                            orgInfo.adf002 ? $utils.queryCodeDesc('adf002', orgInfo.adf002) : '未知单位性质'
                          }}
                        </p>
                        <p>所属行业：技能培训、教育辅助及其他教育</p>
                      </div>
                    </div>

                    <div class="intro" v-dompurify-html="orgInfo.adf043"></div>
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
  </div>
</template>

<script>
export default {
  onLoad(option) {
    this.userInfo = uni.getStorageSync('userInfo')
    if (option) {
      let item = JSON.parse(decodeURIComponent(option.item))
      this.adf070 = item.adf070
      this.initInfo(this.adf070)
    }

    if (this.userInfo) {
      this.isLogin = true
      this.initPlan(this.adf070)
    } else {
      this.isLogin = false
    }
  },
  name: '',
  data() {
    return {
      userInfo: {},
      isLogin: false,
      classInfo: {},
      orgInfo: {},
      isOrder: false,
      orderNum: undefined,
      adc040: undefined, //预约成功编号
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
    init(aaf001) {
      let paramObj = {
        method: 'jy301_train101',
        aaf001: aaf001,
      }
      this.$utils.request(null, paramObj, true).then((res) => {
        this.orgInfo = res.data
        this.orgInfo.logoSrc = this.$downLoadImgSrc + this.orgInfo.adf031
      })
    },
    //查询培训计划详情
    initInfo(adf070) {
      let paramObj = {
        method: 'jy306_service02',
        apiCode: 'jy306_service02',
        adf070,
      }
      this.$utils.request('/api/business/invoke', paramObj, true, true, 'cipher').then((res) => {
        this.classInfo = res.data
        this.orderNum = this.classInfo.signed
        this.classInfo.coverImg = this.$downLoadImgSrc + this.classInfo.aae708
        this.orgInfo = res.data
		//添加查看培训计划浏览记录
		this.cz29Param.acz01w = this.jobFairInfo.adf070; //业务信息
		this.cz29Param.acz01x = this.jobFairInfo.adf077; //业务信息
		this.cz29Param.acz01s = '27' //足迹类型:查看单位
		this.cz29Param.acz01q = this.userInfo.aac001; //主体信息
		this.cz29Param.acz01r = this.userInfo.aac003; //主体信息
		this.$utils.addFootprint(this.cz29Param)
      })
    },
    //查询该计划的具体预约情况
    initPlan(adf070) {
      let paramObj = {
        // aac147: this.userInfo.aac147,
        aac001: this.userInfo.aac001,
        adf070,
        pageNumber: '1',
        pageSize: '10',
        method: 'jy306_service13',
        paginationModel: 'mostCount',
      }
      this.$utils.request('/api/business/invoke', paramObj, true, true, 'cipher').then((res) => {
        console.log(res, '99999')

        if (res?.pageBean?.list.length) {
          let { adc040, signed } = res.pageBean.list[0]
          this.adc040 = adc040 //预约成功的编号
          this.orderNum = signed
          this.isOrder = true
        } else {
          this.isOrder = false
        }
      })
    },

    //跳转机构详情页面
    toPage() {
      this.$utils.navigateTo(
        '/pages/trainingClass/orgDetail/orgDetail?item=' + encodeURIComponent(JSON.stringify(this.orgInfo)),
      )
    },

    //预约班级
    toAppoint() {
      if (!this.isLogin) {
        this.$refs.modalPopup.open()
        return
      }
      if (this.isLogin && this.isOrder) return
      if (this.classInfo.status != 0) return
      let paramObj = {
        adf070: this.classInfo.adf070,
        aac001: this.userInfo.aac001,
        aac147: this.userInfo.aac147,
        aac003: this.userInfo.aac003,
        identityCardCode: this.userInfo.aac147,
        aac067: this.userInfo.customMap.aae005,
        method: 'jy306_service10',
      }
      this.$utils.request('/api/business/invoke', paramObj, true, true, 'cipher').then((res) => {
        this.$utils.showToast('预约成功!')
        this.isOrder = true
        this.orderNum = Number(this.orderNum) + 1
        this.adc040 = res.data.adc040 //预约成功编号
        this.initInfo(this.adf070)
      })
    },

    //取消预约
    cancelAppoint() {
      let paramObj = {
        adc040: this.adc040,
        aac001: this.userInfo.aac001,
        aac147: this.userInfo.aac147,
        identityCardCode: this.userInfo.aac147,
        method: 'jy306_service11',
      }
      this.$utils.request('/api/business/invoke', paramObj, true, true, 'cipher').then((res) => {
        this.$utils.showToast('取消成功!')
        this.orderNum = Number(this.orderNum) - 1
        this.isOrder = false
        this.initInfo(this.adf070)
      })
    },
  },
}
</script>

<style lang="less" scoped>
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

  .work-top {
    height: 228px;
    width: 1640px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    margin: 20px auto 0 auto;
    background: linear-gradient(180deg, #ffffff 0%, #ffffff 100%);
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #d9d9d9;
    padding: 0 30px;

    .top-lt {
      display: flex;
      align-items: center;
      > div:nth-child(1) {
        image {
          width: 250px;
          height: 180px;
        }
        padding-right: 24px;
      }
      > div:nth-child(2) {
        width: 680px;
        .class-name {
          font-weight: 600;
          font-size: 24px;
          color: rgba(0, 0, 0, 0.9);
          padding-bottom: 16px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .info-item {
          font-size: 16px;
          color: rgba(0, 0, 0, 0.6);
          padding-top: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          span {
            color: rgba(0, 0, 0, 0.9);
          }
          &:nth-child(4) {
            span {
              color: #0c6af7;
            }
          }
        }
      }
    }
    .top-rt {
      display: flex;
      align-items: center;
      > div:nth-child(1) {
        font-size: 20px;
        margin-right: 30px;
        font-weight: 400;
        span {
          color: #eb3527;
          font-weight: 500;
          padding-right: 4px;
        }
      }
      .btn {
        width: 158px;
        height: 52px;
        line-height: 52px;
        color: #fff;
        border-radius: 4px 4px 4px 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 30px;
        font-size: 20px;
        &.status0 {
          background: #0c6af7;
        }
        &.status1 {
          background: #e4a128;
        }
        &.status2 {
          background: #eb3527;
        }
        &.status3 {
          background: #bfbfbf;
        }
        image {
          width: 20px;
          height: 20px;
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
    height: calc(100% - 280px);
    width: 1640px;
    margin: 30px auto 0 auto;
    box-sizing: border-box;
    overflow: hidden;

    .bottom-lt {
      height: 347px;
      width: calc(100% - 660px);
      margin-right: 60px;
      box-sizing: border-box;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #d9d9d9;
    }

    .bottom-lt-none {
      height: 347px;
      width: 100%;
      padding-right: 60px;
      box-sizing: border-box;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #d9d9d9;
    }

    .bottom-rt {
      width: 600px;
      height: 347px;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #d9d9d9;
      box-sizing: border-box;
    }
  }
}

.bottom-box {
  height: calc(100% - 65px);
  box-sizing: border-box;
  overflow: hidden;
  padding: 20px 30px 10px 30px;

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
  + .bottom-con {
    height: calc(100% - 40px);
    padding-left: 14px;

    .scroll {
      padding-left: 0;
    }
  }

  .bottom-con2 {
    height: 95%;

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
        background: #f3faff;
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
  .intro {
    padding-top: 28px;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    line-clamp: 3;
    -webkit-line-clamp: 3;
    font-weight: 400;
    font-size: 18px;
    color: rgba(0, 0, 0, 0.6);
    line-height: 25px;
  }
}
.status0,
.status1,
.status2 {
  color: #fff;
  padding: 2px 6px;
  margin-right: 12px;
}
.status0 {
  background-color: #1890ff;
}
.status1 {
  background-color: #52c41a;
}
.status2 {
  background-color: #bfbfbf;
}
</style>
