<template>
  <view>
    <div class="modal-input" @click="clickAddressModal">
      <div
        :class="
          !disabled
            ? areaname
              ? 'input-content input-text'
              : 'input-content input-placehoder'
            : 'input-content input-placehoder input-disabled'
        "
        :style="{ cursor: disabled ? 'not-allowed' : 'pointer' }"
      >
        <span>{{ !areaname ? placeholder : areaname }}</span>
      </div>
    </div>
    <uni-popup ref="popup" type="center">
      <div class="screen-box">
        <div class="screen-title">
          <div class="screen-title-base">
            <text style="color: #0c6af7">所学专业</text>选择
            <span> / 请您选择相关所学专业</span>
          </div>
          <div class="screen-title-close" @click="close">
            <image src="../../static/images/index/icon-close.png" mode="aspectFit"></image>
          </div>
        </div>
        <div class="screen-search">
          <div class="screen-search-input">
            <uni-row class="search-row">
              <uni-col :span="3" :offset="1">
                <div class="input-text">已选择的专业类别：</div>
              </uni-col>
              <uni-col :span="17">
                <div class="input-content">{{ checkText }}</div>
              </uni-col>
              <uni-col :span="2">
                <button class="input-btn" type="primary" @click="selectValue">确定</button>
              </uni-col>
            </uni-row>
          </div>
        </div>
        <div class="screen-content">
          <div class="screen-lt">
            <div class="screen-tab">
              <scroll-view scroll-y="true" class="scroll-Y" style="height: 100%">
                <div
                  v-for="(item, index) in addressFirstData"
                  :key="index"
                  @click="changeType(item, 1)"
                  :class="['tab-item', item.value == screenTypeFirst ? 'actived' : '']"
                >
                  <span class="text">{{ item.label }}</span>
                  <span class="arrow"
                    ><image src="../../static/images/viewer/icon-arrow.png" mode="aspectFit"></image
                  ></span>
                </div>
              </scroll-view>
            </div>
          </div>

          <div class="screen-rt">
            <div class="screen-rt-list" v-if="addressSecondData.length > 0">
              <scroll-view scroll-y="true" style="height: 100%">
                <div
                  v-for="(item, index) in addressSecondData"
                  :key="index"
                  @click="changeType(item, 2)"
                  :class="['tab-item', item.value == screenTypeSecond ? 'actived' : '']"
                >
                  <span class="text">{{ item.label }}</span>
                  <span class="arrow"
                    ><image src="../../static/images/viewer/icon-arrow.png" mode="aspectFit"></image
                  ></span>
                </div>
              </scroll-view>
            </div>
            <div class="screen-rt-tag">
              <template v-if="addressLastData.length > 0">
                <scroll-view scroll-y="true" style="height: 100%">
                  <div class="screen-rt-tag-content">
                    <div
                      v-for="(item, index) in addressLastData"
                      :key="index"
                      @click="changeType(item)"
                      :class="['tab-item-tag', item.value == screenTypeLast ? 'actived' : '']"
                    >
                      <span class="text">{{ item.label }}</span>
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
        </div>
      </div>
    </uni-popup>
  </view>
</template>

<script>
export default {
  name: 'modal-major',

  data() {
    return {
      areaname: '',
      checkText: '',
      screenTypeFirst: '',
      screenTypeSecond: '',
      screenTypeLast: '',
      addressFirstData: [], //一级数据
      addressSecondData: [], //二级数据
      addressLastData: [], //最后级数据
      checkSelect: {}, //选中数据
    }
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '选择所学专业',
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    value: {
      handler(val) {
        //console.log(val)
        this.$nextTick(() => {
          this.areaname = val
        })
      },
      immediate: true,
    },
  },
  async mounted() {
	  this.handleGetAddress()
  },
  methods: {
    clickAddressModal() {
      //打开弹窗
      if (!this.disabled) {
        this.$refs.popup.open()
        this.restModal()
      }
    },

    handleGetAddress(_item = {}, num) {
      let param = {
        method: 'jy049_com101',
        aca130: _item.value, 
      }
      this.$utils.request(null, param, true).then((res) => {
		  if(res.result&&res.result.length>0){
			  if (num == '1') {
			    this.addressSecondData = res.result
			  } else if (num == '2') {
			    this.addressLastData = res.result
			  } else {
				  if(!_item.value){
					  this.addressFirstData = res.result
				  }
			  }
		  }
      })
    },

    close: function () {
      //关闭弹窗
      this.areaname = this.checkSelect.label
      this.$emit('setAreaValue', this.checkSelect)
      this.$refs.popup.close()
    },

    changeType: function (item, num) {
      console.log(item, 6666)

      if (num == '1') {
        this.screenTypeFirst = item.value
      } else if (num == '2') {
        this.screenTypeSecond = item.value
      } else{
        this.screenTypeLast = item.value
      }
      this.checkText = item.label

      this.handleGetAddress(item, num)
      this.checkSelect = {
        value: item.value,
        label: item.label,
      }
    },

    selectValue() {
      this.areaname = this.checkSelect.label
      //console.log(this.areaname)
      this.$emit('setAreaValue', this.checkSelect)
      console.log('关闭弹窗')

      this.$refs.popup.close()
    },
    restModal() {
      this.checkText = ''
      this.screenTypeFirst = ''
      this.screenTypeSecond = ''
      this.screenTypeLast = ''
      this.addressSecondData = [] //二级数据
      this.addressLastData = [] //最后级数据
      this.checkSelect = {} //选中数据
    },
  },
}
</script>

<style lang="scss" scoped>
.screen-box {
  width: 1600px;
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
  .screen-search {
    width: 100%;
    height: 98px;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    .screen-search-input {
      width: 100%;
      height: 48px;
      margin: 24px 0;
      .search-row {
        width: 100%;
        height: 100%;
        .input-text {
          height: 46px;
          line-height: 48px;
          width: 100%;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          font-size: 18px;
          color: rgba(0, 0, 0, 0.25);
          text-align: left;
          font-style: normal;
          text-transform: none;
        }
        .input-content {
          width: 100%;
          height: 48px;
          background: #ffffff;
          border-radius: 4px 0px 0px 4px;
          border: 1px solid #a2a7a9;
          padding: 0 2%;
          box-sizing: border-box;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          font-size: 18px;
          color: #0c6af7;
          line-height: 48px;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }
        .input-btn {
          width: 90px;
          height: 48px;
          background: #0c6af7;
          border-radius: 0px 4px 4px 0px;
          margin: 0 !important;
        }
      }
    }
  }
  .screen-content {
    height: calc(100% - 71px - 98px);
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

      .screen-tab {
        width: 100%;
        height: 100%;
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
		  display: flex;
		  flex-wrap: wrap;
		  overflow: hidden;
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
