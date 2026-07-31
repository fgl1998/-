<!-- 职位库-抽屉 -->
<template>
  <el-dialog
      title="选择要搜索的职位"
      :visible="visible"
      width="70%"
      :append-to-body="true"
      :modal-append-to-body="false"
      :before-close="handleClose"
  >
    <div class="positionLibrary">
      <div class="title">
        <span>已发布的职位</span>
        <div class="chose_and_btn">
          <div class="chose_num">
            已选<span>{{ choseJobList.length }}</span>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="job_item" v-for="(item, index) in jobList" :key="'job' + index">
          <div class="chose_box">
            <div class="chose_btn" @click="handleChoseJob(item)">
              <template v-if="!item.isChose">
                <div class="no_chose"></div>
              </template>
              <template v-else>
                <div class="chose">
                  <div></div>
                </div>
              </template>
            </div>
            <div class="job_name" :title="item.acb213">
              {{ item.acb213 ? item.acb213 : "未知职位" }}
            </div>
          </div>
          <div class="info_box">
            <span v-if="item.acb217">{{ item.acb217 ? item.acb217 : "未知工作地址" }}</span>
            <span v-if="item.acc217">{{ item.acc217_dsc ? item.acc217_dsc : "未知工作年限" }}</span>
            <span v-if="item.aac011">{{
                item.aac011 ? $codeConfig.getCodeLabel("AAC011", item.aac011) : "未知学历"
              }}</span>
            <span
                class="salary">{{
                item.acb21h ? getAbbreviatSalary(item.acb21h) : "未知最低月薪"
              }}-{{ item.acb21j ? getAbbreviatSalary(item.acb21j) : "未知最高月薪" }}</span>
          </div>
          <div class="time">
            {{ item.aae043 ? moment(item.aae043).format("YYYY-MM-DD") : "未知发布时间" }}
          </div>
        </div>
      </div>
      <div class="btns">
        <el-button type="primary" @click="handleApplicate">确定</el-button>
        <el-button @click="handleClose">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import moment from "moment";

export default {
  name: "CC30List",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      userInfo: this.$loginConfig.getLoginInfo(),
      choseJobList: [],
      jobList: [],
    };
  },
  watch: {
    visible: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.initJobList(this.userInfo.aab001, this.userInfo.acb330);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    moment,
    // 初始化职位列表
    initJobList(aab001, acb330) {
      let params = {
        acb330: acb330,
      };
      this.$http.post(this.$requestConstant.businessRequestType, 'jy204_hrm252', null, params, true).then((data) => {
        this.jobList = data.data.data.data;
        this.jobList.forEach((item) => {
          if (item.acb21t == "0") {
            item.acb21j = item.acb21j * 12;
            item.acb21j = item.acb21j / 10000;
            item.acb21j = Math.round(item.acb21j);
          }
        });
      });
    },
    // 选择职位
    handleChoseJob(jobInfo) {
      this.jobList.forEach((item) => {
        if (item.isChose) {
          delete item.isChose;
        }
      });
      this.choseJobList = [];
      this.choseJobList.push(jobInfo);
      jobInfo.isChose = true;
    },
    // 关闭弹窗
    handleClose(done) {
      this.$emit("onClose");
    },
    // 提交
    handleApplicate() {
      if (this.choseJobList.length == 0) {
        this.$message.warning("请选择要添加参会的职位");
        return;
      }
      this.$emit("getData", this.choseJobList[0]);
      this.handleClose();
    },
  },
};
</script>

<style lang="less" scoped>
.positionLibrary {
  padding: 0 24px;

  .title {
    font-family: MicrosoftYaHei;
    font-size: 18px;
    line-height: 30px;
    color: #101e2e;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .chose_and_btn {
      display: flex;
      align-items: center;

      .chose_num {
        margin-right: 22px;
        font-size: 16px;
        color: #404040;

        > span {
          color: #ff5c00;
          margin-left: 4px;
        }
      }

      .add_btn {
        padding: 0 20px;
        height: 38px;
        background-color: #f4f9ff;
        border-radius: 2px;
        border: solid 1px #78b5fe;
        font-size: 16px;
        color: #2e8eff;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .add_btn:nth-of-type(1) {
        margin-right: 12px;
      }
    }
  }

  .content {
    width: 100%;
    height: 400px;
    // height: 294px;
    background-color: #fafcfe;
    border: solid 1px rgba(221, 221, 221, 0.61);
    padding: 4px 28px 0 20px;
    overflow: auto;
    box-sizing: border-box;

    .job_item {
      height: 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      box-sizing: border-box;

      > div {
        flex-shrink: 0;
      }

      .chose_box {
        display: flex;
        align-items: center;
        width: 30%;
        white-space: nowrap;

        .chose_btn {
          width: 16px;
          height: 16px;
          cursor: pointer;
          background-color: #f3f3f3;
          margin-right: 13px;

          > .no_chose {
            width: 100%;
            height: 100%;
            border: solid 1px #dddddd;
          }

          > .chose {
            width: 100%;
            height: 100%;
            border: solid 1px #007dee;
            display: flex;
            justify-content: center;
            align-items: center;

            > div {
              width: 8px;
              height: 8px;
              background-color: #007dee;
            }
          }
        }

        .job_name {
          font-family: MicrosoftYaHei;
          font-size: 16px;
          color: #333333;
          width: calc(100% - 2rem);
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.5rem;
        }
      }

      .info_box {
        font-size: 12px;
        color: #7a8799;
        width: 60%;

        > span:not(:last-of-type)::after {
          content: "|";
          color: #7a8799;
          margin: 0 6px;
        }

        .salary {
          color: #fe574a;
        }
      }

      .time {
        font-size: 12px;
        color: rgb(197, 202, 211);
      }

      .edit {
        font-size: 14px;
        color: #1380ff;
        cursor: pointer;
        display: flex;
        align-items: center;

        img {
          margin-right: 6px;
        }
      }
    }

    .job_item:not(:last-of-type) {
      border-bottom: solid 1px #dddddd;
    }
  }

  .btns {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
