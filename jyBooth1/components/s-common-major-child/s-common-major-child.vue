<!-- 专业要求-弹窗 -->
<template>
  <view class="major" v-if="visible">
    <view class="major_box">
      <view class="header">
        <view>
          <view>选择专业要求</view>
        </view>
        <image
            src="../../static/images/close.png"
            @click="handleCancel"
        ></image>
      </view>
      <view class="container">
        <view class="chose_speciality" v-if="choseSpecialityList.length > 0">
          <ul class="chose_speciality_list">
            <li
                v-for="(item, index) in choseSpecialityList"
                :key="'choseSpeciality' + index"
                @click="cancleChoseSpeciality(item)"
            >
              <view>{{ item.aac183Desc }}</view>
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
                :class="choseClass.aac183 == item.aac183 ? 'choseClass' : ''"
            >
              {{ item.aac183Desc }}
            </view>
          </view>
          <view class="right_box">
            <view
                class="speciality_box"
                v-for="(i, n) in specialityList"
                :key="'speciality' + n"
            >
              <view
                  @click="chooseSpeciality(i)"
                  :class="
                  JSON.stringify(choseSpecialityList).indexOf(
                    JSON.stringify(i)
                  ) != -1
                    ? 'choseSpeciality'
                    : ''
                "
              >
                {{ i.aac183Desc }}
              </view>
            </view>
          </view>
        </view>
        <view class="btns">
          <button @click="submitChoseSpeciality">确定</button>
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
            //console.log("this.choseData", this.choseData);
            //console.log("this.classList", this.classList);
            if (this.choseData && this.choseData.length > 0) {
              if (this.choseData[0].aac183) {
                this.choseClass = this.classList.find(
                    (item) =>
                        item.aac183.substring(0, 2) ==
                        this.choseData[0].aac183.substring(0, 2)
                );
              }
              if (this.choseClass && this.choseClass.children) {
                this.specialityList = this.choseClass.children;
                this.choseSpecialityList = this.choseClass.children.filter(
                    (i) => i.aac183 == this.choseData[0].aac183
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
      choseSpecialityList: [], // 选择专业
      classList: [], // 种类列表
      choseClass: {}, // 选择种类
      specialityList: [], // 选择的专业列表
    };
  },
  async mounted() {
    this.initSpeciality();
  },
  methods: {
    // 初始化专业种类
    initSpeciality() {
      this.$http.post(this.$requestConstant.commonRequestType, 'queryProfession', null, null, false).then((res) => {
        this.classList = res.data.data.data;
        this.chooseClass(this.classList[0]);
      });
    },
    // 选择种类
    chooseClass(info) {
      //console.log("info", info);
      this.choseClass = info;
      this.specialityList = info.children;
      // 只有一级就只选择一级
      if (info.children.length == 0) {
        let isCityExist = this.choseSpecialityList.find(
            (item) => item.aac183 == info.aac183
        );
        if (isCityExist == undefined) {
          if (this.choseSpecialityList.length < this.maxLength) {
            this.choseSpecialityList.push(info);
          } else if (this.maxLength === 1) {
            this.choseSpecialityList = [info];
          }
        } else {
          this.choseSpecialityList = this.choseSpecialityList.filter(
              (item) => item.aac183 !== info.aac183
          );
          this.choseClass = {};
        }
      }
    },
    // 选择具体专业
    chooseSpeciality(info) {
      // 判断是否选择
      let isCityExist = this.choseSpecialityList.find(
          (item) => item.aac183 == info.aac183
      );
      if (isCityExist == undefined) {
        if (this.choseSpecialityList.length < this.maxLength) {
          this.choseSpecialityList.push(info);
        } else if (this.maxLength === 1) {
          this.choseSpecialityList = [info];
        }
      } else {
        this.choseSpecialityList = this.choseSpecialityList.filter(
            (item) => item.aac183 !== info.aac183
        );
      }
    },
    // 单个取消选中专业
    cancleChoseSpeciality(info) {
      this.choseSpecialityList = this.choseSpecialityList.filter(
          (item) => item.aac183 !== info.aac183
      );
    },
    // 确认选择
    submitChoseSpeciality() {
      //console.log("this.choseSpecialityList", this.choseSpecialityList);
      this.$emit("getData", this.choseSpecialityList);
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

.chose_speciality {
  padding: 0 20px;
  height: 50px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .chose_speciality_list {
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

    > .speciality_box {
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

.choseSpeciality {
  background-color: #3ca1ff !important;
  color: #fff !important;
}
</style>
