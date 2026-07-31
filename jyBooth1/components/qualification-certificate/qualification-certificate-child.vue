<!-- 职业-弹窗 -->
<template>
  <view class="workType" v-if="visible">
    <view class="work_box">
      <view class="header">
        <view>
          <view>选择资格证书</view>
        </view>
        <image
            src="../../static/images/close.png"
            @click="handleCancel"
        ></image>
      </view>
      <view class="inner_card">
        <!-- 左侧一、二级选择 -->
        <view class="left">
          <view class="left_title">
            <view>证书类别</view>
            <span v-if="isShowAll" @click="handleOpenAll">展开</span>
            <span v-else @click="handleCloseAll">收起</span>
          </view>
          <view class="search_box">
            <view class="input_box">
              <input
                  type="text"
                  v-model="searchaca151"
                  placeholder="请输入名称模糊搜索"
              />
              <button class="search" @click="handleSearchByInput">搜索</button>
            </view>
            <view class="search_result" v-if="isShowSearchResult">
              <view
                  class="search_item"
                  v-for="item in searchList"
                  :key="item.aca150"
                  @click="handleCheckSearchResule(item)"
              >
                <view>{{ item.workType }}</view>
                <view>{{ item.workNav }}</view>
              </view>
            </view>
          </view>
          <view class="left_list_box">
            <view v-for="(item, index) in leftList" :key="index">
              <view
                  :class="[
                  'title',
                ]"
                  @click="clickFromLeftList(item, 1)"
              >
                <uni-icons
                    :type="item.isShowUl ? 'arrow-down' : 'arrow-right'"
                    size="14"
                ></uni-icons>
                <span>{{ item.aca151 }}</span>
              </view>
              <!-- 判断是否展示列表 过渡 -->
              <ul
                  :style="{
                  height: item.isShowUl
                    ? 1.875 * item.children.length + 1 + 'rem'
                    : 0,
                }"
              >
                <li
                    v-for="one in item.children"
                    :key="one.aca150"
                    @click="clickFromLeftList(one, 2)"
                    
                >
                  {{ one.aca151 }}
                </li>
              </ul>
            </view>
          </view>
        </view>
        <view class="right">
          <view class="right_title">
            <span>全部资格证书</span>
            <span class="li_span">
              <span></span>
            </span>
          </view>
          <view class="right_list_box">
            <view class="three_list">
              <view
                  :class="getItemClass(item)"
                  v-for="item in threeList"
                  :key="item.aca150"
                  @click="clickFromLeftList(item, 3)"
              >
                <view>{{ item.aca151 }}</view>
              </view>
            </view>
            <view class="four_list">
              <view
                  :class="[
                  'four_item',
                  checkedList[0] &&
                  checkedList[0].aca150 &&
                  checkedList[0].aca150 == item.aca150
                    ? 'title_icon_check'
                    : '',
                ]"
                  v-for="item in fourList"
                  :key="item.aca150"
                  @click="clickFromLeftList(item, 4)"
              >
                <view>
                  {{ item.aca151 }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="footer">
        <view class="footer_label">
          已选择：<span>{{ checkedList.length }}</span
        >个
        </view>
        <ul class="chose_job_list">
          <li
              v-for="(item, index) in checkedList"
              :key="index"
              @click="cancleChoseJob(item)"
          >
            <view>{{ item.aca151 }}</view>
            <view class="close">X</view>
          </li>
        </ul>
        <view class="right_btn">
          <button @click="handleOk">确认</button>
          <button @click="handleCancel">取消</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "workType",
  props: {
    maxLength: {
      type: Number,
      default: 30,
    },
    visible: {
      type: Boolean,
    },
    choseData: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    // 打开、关闭弹窗重置值
    visible: {
      handler(val) {
        if (val) {
          this.show = val;
          this.$nextTick(() => {
            if (this.choseData.length) {
              this.checkedList = this.choseData
            }
          });
        } else {
          this.checkedList = [];
          this.threeList = [];
          this.fourList = [];
          this.searchList = [];
          this.isShowSearchResult = false;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.initJobList();
  },
  data() {
    return {
      // 左侧列表数据
      leftList: [],
      // 右侧nav栏数据
      navList: [],
      // 右侧数据
      rightList: [],
      // 选中数据
      checkedList: [],
      show: false,
      threeList: [], // 三级数据
      fourList: [], // 四级数据
      searchList: [], // 搜索列表
      isShowSearchResult: false, // 是否显示搜索列表
      searchaca151: "", // 搜索关键字
    };
  },
  computed: {
    // 判断左侧是 全部展开 还是全部
    isShowAll() {
      let index = this.leftList.findIndex((item) => !item.isShowUl);
      if (index === -1) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    getItemClass(item) {
      // const checkedItem = this.checkedList[0];
      if (this.checkedList.length && this.checkedList.some(i => i.aca150 === item.aca150)) {
        return 'three_item title_icon_check';
      } else {
        return 'three_item';
      }
    },
    // 收起左侧所有二级列表
    handleCloseAll() {
      this.leftList = this.leftList.map((item) => {
        return {...item, isShowUl: false};
      });
      this.threeList = [];
      this.fourList = [];
    },
    // 展开左侧所有二级列表
    handleOpenAll() {
      this.leftList = this.leftList.map((item) => {
        return {...item, isShowUl: true};
      });
    },
    // 判断是否被选中
    isChecked(value) {
      let index = this.checkedList.findIndex(
          (item) => item.aca150 === value.aca150
      );
      if (index === -1) {
        return false;
      } else {
        return true;
      }
    },
    // 判断标题栏是否全选
    isTitleChecked(value) {
      let list = this.checkedList.filter(
          (item) => item.parentid === value.aca150
      );
      if (value.children.length === list.length && list.length !== 0) {
        return true;
      } else {
        return false;
      }
    },
    // 初始化资格证书
    initJobList() {
      this.$http.post(this.$requestConstant.businessRequestType, 'jy202_hrm214', null, null, true).then((responseData) => {
        let res = responseData ? responseData.data : {};
        if (res.errors && res.errors.length > 0) {
          this.$utils.showToast(res.errors[0].msg);
        } else {
          this.leftList = res.data.data;
          this.handleSetAll();
        }
      });
    },
    // 层级点击事件-从列表 （处理左侧列表收缩 以及 锚点事件）
    clickFromLeftList(info, type) {
      // 点击一级
      if (type == 1) {
        this.threeList = [];
        this.fourList = [];
        // 有二级 - 展开
        if (info.children && info.children.length > 0) {
          let item = this.leftList.find((item) => item.aca150 == info.aca150);
          if (item.isShowUl) {
            this.$set(item, "isShowUl", false);
          } else {
            this.$set(item, "isShowUl", true);
          }
          // 无二级 - 选中一级
        } else {
          let isExit = this.checkedList.find(
              (item) => item.aca150 == info.aca150
          );
          // 选则列表中无该项
          if (!isExit) {
            if (this.checkedList.length < this.maxLength) {
              this.checkedList.push(info);
              // this.$set(item, "isCheck", true);
            } else {
              if (this.maxLength == 1) {
                this.checkedList = [info];
              } else {
                this.$$utils.showToast(`不能选择超过${this.maxLength}项`);
              }
            }
            // 选则列表中有该项
          } else {
            this.checkedList = this.checkedList.filter(
                (item) => item.aca150 != info.aca150
            );
          }
        }
      }
      // 点击二级
      if (type == 2) {
        this.fourList = [];
        // 有三级 - 展开
        if (info.children && info.children.length > 0) {
          this.threeList = info.children;
          // 无三级 - 选中二级
        } else {
          this.threeList = [];
          let isExit = this.checkedList.find(
              (item) => item.aca150 == info.aca150
          );
          // 选则列表中无该项
          if (!isExit) {
            if (this.checkedList.length < this.maxLength) {
              this.checkedList.push(info);
            } else {
              if (this.maxLength == 1) {
                this.checkedList = [info];
              } else {
                this.$message.warn(`不能选择超过${this.maxLength}项`);
              }
            }
            // 选则列表中有该项
          } else {
            this.checkedList = this.checkedList.filter(
                (item) => item.aca150 != info.aca150
            );
          }
        }
      }
      // 点击三级
      if (type == 3) {
        // 有四级 - 展开
        if (info.children && info.children.length > 0) {
          this.fourList = info.children;
          // 无四级 - 选中三级
        } else {
          this.fourList = [];
          let isExit = this.checkedList.find(
              (item) => item.aca150 == info.aca150
          );
          // 选则列表中无该项
          if (!isExit) {
            if (this.checkedList.length < this.maxLength) {
              this.checkedList.push(info);
            } else {
              if (this.maxLength == 1) {
                this.checkedList = [info];
              } else {
                this.$message.warn(`不能选择超过${this.maxLength}项`);
              }
            }
            // 选则列表中有该项
          } else {
            this.checkedList = this.checkedList.filter(
                (item) => item.aca150 != info.aca150
            );
          }
        }
      }
      // 点击四级
      if (type == 4) {
        let isExit = this.checkedList.find(
            (item) => item.aca150 == info.aca150
        );
        // 选则列表中无该项
        if (!isExit) {
          if (this.checkedList.length < this.maxLength) {
            this.checkedList.push(info);
          } else {
            if (this.maxLength == 1) {
              this.checkedList = [info];
            } else {
              this.$message.warn(`不能选择超过${this.maxLength}项`);
            }
          }
          // 选则列表中有该项
        } else {
          this.checkedList = this.checkedList.filter(
              (item) => item.aca150 != info.aca150
          );
        }
      }
    },
    // 层级点击事件-从搜索 （处理左侧列表收缩 以及 锚点事件）
    clickFromSearchList(info, type) {
      // 点击一级
      if (type == 1) {
        this.threeList = [];
        this.fourList = [];
        // 有二级 - 展开
        if (info.children && info.children.length > 0) {
          let item = this.leftList.find((item) => item.aca150 == info.aca150);
          if (item.isShowUl) {
            this.$set(item, "isShowUl", false);
          } else {
            this.$set(item, "isShowUl", true);
          }
          // 无二级 - 选中一级
        } else {
          let isExit = this.checkedList.find(
              (item) => item.aca150 == info.aca150
          );
          // 选则列表中无该项
          if (!isExit) {
            if (this.checkedList.length < this.maxLength) {
              this.checkedList.push(info);
              // this.$set(item, "isCheck", true);
            } else {
              if (this.maxLength == 1) {
                this.checkedList = [info];
              } else {
                this.$message.warn(`不能选择超过${this.maxLength}项`);
              }
            }
          }
        }
      }
      // 点击二级
      if (type == 2) {
        this.fourList = [];
        // 有三级 - 展开
        if (info.children && info.children.length > 0) {
          this.threeList = info.children;
          // 无三级 - 选中二级
        } else {
          this.threeList = [];
          let isExit = this.checkedList.find(
              (item) => item.aca150 == info.aca150
          );
          // 选则列表中无该项
          if (!isExit) {
            if (this.checkedList.length < this.maxLength) {
              this.checkedList.push(info);
            } else {
              if (this.maxLength == 1) {
                this.checkedList = [info];
              } else {
                this.$message.warn(`不能选择超过${this.maxLength}项`);
              }
            }
          }
        }
      }
      // 点击三级
      if (type == 3) {
        // 有四级 - 展开
        if (info.children && info.children.length > 0) {
          this.fourList = info.children;
          // 无四级 - 选中三级
        } else {
          this.fourList = [];
          let isExit = this.checkedList.find(
              (item) => item.aca150 == info.aca150
          );
          // 选则列表中无该项
          if (!isExit) {
            if (this.checkedList.length < this.maxLength) {
              this.checkedList.push(info);
            } else {
              if (this.maxLength == 1) {
                this.checkedList = [info];
              } else {
                this.$message.warn(`不能选择超过${this.maxLength}项`);
              }
            }
          }
        }
      }
      // 点击四级
      if (type == 4) {
        let isExit = this.checkedList.find(
            (item) => item.aca150 == info.aca150
        );
        // 选则列表中无该项
        if (!isExit) {
          if (this.checkedList.length < this.maxLength) {
            this.checkedList.push(info);
          } else {
            if (this.maxLength == 1) {
              this.checkedList = [info];
            } else {
              this.$message.warn(`不能选择超过${this.maxLength}项`);
            }
          }
        }
      }
    },
    // 设置全部
    handleSetAll() {
      this.rightList = [];
      this.leftList.forEach((item) => {
        this.rightList = [...this.rightList, ...item.children];
      });
    },
    // 选中搜索结果
    handleCheckSearchResule(info) {
      let isExit = this.checkedList.find(
          (item) => item.aca150 == info.aca150
      );
      if (!isExit) {
        if (this.checkedList.length < this.maxLength) {
          this.checkedList.push(info);
        } else {
          if (this.maxLength == 1) {
            this.checkedList = [info];
          } else {
            this.$message.warn(`不能选择超过${this.maxLength}项`);
          }
        }
      }
    
      this.isShowSearchResult = false;
    },
    // 取消选中
    cancleChoseJob(value) {
      this.checkedList = this.checkedList.filter(
          (item) => item.aca150 !== value.aca150
      );
    },
    handleOk() {
      this.$emit("getData", this.checkedList);
      this.handleCancel();
    },
    handleCancel() {
      this.$emit("onClose");
      this.show = false;
    },
    handleNoZero(num) {
      for (let i = num.length - 1; i >= 0; i--) {
        if (num[i] != 0) {
          return i;
        }
      }
    },

    // 搜索
    handleSearchByInput() {
      let keywords = this.searchaca151;
      if (!keywords) {
        return;
      }
      let param = {
        apiCode: "jy202_hrm215",
        method: "jy202_hrm215",
        keywords,
      };
      this.$http.post(this.$requestConstant.businessRequestType, 'jy202_hrm215', null, param, true).then((responseData) => {
        let res = responseData ? responseData.data : {};
        if (res.serviceSuccess) {
          let result = res.data.data;
          if (result.length > 0) {
            this.isShowSearchResult = true;
          }
          let navList = [];
          result.forEach((item) => {
            navList = [];
            navList.push(item.aca151);
            // 有二级
            if (item.singleChildren) {
              navList.push(item.singleChildren.aca151);
              // 有三级
              if (item.singleChildren.singleChildren) {
                navList.push(item.singleChildren.singleChildren.aca151);
                // 有四级
                if (item.singleChildren.singleChildren.singleChildren) {
                  this.$set(
                      item,
                      "workType",
                      item.singleChildren.singleChildren.singleChildren.aca151
                  );
                  this.$set(
                      item,
                      "workCode",
                      item.singleChildren.singleChildren.singleChildren.aca150
                  );
                  navList.push(
                      item.singleChildren.singleChildren.singleChildren.aca151
                  );
                  // 无四级
                } else {
                  this.$set(
                      item,
                      "workType",
                      item.singleChildren.singleChildren.aca151
                  );
                  this.$set(
                      item,
                      "workCode",
                      item.singleChildren.singleChildren.aca150
                  );
                }
                // 无三级
              } else {
                this.$set(item, "workType", item.singleChildren.aca151);
                this.$set(item, "workCode", item.singleChildren.aca150);
              }
              // 无二级
            } else {
              this.$set(item, "workType", item.aca151);
              this.$set(item, "workCode", item.aca150);
            }
            navList = navList.join(" / ");
            this.$set(item, "workNav", navList);
          });
          this.searchList = result.filter(item => item.aca154 == '3');

        } else {
          this.$utils.showToast(res.errors[0].msg);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.workType {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;

  > .work_box {
    width: 1265px;
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

.inner_card {
  height: 600px;
  display: flex;
  justify-content: space-between;

  .left {
    width: 260px;
    height: 100%;
    cursor: pointer;

    .left_title {
      background: #f5f7fa;
      font-size: 14px;
      font-weight: 600;
      height: 40px;
      color: #09122c;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      box-sizing: border-box;

      > span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #2e8eff;
        font-weight: 400;
      }
    }

    .search_box {
      height: 54px;
      padding: 10px;
      background: #f9fbff;
      position: relative;
      cursor: default;
      box-sizing: border-box;

      .input_box {
        width: 100%;
        height: 100%;
        display: flex;

        input {
          width: 75%;
          height: 100%;
          border: 1px solid #ddd;
          padding-left: 10px;
          box-sizing: border-box;
          font-size: 14px;
          margin-right: 10px;
        }

        .search {
          width: 25%;
          height: 100%;
          font-size: 14px;
          color: #fff;
          background-color: #007dee;
        }
      }

      .close_btn {
        text-align: right;
        padding: 0 15px;

        i {
          cursor: pointer;
        }

        i:hover {
          color: #007dee;
        }
      }

      .search_result {
        width: 100%;
        height: 400px;
        background-color: #fff;
        position: absolute;
        top: 44px;
        left: 0px;
        z-index: 999;
        box-shadow: 0px 8px 8px 0px rgba(0, 35, 67, 0.08);
        overflow: auto;
        padding: 15px 0px;
        padding-top: 5px;
        box-sizing: border-box;

        .search_item:not(:last-of-type) {
          margin-bottom: 14px;
        }

        .search_item {
          cursor: pointer;
          padding: 0 15px;
          box-sizing: border-box;

          > view:nth-of-type(1) {
            color: #333;
            margin-bottom: 4px;
          }

          > view:nth-of-type(2) {
            font-size: 14px;
            color: #666;
          }
        }

        .search_item:hover {
          > view:nth-of-type(1) {
            font-weight: bold;
          }

          background-color: #e7e7e7;
        }
      }
    }

    .left_list_box {
      overflow: scroll;
      height: calc(100% - 94px);
      background: #f9fbff;

      .title {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        height: max-content;
        min-height: 20px;
        color: #333333;
        font-weight: 600;
        box-sizing: content-box;
        padding: 6px 0 6px 14px;
        position: relative;

        .title_icon {
          padding: 0 13px;
          transition: all 0.3s;
          position: absolute;
          left: 0;
          top: 8px;
          height: 20px;
          line-height: 20px;
        }
      }

      ul {
        overflow: hidden;
        transition: height 0.3s;
        padding: 0px !important;

        > li {
          font-size: 14px;
          min-height: 30px;
          line-height: 30px;
          padding-left: 45px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-bottom: 0;
        }
      }
    }
  }

  .right {
    width: calc(100% - 260px);

    .right_title {
      height: 40px;
      background: #f5f7fa;
      font-size: 14px;
      font-weight: 600;
      color: #09122c;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      box-sizing: border-box;
    }

    .right_list_box {
      padding: 10px 20px;
      box-sizing: border-box;
      overflow: scroll;
      height: calc(100% - 40px);
      box-sizing: border-box;
      display: flex;

      > .three_list {
        width: 30%;
        margin-right: 20px;
        display: flex;
        flex-direction: column;
        overflow: auto;
        border-right: 1px solid #ddd;

        > .three_item {
          line-height: 50px;
          cursor: pointer;
          padding-left: 10px;
          box-sizing: border-box;
        }

        > .three_item:hover {
          background-color: #e7e7e7;
        }
      }

      > .four_list {
        width: calc(70% - 20px);
        display: flex;
        flex-wrap: wrap;
        overflow: auto;
        align-content: flex-start;
        gap: 1%;

        > .four_item {
          width: 49%;
          margin-bottom: 10px;
          padding: 0 20px;
          box-sizing: border-box;

          > view {
            width: auto;
            cursor: pointer;
          }

          > view:hover {
            color: #007dee;
          }
        }
      }

      > view {
        .title {
          font-size: 18px;
          font-weight: 600;
          height: 36px;
          line-height: 36px;
        }

        .item_box {
          display: flex;
          flex-wrap: wrap;
          padding-left: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid #dcdee0;

          > view {
            width: calc(100% / 3);
            padding-right: 10px;
          }
        }
      }
    }
  }
}

.footer {
  padding: 0 20px;
  height: 54px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .footer_label {
    font-size: 14px;

    > span {
      font-family: PingFangSC-Medium;
      font-size: 20px;
      color: #ff9920;
      font-weight: 600;
      padding: 0 19px 0 10px;
    }
  }

  .chose_job_list {
    flex: 1;
    display: flex;
    align-items: center;
    margin-bottom: 0px !important;
    flex-wrap: wrap;
    padding: 0 20px;
    box-sizing: border-box;

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

  .right_btn {
    width: 150px;
    margin-left: 20px;
    display: flex;

    button {
      height: 34px;
      border-radius: 2px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;

      &:nth-of-type(1) {
        background: #2e8eff;
        color: #fff;
      }
    }
  }
}

.title_icon_check {
  background-color: #9bd0ff;
}
</style>
