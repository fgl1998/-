<template>
  <div class="multipleJob">
    <div class="left_list">
      <div class="title">
        <div class="txt">招聘职位</div>
        <div class="line"></div>
      </div>
      <div class="job_container">
        <div class="job_list" v-if="jobList && jobList.length > 0">
          <div class="topJobList" v-if="topJobList && topJobList.length>0" :style="{height:topJobListHeight}">
            <div
                v-for="(item, index) in topJobList"
                :key="index"
            >
              <div class="job_item"
                   :class="{'needBottom':index==0&&topJobList.length>1,'noBottom':topJobList.length==1}">
                <div class="top">
                  <div class="name_and_salary">
                    <div class="name">
			            <span>{{
                      item.acb213 ? item.acb213 : "未知职位名称"
                    }}</span
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
                      >{{ getAbbreviatSalary(item.acb21h) }} -
			              {{ getAbbreviatSalary(item.acb21j) }}</span
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
                    <span
                    >工作地点：{{
                        item.acb217 ? item.acb217 : "未知"
                      }}</span
                    >
                  </div>
                </div>
                <div class="bottom">
                  <div class="msg_box">
                    <div class="s_title">职位描述</div>
                    <div class="text">
                      {{ item.acb216}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="swiper-container" :style="{height:commonJobListHeight}">
            <div class="swiper-wrapper">
              <div
                  class="swiper-slide"
                  v-for="(item, index) in commonJobList"
                  :key="index"
              >
                <div class="job_item">
                  <div class="top">
                    <div class="name_and_salary">
                      <div class="name">
                        <span>{{
                            item.acb213 ? item.acb213 : "未知职位名称"
                          }}</span
                        >（招{{ item.acb21g && item.acb21g != 0 ? item.acb21g : '若干' }}人）
                      </div>
                      <div class="salary">
                        {{
                          item.acb21t == 0
                              ? "年薪："
                              : item.acb21t == 1
                                  ? "月薪："
                                  : "未知薪资类型："
                        }}
                        <span v-if="item.acb21t == 0">{{ getAbbreviatSalary(item.acb21h * 12) }}</span>
                        <span v-if="item.acb21t == 1"
                        >{{ $utils.getAbbreviatSalary(item.acb21h) }} -
                          {{ $utils.getAbbreviatSalary(item.acb21j) }}</span
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
                      <span
                      >工作地点：{{
                          item.acb217 ? item.acb217 : "未知"
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="bottom">
                    <div class="msg_box">
                      <div class="s_title">职位描述</div>
                      <div class="text">
                        {{ item.acb216}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <yt-none :isShow="jobList.length == 0 ? true : false"></yt-none>
      </div>
    </div>
    <div class="right_list">
      <div class="title">
        <div class="txt">招聘职位</div>
        <div class="line"></div>
      </div>
      <div class="job_title_list" v-if="jobList.length != 0">
        <div
            class="job_title_item"
            v-for="(item, index) in jobList"
            :key="index"
        >
          <i class="el-icon-caret-right"></i>
          <div>{{ item.acb213 }}</div>
        </div>
      </div>
      <yt-none :isShow="!jobList || jobList.length == 0 ? true : false"></yt-none>
    </div>
  </div>
</template>

<script>
import Swiper from "swiper";

export default {
  name: "multipleJob",
  props: {
    jobList: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.initSwiper();
  },
  data() {
    return {
      topJobList: [],//置顶职位
      commonJobList: [],//非置顶职位
      topJobListHeight: '0%',//置顶职位外边框高度
      commonJobListHeight: '100%',//非置顶职位外边框高度
      swiper: null,
    };
  },
  watch: {
    jobList: {
      handler(newValue, oldValue) {//遍历职位并拆分为置顶及非置顶职位
        this.topJobList = this.jobList.filter((item) => {
          return item.acb361 == "1";
        });
        this.commonJobList = this.jobList.filter((item) => {
          return item.acb361 == "0";
        });
        if (this.topJobList.length > 0) {
          this.topJobListHeight = 33.33 * this.topJobList.length + "%";
          this.commonJobListHeight = 33.33 * (3 - this.topJobList.length) + "%";
        } else {
          this.topJobListHeight = "0%";
          this.commonJobListHeight = "100%";
        }
      },
      deep: true,//对象深度监听开启
      immediate: true,
    }
  },
  updated() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
    }
    this.initSwiper();
  },
  methods: {
    initSwiper() {
      this.swiper = new Swiper(".swiper-container", {
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        loop: (this.topJobList.length + this.commonJobList.length) == 3 ? false : true,
        direction: "vertical",
        slidesPerView: 3 - this.topJobList.length,
        // slidesPerGroup: 3,
        spaceBetween: 17,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.multipleJob {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;

  > .left_list {
    width: 2928px;
    height: 100%;
    background-color: #fff;
    border-radius: 16px;
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
        .topJobList {
          margin-bottom: 17px;

          .needBottom {
            margin-bottom: 17px;
          }

          .noBottom {
            margin-bottom: 0px;
          }
        }

        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .swiper-container {
          width: 100%;
          height: 100%;

          .swiper-wrapper {
            width: 100%;
            height: 100%;

            .swiper-slide {
              width: 100%;
              height: 100%;
            }

            .swiper-wrapper:not(:last-of-type) {
              margin-bottom: 48px;
            }
          }
        }

        .job_item {
          width: 99.8%;
          height: 440px;
          border: 2px solid rgba(0, 68, 154, 0.21);
          border-radius: 16px;

          > .top {
            height: 292px;
            padding: 56px 80px 40px 80px;
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

              //   > span:nth-of-type(2) {
              //     text-align: center;
              //   }
              > span:nth-of-type(3) {
                text-align: right;
              }
            }
          }

          > .bottom {
            width: 100%;
            height: calc(100% - 292px);
            background: rgba(0, 68, 154, 0.03);
            border-radius: 16px;
            padding: 40px 80px 42px 80px;
            box-sizing: border-box;

            > .msg_box {
              height: 100%;
              display: flex;

              > .s_title {
                font-family: SourceHanSansCN-Medium;
                font-size: 56px;
                color: #343434;
                letter-spacing: 0;
                font-weight: bold;
                margin-right: 48px;
                width: 260px;
              }

              > .text {
                width: calc(100% - 260px - 48px);
                font-size: 52px;
                font-family: SourceHanSansCN-Regular;
                color: #656565;
                letter-spacing: 0;
                line-height: 80px;
                font-weight: 400;
                height: 100%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }
        }
      }
    }
  }

  > .right_list {
    width: 800px;
    height: 100%;
    background-color: #fff;
    border-radius: 16px;
    padding: 0 0px 80px 80px;
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

    > .job_title_list {
      height: calc(100% - 240px);
      overflow: auto;

      > .job_title_item {
        width: 100%;
        height: 112px;
        padding-right: 80px;
        box-sizing: border-box;
        background-image: linear-gradient(90deg,
        rgba(0, 68, 154, 0.07) 0%,
        #fff 100%);
        display: flex;
        align-items: center;
        position: relative;

        > i {
          position: absolute;
          font-size: 40px;
          top: 36%;
          left: -12px;
          color: rgba(0, 68, 154, 0.5);
        }

        > div {
          font-family: SourceHanSansCN-Medium;
          font-size: 48px;
          color: #333333;
          letter-spacing: 0;
          font-weight: 500;
          margin-left: 64px;
          width: calc(100% - 64px);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      > .job_title_item:not(:last-of-type) {
        margin-bottom: 48px;
      }
    }
  }
}
</style>
