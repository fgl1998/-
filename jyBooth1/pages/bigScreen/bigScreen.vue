<template>
  <div class="big-screen" :class="unitInfo ? 'normal' : 'preview'">
    <view class="preview-box" v-if="unitInfo">
      <view class="preview-title">
        <view class="left" :class="unitInfo.aab004 && unitInfo.aab004.length > 16 ? 'wrap' : ''">
          <image src="../../static/images/logo.png" class="logo" mode="aspectFit" />
          <view class="title">{{ unitInfo.aab004 }}</view>
        </view>
        <view class="right">{{ unitInfo.acb32b < 10 ? '0' + unitInfo.acb32b : unitInfo.acb32b }}号展位</view>
      </view>

      <view class="preview-center">
        <view class="preview-center-left">
          <view class="preview-center-left-bottom">
            <view class="left-right">
              <view class="left-left">
                <swiper v-if="ce23s.length" class="album-swiper" indicator-dots autoplay circular>
                  <swiper-item class="swiper-item" v-for="item in ce23s" :key="item.aae707">
                    <image :src="$utils.getFileLoadUrl(item.aae707)" />
                  </swiper-item>
                </swiper>
                <image v-else :src="this.$defaultData.defaultCompanyInfo.defaultImg" />
              </view>
              <view>
                <view>公司简介：</view>
                <view v-if="unitInfo.aab092">
                  <view class="scroll-container" v-dompurify-html="unitInfo.aab092"></view>
                </view>
                <view v-else>暂无简介</view>
              </view>
              <view>
                <view>公司地址：</view>
                <view>
                  <view>
                    地址：
                    <span>{{ unitInfo.aab060 ? unitInfo.aab060 : '暂无' }}</span>
                  </view>
                  <view>
                    邮箱：
                    <span>{{ unitInfo.aae159 ? unitInfo.aae159 : '暂无' }}</span>
                  </view>
                  <view>
                    <view>
                      联系人：
                      <span>{{ unitInfo.aae004 ? unitInfo.aae004 : '暂无' }}</span>
                    </view>
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
              预计招聘：
              <span>{{ total }}</span>
              个
            </view>
            <view class="list-bottom">
              <view class="list-item" v-for="(item, index) in jobList" :key="index">
                <view class="item-box">
                  <view class="item-top">
                    <view class="item-name">
                      <view>{{ item.acb213 }}</view>
                      <view class="money">
                        薪资待遇：
                        <!-- <text>{{ item.acb21h }}-{{ item.acb21j }}</text> -->
                        <text>{{
                          !item.acb21h || !item.acb21j ? '面议' : `${item.acb21h} - ${item.acb21j}元/月`
                        }}</text>
                      </view>
                    </view>
                    <view class="item-decr">
                      <view class="item-lt">
                        <text class="tag-item">{{ item.acc217_dsc }}</text>
                        <text class="tag-item">{{ $codeConfig.getCodeLabel('AAC011', item.aac011) }}</text>
                        <text class="tag-item">{{ $codeConfig.getCodeLabel('ACB469', item.acb469) }}</text>
                      </view>
                      <view class="item-rt">
                        <view class="ready">
                          预招聘
                          <text>{{ item.acb21g }}</text>
                          人
                        </view>
                      </view>
                    </view>
                  </view>
                  <view class="item-bottom">
                    <image src="../../static/images/ic_company_new.png"></image>
                    <text>{{ item.acb217 }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="40%"
        top="15%"
        :modal-append-to-body="false"
        :append-to-body="true"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
      >
        <el-form label-width="280px">
          <el-form-item label="请选择电视屏设备" required>
            <el-select style="width: 340px" ref="select" v-model="ace711_dsc" placeholder="请选择电视屏设备">
              <el-option :value="treeDataValue" style="overflow-y: scroll; height: 100%; max-height: 300px">
                <el-tree
                  default-expand-all
                  ref="tree"
                  :data="data"
                  node-key="label"
                  :props="defaultProps"
                  @node-click="handleNodeClick"
                ></el-tree>
              </el-option>
            </el-select>
            <el-button style="margin-left: 20px" type="primary" @click="queryDeviceInfo">刷新</el-button>
          </el-form-item>
          <el-form-item label="请输入校验码" required>
            <el-input placeholder="请输入校验码" v-model="ace772" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="chooseDevice">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'
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
      options: [],
      deviceId: '',
      dialogVisible: false,
      style1: {
        color: '#999999',
      },
      style2: {
        color: '#0682FE',
      },
      isPrevire: false,
      urlDeviceId: uni.getDeviceInfo().deviceId,
      unitInfo: {},
      jobList: [],
      currentPage: 1,
      totalPages: 0,
      acb210: '',
      total: 0,
      currentSendInfoTimer: null,
      qrCodeBase64: '',
      ace711: '', //设备id
      treeDataValue: '',
      data: [],
      ace711_dsc: '',
      ace772: '', //设备校验码
      isScrolling: true, // 控制滚动的状态
      scrollTimer: null,
      currentOffset: 0, //当前偏移量
      videoExt: ['mp4', 'm4v', 'mov', '3gp', 'flv', 'webm', 'm3u8'],
      ce23s: [],
    }
  },
  computed: {
    defaultProps() {
      return {
        children: 'children',
        label: 'label',
      }
    },
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
    // this.getUrlParam();
    this.queryDeviceInfo()
    this.unitInit()
    this.currentSendInfoTimer = setInterval(() => {
      //后台返回总数为0，或者当前页码等于总页数时，重置页码
      if (this.totalPages == 0 || this.currentPage == this.totalPages) {
        this.currentPage = 1
      } else {
        this.currentPage++
      }
      this.unitInit()
    }, 5000)

    // this.$nextTick(() => {
    //   this.scrollTimer = setTimeout(this.startAutoScroll, 3000);
    // })
  },
  onShow() {
    let deviceInfo_2 = uni.getStorageSync('deviceInfo_2')
    if (!deviceInfo_2) {
      this.dialogVisible = true
    }
  },
  onHide() {
    //console.info('onHide')
  },
  onUnload() {
    //console.info('onUnload')
    clearInterval(this.currentSendInfoTimer)
    // clearInterval(this.scrollTimer)
  },
  beforeDestroy() {
    //console.info('destroyed')
    clearInterval(this.currentSendInfoTimer)
    // clearInterval(this.scrollTimer)
    this.isScrolling = false
  },
  methods: {
    startAutoScroll() {
      const container = this.$refs.scrollContainer?.$el
      if (!container) {
        // console.log("容器未找到！");
        return
      }
      const contentHeight = container.scrollHeight // 获取内容区域的高度
      const containerHeight = container.clientHeight
      if (contentHeight <= containerHeight) {
        // 如果内容高度小于容器高度，停止滚动
        this.isScrolling = false
        return
      }
      // 定义滚动逻辑
      const scroll = () => {
        if (!this.isScrolling) return // 停止滚动
        const scrollAmount = 0.2 // 滚动增量
        this.currentOffset += scrollAmount

        if (this.currentOffset >= container.scrollHeight) {
          this.currentOffset = 0
        }
        container.style.transform = `translateY(-${this.currentOffset}px)`
        requestAnimationFrame(scroll) // 继续请求下一个帧
      }
      requestAnimationFrame(scroll) // 启动滚动
    },
    //生成二维码
    async createQRCode() {
      try {
        let text = `d=3&h=${this.unitInfo.aab001}`
        this.qrCodeBase64 = await QRCode.toDataURL(text)
      } catch (error) {}
    },
    chooseDevice() {
      if (!this.ace711) {
        this.$message.error('请选择设备!')
        return
      }
      if (!this.ace772) {
        this.$message.error('请输入检验码!')
        return
      }
      //验证电视屏编号和校验码
      let param = {
        ace711: this.ace711,
        ace772: this.ace772,
      }
      this.$http.post(this.$requestConstant.commonRequestType, 'jy204_hrm267', null, param, true).then((res) => {
        if (res.data.data.code === '0') {
          this.$message.error(res.data.data.message)
        } else {
          this.$message.success(res.data.data.message)
          uni.setStorageSync('deviceInfo_2', {
            ace769: '1',
            ace711: this.ace711,
            ace772: res.data.data.ace772,
          })
          this.dialogVisible = false
          uni.removeStorageSync('reLanch_times')
          this.unitInit()
        }
      })
    },
    queryDeviceInfo() {
      let deviceInfo = uni.getStorageSync('deviceInfo_2')
      if (!deviceInfo) {
        this.dialogVisible = true
        this.$http
          .post(
            this.$requestConstant.commonRequestType,
            'jy204_hrm262',
            null,
            {
              ace769: '3',
            },
            true,
          )
          .then((res) => {
            this.data = res.data.data.data
          })
      } else {
        this.dialogVisible = false
        this.unitInit()
      }
    },
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
      this.jobListShow({
        aab001: this.unitInfo.aab001,
        acb330: this.unitInfo.acb330,
        acb219: '1',
      })
    },
    unitInit() {
      // 获取设备唯一编码
      let param = {
        ace711: uni.getStorageSync('deviceInfo_2').ace711,
        ace769: '3',
        yae100: 19,
      }
      this.$http.post(this.$requestConstant.commonRequestType, 'jy204_hrm257', null, param, false).then((res) => {
        let result = res.data.data.data
        this.unitInfo = res.data.data.data
        uni.setStorageSync('bigScreen', this.unitInfo)
        if (this.unitInfo) {
          this.ce23s = res.data.data.data.ce23s
          if (this.ce23s.length > 0) {
            this.ce23s = this.ce23s.filter((item) => {
              return !this.videoExt.includes(item.aae523)
            })
          }
          this.jobListShow({
            aab001: this.unitInfo.aab001,
            acb330: this.unitInfo.acb330,
            acb219: '1',
          })
          this.createQRCode()
        }
      })
    },
    jobListShow(param) {
      param.pageNumber = this.currentPage
      param.pageSize = 3
      this.$http
        .post(this.$requestConstant.commonRequestType, 'jy204_hrm252', null, param, false)
        .then((responseData) => {
          let res = responseData ? responseData.data : {}
          this.jobList = res.data.pageBean.list
          this.currentPage = res.data.pageBean.pageNum
          this.totalPages = res.data.pageBean.pages
          this.total = res.data.pageBean.total
        })
    },
    handleNodeClick(data, node, nodeData) {
      if (!data.children.length) {
        //非为最后一层 为城市，不可选为值
        this.treeDataValue = data
        this.ace711 = data.value
        this.ace711_dsc = data.label
        this.$refs.select.blur() //收起下拉框
      }
    },
  },
}
</script>

<style lang="scss" scoped>
$preview-width: 1740px;
$preview-height: 700px;

$normal-width: 1920px;
$normal-height: 1080px - 85px;

.noData {
  width: $normal-width;
  height: 1074px;

  > image {
    width: 100%;
    height: 100%;
  }
}

.preview {
  width: calc($normal-width - 1px);
  height: $normal-height;
  background-image: url('../../static/images/start-logo.png');
}

.normal {
  width: calc($normal-width - 1px);
  height: $normal-height;
  background-image: url('../../static/images/loginBack.png');
}

.big-screen {
  padding: 42px 117px;
  background-size: cover;

  .preview-box {
    height: 90%;

    .preview-title {
      font-family: SourceHanSansCNBold, SourceHanSansCNBold;
      font-weight: bold;
      font-size: 56px;
      color: #ffffff;
      line-height: 54px;
      font-style: normal;
      width: 100%;
      display: flex;
      justify-content: space-between;

      .left {
        flex: 3;
        display: flex;
        align-items: center;

        .logo {
          width: 60px;
          height: 63px;
          margin-right: 24px;
        }

        &.wrap {
          .title {
            white-space: wrap;
            font-size: 42px;
          }
        }
      }

      .right {
        flex: 1;
        text-align: right;
      }
    }

    .preview-center {
      margin-top: 36px;
      width: 100%;
      height: 100%;
      background-color: #ffffff;
      display: flex;
      border-radius: 4px;

      .preview-center-left {
        width: 35%;
        height: calc(100% - 72px);
        padding: 24px 30px 0 24px;

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
            overflow: hidden;
            text-overflow: ellipsis;
            text-wrap: nowrap;
          }
        }

        .preview-center-left-bottom {
          display: flex;
          height: 100%;

          .left-right {
            width: 100%;
            height: 100%;
            padding-right: 16px;

            .album-swiper {
              height: calc(100% - 12px);

              .swiper-item {
                > image {
                  width: 100%;
                  height: 100%;
                }
              }
            }

            > view:nth-child(1) {
              height: 40%;
              margin-bottom: 12px;

              > image {
                width: 100%;
                height: calc(100% - 12px);
              }
            }

            > view:nth-child(2) {
              height: 30%;

              > view:first-child {
                font-family: SourceHanSansCNBold, SourceHanSansCNBold;
                font-weight: bold;
                font-size: 28px;
                color: #333333;
                line-height: 36px;
                text-align: left;
                font-style: normal;
                margin-bottom: 12px;
              }

              > view:last-child {
                height: 90%;
                font-family: SourceHanSansCN, SourceHanSansCN;
                font-weight: 400;
                font-size: 24px;
                color: #333333;
                line-height: 2;
                text-align: left;
                font-style: normal;
                overflow-y: hidden;

                .scroll-container {
                  height: 100%;
                  line-height: 43px;
                  display: -webkit-box;
                  -webkit-line-clamp: 5; /* 显示的行数 */
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                }
              }
            }

            > view:last-child {
              width: 95%;
              margin-top: 36px;
              height: 30%;

              > view:first-child {
                font-family: SourceHanSansCNBold, SourceHanSansCNBold;
                font-weight: bold;
                font-size: 28px;
                color: #333333;
                text-align: left;
                font-style: normal;
                margin-bottom: 12px;
              }

              > view:last-child {
                width: 100%;
                height: calc(100% - 120px);
                background: #f4f7fc;
                border-radius: 8px;
                opacity: 0.54;
                padding: 16px;
                font-size: 24px;

                > view {
                  font-family: SourceHanSansCN, SourceHanSansCN;
                  font-weight: 400;
                  color: #999999;
                  text-align: left;
                  font-style: normal;

                  > span {
                    font-family: SourceHanSansCN, SourceHanSansCN;
                    font-weight: 400;
                    color: #666666;
                    text-align: left;
                    font-style: normal;
                  }
                }

                > view:last-child {
                  display: flex;

                  > view {
                    margin-right: 20px;

                    span {
                      color: #666;
                    }
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
        width: 65%;
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
          padding: 30px 36px;

          > view:first-child {
            width: 100%;
            font-family: SourceHanSansCNBold, SourceHanSansCNBold;
            font-weight: bold;
            font-size: 32px;
            color: #333333;
            line-height: 42px;
            text-align: left;
            font-style: normal;

            > span {
              color: #0682fe;
            }
          }

          > view:nth-child(1) {
            display: flex;

            > view:first-child {
              font-family: SourceHanSansCNBold, SourceHanSansCNBold;
              font-weight: bold;
              font-size: 24px;
              color: #333333;
              line-height: 36px;
              text-align: left;
              font-style: normal;
            }
          }

          > view:nth-child(3) {
            display: flex;

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
            margin-top: 24px;

            .list-item {
              margin-bottom: 20px;

              .item-box {
                background: #ffffff;
                border-radius: 8px;
                border: 1px solid #eeeeee;
                padding: 32px 24px 10px;

                .item-top {
                  .item-name {
                    font-size: 36px;
                    font-weight: bold;
                    color: #333333;
                    line-height: 36px;
                    margin-bottom: 24px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    display: flex;
                    justify-content: space-between;

                    .money {
                      font-size: 30px;
                      color: #999999;
                      line-height: 30px;
                      font-weight: normal;

                      text {
                        color: #fe2c2c;
                        padding-right: 8px;
                        font-weight: bold;
                      }
                    }
                  }

                  .item-decr {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .item-lt {
                      font-size: 16px;
                      width: calc(100% - 120px);

                      .tag-item {
                        font-size: 28px;
                        display: inline-block;
                        color: #666;
                        background: #f8f8f8;
                        border-radius: 4px;
                        padding: 10px 16px;
                        max-width: 200px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;

                        &:not(:last-child) {
                          margin-right: 12px;
                        }
                      }
                    }

                    .item-rt {
                      .edit-job {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        width: 120px;

                        image {
                          width: 24px;
                          height: 24px;
                        }

                        text {
                          font-size: 18px;
                          font-weight: bold;
                          color: #0682fe;
                          padding-left: 8px;
                        }
                      }

                      .ready {
                        font-size: 28px;
                        color: #999;
                        background: #f8f8f8;
                        border-radius: 4px;
                        padding: 0 8px;
                        max-width: 200px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        padding: 10px 16px;

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

                  image {
                    width: 28px;
                    height: 28px;
                  }

                  text {
                    font-size: 30px;
                    color: #666666;
                    padding-left: 12px;
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

/deep/ .el-dialog__body {
  padding: 30px 20px 10px;
}

/deep/.el-form {
  .el-form-item {
    margin-bottom: 20px;

    .el-form-item__label {
      font-size: 24px;
    }

    .el-form-item__content {
      .el-form-item__error {
        font-size: 20px;
      }

      .el-input {
        font-size: 22px;
      }

      .el-button {
        font-size: 22px;
      }
    }
  }
}

/deep/.el-tree {
  height: 100%;
}
</style>
