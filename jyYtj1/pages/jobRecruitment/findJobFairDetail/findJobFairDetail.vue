<template>
  <div class="page">
    <!-- 招聘会明细 -->
    <common-header></common-header>

    <div class="page-wrap">
      <div class="wrap-center">
        <div class="job-wrap wrap-box">
          <div class="wrap-con" style="height: 65px">
            <div class="wrap-title">
              <div class="title-lt">
                <div class="lt-text" style="width: 400px">
                  <span><text style="color: #0c6af7">招聘</text> 会 </span>/招聘会详情介绍，原圆就业伴你行
                </div>
              </div>
              <div class="title-rt rt-address">
                <div>
                  <image src="../../../static/images/findWork/icon_home.png" mode="aspectFit" class="icon_home"></image>
                  <span>首页&nbsp;&gt;&nbsp;招聘会&nbsp;&gt;&nbsp;招聘会详情</span>
                </div>
              </div>
            </div>
          </div>
          <div class="detailBox">
            <div class="job-top">
              <div class="top-lt">
                <image :src="jobFairInfo.logo" mode="scaleToFill" class="job-logo"></image>
              </div>
              <div class="top-rt">
                <div class="job-info">
                  <div class="job-title">
                    <div class="job-name">{{ jobFairInfo.acb331 }}</div>
                    <div class="job-btn" v-if="jobFairInfo.jobfairstate !== '2'">
                      <button class="btn btn-blue" disabled v-if="jobFairInfo.isApply == '1'">已报名</button>
                      <template v-else>
                        <button class="btn btn-blue" v-if="!isLogin" @click="signNoLogin">报名</button>
                        <button class="btn btn-blue" v-else @click="sign">报名</button>
                      </template>
                    </div>
                    <div v-else class="job-btn">
                      <span class="job-over">已结束</span>
                    </div>
                  </div>
                  <div class="botMain">
                    <div class="job-decr">
                      <p>时间：{{ jobFairInfo.acb333 + ' 至 ' + jobFairInfo.acb334 }}</p>
                      <p>主办单位：{{ jobFairInfo.acb484 }}</p>
                      <p>承办单位：{{ jobFairInfo.acb485 }}</p>
                      <!-- <p>
                        规模：{{
                          jobFairInfo.acb473 ? jobFairInfo.acb473 : 0
                        }}个展位&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;电话：<span>{{
                          jobFairInfo.aae005
                        }}</span>
                      </p> -->
                      <p>地址：{{ jobFairInfo.acb303 }}</p>
                      <!-- <p v-if="jobFairInfo.delay_detail">延期说明：{{ jobFairInfo.delay_detail }}</p> -->
                    </div>
                    <div class="btnNum">
                      <div class="btnItem">
                        <div>
                          <image
                            src="../../../static/images/findWork/icon_fairNum.png"
                            mode="scaleToFill"
                            class="icon-num"
                          ></image>
                        </div>
                        <div>{{ jobFairInfo.boothCount ? jobFairInfo.boothCount : 0 }}</div>
                        <div>展位数量(个)</div>
                      </div>
                      <div class="btnItem">
                        <div>
                          <image
                            src="../../../static/images/findWork/icon_unit1.png"
                            mode="scaleToFill"
                            class="icon-num"
                          ></image>
                        </div>
                        <div>{{ jobFairInfo.orderCount ? jobFairInfo.orderCount : 0 }}</div>
                        <div>报名企业(家)</div>
                      </div>
                      <div class="btnItem">
                        <div>
                          <image
                            src="../../../static/images/findWork/icon_workNum.png"
                            mode="scaleToFill"
                            class="icon-num"
                          ></image>
                        </div>
                        <div>{{ jobFairInfo.jobCount ? jobFairInfo.jobCount : 0 }}</div>
                        <div>招聘岗位(个)</div>
                      </div>
                      <div class="btnItem">
                        <div>
                          <image
                            src="../../../static/images/findWork/icon_perNum.png"
                            mode="scaleToFill"
                            class="icon-num"
                          ></image>
                        </div>
                        <div>{{ jobFairInfo.personCount ? jobFairInfo.personCount : 0 }}</div>
                        <div>招聘人数(人)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="job-bottom">
              <div class="bottom-lt">
                <div class="bottom-box">
                  <div class="bottom-title">
                    <div class="title-blt">招聘会描述：</div>
                  </div>
                  <div class="bottom-con">
                    <common-scroll>
                      <div class="decr-box" v-dompurify-html="jobFairInfo.acb486" v-if="jobFairInfo.acb486"></div>

                      <div class="nodata" v-else style="height: 230px">
                        <div class="nodata-pic">
                          <div class="nodata-img"></div>
                          <div class="nodata-text">暂无数据~</div>
                        </div>
                      </div>
                    </common-scroll>
                  </div>
                </div>
              </div>
              <div class="bottom-rt">
                <div class="bottom-box">
                  <div class="bottom-title">
                    <div class="title-blt">最新参会企业：</div>
                    <div class="title-brt">
                      <button class="btn btn-dblue" @click="tapList">查看全部</button>
                    </div>
                  </div>
                  <div class="bottom-con">
                    <common-scroll>
                      <div class="job-table">
                        <table v-if="jobList.length > 0">
                          <tr v-for="(item, index) in jobList" :key="index">
                            <td>{{ index + 1 }}号</td>
                            <td>{{ item.aab004 }}</td>
                          </tr>
                        </table>
                        <div class="nodata" v-else style="height: 230px">
                          <div class="nodata-pic">
                            <div class="nodata-img"></div>
                            <div class="nodata-text">暂无数据~</div>
                          </div>
                        </div>
                      </div>
                    </common-scroll>
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
  </div>
</template>

<script>
export default {
  onLoad(option) {
    if (option) {
      this.userInfo = uni.getStorageSync('userInfo')
      if (this.userInfo) {
        this.isLogin = true
      } else {
        this.isLogin = false
      }
      console.log(option)
      this.jobFairInfo = JSON.parse(decodeURIComponent(option.item))
      this.init()
    }
  },
  data() {
    return {
      userInfo: {},
      loading: false,
      jobFairInfo: '',
      jobList: [],
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
    // 查询招聘会详情详细
    init() {
      let param = {
        method: 'jy204_hrm101',
        acb330: this.jobFairInfo.acb330,
        aac001: this.userInfo.aac001,
      }
      this.$utils.request(null, param, true).then((res) => {
        this.jobFairInfo = res.cb33VO
        if (this.jobFairInfo.ycb337) {
          this.jobFairInfo.ycb337 = this.jobFairInfo.ycb337
            .replaceAll('\\r', '')
            .replaceAll('\\n', '')
            .replaceAll('\\t', '')
            .replace(/<img/g, '< img class="richImg"')
            .replaceAll('\\', '')
        }
        if (this.jobFairInfo.ce23List) {
          this.jobFairInfo.logo = this.$downLoadImgSrc + this.jobFairInfo.ce23List[0].aae707
        } else {
          if (this.jobFairInfo.acb487 == '3') {
            //零工
            this.jobFairInfo.logo = '../../../static/images/findWork/bg_jobFairt3.png'
          } else if (this.jobFairInfo.acb487 == '2' && this.jobFairInfo.acb481 == '1') {
            //校园
            this.jobFairInfo.logo = '../../../static/images/findWork/bg_jobFairt2.png'
          } else {
            if (this.jobFairInfo.acb481 == '1') {
              //现场招聘会
              this.jobFairInfo.logo = '../../../static/images/findWork/bg_jobFairt.png'
            } else {
              //网络
              this.jobFairInfo.logo = '../../../static/images/findWork/bg_jobFairt.png'
            }
          }
        }
        this.queryCompany()
		//添加查看招聘会浏览记录
		this.cz29Param.acz01w = this.jobFairInfo.acb330; //业务信息
		this.cz29Param.acz01x = this.jobFairInfo.acb331; //业务信息
		this.cz29Param.acz01s = '27' //足迹类型:查看单位
		this.cz29Param.acz01q = this.userInfo.aac001; //主体信息
		this.cz29Param.acz01r = this.userInfo.aac003; //主体信息
		this.$utils.addFootprint(this.cz29Param)
      })
    },
    queryCompany() {
      let param = {
        method: 'jy204_hrm102',
        acb330: this.jobFairInfo.acb330,
        aae100: '0', //有效
        aae033: '0', //审核通过
        pageNumber: '1',
        pageSize: '10',
      }
      this.$utils.request(null, param).then((res) => {
        let jobFairComList = res.pageBean
        if (jobFairComList.list.length > 0) {
          this.jobList = jobFairComList.list
        }
      })
    },
    signNoLogin() {
      this.$refs.modalPopup.open()
    },
    sign() {
      let param = {
        acb330: this.jobFairInfo.acb330,
        aac001: this.userInfo.aac001,
        aac003: this.userInfo.aac003,
        acb3b1: '0', //签到类型 (0: 刷卡签到 1: 微信百米签到 2: 人脸签到)
        yae100: '14',
        method: 'jy204_hrm110',
      }
      this.$utils.request('/api/business/invoke', param, true, true, 'cipher').then((res) => {
        this.$utils.showToast('报名成功')
        setTimeout(() => {
          this.init()
        }, 1000)
      })
    },
    tapList() {
		const acb331 =this.jobFairInfo.acb331
		const acz01t = this.jobFairInfo.acb481 == '1'?'3':'2' // 去岗位带的招聘会类型
      this.$utils.navigateTo('/pages/jobRecruitment/findJobFairDetail/jobFairUnit?acb330=' + this.jobFairInfo.acb330+'&acz01v='+acb331+'&acz01t='+acz01t)
    },
  },
}
</script>

<style lang="scss" scoped>
.job-wrap {
  height: 100%;
  .detailBox {
    width: 1640px;
    height: 650px;
    background: linear-gradient(180deg, #ffffff 0%, #ffffff 100%);
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #d9d9d9;
    margin: 25px auto 0 auto;
  }
  .job-top {
    height: 300px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    background: url('../../../static/images/service_rt_bg.png') left bottom repeat-x;
    background-size: 20px 12px;
    padding: 20px 50px 30px;

    .top-lt {
      .job-logo {
        width: 328px;
        height: 240px;
        background: #0578ee;
        box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.23);
        border: 4px solid #ffffff;
      }
    }

    .top-rt {
      padding-left: 30px;
      width: 100%;

      .job-info {
        .job-title {
          position: relative;
          margin-bottom: 15px;

          .job-name {
            font-size: 26px;
            color: #333333;
            max-width: 800px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .job-btn {
            position: absolute;
            right: 0;
            top: 0;

            .btn-blue {
              width: 160px;
              margin-bottom: 16px;
            }

            .btn-decr {
              color: #999999;
              font-size: 18px;
              text-align: center;

              span {
                color: #ff6305;
                padding: 0 8px;
              }
            }

            .job-over {
              color: #ff6305;
              font-size: 20px;
              font-weight: 600;
            }
          }
        }
        .botMain {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .job-decr {
            p {
              font-size: 18px;
              color: #666666;
              line-height: 40px;
              span {
                color: #2778ff;
              }
            }
          }
          .btnNum {
            width: 560px;
            display: flex;
            justify-content: space-between;
            .btnItem {
              width: 125px;
              height: 140px;
              text-align: center;
              padding-top: 20px;
              border-radius: 4px 4px 4px 4px;
              > div:nth-child(2) {
                font-family: PingFang SC, PingFang SC;
                font-weight: 600;
                font-size: 20px;
                color: rgba(0, 0, 0, 0.9);
                margin-bottom: 10px;
              }
              > div:nth-child(3) {
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                font-size: 16px;
                color: rgba(0, 0, 0, 0.6);
              }
              .icon-num {
                width: 48px;
                height: 48px;
              }
            }
            > div:first-child {
              background-color: #f1fff4;
              border: 1px solid #bfe7c7;
            }
            > div:nth-child(2) {
              background-color: #e9f8fe;
              border: 1px solid #b7d9e6;
            }
            > div:nth-child(3) {
              background-color: #ebf5ff;
              border: 1px solid #bad0e7;
            }
            > div:nth-child(4) {
              background-color: #fff8ed;
              border: 1px solid #ebd6b5;
            }
          }
        }
      }
    }
  }

  .job-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: calc(100% - 310px);
    padding: 18px 50px;
    box-sizing: border-box;

    .bottom-lt {
      height: 100%;
      width: 50%;
      padding-right: 60px;
      box-sizing: border-box;
    }

    .bottom-rt {
      width: 50%;
      height: 100%;
    }
  }
}

.bottom-box {
  height: 100%;

  .bottom-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    height: 40px;

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
    height: calc(100% - 70px);
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

  p {
    text-indent: 32px;
  }
}

.job-table {
  width: 100%;

  table {
    width: 100%;
    border-left: 1px solid #a2a7a9;
    border-top: 1px solid #a2a7a9;

    tr {
      td {
        height: 42px;
        line-height: 42px;
        border-right: 1px solid #a2a7a9;
        border-bottom: 1px solid #a2a7a9;
        font-size: 16px;
        color: #666666;
        padding: 0 24px;

        &:first-child {
          background-color: #eaf5ff;
          text-align: center;
          font-family: PingFang SC, PingFang SC;
          font-weight: 600;
          font-size: 16px;
          color: rgba(0, 0, 0, 0.9);
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
