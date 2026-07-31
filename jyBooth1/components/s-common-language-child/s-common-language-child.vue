<!-- 语言要求-弹窗 -->
<template>
  <view class="language" v-if="visible">
    <view class="language_box">
      <view class="header">
        <view>
          <view>选择语言要求</view>
        </view>
        <image
            src="../../static/images/close.png"
            @click="handleCancel"
        ></image>
      </view>
      <view class="container">
        <view class="chose_language" v-if="choseLanguageList.length > 0">
          <ul class="chose_language_list">
            <li
                v-for="(item, index) in choseLanguageList"
                :key="'choseLanguage' + index"
                @click="cancleChoseLanguage(item)"
            >
              <view>{{ item.acc241Desc }}</view>
              <view class="close">X</view>
            </li>
          </ul>
          <view class="notice">最多只能选择{{ maxLength }}项</view>
        </view>
        <view class="content">
          <view class="left_box">
            <view
                class="class_btn"
                v-for="(item, index) in classList"
                :key="'class' + index"
                @click="chooseClass(item)"
                :class="choseClass.acc241 == item.acc241 ? 'choseClass' : ''"
            >
              {{ item.acc241Desc }}
            </view>
          </view>
          <view class="right_box">
            <view
                class="language_box"
                v-for="(i, n) in languageList"
                :key="'language' + n"
            >
              <view
                  @click="chooseLanguage(i)"
                  :class="
                  JSON.stringify(choseLanguageList).indexOf(
                    JSON.stringify(i)
                  ) != -1
                    ? 'choseLanguage'
                    : ''
                "
              >
                {{ i.acc241Desc }}
              </view>
            </view>
          </view>
        </view>
        <view class="btns">
          <button @click="submitChoseLanguage">确定</button>
          <button @click="handleCancel">取消</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "language",
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
            if (this.choseLanguage && this.choseLanguage.length > 0) {
              //console.log("this.classList", this.classList);
              //console.log('this.choseLanguage[0].acc241.length', this.choseLanguage[0].acc241.length);
              if (this.choseLanguage[0].acc241.length == 3) {
                this.choseClass = this.classList.find(
                    (item) =>
                        item.acc241.substring(0, 1) ==
                        this.choseLanguage[0].acc241.substring(0, 1)
                );
              }
              if (this.choseLanguage[0].acc241.length == 4) {
                this.choseClass = this.classList.find(
                    (item) =>
                        item.acc241.substring(0, 2) ==
                        this.choseLanguage[0].acc241.substring(0, 2)
                );
              }
              //console.log("this.choseClass", this.choseClass);
              if (this.choseClass && this.choseClass.children) {
                this.languageList = this.choseClass.children;
                this.choseLanguageList = this.choseClass.children.filter(
                    (i) => i.acc241 == this.choseLanguage[0].acc241
                );
              }
            }
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      choseLanguageList: [], // 选择语言
      classList: [], // 种类列表
      choseClass: {}, // 选择种类
      languageList: [], // 选择的语言列表
    };
  },
  async mounted() {
    this.initLanguage();
  },
  methods: {
    // 初始化语言种类
    initLanguage() {
      this.$http.post(this.$requestConstant.commonRequestType, 'queryLanguageType', null, null, false).then((res) => {
        console.log("初始化语言种类", res);
        this.classList = res.data.data.data;
        this.chooseClass(this.classList[0]);
      });
    },
    // 选择种类
    chooseClass(info) {
      console.log("chooseClass", info);
      // this.choseClass = info;
      // this.languageList = info.children;

      // 判断是否选择
      let isCityExist = this.choseLanguageList.find(
          (item) => item.acc241 == info.acc241
      );
      if (isCityExist == undefined) {
        if (this.choseLanguageList.length < this.maxLength) {
          this.choseLanguageList.push(info);
        } else if (this.maxLength === 1) {
          this.choseLanguageList = [info];
        }
      } else {
        this.choseLanguageList = this.choseLanguageList.filter(
            (item) => item.acc241 !== info.acc241
        );
      }
    },
    // 选择具体语言
    chooseLanguage(info) {
      console.log("chooseLanguage", info);
      // 判断是否选择
      let isCityExist = this.choseLanguageList.find(
          (item) => item.acc241 == info.acc241
      );
      if (isCityExist == undefined) {
        if (this.choseLanguageList.length < this.maxLength) {
          this.choseLanguageList.push(info);
        } else if (this.maxLength === 1) {
          this.choseLanguageList = [info];
        }
      } else {
        this.choseLanguageList = this.choseLanguageList.filter(
            (item) => item.acc241 !== info.acc241
        );
      }
    },
    // 单个取消选中语言
    cancleChoseLanguage(info) {
      console.log("cancleChoseLanguage", info);
      this.choseLanguageList = this.choseLanguageList.filter(
          (item) => item.acc241 !== info.acc241
      );
    },
    // 确认选择
    submitChoseLanguage() {
      //console.log("this.choseLanguageList", this.choseLanguageList);
      this.$emit("getData", this.choseLanguageList);
      this.handleCancel();
    },
    // 关闭弹窗
    handleCancel() {
      this.$emit("onClose");
    },
  },
};
</script>

<style lang="less" scoped>
.language {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;

  > .language_box {
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

.chose_language {
  padding: 0 20px;
  height: 50px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .chose_language_list {
    display: flex;
    align-items: center;
    margin-bottom: 0px !important;
    padding: 0px !important;

    > li {
      height: 26px;
      font-size: 12px;
      color: #333;
      padding: 0 8px;
      background-color: #fff;
      border: 1px solid #999999;
      cursor: pointer;
      display: flex;
      align-items: center;

      > .close {
        font-weight: bold;
        color: #999;
        margin-left: 6px;
        font-size: 11px;
      }
    }

    > li:not(:last-of-type) {
      margin-right: 12px;
    }
  }

  .notice {
    width: 154px;
    // padding-left: 38px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background-size: 100% 100%;
  }
}

.content {
  width: 100%;
  height: 478px;
  display: flex;

  .left_box {
    width: 260px;
    height: 100%;
    overflow: auto;
    background-color: #f7f7f7;

    > .class_btn {
      padding-left: 20px;
      height: 34px;
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 14px;
    }

    > .class_btn:hover {
      background-color: #ddd;
    }
  }

  .right_box {
    width: calc(100% - 260px);
    padding: 6px 14px;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 10px;
    overflow-y: scroll;

    > .language_box {
      width: 32%;
      height: 36px;

      > view {
        height: 100%;
        display: inline-block;
        line-height: 36px;
        cursor: pointer;
        padding: 0 6px;
      }

      > view:hover {
        background-color: #ddd;
      }
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

.choseClass {
  background-color: #fff !important;
  font-weight: bold !important;
  color: #007dee !important;
}

.choseLanguage {
  background-color: #3ca1ff !important;
  color: #fff !important;
}
</style>
