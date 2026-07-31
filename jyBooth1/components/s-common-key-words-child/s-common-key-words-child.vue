<!-- 关键字-弹窗 -->
<template>
  <view class="major" v-if="visible">
    <view class="major_box">
      <view class="header">
        <view>
          <view>选择关键字</view>
        </view>
        <image
          src="../../static/images/close.png"
          @click="handleCancel"
        ></image>
      </view>
      <view class="container">
        <div class="input_box">
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            label-width="120px"
            size="medium"
          >
            <el-form-item label="" prop="keyWords">
              <el-input
                v-model="form.keyWords"
                placeholder="请输入6个字以内的关键字"
              ></el-input>
            </el-form-item>
          </el-form>

          <el-button @click="addKeyWordsList" v-if="keyWordsList.length < 10"
            >添加</el-button
          >
        </div>
        <div class="seen_box">
          <div
            class="key_words_item"
            v-for="(item, index) in keyWordsList"
            :key="'keyWords' + index"
            @click="deleteKeyWords(item)"
          >
            <span> {{ item }}</span>
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
        <view class="btns">
          <button @click="handleSubmit">确定</button>
          <button @click="handleCancel">取消</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "major",
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
    visible: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.$nextTick(() => {
            if (this.choseData.length > 0) {
              this.keyWordsList = this.choseData
            }
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    var checkKeyWords = (rule, value, callback) => {
      let isExit = this.keyWordsList.indexOf(value);
      if (isExit != -1) {
        return callback(new Error("该关键词已存在，请输入其他关键词"));
      } else {
        callback();
      }
    };
    return {
      keyWordsList: [], // 选择的关键字列表
      form: {
        keyWords: "",
      },
      rules: {
        keyWords: [
          { required: true, message: "请输入关键字", trigger: "blur" },
          {
            min: 1,
            max: 6,
            message: "长度在 1 到 6 个字符",
            trigger: "blur",
          },
          { validator: checkKeyWords, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 加入关键字
    addKeyWordsList() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.keyWordsList.push(this.form.keyWords);
          this.$refs.form.resetFields();
        } else {
          //console.log("error add!!");
          return false;
        }
      });
    },
    // 删除关键字
    deleteKeyWords(keywords) {
      this.keyWordsList = this.keyWordsList.filter((item) => item != keywords);
    },
    // 提交关键字
    handleSubmit() {
      //console.log('this.keyWordsList', this.keyWordsList);
      this.$emit("getData", this.keyWordsList);
      this.handleCancel();
    },
    // 关闭弹窗
    handleCancel() {
      this.$emit("onClose");
      setTimeout(() => {
        this.keyWords = "";
        this.keyWordsList = [];
      }, 500);
    },
  },
};
</script>

<style lang="less" scoped>
.major {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
  > .major_box {
    width: 1265px;
    // height: 750px;
    background: #ffffff;
    border-radius: 8px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    -webkit-transform: translateX(-50%) translateY(-50%);
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

.container {
  height: calc(100% - 68px);
}

.input_box {
  display: flex;
  padding-top: 20px;
  margin-bottom: 16px;
  /deep/form {
    width: 100%;
    .ant-col {
      width: 100% !important;
      padding-left: 0 !important;
    }
  }
  /deep/.el-button {
    margin-left: 16px !important;
    height: 36px;
  }
}
.seen_box {
  min-height: 200px;
  padding: 10px 122px;
  box-sizing: border-box;
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

.btns {
  background-color: #f7f7f7;
  width: 100%;
  height: 60px;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  button {
    width: 120px;
    margin: 0px;
  }
  > button:nth-of-type(1) {
    margin-right: 16px;
    background-color: #007dee;
    color: #fff;
  }
  > button:nth-of-type(2) {
    background-color: #fff;
    color: #333;
  }
}
</style>
