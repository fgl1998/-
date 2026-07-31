<!-- 职位亮点 - 弹窗 -->
<template>
  <view class="jobHeightLights" v-if="visible">
    <view class="job_height_light_box">
      <view class="header">
        <view>
          <view>选择职位标签</view>
        </view>
        <image
          src="../../static/images/close.png"
          @click="handleCancel"
        ></image>
      </view>
      <div class="main_box">
        <!-- <div class="choose_box">
          <div
            v-for="item in acb00rList"
            :key="item.acb00r"
            @click="addAcb00rList(1, item.acb00r, item.acb00rDesc)"
          >
            {{ item.acb00rDesc }}
          </div>
        </div> -->
        <div class="input_box">
          <el-form
            ref="form"
            :model="form"
            label-position="left"
            label-width="90px"
            prop="name"
          >
            <el-form-item label="自定义标签" prop="heightLight">
              <el-input
                v-model="form.heightLight"
                placeholder="请输入职位标签"
              ></el-input>
            </el-form-item>
          </el-form>

          <el-button
            @click="addAcb00rList(2)"
            v-if="choseAcb00rList.length < 10"
            >添加</el-button
          >
        </div>
        <div class="acb00r_list_box">
          <div
            class="key_words_item"
            v-for="(item, index) in choseAcb00rList"
            :key="'acb00r' + index"
            @click="deleteHeightLight(item)"
          >
            <span> {{ $codeConfig.getCodeLabel("ACB00R", item) }}</span>
            <uni-icons
              type="closeempty"
              size="16"
              class="close"
              :style="{
                color: '#007dee',
              }"
            ></uni-icons>
          </div>
        </div>
      </div>
      <div class="bottom_btns">
        <div class="left_bottom">
          已选<span>{{ choseAcb00rList.length }}</span
          >/10
        </div>
        <div class="right_bottom">
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </div>
    </view>
  </view>
</template>

<script>
export default {
  name: "jobHeightLights",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    // 最多选择个数
    maxLength: {
      type: Number,
      default: 1,
    },
    choseData: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    visible(val) {
      if (val) {
        // this.initACB00R();
        if (this.choseData && this.choseData.length > 0) {
          this.choseAcb00rList = this.choseData;
        } else {
          this.choseAcb00rList = [];
        }
      }
    },
  },
  data() {
    var checkHeightLight = (rule, value, callback) => {
      if (!value) {
        //console.log("value", value);
        callback(new Error("请输入职位亮点"));
      } else {
        if (value && value.length < 7) {
          let isExit = this.choseAcb00rList.indexOf(value);
          if (isExit != -1) {
            callback(new Error("该职位亮点已存在，请输入其他职位亮点"));
          } else {
            callback();
          }
        } else {
          callback(new Error("字数最长为6"));
        }
      }
    };
    return {
      acb00rList: [],
      choseAcb00rList: [],
      // 表单值
      form: {
        heightLight: "",
      },
      // 表单校验
      rules: {
        heightLight: [{ validator: checkHeightLight, trigger: "blur" }],
      },
    };
  },
  methods: {
    // 初始化职位亮点码值
    initACB00R() {
      let param = {
        apiCode: "queryPositionHighLightList",
        method: "queryPositionHighLightList",
      };
      this.$http
        .request("/api/business/getData.do", "post", param, true)
        .then((res) => {
          //console.log("res", res);
          if (res.serviceSuccess) {
            let result = res.data.data;
            this.acb00rList = result;
          } else {
            this.$utils.showToast("已成功填写招聘信息反馈");
          }
        });
    },
    // 关闭弹窗
    handleCancel() {
      this.$emit("onClose");
      setTimeout(() => {
        this.choseAcb00rList = [];
      }, 500);
    },
    // 添加自定义职位亮点
    addAcb00rList(type, acb00r, label) {
      if (type == 1) {
        let exits = this.choseAcb00rList.find((item) => item == acb00r);
        if (exits) {
          this.$utils.showToast('已选中该职位亮点', 'warning')
        } else {
          this.choseAcb00rList.push(acb00r);
        }
      }
      if (type == 2) {
        this.$refs.form.validate((valid) => {
          //console.log("valid", valid);
          if (valid) {
            this.choseAcb00rList.push(this.form.heightLight);
            this.$refs.form.resetFields();
          } else {
            //console.log("error add!!");
            return false;
          }
        });
      }
      //console.log("choseAcb00rList", this.choseAcb00rList);
    },
    // 删除职位亮点
    deleteHeightLight(heightLight) {
      this.choseAcb00rList = this.choseAcb00rList.filter(
        (item) => item != heightLight
      );
    },
    // 确定职位亮点
    handleSubmit() {
      this.$emit("getData", this.choseAcb00rList);
      this.handleCancel();
    },
  },
};
</script>

<style lang="less" scoped>
.jobHeightLights {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
  > .job_height_light_box {
    width: 1265px;
    // height: 750px;
    background: #ffffff;
    border-radius: 8px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    -webkit-transform: translateX(-50%) translateY(-50%);
    > view:last-child {
      padding: 32px 24px 0px 24px;
    }
  }
}
.header {
  height: 68px;
  background: #0682fe;
  border-radius: 8px 8px 0px 0px;
  padding: 0px 24px 0px 24px !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  > image {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
  > view {
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: 500;
    color: #ffffff;
    > image {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }
  }
}

.main_box {
  padding: 20px;
  flex: 1;
  box-sizing: border-box;
  .choose_box {
    min-height: 100px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 12px;
    > div {
      padding: 0 10px;
      height: 30px;
      box-sizing: border-box;
      border: 1px solid rgba(207, 207, 207, 1);
      border-radius: 5px;
      line-height: 30px;
      cursor: pointer;
    }
    > div:hover {
      color: #007dee;
      border: 1px solid #007dee;
    }
  }
  .input_box {
    display: flex;
    margin-bottom: 10px;
    /deep/.el-form {
      width: 100%;
      .ant-form-item-label {
        width: 86px !important;
      }
      .ant-form-item-control-wrapper {
        width: calc(100% - 86px) !important;
      }
    }
    .el-button {
      margin-left: 20px;
      width: 90px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .acb00r_list_box {
    flex: 1;
    padding: 20px 0;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    > div {
      flex-shrink: 0;
      padding: 0px 8px;
      height: 36px;
      line-height: 36px;
      background-color: rgb(236, 247, 250);
      box-sizing: border-box;
      border: 1px solid rgb(179, 234, 251);
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      > span {
        color: #007dee;
      }
      > .close {
        color: #007dee;
        margin-left: 6px;
      }
    }
  }
}

.bottom_btns {
  height: 60px;
  background-color: rgba(251, 251, 251, 1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 0 30px;
  font-size: 16px;
  > .left_bottom {
    color: #333333;
    > span {
      color: #007dee;
      margin-left: 6px;
    }
  }
  > .right_bottom {
    button {
      width: 100px;
      height: 35px;
      background-color: #007dee;
      border-radius: 5px;
      font-size: 14px;
      color: #fff;
    }
  }
}
</style>
