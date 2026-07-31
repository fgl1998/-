<template>
  <view class="unitPreview" :style="preview ? previewStyle : normalStyle">
    <image src="../../../static/images/loginBack.png" class="loginBack"></image>
    <view class="preview-box">
      <view class="preview-title">
        <text>欢迎您，来到太原“原圆就业”就业智能展位</text>
      </view>
      <view class="preview-con">
        <view class="con-lt">
          <view class="info-title">
            <view class="title-box">
              <view class="title-tag">
                <image src="../../../static/images/ic_num_bg.png" class="tag-bg"></image>
                <view class="tag-text">摊位编号：{{ unitInfo.aab022 }}</view>
              </view>
              <view class="title-name">{{ unitInfo.aab004 }}</view>
            </view>
          </view>
          <view class="info-con">
            <view class="info-lt">
              <view class="lt-top">
                <image :src="unitInfo.aae707"></image>
              </view>
              <view class="lt-bottom">
                <image src="../../../static/images/ic_code_bg.png"></image>
                <image src="../../../static/images/erweima.png" class="code"></image>
              </view>
            </view>
            <view class="info-rt">
              <view class="info-item">
                <view class="item-title">公司简介</view>
                <!-- <view class="item-decr" >{{ unitInfo.brief || unitInfo.aab092 }}</view> -->
                <view
                  class="item-decr"
                  v-if="unitInfo.brief"
                  v-dompurify-html="unitInfo.brief ? unitInfo.brief : '暂无简介'"
                ></view>
                <view class="item-decr" v-else v-dompurify-html="unitInfo.aab092 ? unitInfo.aab092 : '暂无简介'"></view>
              </view>
              <view class="info-item">
                <view class="item-title">联系方式</view>
                <view class="item-decr decr-border">
                  <view>
                    <text>地址：</text>
                    {{ unitInfo.aae006 }}
                  </view>
                  <view>
                    <text>邮箱：</text>
                    {{ unitInfo.aae159 }}
                  </view>
                  <view>
                    <text>联系人：</text>
                    {{ unitInfo.aae004 }}
                    <text class="tel">{{ unitInfo.aae005 }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="con-rt">
          <view class="list-title">
            预计招聘：
            <text>{{ unitInfo.recuitnumber }}个</text>
          </view>
          <view class="list-con">
            <view class="list-top">
              <view class="list-name">招聘岗位：</view>
              <view class="list-page">
                <view
                  v-for="(item, index) in totalPages"
                  :key="index"
                  class="page"
                  :class="{ actived: item === currentPage }"
                  :style="item === currentPage ? style2 : style1"
                  @click="select(item, index)"
                >
                  <span>{{ item }}</span>
                </view>
              </view>
            </view>
            <view class="list-bottom">
              <view class="list-item" v-for="(item, index) in jobList.list" :key="index">
                <view class="item-box">
                  <view class="item-top">
                    <view class="item-name">{{ item.acb213 }}</view>
                    <view class="item-decr">
                      <!-- {{item.acb214List}} -->
                      <view class="item-lt">
                        <!-- <text class="tag-item" v-for="(itemT,indexT) in item.acb214List" :key="indexL">{{itemT}}</text> -->
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
                      <view
                        v-if="preview"
                        class="item-rt edit-job"
                        @click="openEdit({ type: true, acb210: item.acb210 })"
                      >
                        <image src="../../../static/images/toujian.png"></image>
                        <text>编辑职位</text>
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
                    <image src="../../../static/images/ic_company.png"></image>
                    <text>{{ item.acb217 }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="con-line"></view>
      </view>
    </view>

    <!--职位编辑-->
    <job-edit :editJob="editJob" :acb210="acb210" @closeEdit="openEdit"></job-edit>
  </view>
</template>

<script>
import jobEdit from './jobEdit'

export default {
  name: 'unitPreview',
  components: {
    jobEdit,
  },
  props: {
    releaseShow: {
      type: Boolean,
    },
    brief: {
      type: String,
    },
    releaseSuc: {
      type: Boolean,
    },
    preview: {
      type: Boolean,
      default: false,
    },
    deviceId: {
      type: String,
    },
  },
  data() {
    return {
      previewStyle: {
        width: '1802px',
        height: '1032px',
      },
      normalStyle: {
        width: '1920px',
        height: '1080px',
      },
      style1: {
        color: '#999999',
      },
      style2: {
        color: '#0682FE',
      },
      param1: {
        apiCode: 'jy201_hrm217',
        method: 'jy201_hrm217',
        aab001: '',
      },
      param2: {
        apiCode: 'jy204_hrm252',
        method: 'jy204_hrm252',
        aab001: '',
        acb219: '1',
        pageSize: 4,
        pageNumber: this.currentPage,
        paginationModel: 'mostCount',
      },
      unitInfo: {},
      jobList: {},
      currentPage: 1,
      totalPages: 10,
      editJob: false,
      acb210: '',

      aab001: '',
      acb330: '',
    }
  },
  watch: {
    releaseShow(newVal, oldVal) {
      if (newVal) {
        this.unitInit()
        this.jobListShow()
        // 投屏页面定时轮训
        // this.currentSendInfoTimer = setInterval(() => {
        //   if (this.currentPage == this.jobList.pages) {
        //     this.currentPage = 1;
        //   } else {
        //     this.currentPage++;
        //   }
        //   this.param2.pageNumber = this.currentPage;
        //   this.jobListShow()
        // }, 2000)
      } else {
        if (this.currentSendInfoTimer) {
          clearInterval(this.currentSendInfoTimer)
        }
      }
    },
  },

  computed: {
    pages: {
      get() {
        const c = this.currentPage
        const t = this.totalPages
        const numArr = []
        if (t <= 7) {
          for (let i = 1; i <= t; i++) {
            numArr.push(i)
          }
          return numArr
        } else if (t > 7) {
          if (c <= 3) {
            //return [1, 2, 3, 4, 5, '...', t]
            return [1, 2, 3, 4, '...']
          } else if (c >= t - 3) {
            return [1, '...', t - 4, t - 3, t - 2, t - 1, t]
          } else {
            return [1, '...', c - 1, c, c + 1, '...', t] // 第三种情况
          }
        }
      },
      set(v) {},
    },
  },
  mounted() {
    let webSocketParams = this.getRequestParams()
    if (webSocketParams) {
      this.aab001 = webSocketParams.aab001
      this.acb330 = webSocketParams.acb330
    }

    let loginInfo = this.$loginConfig.getLoginInfo()

    if (loginInfo) {
      this.aab001 = loginInfo.aab001
      this.acb330 = loginInfo.acb330
    }
    this.unitInit()
    this.jobListShow()
  },
  methods: {
    select(item, index) {
      this.param2.pageNumber = ++index
      this.jobListShow()
    },
    unitInit() {
      this.param1.aab001 = this.aab001
      this.$http
        .post(this.$requestConstant.businessRequestType, 'jy201_hrm217', null, this.param1, true)
        .then((responseData) => {
          console.log(responseData, 'responseData2')

          let res = responseData ? responseData.data : {}
          this.unitInfo = res.ab01HrmVO
          this.unitInfo.aae707 = this.unitInfo.aae707
            ? this.$host +
              '/api/base/downloadBusinessFile.do?fileId=' +
              this.unitInfo.aae707 +
              '&channelCode=sc&sysCode=jyplat'
            : require('../../../static/images/loginBack.png')
          if (this.releaseShow) {
            this.unitInfo.brief = this.brief
          }
        })
    },
    jobListShow() {
      this.param2.aab001 = this.aab001
      this.param2.acb330 = this.acb330
      this.param2.acb219 = '1'
      this.param2.paginationModel = 'mostCount'
      this.$http
        .post(this.$requestConstant.businessRequestType, 'jy204_hrm252', null, this.param2, true)
        .then((responseData) => {
          console.log(responseData, 'responseData1')

          let res = responseData ? responseData.data : {}
          this.jobList = res.pageBean
          this.currentPage = this.jobList.pageNum
          this.totalPages = this.jobList.pages
        })
    },
    openEdit(obj) {
      this.editJob = obj.type
      this.acb210 = obj.acb210 + ''
      if (!obj.type) {
        this.jobListShow()
      }
    },

    getRequestParams() {
      let url = location.href
      let requestParams = {}
      if (url.indexOf('?') !== -1) {
        let str = url.substring(url.indexOf('?') + 1) //截取?后面的内容作为字符串
        let strs = str.split('&') //将字符串内容以&分隔为一个数组
        for (let i = 0; i < strs.length; i++) {
          requestParams[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1])
          // 将数组元素中'='左边的内容作为对象的属性名，'='右边的内容作为对象对应属性的属性值
        }
      }
      return requestParams
    },
  },
}
</script>

<style lang="scss" scoped>
$con-rt-width: 530px;
$preview-title-height: 70px;

.unitPreview {
  position: relative;
  width: 100%;
  height: 100%;

  * {
    box-sizing: border-box;
  }

  .loginBack {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }

  .preview-box {
    .preview-title {
      font-family: SourceHanSansCNBold, SourceHanSansCNBold;
      font-weight: bold;
      font-size: 36px;
      color: #ffffff;
      line-height: 54px;
      text-align: center;
      font-style: normal;
      padding: 42px 0;
    }

    .preview-con {
      border: 1px solid red;
      //height: 100%;
      height: 800px;
      position: absolute;
      top: 120px;
      bottom: 20px;
      left: 50px;
      right: 50px;
      background: #ffffff;
      border-radius: 8px;

      .con-lt {
        position: absolute;
        top: 0;
        left: 0;
        right: calc(#{$con-rt-width} + 38px);
        width: calc(100% - #{$con-rt-width} - 38px);
        height: 100%;
        overflow: hidden;
        padding: 20px 20px 2px;

        .info-title {
          position: relative;
          height: 40px;
          margin-bottom: 20px;

          .title-box {
            background: #f4f7fc;
            border-radius: 8px;
            border: 1px solid #eeeeee;
            position: absolute;

            .title-tag {
              float: left;
              position: relative;

              .tag-bg {
                width: 100%;
                height: 48px;
                position: absolute;
                left: 0;
                top: 0;
              }

              .tag-text {
                line-height: 48px;
                padding: 0 20px 0 15px;
                font-size: 22px;
                font-weight: 500;
                color: #ffffff;
                position: relative;
                z-index: 1;
              }
            }

            .title-name {
              height: 48px;
              line-height: 48px;
              font-size: 22px;
              font-weight: bold;
              color: #333333;
              padding: 0 20px;
              float: left;
            }
          }
        }

        .info-con {
          position: relative;
          height: calc(100% - 100px);
          top: 10px;
          border: 1px solid red;
          .info-lt {
            background: #ffffff;
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;

            .lt-top {
              width: 200px;
              height: 200px;

              image {
                width: 100%;
                height: 100%;
              }
            }

            .lt-bottom {
              width: 200px;
              height: 200px;
              top: 10px;
              border: 1px dashed #dddddd;
              position: relative;

              image {
                width: 100%;
                height: 100%;
              }

              .code {
                position: absolute;
                right: 10px;
                top: 2px;
                // width: 180px;
                // height: 146px;
                width: 40%;
                height: 50%;
              }
            }
          }

          .info-rt {
            padding-left: 220px;
            height: 100%;

            .info-item {
              margin-top: 10px;
              margin-bottom: 10px;

              &:first-child {
                height: 50%;
                overflow: auto;
              }

              &:last-child {
                margin-bottom: 0;
              }

              .item-title {
                font-size: 20px;
                font-weight: bold;
                color: #333333;
                line-height: 20px;
                margin-bottom: 4px;
              }

              .item-decr {
                font-size: 16px;
                color: #333333;
                line-height: 32px;
                text-indent: 40px;
                text-align: justify;
                display: -webkit-box;
                -webkit-box-orient: vertical; //方向
                -webkit-line-clamp: 7; //设置在第几行添加省略号
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;

                &.decr-border {
                  // width: 400px;
                  max-height: 180px;
                  padding: 14px 5px;
                  box-sizing: border-box;
                  background: rgba($color: #f4f7fc, $alpha: 0.5);
                  border-radius: 8px;
                  text-indent: 0;

                  view {
                    font-size: 16px;
                    color: #666666;
                  }

                  text {
                    font-size: 16px;
                    font-weight: 400;
                    color: #999999;
                    line-height: 24px;

                    &.tel {
                      color: #0682fe;
                      padding-left: 20px;
                    }
                  }
                }
              }
            }
          }
        }
      }

      .con-rt {
        width: $con-rt-width;
        height: 100%;
        overflow: hidden;
        position: absolute;
        right: 0;
        top: 0;
        padding: 20px 20px 2px;
        box-sizing: border-box;

        .list-title {
          font-size: 20px;
          font-weight: bold;
          color: #333333;
          line-height: 20px;
          margin-bottom: 10px;

          text {
            color: #0682fe;
          }
        }

        .list-con {
          .list-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;

            .list-name {
              font-size: 16px;
              font-weight: bold;
              color: #333333;
              line-height: 20px;
            }

            .list-page {
              width: calc(100% - 80px);
              display: flex;
              justify-content: flex-start;
              align-items: center;
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
          }

          .list-bottom {
            .list-item {
              margin-bottom: 10px;

              .item-box {
                background: #ffffff;
                border-radius: 8px;
                border: 1px solid #eeeeee;

                .item-top {
                  padding: 0 10px;

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

      .con-line {
        width: 38px;
        height: 100%;
        position: absolute;
        top: 0;
        right: $con-rt-width;
        bottom: 0;
        background: linear-gradient(270deg, #ffffff 0%, #f4f7fc 100%);
      }
    }
  }
}
</style>
