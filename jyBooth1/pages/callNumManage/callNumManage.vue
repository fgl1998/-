<template>
  <xu-common-shell :title="loginInfo.aab004" type="2">
    <div class="resume">
      <xu-common-title zh="全部排号" en="/ monitor"></xu-common-title>
      <div class="top">
        <view>
          <image src="../../static/images/zongshu.png" />
          <view>待叫号人数：</view>
          <view>{{ djhCounts }}</view>
          <view>个</view>
        </view>
        <view>
          <image src="../../static/images/touren.png"></image>
          <view>已叫号人数：</view>
          <view>{{ yjhCounts }}</view>
          <view>人</view>
        </view>
        <view @click="handleCall" class="callBtn">叫号</view>
        <view>
          <view
            @click="changeType(item)"
            :style="buttonValue == item.value ? style1 : style2"
            v-for="(item, index) in buttonType"
            :key="index"
            >{{ item.label }}
          </view>
        </view>
      </div>
      <div class="center">
        <div v-if="talentList.length > 0">
          <view v-for="(item, index) in currentPageData" :key="index" class="card-wrapper">
            <view
              >取号时间：<span>{{ item.acz476 || '' }}</span></view
            >
            <view>
              <image
                :src="
                  item.aac004 == 2
                    ? getRealImgUrl('img/recruitTalents/female.png')
                    : getRealImgUrl('img/recruitTalents/male.png')
                "
              />
              <view>
                <view>{{ item.aac003 }}</view>
                <view>
                  <!-- <view>{{ item.age }}岁</view> -->
                  <!-- <view>{{ item.acc217Dsc ? item.acc217Dsc : '未知工作经验' }}</view> -->
                  <!-- <view>{{ item.acc217 ? $codeConfig.getCodeLabel('ACC217', item.acc217) : '未知工作经验' }}</view>
                  <view>{{ item.aac011 ? $codeConfig.getCodeLabel('AAC011', item.aac011) : '未知学历' }}</view> -->
                  <!-- <view>{{ item.aac011 ? $codeConfig.getCodeLabel('AAC011', item.aac011) : '未知学历' }}</view> -->
                  <view>{{ item.aab004 ? item.aab004 : '未知公司' }}</view>
                </view>
              </view>
            </view>
            <view>
              <view></view>
              <view
                >联系方式：<span v-if="item.aae005"> {{ item.aae005 }} </span><span v-else>暂无</span></view
              >
              <view @click="handleGuohao(item)" class="callBtn callBtn2" v-if="item.acz474 === '1'">过号</view>
              <view @click="handleFinish(item)" class="callBtn" v-if="item.acz474 === '1'">结束面试</view>
              <view class="status" :class="'status-' + item.acz474">{{ mapStatus[item.acz474] }}</view>
            </view>
          </view>
        </div>
        <view v-else class="noData">
          <image src="../../static/images/img/publicImg/noData.png" />
          <view>暂无数据</view>
        </view>
      </div>
      <div class="bottom">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="changePage"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <common-resume :data="resumeInfo" :visible="commonResumeVisible" @close="closeCommonResume"></common-resume>
    <common-resume-invite
      :visible="commonResumeInviteVisible"
      @close="closeCommonResumeInvite"
      :data="resumeInfo"
    ></common-resume-invite>
  </xu-common-shell>
</template>

<script>
import commonResume from '../../components/common-resume/common-resume.vue'
import commonResumeInvite from '../../components/common-resume-invite/common-resume-invite.vue'

export default {
  components: {
    commonResume,
    commonResumeInvite,
  },
  data() {
    return {
      commonResumeInviteVisible: false,
      resumeCounts: '0',
      unitJobs: '0',
      djhCounts: '0',
      yjhCounts: '0',
      commonResumeVisible: false,
      resumeInfo: {},
      userInfo: this.$loginConfig.getLoginInfo(),
      pageSize: 9,
      currentPage: 1,
      total: 0,
      buttonValue: '',
      style1: {
        'background-color': '#0682FE',
        color: '#FFFFFF',
      },
      style2: {
        'background-color': '#F8F8F8',
        color: '#666666',
      },
      buttonType: [
        {
          label: '全部',
          value: '',
        },
        {
          label: '进行中',
          value: '1',
        },
        {
          label: '待叫号',
          value: '2',
        },
        {
          label: '已完成',
          value: '3',
        },
        {
          label: '已过',
          value: '4',
        },
      ],
      mapStatus: {
        1: '进行中',
        2: '待叫号',
        3: '已完成',
        4: '已过',
      },
      talentList: [],
      loginInfo: {},
    }
  },
  created() {},
  mounted() {
    this.loginInfo = this.$loginConfig.getLoginInfo()
    this.getDataList()
    // this.getStatics()
  },
  onLoad(options) {
    const systemInfo = uni.getStorageSync('systemInfo')
    // const userId = systemInfo.mainBoardSN + systemInfo.cpuSerial
    const userId = '"TEST-OPERATOR-001'
    console.log('🚀 准备初始化 WebSocket')
    try {
      this.$ws.init(userId, 'OPERATOR', (raw) => {
        console.log('📩 叫号端收到：', raw)
      })
      console.log('✅ init 调用已执行（如果能看到这行，说明没同步报错）')
    } catch (e) {
      console.log('🔥 调用 this.$ws.init 直接报错：', e)
    }
  },
  onUnload() {
    this.$ws.completeClose()
  },
  watch: {
    commonResumeInviteVisible(newVal) {
      if (!newVal) {
        this.getDataList()
        // this.getStatics()
      }
    },
  },
  computed: {
    currentPageData() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.talentList.slice(start, end)
    },
  },
  methods: {
    opration(item) {
      if (item.acc676 == '1') {
        this.commonResumeInviteVisible = true
        this.resumeInfo = item
      }
    },
    openResume(item) {
      this.resumeInfo = item
      this.commonResumeVisible = true
    },
    closeCommonResumeInvite() {
      this.commonResumeInviteVisible = false
      this.getDataList()
    },
    closeCommonResume() {
      this.commonResumeVisible = false
    },
    updateState() {
      let param = {
        apiCode: 'jy201_hrm108',
        method: 'jy201_hrm108',
        acc300: this.resumeInfo.acc300,
        acc676: '1',
      }
      this.$http.post('/api/business/getData.do', 'jy201_hrm108', null, param, true).then((res) => {
        this.getDataList()
      })
    },
    formatSalary(salary1, salary2) {
      if (!salary1 && !salary2) {
        return '面议'
      }
      if (salary1 && !salary2) {
        return '最低' + parseFloat((parseInt(salary1) / 1000).toFixed(1)) + 'K'
      }
      if (!salary1 && salary2) {
        return '最高' + parseFloat((parseInt(salary2) / 1000).toFixed(1)) + 'K'
      }
      return (
        parseFloat((parseInt(salary1) / 1000).toFixed(1)) +
        'K' +
        '-' +
        parseFloat((parseInt(salary2) / 1000).toFixed(1)) +
        'K'
      )
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    changePage(curPage) {
      this.currentPage = curPage
      // this.getDataList()
    },
    changeType(item) {
      this.buttonValue = item.value
      this.currentPage = 1
      this.getDataList()
    },
    getStatics() {
      let param = {
        acb330: this.userInfo.acb330,
      }
      this.$http.post(this.$requestConstant.businessRequestType, 'jy201_hrm255', null, param, true).then((res) => {
        // this.resumeCounts = res.data.data.data.resumeCounts
        this.unitJobs = res.data.data.unitJobs
      })
    },
    getDataList() {
      let param = {
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        aab001: this.userInfo.aab001,
        // acz474: this.buttonValue,
        paginationModel: 'mostCount',
      }
      this.$http.post(this.$requestConstant.businessRequestType, 'jy225_hrm101', null, param, true).then((res) => {
        if (res.data) {
          // this.talentList = res.data.result
          const { progress, waiting, finished, passed } = res.data.result
          this.progress = progress ? progress : []

          this.waiting = waiting ? waiting : []
          this.finished = finished ? finished : []
          this.passed = passed ? passed : []

          this.all = [...this.progress, ...this.waiting, ...this.finished, ...this.passed]

          this.total2 = this.all.length
          this.talentList = this.all
          this.djhCounts = this.waiting.length
          this.yjhCounts = this.total2 - this.djhCounts

          if (this.buttonValue == '') {
            this.talentList = this.all
          }
          if (this.buttonValue == '1') {
            this.talentList = this.progress || []
          }
          if (this.buttonValue == '2') {
            this.talentList = this.waiting || []
          }
          if (this.buttonValue == '3') {
            this.talentList = this.finished || []
          }
          if (this.buttonValue == '4') {
            this.talentList = this.passed || []
          }
          this.total = this.talentList.length
        }
      })
    },
    handleCall() {
      // this.changeType({ value: '' })
      const { acz470, aab001, acz474 } = this.progress.length > 0 ? this.progress[0] : {}
      if (!acz470) {
        this.$message.warning('没有进行中的排号')
        return
      }
      let param = {
        aab001,
        acz470,
        acz474: '3',
      }
      this.$http.post(this.$requestConstant.businessRequestType, 'jy225_hrm107', null, param, true).then((res) => {
        this.$message.success('叫号成功')
        this.getDataList()
        // 成功后更新大屏信息，语音播报
      })
    },
    handleFinish() {
      const { acz470, aab001, acz474 } = this.progress ? this.progress[0] : {}
      if (!acz470) {
        this.$message.warning('没有进行中的排号')
        return
      }
      let param = {
        aab001,
        acz470,
        acz474: '3',
      }
      this.$http.post(this.$requestConstant.businessRequestType, 'jy225_hrm107', null, param, true).then((res) => {
        this.$message.success('操作成功')
        this.getDataList()
        // 成功后更新大屏信息，语音播报
      })
    },
    handleGuohao() {
      const { acz470, aab001, acz474 } = this.progress ? this.progress[0] : {}
      if (!acz470) {
        this.$message.warning('没有进行中的排号')
        return
      }
      let param = {
        aab001,
        acz470,
        acz474: '4',
      }
      this.$http.post(this.$requestConstant.businessRequestType, 'jy225_hrm107', null, param, true).then((res) => {
        this.$message.success('操作成功')
        this.getDataList()
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.noData {
  width: 100%;
  height: 100%;
  margin: auto;

  > image {
    width: 100%;
    height: 100%;
  }

  > view {
    text-align: center;
  }
}

.resume {
  width: calc(100% - 64px);
  height: calc(100% - 52px);
  padding: 26px 32px;
  background: #fff;
  border-radius: 8px;

  .top {
    display: flex;
    margin-top: 28px;
    position: relative;
    .callBtn {
      width: 40px;
      position: absolute;
      left: 900px;
      padding: 2px 6px;
      background: #0682fe;
      color: #fff;
      padding: 0 10px;
      border-radius: 4px;
      cursor: pointer;
      font-family: SourceHanSansCN, SourceHanSansCN;
      font-weight: 400;
      font-size: 16px;
      text-align: center;
      font-style: normal;
    }

    > view {
      width: 100%;
      display: flex;

      > image {
        width: 20px;
        height: 18px;
        margin-right: 9px;
      }
    }

    > view:first-child {
      > view:nth-child(2) {
        width: 140px;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 20px;
        color: #999999;
        line-height: 20px;
        text-align: left;
        font-style: normal;
      }

      > view:nth-child(3) {
        width: 36px;
        font-family: SourceHanSansCNBold, SourceHanSansCNBold;
        font-weight: bold;
        font-size: 20px;
        color: #0682fe;
        line-height: 30px;
        text-align: left;
        line-height: 20px;
        font-style: normal;
        margin-right: 8px;
      }

      > view:nth-child(4) {
        width: 140px;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 20px;
        color: #999999;
        line-height: 20px;
        text-align: left;
        font-style: normal;
      }
    }

    > view:nth-child(2) {
      > view:nth-child(2) {
        width: 140px;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 20px;
        color: #999999;
        line-height: 20px;
        text-align: left;
        font-style: normal;
      }

      > view:nth-child(3) {
        width: 36px;
        font-family: SourceHanSansCNBold, SourceHanSansCNBold;
        font-weight: bold;
        font-size: 20px;
        color: #0682fe;
        line-height: 30px;
        text-align: left;
        line-height: 20px;
        font-style: normal;
        margin-right: 8px;
      }

      > view:nth-child(4) {
        width: 140px;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 20px;
        color: #999999;
        line-height: 20px;
        text-align: left;
        font-style: normal;
      }
    }

    > view:last-child {
      display: flex;
      justify-content: space-between;

      > view {
        // width: 120px;
        padding: 0 20px;
        height: 40px;
        border-radius: 4px;
        cursor: pointer;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 20px;
        line-height: 40px;
        text-align: center;
        font-style: normal;
      }
    }
  }

  .center {
    width: 100%;
    height: 652px;
    margin-top: 24px;

    > div {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;

      // justify-content: flex-end;
      > view {
        width: 580px;
        height: 200px;
        background: #ffffff;
        border-radius: 8px;
        border: 1px solid #eeeeee;

        > view:first-child {
          width: calc(100% - 19px);
          height: 56px;
          padding: 0 0 0 19px;
          background: #e7f2fc;
          border-radius: 7px 7px 0px 0px;
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 400;
          font-size: 18px;
          color: #999999;
          line-height: 56px;
          text-align: left;
          font-style: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          > span {
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: 400;
            font-size: 18px;
            color: #333333;
            font-style: normal;
          }
        }

        > view:nth-child(2) {
          display: flex;
          padding: 20px 0 0 19px;

          > image {
            width: 68px;
            height: 68px;
            margin-right: 18px;
          }

          > view:nth-child(2) {
            width: 350px;
            height: 68px;

            > view:first-child {
              font-family: SourceHanSansCNBold, SourceHanSansCNBold;
              font-weight: bold;
              font-size: 20px;
              color: #333333;
              line-height: 35px;
              text-align: left;
              font-style: normal;
            }

            > view:nth-child(2) {
              display: flex;
              font-family: SourceHanSansCN, SourceHanSansCN;
              font-weight: 400;
              font-size: 18px;
              color: #666666;
              line-height: 30px;
              text-align: left;
              font-style: normal;

              > view {
                margin-right: 10px;
              }
            }
          }

          > view:nth-child(3) {
            width: 150px;

            .el-tag {
              margin-left: 40px;
              font-size: 16px;
            }

            > view {
              font-family: SourceHanSansCN, SourceHanSansCN;
              font-weight: 400;
              font-size: 20px;
              color: #333333;
              text-align: center;
              font-style: normal;
              line-height: 30px;
            }
          }
        }

        > view:last-child {
          padding: 0 0 0 19px;
          display: flex;
          width: calc(100% - 19px);
          height: 32px;
          margin-top: 8px;

          > view:first-child {
            width: 68px;
            height: 28px;
            background: transparent;
            border-radius: 14px;
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: 400;
            font-size: 18px;
            color: #ffffff;
            line-height: 27px;
            text-align: center;
            font-style: normal;
            margin-right: 18px;
          }

          > view:nth-child(2) {
            width: 360px;
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: 400;
            font-size: 18px;
            color: #999999;
            line-height: 27px;
            text-align: left;
            font-style: normal;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            > span {
              width: 195px;
              height: 18px;
              font-family: SourceHanSansCN, SourceHanSansCN;
              font-weight: 400;
              font-size: 18px;
              color: #666666;
              line-height: 27px;
              text-align: left;
              font-style: normal;
            }
          }

          > view:last-child {
            cursor: pointer;
          }

          .class0 {
            // width: 94px;
            border-radius: 4px;
            border: 1px solid #c7d5e9;
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: 400;
            font-size: 16px;
            line-height: 27px;
            text-align: center;
            font-style: normal;
            margin: auto;
            background: #0682fe;
            border-radius: 4px;
            color: #ffffff;
            padding: 0 10px;
          }

          .class1 {
            border-radius: 4px;
            background: #ffe2e2;
            border-radius: 4px;
            border: 1px solid #fe4e4e;
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: 400;
            font-size: 16px;
            color: #fe4e4e;
            line-height: 27px;
            text-align: center;
            font-style: normal;
            margin: auto;
            padding: 0 10px;
          }

          .class2 {
            border-radius: 4px;
            background: #f2fff5;
            border-radius: 4px;
            border: 1px solid #88db8d;
            margin: auto;
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: 400;
            font-size: 16px;
            color: #07b313;
            line-height: 27px;
            text-align: center;
            font-style: normal;
            padding: 0 10px;
          }

          .class3 {
            border-radius: 4px;
            background: #e5edf9;
            border-radius: 4px;
            border: 1px solid #c7d5e9;
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: 400;
            font-size: 16px;
            color: #8ca2c2;
            line-height: 27px;
            text-align: center;
            font-style: normal;
            margin: auto;
            padding: 0 10px;
          }
        }
      }
    }
  }

  .bottom {
    width: 100%;
    height: 50px;
    text-align: right;
  }
  .card-wrapper {
    position: relative;
    .callBtn {
      position: absolute;
      right: 10px;
      padding: 2px 6px;
      background: #0682fe;
      color: #fff;
      padding: 0 10px;
      border-radius: 4px;
      cursor: pointer;
      font-family: SourceHanSansCN, SourceHanSansCN;
      font-weight: 400;
      font-size: 16px;
      text-align: center;
      font-style: normal;
    }
    .callBtn2 {
      right: 100px;
    }
    .status {
      position: absolute;
      right: 0;
      top: 0;
      padding: 2px 6px;
      background: #f2f2f2;
      color: #333;
      border-radius: 4px;
      font-family: SourceHanSansCN, SourceHanSansCN;
      font-weight: 400;
      font-size: 16px;
      text-align: center;
      font-style: normal;
    }
    .status-1 {
      background: #e5edf9;
      color: #8ca2c2;
    }
    .status-2 {
      background: #ffe2e2;
      color: #fe4e4e;
    }
    .status-3 {
      background: #f2fff5;
      color: #07b313;
    }
    .status-4 {
      background: #e5edf9;
      color: #8ca2c2;
    }
  }
}
</style>
