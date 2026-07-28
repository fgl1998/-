<template>
  <view class="ez-declare-wrapper">
    <ComponentPanel :title="title" :buttonText="isOpenCategoryNotes ? '详情>>' : ''" @click="handleShowDetail()">
      <div class="panel-content">
        <div class="cell-items">
          <div class="ez-declare-radio-wrapper">
            <div class="ez-declare-tip">{{ tip }}</div>
            <checkbox-group class="radio-group" @change="handleChange" v-if="isMultipleChoicesPersonnel">
              <block v-for="item in newRenderData" :key="item.cac102">
                <label class="label" :for="'radio' + item.cac102" :class="[item.checked ? 'checked' : '']">
                  <div
                    class="iconfont"
                    :class="[item.checked ? 'iconfont-checkbox-checked' : 'iconfont-checkbox']"></div>
                  <checkbox
                    class="radio"
                    :checked="item.checked"
                    :value="item.cac102"
                    :id="'radio' + item.cac102"></checkbox>
                  <div class="label-text">
                    {{ item.cac10a }}
                  </div>
                </label>
              </block>
            </checkbox-group>
            <radio-group class="radio-group" @change="handleChange" v-else>
              <block v-for="item in newRenderData" :key="item.cac102">
                <label class="label" :for="'radio' + item.cac102" :class="[item.checked ? 'checked' : '']">
                  <div class="iconfont" :class="[item.checked ? 'iconfont-radio-checked' : 'iconfont-radio']"></div>
                  <radio class="radio" :checked="item.checked" :value="item.cac102" :id="'radio' + item.cac102"></radio>
                  <div class="label-text">
                    {{ item.cac10a }}
                  </div>
                </label>
              </block>
            </radio-group>
          </div>

          <ComponentMUIPopup :maskClick="false" ref="popup">
            <div class="popup-panel-wrapper">
              <div class="name d-f ai-c jc-c">
                <div class="left d-f ai-c">
                  <div class="iconimg iconimg-project"></div>
                  <span>类别注释</span>
                </div>
              </div>
              <scroll-view scroll-y="true" class="cell-content">
                <div class="cell-wrapper" v-for="(item, index) in newRenderData" :key="index">
                  <div class="cell-title">
                    {{ item.cac10a }}
                  </div>
                  <div class="cell-text">
                    {{ item.cac108 || '暂无注释' }}
                  </div>
                </div>
              </scroll-view>
              <div class="iconimg iconimg-close" @click="closePopup"></div>
            </div>
          </ComponentMUIPopup>
        </div>
      </div>
    </ComponentPanel>
  </view>
</template>

<script>
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
  import ComponentMUIPopup from '@/components/common/ez-popup/ez-popup.vue'
  /**
   * 申报 radio/checkbox 组件
   * @description 申报 radio/checkbox 组件
   */
  export default {
    name: 'ezDeclareRadio',
    components: {
      ComponentPanel,
      ComponentMUIPopup
    },
    props: {
      // 提示信息
      tip: {
        type: [String],
        default: '请根据自身实际情况，在下面勾选。相关佐证材料，请在材料上传页上传。'
      },
      // 类型 radio 单选 checkbox 多选
      type: {
        type: [String],
        default: 'radio'
      },
      // 渲染数据
      renderData: {
        type: [Array],
        default: () => {
          return []
        }
      },
      // 是否开启多选
      isMultipleChoicesPersonnel: {
        type: [Boolean],
        default: false
      },
      // 是否开启类别注释
      isOpenCategoryNotes: {
        type: [Boolean],
        default: false
      },
      title: {
        type: [String],
        default: '人员类别'
      },
      // 筛选数据 （暂时用于非人脸认证）
      filterData: {
        type: [Array],
        default: () => {
          return []
        }
      }
    },
    data() {
      return {}
    },
    created() {},
    mounted() {},
    methods: {
      handleChange(e) {
        const { value } = e.target
        const isMultipleChoicesPersonnel = this.isMultipleChoicesPersonnel
        console.log(value, isMultipleChoicesPersonnel, '========value========')
        this.$emit('change', value)
      },
      // 打开弹窗
      openPopup() {
        const popup = this.$refs.popup
        this.$nextTick(() => {
          popup.open()
        })
      },
      // 关闭弹窗
      closePopup() {
        const popup = this.$refs.popup
        this.$nextTick(() => {
          popup.close()
        })
      },
      // 展示每个人员类别详情
      handleShowDetail() {
        this.openPopup()
      }
    },
    computed: {
      newRenderData() {
        let filterData = this.filterData
        let renderData = [...this.renderData]
        if (renderData && renderData.length !== 0 && filterData && filterData.length !== 0) {
          filterData.forEach((one) => {
            renderData = renderData.filter((item) => item.cac102 !== one)
          })
        }
        return [...renderData]
      }
    },
    watch: {}
  }
</script>

<style lang="scss" scoped>
  .checkbox,
  .radio {
    width: 0;
    height: 0;
    display: none;
  }
  .ez-declare-radio-wrapper {
    width: 100%;
    .ez-declare-tip {
      font-size: 24rpx;
      background-color: #fff7e7;
      padding: 12rpx;
      color: #e49904;
      line-height: 1.4;
      margin-top: 12rpx;
      border-radius: 4rpx;
    }
    .checked-group,
    .radio-group {
      width: 100%;
      .label {
        font-size: 30rpx;
        border-bottom: solid 1rpx $border-color;
        padding: 10rpx 0;
        min-height: 108rpx;
        color: $color;
        font-weight: 500;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        &.checked {
          color: $primary;
        }
        &:last-child {
          border-bottom: 0;
        }
      }
      .iconfont {
        font-size: 32rpx;
        margin-right: 20rpx;
        transition: all 0.3s;
      }

      .label-text {
        flex: 1;
        overflow: hidden;
        line-height: 1.4;
      }
    }
  }
  .popup-panel-wrapper {
    width: 692rpx;
    background-color: #ffffff;
    border-radius: 12rpx;
    padding: 24rpx 40rpx 70rpx;
    position: relative;

    .name {
      color: $primary;
      font-size: 38rpx;
      font-weight: 700;
    }
    .cell-content {
      max-height: 700rpx;
      overflow-y: scroll;

      .cell-wrapper {
        background: #f5f5f5;
        margin: 20rpx 0;
        padding: 20rpx;
        border-radius: 12rpx;
        .cell-title {
          font-size: 34rpx;
          font-weight: 700;
        }
        .cell-text {
          margin-top: 10rpx;
          color: #9b9b9f;
        }
      }
    }

    .operating-wrapper {
      padding-top: 70rpx;
    }

    .iconimg-close {
      position: absolute;
      top: 10rpx;
      right: 10rpx;
      width: 64rpx;
      height: 64rpx;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYBAMAAACDuy0HAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAtUExURUdwTEKR/ziD/ziC/ziD/zyH/zuE/ziD/zqE/ziC/zmD/zmD/ziD/zmD/ziC/81ifo4AAAAOdFJOUwAL+e7QGy7fQb9lVK+KNJnQtAAAAcFJREFUSMftVr1Kw1AUTgelRIcMggTcBBEFJxFdCkU6Kh0KrsUOzg52LCU+QV+gBB+ghD6BeYFOzh2aQGip5xlM7k1y0+Sc3Cs4ONxvas79+Jp7fr4Tw9DQ0PgfaHzdedWoef9gIeQjgG1VYQHQRshLAPDLQTsOfiPkURxfl/6yMY2DEUJuxXGYVF4NIEDIiQiEO9J7j0lsjZCd5AA6xVCPhc4RsslOwm5BeMRCLpboGTt6E4EnFtigVTm4Ss6iXHqfC3t4Defs8CZ7HLDHS6LgTSZ92k+FWS5XY6o9nKL0O5mKVJqJBePybxwDoebsXgBB+p5elpqgX9fUL1kGeGaGtRPAi7ZyzVLOcfCqXVSqiUuzRoNKn+DoCXJHPre5dGjJp9zOyBMVS5hy7tpSMZATTvaV3OaQkz+VnGnByVuV18gv6KvfT+mGtihK2/jLcvNqb2Yq9c58hTuOpEXTDjWMD3mPcl8RYxXVjVXBV+aygS36SlM2sdxXbpEHyr4CNftyMGMk/KvsK8JxSMcdIo5DrYlIbU08UwvojFxtXbXV1kJamFyav1rHS8xXqEV/jA10Muqv6MfJtav8caKhoUHjB9LP2s4osFRtAAAAAElFTkSuQmCC);
      background-size: 44rpx 44rpx;
    }
  }
</style>
