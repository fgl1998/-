<template>
  <xu-common-shell :title="loginInfo.aab004">
    <div class="resume">
      <xu-common-title zh="全部简历" en="/ monitor"></xu-common-title>
      <div class="top">
        <view>
          <image src="../../static/images/zongshu.png" />
          <view>招聘岗位总数：</view>
          <view>{{ unitJobs }}</view>
          <view>个</view>
        </view>
        <view>
          <image src="../../static/images/touren.png"></image>
          <view>已投递人数：</view>
          <view>{{ resumeCounts }}</view>
          <view>人</view>
        </view>
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
          <view v-for="(item, index) in talentList" :key="index">
            <view
              >求职意向：<span>{{ item.cc21Vo ? item.cc21Vo.acb202 + '·' : '' }}{{ item.acb213 }}</span></view
            >
            <view @click="openResume(item)">
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
                  <view>{{ item.age }}岁</view>
                  <!-- <view>{{ item.acc217Dsc ? item.acc217Dsc : '未知工作经验' }}</view> -->
                  <view>{{ item.acc217 ? $codeConfig.getCodeLabel('ACC217', item.acc217) : '未知工作经验' }}</view>
                  <view>{{ item.aac011 ? $codeConfig.getCodeLabel('AAC011', item.aac011) : '未知学历' }}</view>
                  <view>{{ item.acc04tDsc }}</view>
                </view>
              </view>
              <view>
                <!-- <view>{{$codeConfig.getCodeLabel('acc04r',item.acc04r)}}</view> -->
                <el-tag :type="item.acc04r == '1' ? 'info' : 'success'">
                  <!-- {{ $codeConfig.getCodeLabel('acc04r', item.acc04r) }} -->
                  主动投递
                </el-tag>
              </view>
            </view>
            <view>
              <view>{{ formatSalary(item.acb241, item.acb242) }}</view>
              <view
                >优势：<span v-if="item.acc209"> {{ item.acc209 }} </span><span v-else>暂无</span></view
              >
              <view :class="`class${item.acc676}`" @click="opration(item)">
                {{
                  item.acc676 == '0'
                    ? '未查看'
                    : item.acc676 == '1'
                    ? '面试邀请'
                    : item.acc676 == '2'
                    ? '已安排面试'
                    : '不合适简历'
                }}
              </view>
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
      commonResumeVisible: false,
      resumeInfo: {},
      userInfo: this.$loginConfig.getLoginInfo(),
      pageSize: 9,
      currentPage: 1,
      total: 0,
      buttonValue: '4',
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
          value: '4',
        },
        {
          label: '未查看',
          value: '0',
        },
        {
          label: '已查看',
          value: '1',
        },
        {
          label: '已安排面试',
          value: '2',
        },
        // {
        //   label: '不合适简历',
        //   value: '3',
        // },
      ],
      talentList: [],
      loginInfo: {},
    }
  },
  created() {},
  mounted() {
    this.loginInfo = this.$loginConfig.getLoginInfo()
    this.getDataList()
    this.getStatics()
  },
  watch: {
    commonResumeInviteVisible(newVal) {
      if (!newVal) {
        this.getDataList()
        this.getStatics()
      }
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
      this.getDataList()
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
      this.getDataList()
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
        acc676: this.buttonValue == '4' ? '' : this.buttonValue,
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        acb330: this.userInfo.acb330,
        paginationModel: 'mostCount',
      }
      this.$http.post(this.$requestConstant.businessRequestType, 'jy201_hrm116', null, param, true).then((res) => {
        if (res.data.pageBean.list) {
          this.talentList = res.data.pageBean.list
          this.resumeCounts = res.data.pageBean.total
          this.total = res.data.pageBean.total
          this.talentList.forEach((item) => {
            if (item.cc21Vo && item.cc21Vo.acb241) {
              item.acb241 = item.cc21Vo.acb241 ? item.cc21Vo.acb241 : 0
            }
            if (item.cc21Vo && item.cc21Vo.acb242) {
              item.acb242 = item.cc21Vo.acb242 ? item.cc21Vo.acb242 : 0
            }
            if (item.cc21Vo && item.cc21Vo.acb202) {
              item.acb202 = item.cc21Vo.acb202
            }
          })
        }
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
            background: #ff4645;
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
}
</style>
