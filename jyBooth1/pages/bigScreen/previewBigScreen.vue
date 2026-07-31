<template>
  <div class="big-screen" :class="isPrevire ? 'preview' : 'normal'">
    <view class="preview-box">
      <view class="preview-title">
        <text>欢迎您，来到太原“原圆就业”就业智能展位</text>
      </view>
      <view class="preview-center">
        <view class="preview-center-left">
          <view class="title-box">
            <view class="title-tag">
              <view class="tag-text">摊位编号：{{ urlDeviceId || previewDeviceId }}</view>
            </view>
            <view class="title-name">{{ unitInfo.aab004 }}</view>
          </view>
          <view class="preview-center-left-bottom">
            <view class="left-left">
              <image :src="image1 ? image1 : this.$defaultData.defaultCompanyInfo.defaultImg" />
              <view>
                <image src="../../static/images/big-screen-code.png" />
                <image src="../../static/images/img/publicImg/QR_code2.png" />
              </view>
            </view>
            <view class="left-right">
              <view>
                <view>公司简介：</view>
                <view v-if="unitInfo.aab092">
                  <i v-dompurify-html="unitInfo.aab092 ? unitInfo.aab092 : '暂无简介'"></i>
                </view>
                <view v-else>暂无简介</view>
              </view>
              <view>
                <view>公司简介：</view>
                <view>
                  <view
                    >地址：<span>{{ unitInfo.aab060 ? unitInfo.aab060 : '暂无' }}</span></view
                  >
                  <view
                    >邮箱：<span>{{ unitInfo.aae159 ? unitInfo.aae159 : '暂无' }}</span></view
                  >
                  <view>
                    <view
                      >联系人：<span>{{ unitInfo.aae004 ? unitInfo.aae004 : '暂无' }}</span></view
                    >
                    <view v-if="unitInfo.aae005">{{ unitInfo.aae005 }}</view>
                    <view v-else></view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="preview-center-right">
          <view></view>
          <view>
            <view>
              招聘岗位：<span>{{ total }}</span>个
            </view>
            <view>
              <view> 页数： </view>
              <template v-if="totalPages > 0">
              	<view
              	  v-for="(item, index) in totalPages > 3 ? 3 : totalPages"
              	  :key="index"
              	  class="page"
              	  :class="{ actived: item === currentPage }"
              	  :style="pageShow(item) === currentPage ? style2 : style1"
              	  @click="changePage(item)"
              	>
              	  <span>{{ pageShow(item) }}</span>
              	</view>
              </template>
              <view v-if="totalPages > 3 && totalPages - currentPage >= 3" class="page">...</view>
            </view>
            <view class="list-bottom">
              <view class="list-item" v-for="(item, index) in jobList" :key="index">
                <view class="item-box">
                  <view class="item-top">
                    <view class="name-image">
						<view class="item-name">{{ item.aca112 }}</view>
						<image src="../../static/images/remen.png" class="remen" v-if="item.acb218==1"></image>
					</view>
                    <view class="item-decr">
                      <view class="item-lt">
                        <text class="tag-item" v-if="item.acc217">{{
                          $codeConfig.getCodeLabel('acc217', item.acc217)
                        }}</text>
                        <text class="tag-item" v-if="item.aac011">{{
                          $codeConfig.getCodeLabel('AAC011', item.aac011)
                        }}</text>
                        <text class="tag-item" v-if="item.acb469">{{
                          $codeConfig.getCodeLabel('ACB469', item.acb469)
                        }}</text>
                      </view>
                    </view>
                    <view class="item-decr">
                      <view class="item-lt money">
                        薪资待遇：
                        <text>{{ item.acb21h || 0 }}-{{ item.acb21j || '不限' }}</text>
                        元/月
                      </view>
                      <view class="item-rt ready">
                        预招聘
                        <text>{{ item.acb21g }}</text>
                        人
                      </view>
                    </view>
                  </view>
                  <view class="item-bottom">
                    <image src="../../static/images/ic_company.png"></image>
                    <text>{{ item.acb217 }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </div>
</template>

<script>
export default {
  name: 'bigScreen',
  props: {
    visible: {
      type: Boolean,
      default: () => {
        return false
      },
    },
    previewDeviceId: {
      type: String,
      default: () => {
        return ''
      },
    },
  },
  data() {
    return {
      style1: {
        color: '#999999',
      },
      style2: {
        color: '#0682FE',
      },
      isPrevire: false,
      urlDeviceId: uni.getStorageSync('deviceInfo_1')?.ace711,
      unitInfo: {},
      jobList: [],
      currentPage: 1,
      totalPages: 0,
      acb210: '',
      image1: '',
      total: 0,
      currentSendInfoTimer: null,
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.isPrevire = true
          this.unitInit()
        }
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {
    this.unitInit()
  },
  methods: {
    pageShow(item) {
      let num = this.totalPages % 5 > 0 ? this.totalPages / 5 + 1 : this.totalPages / 5
      let row = Math.floor(this.currentPage / 5)
      let showNum = row * 5 + item
      return showNum
    },
    getUrlParam() {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const param = currentPage.options
      if (param) {
        this.isPrevire = false
        this.urlDeviceId = param.deviceId
      }
    },
    changePage(item) {
      this.currentPage = item
      this.jobListShow({ aab001: this.unitInfo.aab001, acb330: this.unitInfo.acb330, acb219: '1' })
    },
    unitInit() {
      // 获取设备唯一编码
      let param = {
        // ace711: uni.getDeviceInfo().deviceId,
        ace711: uni.getStorageSync('deviceInfo_1').ace711,
        ace769: '1',
        aae400: 18,
      }
      this.$http.post(this.$requestConstant.commonRequestType, 'jy204_hrm257', null, param, false).then((res) => {
        this.unitInfo = res?.data?.Ab01VO
        if (this.unitInfo) {
          this.unitInfo.aab092 = this.$utils.htmlDecode(this.unitInfo.aab092)
          this.ce23s = res?.data?.Ab01VO?.ce23s
          if (this.ce23s.length > 0) {
            this.ce23s.forEach((item, index) => {
              item.aae707 = this.$utils.getFileLoadUrl(item.aae707)
              if (index == 0) {
                this.image1 = item.aae707
              }
            })
          }
          this.jobListShow({ aab001: this.unitInfo.aab001, acb330: this.unitInfo.acb330, acb219: '1' })
        }
      })
    },
    jobListShow(param) {
      param.pageNumber = this.currentPage
      param.pageSize = 3
      param.paginationModel = 'mostCount'
      this.$http
        .post(this.$requestConstant.businessRequestType, 'jy204_hrm252', null, param, false)
        .then((responseData) => {
          let res = responseData ? responseData.data : {}
          this.jobList = res.pageBean.list
          // this.jobList = [...res.pageBean.list, ...res.pageBean.list, ...res.pageBean.list]
          this.currentPage = res.pageBean.pageNum
          this.totalPages = res.pageBean.pages
          this.total = res.pageBean.total
        })
    },
  },
}
</script>

<style lang="scss" scoped>
$preview-width: 1740px;
$preview-height: 700px;

$normal-width: 1920px;
$normal-height: 1080px - 85px;

.preview {
  width: calc($normal-width - 1px);
  height: $normal-height;
}

.normal {
  width: calc($normal-width - 1px);
  height: $normal-height;
}

.big-screen {
  padding: 42px 117px;
  background-image: url('../../static/images/loginBack.png');
  background-size: cover;

  .preview-box {
    height: 92%;

    .preview-title {
      font-family: SourceHanSansCNBold, SourceHanSansCNBold;
      font-weight: bold;
      font-size: 36px;
      color: #ffffff;
      line-height: 54px;
      text-align: center;
      font-style: normal;
    }

    .preview-center {
      margin-top: 12px;
      width: 100%;
      height: 100%;
      background-color: #ffffff;
      display: flex;

      .preview-center-left {
        width: 65%;
        height: calc(100% - 72px);
        padding: 42px 36px 0 36px;

        .title-box {
          height: 48px;
          display: flex;

          .title-tag {
            max-width: 30%;
            background-image: url('../../static/images/ic_num_bg.png');
            background-size: cover;

            .tag-text {
              line-height: 48px;
              padding: 0 20px 0 15px;
              font-size: 22px;
              font-weight: 500;
              color: #ffffff;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }

          .title-name {
            background: #f4f7fc;
            line-height: 48px;
            font-size: 32px;
            font-weight: bold;
            color: #333333;
            border: 1px solid #eeeeee;
          }
        }

        .preview-center-left-bottom {
          margin-top: 30px;
          display: flex;
          height: calc(100% - 52px);

          .left-left {
            width: 50%;
            height: 100%;

            > image {
              width: 100%;
              height: calc(50% - 4px);
              margin-bottom: 4px;
            }

            > view {
              width: 100%;
              height: calc(50% - 4px);
              position: relative;

              > image:first-child {
                width: 100%;
                height: 100%;
              }

              > image:last-child {
                position: absolute;
                top: 0;
                right: 0;
                width: 43%;
                height: 54%;
              }
            }
          }

          .left-right {
            width: 50%;
            height: calc(100% - 72px);
            padding: 0 36px;

            > view:first-child {
              height: 70%;

              > view:first-child {
                font-family: SourceHanSansCNBold, SourceHanSansCNBold;
                font-weight: bold;
                font-size: 24px;
                color: #333333;
                line-height: 36px;
                text-align: left;
                font-style: normal;
              }

              > view:last-child {
                height: 88%;
                font-family: SourceHanSansCN, SourceHanSansCN;
                font-weight: 400;
                font-size: 20px;
                color: #333333;
                line-height: 1.5;
                text-align: left;
                font-style: normal;
                overflow: auto;
              }
            }

            > view:last-child {
              width: 90%;
              margin-top: 12px;
              height: 30%;

              > view:first-child {
                font-family: SourceHanSansCNBold, SourceHanSansCNBold;
                font-weight: bold;
                font-size: 24px;
                color: #333333;
                line-height: 36px;
                text-align: left;
                font-style: normal;
              }

              > view:last-child {
                width: calc(100% - 66px);
                height: calc(100% - 60px);
                background: #f4f7fc;
                border-radius: 8px;
                opacity: 0.54;
                line-height: 2;
                padding: 28px 30px;

                > view {
                  font-family: SourceHanSansCN, SourceHanSansCN;
                  font-weight: 400;
                  font-size: 20px;
                  color: #999999;
                  text-align: left;
                  font-style: normal;
                  margin-bottom: 5px;

                  > span {
                    font-family: SourceHanSansCN, SourceHanSansCN;
                    font-weight: 400;
                    font-size: 20px;
                    color: #666666;
                    text-align: left;
                    font-style: normal;
                  }
                }

                > view:last-child {
                  display: flex;

                  > view {
                    margin-right: 20px;
                  }

                  > view:last-child {
                    color: #0682fe;
                  }
                }
              }
            }
          }
        }
      }

      .preview-center-right {
        width: 35%;
        height: 100%;
        display: flex;
        overflow: auto;

        > view:first-child {
          width: 38px;
          height: 100%;
          background: linear-gradient(270deg, #ffffff 0%, #f4f7fc 100%);
        }

        > view:nth-child(2) {
          width: 100%;
          padding: 51px 36px;

          > view:first-child {
            width: 100%;
            font-family: SourceHanSansCNBold, SourceHanSansCNBold;
            font-weight: bold;
            font-size: 28px;
            color: #333333;
            line-height: 42px;
            text-align: left;
            font-style: normal;

            > span {
              color: #0682fe;
            }
          }

          > view:nth-child(2) {
            display: flex;
            margin-bottom: 23px;

            > view:first-child {
              font-family: SourceHanSansCNBold, SourceHanSansCNBold;
              font-weight: bold;
              font-size: 24px;
              color: #333333;
              line-height: 36px;
              text-align: left;
              font-style: normal;
            }

            .page {
              width: 42px;
              height: 38px;
              line-height: 38px;
              background: #ffffff;
              border-radius: 4px;
              border: 1px solid #eeeeee;
              font-size: 16px;
              color: #999999;
              text-align: center;
              margin-left: 12px;
              cursor: pointer;
            }
          }

          .list-bottom {
            .list-item {
              margin-bottom: 17px;

              .item-box {
                background: #ffffff;
                border-radius: 8px;
                border: 1px solid #eeeeee;

                .item-top {
                  padding: 0 10px;
				  .name-image{
					  display: flex;
					  align-items: center;
					  .remen{
						  width: 14px;
						  height: 16px;
						  margin-left: 6px;
						  padding-bottom: 4px;
					  }
				  }
                  .item-name {
                    font-size: 16px;
                    font-weight: bold;
                    color: #333333;
                    line-height: 16px;
                    margin-bottom: 10px;
                    margin-top: 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }

                  .item-decr {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .item-lt {
                      font-size: 16px;
                      margin-bottom: 10px;
                      width: calc(100% - 120px);

                      .tag-item {
                        font-size: 16px;
                        color: #666666;
                        line-height: 16px;
                        height: 25px;
                        background: #f8f8f8;
                        border-radius: 4px;
                        padding: 0 8px;
                        margin-right: 8px;
                        max-width: 200px;
                        box-sizing: border-box;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      }

                      &.money {
                        font-size: 16px;
                        color: #999999;
                        line-height: 20px;

                        text {
                          color: #fe2c2c;
                          padding-right: 8px;
                        }
                      }
                    }

                    .item-rt {
                      &.edit-job {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        width: 120px;

                        image {
                          width: 24px;
                          height: 24px;
                        }

                        text {
                          font-size: 16px;
                          font-weight: bold;
                          color: #0682fe;
                          padding-left: 8px;
                        }
                      }

                      &.ready {
                        font-size: 16px;
                        color: #999999;

                        text {
                          color: #0682fe;
                        }
                      }
                    }
                  }
                }

                .item-bottom {
                  display: flex;
                  justify-content: flex-start;
                  align-items: center;
                  padding: 0 10px 10px;

                  image {
                    width: 16px;
                    height: 16px;
                  }

                  text {
                    font-size: 16px;
                    color: #666666;
                    padding-left: 8px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
