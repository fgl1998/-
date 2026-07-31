<template>
  <el-dialog
    :visible.sync="visible"
    :append-to-body="true"
    top="64px"
    :show-close="false"
    width="80%"
    :close-on-click-modal="false"
    custom-class="dialog"
    :before-close="handleClose"
  >
    <div slot="title" class="resume-title">
      <div>
        <div class="resume-title-left">
          <image
            :src="
              personMesg.aac004 == 2
                ? getRealImgUrl('img/recruitTalents/female.png')
                : getRealImgUrl('img/recruitTalents/male.png')
            "
          />
        </div>
        <div class="resume-title-right">
          <view>
            <view>{{ personMesg.aac003 }}</view>
            <view>{{ personMesg.acc04t ? $codeConfig.getCodeLabel('acc04t', personMesg.acc04t) : '未知状态' }}</view>
            <view @click="handleClose">x</view>
          </view>
          <view>
            <!-- <view>身份证号码：{{ personMesg.aac147 }}</view> -->
            <view>出生日期：{{ moment(personMesg.aac006).format('YYYY-MM-DD') }}</view>
            <view>{{ $codeConfig.getCodeLabel('AAC004', personMesg.aac004) }}</view>
            <view>{{ personMesg.aac011 ? $codeConfig.getCodeLabel('AAC011', personMesg.aac011) : '暂无学历' }}</view>
<!--            <view>{{ personMesg.acc262 ? $codeConfig.getCodeLabel('AAC183_ZP', personMesg.acc262) : '未知专业' }}</view> -->
            <view>户籍地：{{ personMesg.aac010 ? personMesg.aac010 : '未知' }}</view>
            <view>居住地：{{ personMesg.aae006 ? personMesg.aae006 : '未知' }}</view>
          </view>
          <view>
            <view>电子邮箱：{{ personMesg.aae159 ? personMesg.aae159 : '无' }}</view>
            <view>联系电话：{{ personMesg.aae005 ? personMesg.aae005 : '无' }}</view>
          </view>
        </div>
      </div>
    </div>
    <div class="resume">
      <div class="item-first">
        <xu-common-title zh="求职意向" en="/ Job hunting intent"></xu-common-title>
        <div v-if="jobIntension.length > 0" class="job-intent">
          <view v-for="(item, index) in jobIntension" :key="index">
            <view>岗位类型：{{ item.aca112 }}</view>
            <view>求职类型：{{ item.acb469Desc ? item.acb469Desc : '暂无' }}</view>
            <view>工作地点：{{ item.acb202 ? item.acb202 : '暂无' }}</view>
            <view v-if="item.acb21h && item.acb21j">期望薪资：{{ item.acb21h + '~' + item.acb21j }} </view>
            <view v-else-if="item.acb21h">期望薪资：{{ item.acb21h }} </view>
            <view v-else-if="item.acb21j">期望薪资：{{ item.acb21j }} </view>
            <view v-else>期望薪资：暂无</view>
            <!-- <view>期望薪资：{{ item.acc034 ? $codeConfig.getCodeLabel('ACC034', item.acc034) : '暂无' }} </view> -->
          </view>
        </div>
        <div v-else class="noData">
          <view style="width: 100%; text-align: center">暂无求职意向</view>
        </div>
      </div>
      <div class="item-second">
        <xu-common-title zh="工作经历" en=" / work experience"></xu-common-title>
        <div v-if="workExperience.length > 0">
          <div class="exp-item" v-for="(item, index) in workExperience" :key="index">
            <div>
              <view>{{ item.aae030 }}至{{ item.aae031 }}</view>
              <view>{{ item.aca112 }}</view>
              <view>/{{ item.aab004 }}</view>
            </div>
            <div>
              <view>工作职能及职业成绩：</view>
              <view>
                {{ item.acc251 }}
              </view>
            </div>
          </div>
        </div>
        <div v-else class="noData">
          <view>暂无工作经历</view>
        </div>
      </div>
      <div class="item-three">
        <xu-common-title zh="教育经历" en="/ Educational experi"></xu-common-title>
        <div v-if="eduExperience.length > 0">
          <div class="edu-item" v-for="(item, index) in eduExperience" :key="index">
            <div>
              <view>{{ item.aae030 }}至{{ item.aae031 }}</view>
              <view>{{ item.acc261 }}</view>
              <view>{{ $codeConfig.getCodeLabel('AAC011', item.aac011) }}</view>
            </div>
            <div>
              <view>所学专业：</view>
              <view
                >{{ item.acc262Desc ? item.acc262Desc : '未知专业' }}</view>
            </div>
          </div>
        </div>
        <div v-else class="noData">
          <view>暂无教育经历</view>
        </div>
      </div>
      <div class="item-four">
        <xu-common-title zh="语言能力" en="/ Language proficiency"></xu-common-title>
        <div v-if="language.length > 0">
          <view class="train-item" v-for="(item, index) in language" :key="index">
            <view>语言类别：{{ item.acc241 ? $codeConfig.getCodeLabel('acc241', item.acc241) : '暂无' }}</view>
            <view>熟练程度：{{ item.acc242 ? $codeConfig.getCodeLabel('acc242', item.acc242) : '暂无' }}</view>
            <view>读写能力：{{ item.acc243 ? $codeConfig.getCodeLabel('acc242', item.acc243) : '暂无' }}</view>
            <view>听说能力：{{ item.acc244 ? $codeConfig.getCodeLabel('acc242', item.acc244) : '暂无' }} </view>
          </view>
        </div>
        <div v-else class="noData">
          <view>暂无语言能力数据</view>
        </div>
      </div>
      <div class="item-sex">
        <xu-common-title zh="自我评价" en="/ Self evaluation"></xu-common-title>
        <view v-if="personMesg.acc209">{{ personMesg.acc209 }}</view>
        <div v-else class="noData">
          <view>暂无自我评价</view>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
	import moment from 'moment'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.queryResumeDetail()
      }
    },
  },
  data() {
    return {
      personMesg: {},
      jobIntension: [],
      eduExperience: [],
      projectExperience: [],
      certificate: [],
      workExperience: [],
      language: [],
    }
  },
  methods: {
	moment,
    handleClose() {
      this.$emit('close')
    },
    // 查询方法
    queryResumeDetail() {
      const params = {
        // personAac001: this.data.aac001,
        aac001: this.data.aac001,
        aac001q: this.data.aac001,
        acc200: this.data.acc200,
      }
      this.$http
        .post(this.$requestConstant.businessRequestType, 'jy202_hrm119', null, params, true)
        .then((responseData) => {
          // 业务信息成功处理
          let res = responseData ? responseData.data : {}
          const resultData = res.resumeMap || {}

          if (!resultData.baseInfo || !resultData.baseInfo.acc200) {
            this.$message.warning('无法查看该人员简历信息！')
            this.$parent.showModal = false
            return
          }
          resultData.baseInfo.aae707 = this.$utils.getSexHeadOrDefault(
            resultData.baseInfo.aae707,
            resultData.baseInfo.aac004,
          )
          this.personMesg = resultData.baseInfo
          this.jobIntension = resultData.jobIntent
          this.eduExperience = resultData.eduExperience
          this.workExperience = resultData.workExperience
          this.projectExperience = resultData.projectExperience
          this.language = resultData.language
          this.updateViewStatus()
        })
    },
    // 修改查看状态
    updateViewStatus() {
      if (this.data.acc300) {
        let param = {
          acc300: this.data.acc300,
          acc676: '1',
        }
        this.$http.post(this.$requestConstant.businessRequestType, 'jy201_hrm108', null, param, true)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  height: 940px;
  border-radius: 8px;
}

/deep/ .el-icon-close {
  width: 24px;
  height: 24px;
  color: black;
}

.resume {
  width: 95%;
  height: 740px;
  margin: 0 auto;
  overflow: auto;
}

.noData {
  width: 100%;
  height: 40px;
  text-align: center;

  > view {
    line-height: 40px;
  }
}

.resume-title {
  width: 100%;
  height: 124px;
  padding: 0 24px;

  > div:first-child {
    display: flex;
    // margin-bottom: 30px;
    .resume-title-left {
      width: 94px;
      height: 94px;
      margin: auto 0;

      > image {
        width: 100%;
        height: 100%;
      }
    }

    .resume-title-right {
      width: calc(100% - 140px);
      margin-left: 10px;

      > view:first-child {
        height: 24px;
        margin: 16px 0;
        display: flex;

        > view:first-child {
          width: 150px;
          color: #333333;
          font-family: SourceHanSansCNBold, SourceHanSansCNBold;
          font-weight: bold;
          font-size: 24px;
          text-align: left;
          font-style: normal;
        }

        > view:nth-child(2) {
          width: calc(100% - 150px);
          color: #333333;
          font-family: SourceHanSansCNBold, SourceHanSansCNBold;
          font-weight: bold;
          font-size: 24px;
          text-align: left;
          font-style: normal;
        }

        > view:last-child {
          width: 24px;
          font-size: 26px;
          cursor: pointer;
        }
      }

      > view:nth-child(2) {
        display: flex;
        width: 1201px;
        height: 18px;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 18px;
        color: #666666;
        text-align: left;
        font-style: normal;
        margin-bottom: 16px;

        > view:first-child {
          max-width: 350px;
          padding: 0 10px 0 0;
          line-height: 18px;
          border-right: 1px solid #666666;
          margin-right: 10px;
        }

        > view:nth-child(2) {
          max-width: 50px;
          padding: 0 10px 0 0;
          line-height: 18px;
          border-right: 1px solid #666666;
          margin-right: 10px;
        }

        // > view:nth-child(3) {
        //   max-width: 130px;
        //   padding: 0 10px 0 0;
        //   line-height: 18px;
        //   border-right: 1px solid #666666;
        //   margin-right: 10px;
        // }

        > view:nth-child(3) {
          max-width: 130px;
          padding: 0 10px 0 0;
          line-height: 18px;
          border-right: 1px solid #666666;
          margin-right: 10px;
        }

        > view:nth-child(4) {
          max-width: 400px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding: 0 10px 0 0;
          line-height: 18px;
          border-right: 1px solid #666666;
          margin-right: 10px;
        }

        > view:nth-child(5) {
          max-width: 380px;
          line-height: 18px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      > view:nth-child(3) {
        display: flex;
        width: 515px;
        height: 18px;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 18px;
        color: #666666;
        line-height: 27px;
        text-align: left;
        font-style: normal;

        > view:nth-child(1) {
          padding: 0 10px 0 0;
          line-height: 18px;
          // width: 260px;
          border-right: 1px solid #666666;
          margin-right: 10px;
        }

        > view:nth-child(2) {
          line-height: 18px;
        }
      }
    }
  }
}

.item-first {
  margin-bottom: 28px;

  .job-intent {
    text-align: center;

    > view {
      margin-top: 24px;
      display: flex;

      > view {
        padding-right: 100px;
        // height: 18px;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 18px;
        color: #666666;
        line-height: 27px;
        text-align: left;
        font-style: normal;
      }

      > view:first-child {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 300px;
      }

      > view:nth-child(2) {
        width: 200px;
      }

      > view:nth-child(3) {
        width: 300px;
      }

      > view:last-child {
        width: 300px;
      }
    }
  }
}

.item-second {
  // max-height: 310px;
  margin-bottom: 28px;
  overflow: auto;

  > div:last-child {
    width: 100%;
    // height: 100px;
    // max-height: 252px;
    overflow: auto;

    .exp-item {
      width: 100%;
      // height: 100px;
      margin: 20px 0;

      > div:first-child {
        display: flex;
        width: 100%;
        margin-bottom: 16px;

        > view:nth-child(1) {
          height: 18px;
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 400;
          font-size: 18px;
          color: #666666;
          line-height: 27px;
          text-align: left;
          font-style: normal;
          margin-right: 60px;
        }

        > view:nth-child(2) {
          height: 18px;
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 400;
          font-size: 18px;
          color: #333333;
          line-height: 27px;
          text-align: left;
          font-style: normal;
          margin-right: 10px;
        }

        > view:last-child {
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

      > div:last-child {
        display: flex;

        > view:first-child {
          width: 255px;
          height: 18px;
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 400;
          font-size: 18px;
          color: #666666;
          line-height: 27px;
          text-align: left;
          font-style: normal;
          margin-right: 30px;
        }

        > view:last-child {
          // height: 60px;
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 400;
          font-size: 18px;
          color: #333333;
          line-height: 28px;
          text-align: left;
          font-style: normal;
          overflow: auto;
        }
      }
    }
  }
}

.item-three {
  // max-height: 310px;
  margin-bottom: 28px;
  overflow: auto;

  > div:last-child {
    width: 100%;
    // max-height: 252px;
    // overflow: auto;
    .edu-item {
      width: 100%;
      // height: 100px;
      margin: 24px 0;

      > div:first-child {
        display: flex;
        width: 100%;
        margin-bottom: 16px;

        > view:nth-child(1) {
          height: 18px;
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 400;
          font-size: 18px;
          color: #666666;
          line-height: 27px;
          text-align: left;
          font-style: normal;
          margin-right: 60px;
        }

        > view:nth-child(2) {
          height: 18px;
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 400;
          font-size: 18px;
          color: #333333;
          line-height: 27px;
          text-align: left;
          font-style: normal;
          margin-right: 10px;
        }

        > view:last-child {
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

      > div:last-child {
        display: flex;

        > view:first-child {
          width: 256px;
          height: 18px;
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 400;
          font-size: 18px;
          color: #666666;
          line-height: 27px;
          text-align: left;
          font-style: normal;
          margin-right: 30px;
        }

        > view:last-child {
          // height: 60px;
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 400;
          font-size: 18px;
          color: #333333;
          line-height: 28px;
          text-align: left;
          font-style: normal;
          overflow: auto;
        }
      }
    }
  }
}

.item-four {
  margin-bottom: 28px;

  > div:last-child {
    width: 100%;

    .train-item {
      width: 100%;
      margin: 24px 0;

      > div:first-child {
        display: flex;
        width: 100%;
        margin-bottom: 16px;

        > view:nth-child(1) {
          height: 18px;
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 400;
          font-size: 18px;
          color: #666666;
          line-height: 27px;
          text-align: left;
          font-style: normal;
          margin-right: 60px;
        }

        > view:nth-child(2) {
          height: 18px;
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 400;
          font-size: 18px;
          color: #333333;
          line-height: 27px;
          text-align: left;
          font-style: normal;
          margin-right: 10px;
        }

        > view:last-child {
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

      > div:last-child {
        display: flex;

        > view:first-child {
          width: 256px;
          height: 18px;
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 400;
          font-size: 18px;
          color: #666666;
          line-height: 27px;
          text-align: left;
          font-style: normal;
          margin-right: 30px;
        }

        > view:last-child {
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 400;
          font-size: 18px;
          color: #333333;
          line-height: 28px;
          text-align: left;
          font-style: normal;
          overflow: auto;
        }
      }
    }
    > view {
      margin-top: 24px;
      display: flex;

      > view {
        padding-right: 100px;
        // height: 18px;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 18px;
        color: #666666;
        line-height: 27px;
        text-align: left;
        font-style: normal;
      }

      > view:first-child {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 300px;
      }

      > view:nth-child(2) {
        width: 200px;
      }

      > view:nth-child(3) {
        width: 300px;
      }

      > view:last-child {
        width: 300px;
      }
    }
  }
}

.item-five {
  // height: 100px;
  margin-bottom: 28px;
  // overflow: auto;
  > view {
    display: flex;
    flex-wrap: wrap;
    margin-top: 24px;
    // justify-content: space-between;
    // gap: 10px;
    > view {
      width: 27%;
      display: flex;
      // max-height: 10px;
      font-family: SourceHanSansCN, SourceHanSansCN;
      font-weight: 400;
      font-size: 18px;
      color: #333333;
      text-align: left;
      font-style: normal;
      line-height: 30px;

      > view:first-child {
        width: 80px;
        margin-right: 80px;
      }
    }
  }
}

.item-sex {
  height: 150px;
  margin-bottom: 20px;

  > view {
    overflow: auto;
    margin-top: 8px;
    width: 100%;
    font-family: SourceHanSansCN, SourceHanSansCN;
    font-weight: 400;
    font-size: 18px;
    color: #333333;
    line-height: 32px;
    text-align: left;
    font-style: normal;
  }
}
</style>
