<template>
  <xu-common-shell :title="loginInfo.aab004">
    <view class="center">
      <!-- 顶部标题栏 -->
      <div class="wrap-con" style="height: 65px">
        <div class="wrap-title">
          <div class="title-lt">
            <div class="lt-text">
              <span><text style="color: #0c6af7">职位</text> 详情</span>
            </div>
          </div>
          <div class="title-rt rt-address">
            <div>
              <image src="../../static/images/img/recruitment/icon_home.png" mode="aspectFit" class="icon_home"></image>
              <span>企业中心&nbsp;&gt;&nbsp;职位管理&nbsp;&gt;&nbsp;职位详情</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 职位基本信息 -->
      <div class="work-top">
        <div class="work-title">
          <div class="work-name">{{ workInfo.acb213 }}</div>
          <div class="work-money">
            薪资待遇：
            <span>{{ workInfo.acb21h && workInfo.acb21j ? workInfo.acb21h + '~' + workInfo.acb21j : '' }}</span>
            <span>{{ workInfo.acb21h && !workInfo.acb21j ? workInfo.acb21h + '元以上' : '' }}</span>
            <span>{{ !workInfo.acb21h && workInfo.acb21j ? workInfo.acb21j + '元以下' : '' }}</span>
            <span>{{ !workInfo.acb21h && !workInfo.acb21j ? '薪资面议' : '' }}</span>
            <label v-if="workInfo.acb21h && workInfo.acb21j">{{
              workInfo.acb21h || workInfo.acb21j ? '元/月' : ''
            }}</label>
            <label v-if="(workInfo.acb21h && !workInfo.acb21j) || (!workInfo.acb21h && workInfo.acb21j)">{{
              workInfo.acb21h || workInfo.acb21j ? '/月' : ''
            }}</label>
          </div>
        </div>
        <div class="work-address">
          <span v-show="workInfo.acb217">{{ workInfo.acb217 }}</span>
          <span v-show="workInfo.acb217">|</span>
          <span v-show="workInfo.acc217">{{ workInfo.acc217 }}</span>
          <span v-show="workInfo.acc217">|</span>
          <span v-show="workInfo.aac011">{{ $codeConfig.getCodeLabel('aac011', workInfo.aac011) }}</span>
          <span v-show="workInfo.aac011">|</span>
          <span v-show="workInfo.acb21g">招{{ workInfo.acb21g }}人</span>
		   <span v-show="workInfo.acb469Desc">|</span>
		  <span v-show="workInfo.acb469Desc">工作方式：{{workInfo.acb469Desc}}</span>
		   <span v-show="workInfo.acb303">|</span>
		  <span v-show="workInfo.acb303">工作地点：{{workInfo.acb303}}</span>
        </div>
        <div v-if="workInfo.acb214 && workInfo.acb214" class="work-tip">
          <span v-for="item in workInfo.acb214.split(',')" :key="item">{{ item }}</span>
        </div>
      </div>

      <!-- 职位信息和企业信息 -->
      <div class="work-bottom">
        <div :class="isAab001 ? 'bottom-lt' : 'bottom-lt-none'">
          <div class="main-title">
            <div>职位信息</div>
          </div>
          <div class="bottom-box">
            <div class="bottom-title">
              <div class="title-blt">岗位描述：</div>
            </div>
            <div class="bottom-con2" v-if="workInfo.acb216">
              <p v-dompurify-html="workInfo.acb216"></p>
            </div>
            <div class="no-data">
              <yt-none :isShow="!workInfo.acb216" tip="暂无岗位描述"></yt-none>
            </div>
            <div class="person-bot">
              <div class="bottom-title">
                <div class="title-blt">岗位联系人：</div>
                <div v-if="workInfo.acb224 || workInfo.aae004">
                  <p>{{ workInfo.acb224 || workInfo.aae004 }}</p>
                </div>
              </div>
              <div class="bottom-title">
                <div class="title-blt">岗位联系电话：</div>
                <div v-if="workInfo.acb225 || workInfo.aae005">
                  <div class="decr-box">
                    <p>{{ workInfo.acb225 || workInfo.aae005 }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bottom-rt" v-if="isAab001">
          <div class="main-title">
            <div>企业信息</div>
          </div>
          <div class="bottom-box h45">
            <div class="bottom-con">
              <div class="unit-info">
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
                    <!-- unitInfo.aab022 ? $codeConfig.getCodeLabel('aab022', unitInfo.aab022) : '未知' -->
                    <span class="text-blue">{{ unitInfo.aab022Desc || '未知' }}</span>
                  </p>
                  <p>统一社会信用代码：{{ unitInfo.aab998 ? unitInfo.aab998 : '未知' }}</p>
                  <!-- <p>公司规模：{{ unitInfo.aab056 ? $codeConfig.getCodeLabel('aab056', unitInfo.aab056) : '未知' }}</p> -->
                  <p>公司规模：{{ unitInfo.aab056Desc ? unitInfo.aab056Desc : '未知' }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bottom-box h45" style="padding-top: 0">
            <div class="bottom-con">
              <div v-if="workList.length > 0" class="jobBox">
                <div class="work-list" :style="`margin-left:-${(numIndex - 1) * 526}px;`">
                  <div class="work-item" v-for="(item, index) in workList" :key="index" @click="toPage(item)">
                    <div class="item-title">
                      <div class="item-name">{{ item.acb213 }}</div>
                      <div class="item-money">
                        <span>{{ item.acb21h && item.acb21j ? item.acb21h + '~' + item.acb21j : '' }}</span>
                        <span>{{ item.acb21h && !item.acb21j ? item.acb21h + '以上' : '' }}</span>
                        <span>{{ !item.acb21h && item.acb21j ? item.acb21j + '以下' : '' }}</span>
                        <span>{{ !item.acb21h && !item.acb21j ? '薪资面议' : '' }}</span>
                        <label>{{ item.acb21h || item.acb21j ? '元' : '' }}</label>
                      </div>
                    </div>
                    <div>
                      <span v-if="item.aac011"
                        >{{
                          item.aac011 ? $codeConfig.getCodeLabel('aac011', item.aac011) : '未知学历'
                        }}&nbsp;&nbsp;&nbsp;</span
                      >
                      <span v-if="item.acb00r">{{ item.acb00r }}</span>
                      <span v-if="item.acb469"
                        >{{
                          item.acb469 ? $codeConfig.getCodeLabel('acb469', item.acb469) : '未知状态'
                        }}&nbsp;&nbsp;&nbsp;</span
                      >
                      <span v-if="item.aab056"
                        >{{
                          item.aab056 ? $codeConfig.getCodeLabel('aab056', item.aab056) : '未知规模'
                        }}&nbsp;&nbsp;&nbsp;</span
                      >
                    </div>
                    <div class="item-decr">
                      <span>工作地点：{{ item.acb217 ? item.acb217 : '未知地点' }}</span>
                    </div>
                  </div>
                </div>
                <div class="botItem">
                  <div
                    :class="numIndex === index + 1 ? 'numActive' : ''"
                    @click="numIndex = index + 1"
                    v-for="(it, index) in workList"
                    :key="index"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="btn">
        <span @click="backTo">返回</span>
      </div>
    </view>
  </xu-common-shell>
</template>

<script>
export default {
  name: 'workDetail',
  data() {
    return {
      loginInfo: this.$loginConfig.getLoginInfo(),
      workInfo: {},
      unitInfo: {},
      workList: [],
      currentPage: 0,
      numIndex: 1,
      isAab001: false,
    }
  },
  onLoad(option) {
    if (option) {
      this.workInfo = JSON.parse(option.item)
      this.currentPage = 1
    }
    this.init()
  },
  methods: {
    init() {
      let param = {
        method: 'jy202_hrm102',
        acb210: this.workInfo.acb210,
      }
      this.$http.post(this.$requestConstant.businessRequestType, 'jy202_hrm102', null, param, true).then((res) => {
        this.$nextTick(() => {
          this.workInfo = res.data.cb21VO
          this.isAab001 = true
          this.queryCompany()
        })
      })
    },
    queryCompany() {
      let param = {
        method: 'jy202_hrm111',
        aab001: this.workInfo.aab001,
      }
      this.$http.post(this.$requestConstant.businessRequestType, 'jy202_hrm111', null, param, true).then((res) => {
        this.unitInfo = res.data.ab01VO
        if (this.unitInfo.aae707) {
          this.unitInfo.headImg = this.$utils.getFileLoadUrl(this.unitInfo.aae707)
        } else if (this.unitInfo?.ce23List && this.unitInfo?.ce23List.length > 0) {
          this.unitInfo.headImg = this.$utils.getFileLoadUrl(this.unitInfo.ce23List[0].aae707)
        } else {
          this.unitInfo.headImg = this.$utils.getRealImgUrl('img/recruitment/icon_unit.png')
        }
        this.queryWorkList()
      })
    },
    // 查询岗位
    queryWorkList() {
      let param = {
        method: 'jy202_hrm101',
        aab001: this.unitInfo.aab001,
        acb468: '1', //岗位是否上线（1：上线，0：下线）
        AAE100: '1', //岗位是否有效（1：有效，0：无效）
        audit_status: '0', //岗位审核通过的
        pageNumber: 1,
        pageSize: 3,
        paginationModel: 'mostCount',
      }
      this.$http.post(this.$requestConstant.businessRequestType, 'jy202_hrm101', null, param, true).then((res) => {
        this.workList = res.data.pageBean.list
      })
    },
    toPage(item) {
      this.$utils.navigateTo('/pages/recruitment/workDetail?item=' + encodeURIComponent(JSON.stringify(item)))
    },
    backTo() {
      this.$utils.navigateBack(1)
    },
  },
}
</script>
<style lang="scss" scoped>
.center {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 8px;

  .wrap-con {
    overflow: hidden;
    height: calc(100% - 100px);
    box-sizing: border-box;
    padding: 0 50px;
    .wrap-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 98px;
      width: 100%;
      .title-lt {
        font-size: 24px;
        line-height: 36px;
        color: #333333;
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        &:before {
          content: '';
          width: 8px;
          height: 23px;
          background: #0c6af7;
          border-radius: 2px;
        }
        .lt-text {
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          font-size: 18px;
          color: rgba(0, 0, 0, 0.9) !important;
          line-height: 21px;
          text-align: left;
          font-style: normal;
          text-transform: none;
          span {
            padding-left: 6px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 600;
            font-size: 24px;
            text-align: left;
            font-style: normal;
            text-transform: none;
          }
        }
      }
      .title-rt {
        width: 1300px;
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
    }
  }

  .work-top {
    height: 160px;
    width: 1740px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    background: url('../../static/images/img/recruitment/bg_top.png') center no-repeat;
    background-size: cover;
    margin: 20px auto 0 auto;
    padding: 12px 30px 0;
    .work-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: PingFang SC, PingFang SC;
      .work-name {
        font-weight: 600;
        font-size: 30px;
        color: rgba(0, 0, 0, 0.9);
        text-align: left;
      }
      .work-money {
        font-weight: 500;
        font-size: 24px;
        color: #eb3527;
      }
    }
    .work-address {
      padding-top: 6px;
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
      padding-top: 6px;
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

  .work-bottom {
    display: flex;
    justify-content: space-between;
    width: 1740px;
    margin: 30px auto 0 auto;
    box-sizing: border-box;
    overflow: hidden;
    .bottom-lt {
      height: 530px;
      width: calc(100% - 660px);
      margin-right: 60px;
      box-sizing: border-box;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #d9d9d9;
    }
    .bottom-lt-none {
      height: 530px;
      width: 100%;
      padding-right: 60px;
      box-sizing: border-box;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #d9d9d9;
    }
    .bottom-rt {
      width: 600px;
      height: 530px;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #d9d9d9;
      box-sizing: border-box;
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
    .bottom-box {
      height: calc(100% - 65px);
      box-sizing: border-box;
      overflow: hidden;
      padding: 40px 30px 10px 30px;
      &.h45 {
        height: 45%;
      }
      .no-data {
        padding: 10px;
        .none-box {
          margin-top: 0;
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
        .decr-box {
          font-size: 18px;
          color: #666666;
          line-height: 32px;
        }
      }
      .bottom-con {
        height: calc(100% - 40px);
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
        .jobBox {
          width: 526px;
          overflow: hidden;
          .work-list {
            width: 300%;
            display: flex;
            transition: all 0.3s ease-in-out;
            .work-item {
              width: 526px;
              height: 166px;
              padding: 20px 26px 12px;
              box-sizing: border-box;
              background-color: #f5f5f5;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              > :nth-child(2) {
                margin-top: -36px;
              }
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
                span {
                  padding-right: 8px;
                  white-space: nowrap;
                  color: #666666;
                  font-size: 16px;
                }
              }
            }
          }
          .botItem {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 24px;
            > div {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background-image: url('../../static/images/img/recruitment/Rectangle9.png');
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
              background-image: url('../../static/images/img/recruitment/Rectangle8.png');
            }
          }
        }
      }
      .bottom-con2 {
        height: 65%;
        margin-bottom: 30px;
        overflow: auto;
      }
    }
  }

  .btn {
    width: 1740px;
    margin: 24px auto 0 auto;
    text-align: right;
    span {
      font-size: 24px;
      padding: 0 24px;
      height: 48px;
      line-height: 48px;
      background: #0066d5;
      color: #ffff;
      display: inline-block;
      border-radius: 8px;
    }
  }
}
</style>
