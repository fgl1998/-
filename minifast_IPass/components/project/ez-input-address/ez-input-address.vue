<template>
  <div class="ez-input-address">
    <div class="cell-item" :class="{ required: required }">
      <div class="key">{{ label }}</div>
      <div class="value">
        <input type="text" @focus="openPopup()" v-model="value" :placeholder="placeholder" />
      </div>
    </div>

    <!-- 输入弹窗 -->
    <ComponentMUIPopup :maskClick="false" ref="popup">
      <div class="popup-panel-wrapper">
        <div class="content">
          <div class="input-cell">
            <div class="key">市：</div>
            <div class="value">
              <input type="text" v-model="address.city" placeholder="请输入市" />
            </div>
          </div>
          <div class="input-cell">
            <div class="key">县(市、区)：</div>
            <div class="value">
              <input type="text" v-model="address.county" placeholder="请输入县(市、区)" />
            </div>
          </div>
          <div class="input-cell">
            <div class="key">镇(街道)：</div>
            <div class="value">
              <input type="text" v-model="address.town" placeholder="请输入镇(街道)" />
            </div>
          </div>
          <div class="input-cell">
            <div class="key">村(社区)：</div>
            <div class="value">
              <input type="text" v-model="address.village" placeholder="请输入村(社区)" />
            </div>
          </div>
          <div>
            <ComponentButton name="确定" type="primary" @click="handleSave"></ComponentButton>
          </div>
        </div>
        <div class="iconimg iconimg-close" @click="closePopup"></div>
      </div>
    </ComponentMUIPopup>
  </div>
</template>

<script>
  import ComponentMUIPopup from '@/components/common/ez-popup/ez-popup.vue'
  import ComponentButton from '@/components/common/ez-button/ez-button.vue'

  import { showModal } from '@/utils/uni-api'
  /**
   * 申报 radio/checkbox 组件
   * @description 申报 radio/checkbox 组件
   */
  export default {
    name: 'ezInputAddress',
    components: {
      ComponentMUIPopup,
      ComponentButton
    },
    props: {
      label: {
        type: [String],
        default: '户籍地址'
      },
      placeholder: {
        type: [String],
        default: '请输入户籍地址'
      },
      value: {
        type: [String],
        default: ''
      },
      required: {
        type: [Boolean],
        default: true
      }
    },
    data() {
      return {
        address: {
          city: '',
          county: '',
          town: '',
          village: ''
        }
      }
    },
    created() {},
    mounted() {},
    methods: {
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
      handleCheckInput() {
        const { city, county, town, village } = this.address
        if (!city) {
          showModal('请输入市')
          return false
        }
        if (!county) {
          showModal('请输入县(市、区)')
          return false
        }
        if (!town) {
          showModal('请输入镇(街道)')
          return false
        }
        if (!village) {
          showModal('请输入村(社区)')
          return false
        }
      },
      handleSave() {
        if (this.handleCheckInput()) {
          return
        }
        const { city, county, town, village } = this.address
        let res = `${city}/${county}/${town}/${village}`
        this.$emit('input', res)
        this.closePopup()
      }
    },
    watch: {}
  }
</script>

<style lang="scss" scoped>
  .ez-input-address {
    .popup-panel-wrapper {
      width: 692rpx;
      background-color: #ffffff;
      border-radius: 12rpx;
      padding: 24rpx 40rpx 70rpx;
      padding-top: 60rpx;
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

      .input-cell {
        display: flex;
        align-items: center;
        border-bottom: 1px solid $border-color;

        height: 100rpx;

        .key {
          font-size: 30rpx;
          color: $color;
          font-weight: 700;
          padding-left: 14rpx;
          position: relative;

          &::before {
            content: '*';
            position: absolute;
            color: #f00;
            top: 50%;
            transform: translateY(-50%);
            margin-top: -4rpx;
            left: 0;
          }
        }

        .value {
          flex: 1;
          color: shade($color-placeholder, 20%);
          overflow: hidden;
          padding-left: 20rpx;
          text-align: right;
        }

        .input {
          font-size: 30rpx;
          line-height: 1.4;
          color: shade($color-placeholder, 20%);
          display: block;
          font-weight: 700;
          width: 100%;
        }

        &.disabled {
          .value,
          input {
            opacity: 0.4;
          }
        }
      }
    }
  }
</style>
