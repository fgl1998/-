<template>
  <view>
    <div class="modal-input" @click="clickModal">
      <div
        :class="
          !disabled
            ? moduleValue
              ? 'input-content input-text'
              : 'input-content input-placehoder'
            : 'input-content input-placehoder input-disabled'
        "
        :style="{ cursor: disabled ? 'not-allowed' : 'pointer' }"
      >
        <span>{{ !moduleValue ? placeholder : moduleValue }}</span>
      </div>
    </div>
    <uni-popup ref="popup" type="center">
      <div class="screen-box">
        <div class="screen-title">
          <div class="screen-title-base">
            <text style="color: #0c6af7">行业</text>选择
            <span> / 请您选择或检索相关行业</span>
          </div>
          <div class="screen-title-close" @click="close">
            <image src="../../static/images/index/icon-close.png" mode="aspectFit"></image>
          </div>
        </div>
        <div class="screen-content">
          <div class="screen-lt">
            <div class="screen-search">
              <div class="screen-search-input">
                <uni-easyinput
                  type="text"
                  v-model="searchText"
                  placeholder="行业名称搜索"
                  suffixIcon="search"
                  @iconClick="iconClick"
                />
              </div>
            </div>
            <div class="screen-tab">
              <scroll-view scroll-y="true" class="scroll-Y" style="height: 100%">
                <div
                  v-for="(item, index) in unitTypeTree"
                  :key="index"
                  @click="changeType(item, 1)"
                  :class="['tab-item', item.aab022 == screenType ? 'actived' : '']"
                >
                  <span class="text">{{ item.aab022Desc }}</span>
                  <span class="arrow"
                    ><image src="../../static/images/viewer/icon-arrow.png" mode="aspectFit"></image
                  ></span>
                </div>
              </scroll-view>
            </div>
          </div>

          <div class="screen-rt" v-if="!searchShow && unitTypeSecond.length > 0">
            <!-- <div class="screen-rt-list">
              <scroll-view scroll-y="true" style="height: 100%">
                <div
                  v-for="(item, index) in unitTypeSecond"
                  :key="index"
                  @click="changeType(item, 2)"
                  :class="['tab-item', item.aab022 == screenTypeSecond ? 'actived' : '']"
                >
                  <span class="text">{{ item.aab022Desc }}</span>
                  <span class="arrow"
                    ><image src="../../static/images/viewer/icon-arrow.png" mode="aspectFit"></image
                  ></span>
                </div>
              </scroll-view>
            </div>
            <div class="screen-rt-list" v-if="unitTypeTrid.length > 0">
              <scroll-view scroll-y="true" style="height: 100%">
                <div
                  v-for="(item, index) in unitTypeTrid"
                  :key="index"
                  @click="changeType(item, 3)"
                  :class="['tab-item', item.aab022 == screenTypeTrid ? 'actived' : '']"
                >
                  <span class="text">{{ item.aab022Desc }}</span>
                  <span class="arrow"
                    ><image src="../../static/images/viewer/icon-arrow.png" mode="aspectFit"></image
                  ></span>
                </div>
              </scroll-view>
            </div> -->
            <div class="screen-rt-tag">
              <template v-if="unitTypeSecond.length > 0">
                <scroll-view scroll-y="true" style="height: 100%">
                  <div class="screen-rt-tag-content">
                    <div
                      v-for="(item, index) in unitTypeSecond"
                      :key="index"
                      @click="changeType(item)"
                      :class="['tab-item-tag', item.aab022 == screenTypeLast ? 'actived' : '']"
                    >
                      <span class="text">{{ item.aab022Desc }}</span>
                    </div>
                  </div>
                </scroll-view>
              </template>
              <template>
                <div class="nodata">
                  <div class="nodata-pic">
                    <div class="nodata-img"></div>
                    <div class="nodata-text">暂时检索不到你要的数据哦~</div>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <div class="screen-rt" v-else-if="searchShow && searchArray.length > 0">
            <scroll-view scroll-y="true" style="height: 100%">
              <div class="screen-rt-tag-content-search">
                <div
                  v-for="(item, index) in searchArray"
                  :key="index"
                  @click="changeType(item)"
                  :class="['tab-item-tag', item.aab022 == screenTypeLast ? 'actived' : '']"
                >
                  <span class="text">{{ item.aab022Desc }}</span>
                </div>
              </div>
            </scroll-view>
          </div>

          <div class="screen-rt" v-else>
            <div class="nodata">
              <div class="nodata-pic">
                <div class="nodata-img"></div>
                <div class="nodata-text">暂时检索不到你要的数据哦~</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </uni-popup>
  </view>
</template>

<script>
export default {
  name: 'modal-unittype',

  data() {
    return {
      moduleValue: '',
      searchText: '',
      searchShow: false,
      screenType: '',
      screenTypeSecond: '',
      screenTypeTrid: '',
      screenTypeLast: '',
      unitTypeTree: [], //一级数据
      unitTypeSecond: [], //二级数据
      unitTypeTrid: [], //三级数据
      unitTypeLast: [], //最后级数据
      checkSelect: {}, //选中数据
      searchArray: [],
    }
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '选择行业',
    },
    moduleKey: {
      type: String,
      default: '',
    },
    moduleId: {
      type: String,
      default: '',
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },
  async mounted() {
    this.unitTypeTree = await this.$utils.getOddUnitTypeTree()
    console.log(this.unitTypeTree, 6666)
  },
  watch: {
    value: {
      handler(val) {
        this.$nextTick(() => {
          this.moduleValue = val
        })
      },
      immediate: true,
    },
    moduleId: {
      handler(val) {
        if (!val) {
          this.moduleValue = ''
        }
      },
      immediate: true,
    },
  },
  methods: {
    clickModal: function () {
      //打开弹窗
      if (!this.disabled) {
        this.$refs.popup.open()
        if (!this.moduleId) {
          this.restModal()
        }
      }
    },
    close: function () {
      //关闭弹窗
      this.checkSelect.label = this.checkSelect.aab022Desc
      this.checkSelect.value = this.checkSelect.aab022
      this.moduleValue = this.checkSelect.aab022Desc
      this.$emit('setModalValue', this.checkSelect)
      this.$refs.popup.close()
    },
    iconClick() {
      //搜索
      let param = {
        method: 'jy202_hrm353',
        label: this.searchText,
      }
      this.$utils.request(null, param, true).then((res) => {
        this.searchShow = true
        res.data.forEach((item) => {
          item.aab022Desc = item.label
          item.aab022 = item.value
        })
        this.searchArray = res.data
      })
    },
    changeType: function (type, num) {
      if (num == '1') {
        this.unitTypeSecond = type.children || []
        this.screenType = type.aab022
        this.unitTypeTrid = []
        this.screenTypeTrid = {}
        this.unitTypeLast = []
        this.checkSelect = {}
        this.searchShow = false
      } else if (num == '2') {
        this.unitTypeTrid = type.children || []
        this.screenTypeSecond = type.aab022
        this.screenTypeTrid = {}
        this.unitTypeLast = []
        this.checkSelect = {}
      } else if (num == '3') {
        this.unitTypeLast = type.children
        this.screenTypeTrid = type.aab022
        this.checkSelect = {}
      } else {
        this.screenTypeLast = type.aab022
        this.checkSelect = type
        this.close()
      }
    },
    restModal() {
      this.moduleValue = ''
      this.searchText = ''
      this.screenType = ''
      this.screenTypeSecond = ''
      this.screenTypeTrid = ''
      this.screenTypeLast = ''
      this.unitTypeSecond = [] //二级数据
      this.unitTypeTrid = [] //三级数据
      this.unitTypeLast = [] //最后级数据
      this.checkSelect = {} //选中数据
      this.searchShow = false
      this.searchArray = []
    },
  },
}
</script>

<style lang="scss" scoped>
.screen-box {
  width: 1440px;
  height: 800px;
  background: #fdfdfd;
  border-radius: 20px 20px 20px 20px;
  .screen-title {
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    padding: 0 30px;
    border-bottom: 1px solid #dddddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .screen-title-base {
      width: 100%;
      height: 70px;
      line-height: 70px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 24px;
      color: rgba(0, 0, 0, 0.9);
      text-align: left;
      font-style: normal;
      text-transform: none;
      position: relative;
      padding-left: 15px;
      :before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        width: 8px;
        height: 23px;
        background: #0c6af7;
        border-radius: 2px;
      }
      span {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 18px;
        color: rgba(0, 0, 0, 0.6);
        line-height: 21px;
        text-align: left;
        font-style: normal;
        text-transform: none;
        margin-left: 5px;
      }
    }
    .screen-title-close {
      width: 34px;
      height: 34px;
      cursor: pointer;
      image {
        width: 100%;
        height: 100%;
      }
    }
  }
  .screen-content {
    height: calc(100% - 71px);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    background: #fff;
    background-size: 20px 12px;

    .screen-lt {
      width: 320px;
      height: 100%;
      border-right: 1px solid #ddd;
      .screen-search {
        width: 100%;
        height: 99px;
        border-bottom: 1px solid #ddd;
        display: flex;
        justify-content: center;
        align-items: center;
        .screen-search-input {
          width: 260px;
          height: 48px;
        }
      }

      .screen-tab {
        width: 100%;
        height: calc(100% - 100px);
        .tab-item {
          width: 320px;
          height: 55px;
          line-height: 55px;
          text-align: center;
          border-radius: 0px 0px 0px 0px;
          display: flex;
          box-sizing: border-box;
          padding: 0 24px;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          &.actived {
            background: rgba(39, 164, 255, 0.15);

            .text {
              color: #0c6af7;
            }
          }

          .text {
            display: block;
            width: 235px;
            height: 35px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 18px;
            color: rgba(0, 0, 0, 0.9);
            line-height: 35px;
            text-align: left;
            font-style: normal;
            text-transform: none;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .arrow {
            display: block;
            width: 18px;
            height: 35px;
            image {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }

    .screen-rt {
      width: calc(100% - 321px);
      height: 100%;
      background: #fbfcfd;
      display: flex;
      justify-content: space-between;
      .screen-rt-list {
        width: 320px;
        height: 100%;
        border-right: 1px solid #ddd;
        .tab-item {
          width: 320px;
          height: 55px;
          line-height: 55px;
          text-align: center;
          border-radius: 0px 0px 0px 0px;
          display: flex;
          box-sizing: border-box;
          padding: 0 24px;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          &.actived {
            background: rgba(39, 164, 255, 0.15);

            .text {
              color: #0c6af7;
            }
          }

          .text {
            display: block;
            width: 235px;
            height: 35px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 18px;
            color: rgba(0, 0, 0, 0.9);
            line-height: 35px;
            text-align: left;
            font-style: normal;
            text-transform: none;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .arrow {
            display: block;
            width: 18px;
            height: 35px;
            image {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .screen-rt-tag {
        width: calc(100% - 321px);
        height: 100%;

        .screen-rt-tag-content {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          padding: 30px;
          .tab-item-tag {
            display: inline-block;
            margin-right: 20px;
            margin-bottom: 20px;
            height: 48px;
            background: #f3f3f3;
            border-radius: 4px 4px 4px 4px;
            cursor: pointer;
            border: 1px solid #f3f3f3;
            &.actived {
              background: rgba(39, 164, 255, 0.15);
              border-radius: 4px 4px 4px 4px;
              border: 1px solid #0c6af7;

              .text {
                color: #0c6af7;
                background: url('../../static/images/viewer/icon-check.png') right top no-repeat;
              }
            }

            .text {
              display: block;
              width: 100%;
              padding: 0 15px;
              height: 48px;
              box-sizing: border-box;
              font-family: PingFang SC, PingFang SC;
              font-weight: 400;
              font-size: 18px;
              color: rgba(0, 0, 0, 0.9);
              line-height: 48px;
              text-align: center;
              font-style: normal;
              text-transform: none;
            }
          }
        }
      }
    }
  }
}
.screen-rt-tag-content-search {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 30px;
  .tab-item-tag {
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 20px;
    height: 48px;
    background: #f3f3f3;
    border-radius: 4px 4px 4px 4px;
    cursor: pointer;
    border: 1px solid #f3f3f3;
    &.actived {
      background: rgba(39, 164, 255, 0.15);
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #0c6af7;

      .text {
        color: #0c6af7;
        background: url('../../static/images/viewer/icon-check.png') right top no-repeat;
      }
    }

    .text {
      display: block;
      width: 100%;
      padding: 0 15px;
      height: 48px;
      box-sizing: border-box;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 18px;
      color: rgba(0, 0, 0, 0.9);
      line-height: 48px;
      text-align: center;
      font-style: normal;
      text-transform: none;
    }
  }
}

.screen-search-input /deep/ .content-clear-icon {
  padding: 0 5px;
  height: 100%;
  width: 50px;
  background: #0c6af7;
  line-height: 48px;
  font-size: 26px !important;
  color: #fff !important;
  cursor: pointer;
}
</style>
