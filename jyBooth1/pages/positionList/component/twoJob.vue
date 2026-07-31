yt-none
<template>
  <div class="twoJob">
    <div class="title">
      <div class="txt">招聘职位</div>
      <div class="line"></div>
    </div>
    <div class="job_container">
      <div class="job_list" v-if="jobList && jobList.length > 0">
        <div
          class="job_item"
          v-for="(item, index) in jobList"
          :key="index"
          v-show="index < 2"
        >
          <div class="top">
            <div class="name_and_salary">
              <div class="name">
                <span>{{ item.acb213 ? item.acb213 : "未知职位名称" }}</span
                >（招{{ item.acb21g && item.acb21g != 0 ? item.acb21g : '若干' }}人）
              </div>
              <div class="salary">
                {{
                  item.acb21t == 0
                    ? "年薪："
                    : item.acb21t == 1
                    ? "月薪："
                    : "未知薪资类型"
                }}
                <span v-if="item.acb21t == 0">{{ getAbbreviatSalary(item.acb21h * 12) }}</span>
                <span v-if="item.acb21t == 1"
                  >{{ getAbbreviatSalary(item.acb21h) }} - {{ getAbbreviatSalary(item.acb21j) }}</span
                >
              </div>
            </div>
            <div class="job_ask">
              <span
                >工作经验：{{
                  item.acc217
                    ? $codeConfig.getCodeLabel("ACC217", item.acc217)
                    : "未知"
                }}</span
              >
              <span
                >学历要求：{{
                  item.aac011
                    ? $codeConfig.getCodeLabel("AAC011", item.aac011)
                    : "未知"
                }}</span
              >
              <span>工作地点：{{ item.acb217 ? item.acb217 : "未知" }}</span>
            </div>
          </div>
          <div class="bottom">
            <div class="msg_box">
              <div class="s_title">职位福利</div>
              <div class="info_list" v-if="item.acb00r">
                <div
                  class="info_item"
                  v-for="(item, index) in item.acb00r.split(',')"
                  :key="index"
                >
                  {{ item }}
                </div>
              </div>
            </div>
            <div class="msg_box">
              <div class="s_title">职位描述</div>
              <div class="text">
                {{ item.acb216}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <yt-none :isShow="jobList.length == 0 ? true : false"></yt-none>
    </div>
  </div>
</template>

<script>
import ytNone from "../../../components/yt-none/yt-none.vue";
export default {
  components: { ytNone },
  name: "twoJob",
  props: {
    jobList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.twoJob {
  width: 100%;
  height: 100%;
  border-radius: 18px;
  background-color: #fff;
  padding: 80px;
  padding-top: 0px;
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
    > .job_list {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      > .job_item {
        width: 100%;
        height: 676px;
        border: 2px solid rgba(0, 68, 154, 0.21);
        border-radius: 16px;
        > .top {
          height: 308px;
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
          height: calc(100% - 308px);
          background: rgba(0, 68, 154, 0.03);
          border-radius: 16px;
          padding: 60px 80px 42px 80px;
          box-sizing: border-box;
          > .msg_box {
            display: flex;
            align-items: center;
            > .s_title {
              font-family: SourceHanSansCN-Medium;
              font-size: 56px;
              color: #343434;
              letter-spacing: 0;
              font-weight: bold;
              margin-right: 48px;
              width: 112px !important;
            }
            > .info_list {
              display: flex;
              align-items: center;
              flex-wrap: wrap;
              overflow: auto;
              width: calc(100% - 136px);
              height: 84px;
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
              width: calc(100% - 136px);
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2; /* 定义显示的行数 */
              overflow: hidden !important;
              text-overflow: ellipsis;

            }
          }
          > .msg_box:nth-of-type(1) {
            margin-bottom: 28px;
          }
          > .msg_box:nth-of-type(2) {
            height: calc(100% - 84px - 28px);
            align-items: flex-start;
            .s_title{
                width: 628px;
            }
            .text {
              height: 100%;
              overflow: auto;
            }
          }
        }
      }
    }
  }
}
</style>
