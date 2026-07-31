<!-- 一个职位 -->
<template>
  <div class="oneJob">
    <div class="title">
      <div class="txt">招聘职位</div>
      <div class="line"></div>
    </div>
    <div class="job_container">
      <div class="job_info" v-if="jobList && jobList.length > 0">
        <div class="top">
          <div class="name_and_salary">
            <div class="name">
              <span>{{
                  jobList[0].acb213 ? jobList[0].acb213 : "未知职位名称"
                }}</span
              >（招{{ jobList[0].acb21g && jobList[0].acb21g != 0 ? jobList[0].acb21g : '若干' }}人）
            </div>
            <div class="salary">
              {{
                jobList[0].acb21t == 0
                    ? "年薪："
                    : jobList[0].acb21t == 1
                        ? "月薪："
                        : "未知薪资类型"
              }}
              <span v-if="jobList[0].acb21t == 0">{{ getAbbreviatSalary(jobList[0].acb21h * 12) }}</span>
              <span v-if="jobList[0].acb21t == 1"
              >{{ getAbbreviatSalary(jobList[0].acb21h) }} - {{ getAbbreviatSalary(jobList[0].acb21j) }}</span
              >
            </div>
          </div>
          <div class="job_ask">
            <span>工作经验：{{
                jobList[0].acc217
                    ? $codeConfig.getCodeLabel("ACC217", jobList[0].acc217)
                    : "未知"
              }}</span>
            <span>学历要求：{{
                jobList[0].aac011
                    ? $codeConfig.getCodeLabel("AAC011", jobList[0].aac011)
                    : "未知"
              }}</span>
            <span>工作地点：{{
                jobList[0].acb217 ? jobList[0].acb217 : "未知"
              }}</span>
          </div>
        </div>
        <div class="bottom">
          <div class="msg_box">
            <div class="s_title">职位福利</div>
            <div class="info_list" v-if="jobList[0].acb00r">
              <div
                  class="info_item"
                  v-for="(item, index) in jobList[0].acb00r.split(',')"
                  :key="index"
              >
                {{ item }}
              </div>
            </div>
          </div>
          <div class="msg_box">
            <div class="s_title">职位描述</div>
            <div class="text">
              {{ jobList[0].acb216 }}
            </div>
          </div>
        </div>
      </div>
      <yt-none :isShow="jobList.length == 0 ? true : false"></yt-none>
    </div>
  </div>
</template>

<script>
export default {
  name: "oneJob",
  props: {
    jobList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.oneJob {
  width: 100%;
  height: 100%;
  border-radius: 18px;
  background-color: #fff;
  padding: 0 80px 80px;
  box-sizing: border-box;

  > .title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 240px;

    > .txt {
      font-family: SourceHanSansCN-Medium;
      font-size: 72px;
      color: #343434;
      font-weight: bold;
      margin-bottom: 32px;
    }

    > .line {
      width: 108px;
      height: 8px;
      background: #00449a;
    }
  }

  > .job_container {
    width: 100%;
    height: calc(100% - 240px);
    border: 2px solid rgba(0, 68, 154, 0.21);
    border-radius: 16px;

    > .job_info {
      height: 100%;

      > .top {
        height: 320px;
        padding: 64px 80px 50px 80px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-family: SourceHanSansCN-Medium;
        font-size: 68px;
        color: #343434;

        > .name_and_salary {
          display: flex;
          justify-content: space-between;
          align-items: center;

          span {
            font-weight: 500;
          }

          > .salary {
            font-family: SourceHanSansCN-Medium;
            color: #ff6d1d;
            font-weight: 500;
          }
        }

        > .job_ask {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: SourceHanSansCN-Regular;
          font-size: 52px;
          color: #656565;
          font-weight: 400;

          > span {
            display: inline-block;
            width: 32%;
          }

          // > span:nth-of-type(2) {
          //   text-align: center;
          // }
          > span:nth-of-type(3) {
            text-align: right;
          }
        }
      }

      > .bottom {
        width: 100%;
        height: calc(100% - 320px);
        background: rgba(0, 68, 154, 0.03);
        border-radius: 16px;
        padding: 64px 80px;
        box-sizing: border-box;

        > .msg_box {
          > .s_title {
            font-family: SourceHanSansCN-Medium;
            font-size: 56px;
            color: #343434;
            letter-spacing: 0;
            font-weight: bold;
            margin-bottom: 48px;
          }

          > .info_list {
            display: flex;
            align-items: center;

            > .info_item {
              background: #ebf1fb;
              border-radius: 8px;
              padding: 0 48px;
              height: 84px;
              display: flex;
              align-items: center;
              font-family: SourceHanSansCN-Regular;
              color: #00449a;
              font-weight: 400;
              font-size: 48px;
            }

            > .info_item:not(:last-of-type) {
              margin-right: 48px;
            }
          }

          > .text {
            font-size: 52px;
            font-family: SourceHanSansCN-Regular;
            color: #656565;
            letter-spacing: 0;
            line-height: 80px;
            font-weight: 400;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 6; /* 定义显示的行数 */
            overflow: hidden !important;
            text-overflow: ellipsis;
          }
        }

        > .msg_box:nth-of-type(1) {
          margin-bottom: 96px;
        }

        > .msg_box:nth-of-type(2) {
          height: calc(100% - 206px - 96px);
          // .text {
          //   height: calc(100% - 74px - 48px);
          // }
        }
      }
    }
  }
}
</style>
