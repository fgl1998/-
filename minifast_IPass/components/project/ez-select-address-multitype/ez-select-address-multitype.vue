<template>
  <view class="ez-select-address-multitype-wrapper">
    <div class="key" :class={required:required}>
      <div>{{ label }}</div>
      <div class="tag" v-if="isShowBtn" @click="$emit('clickBtn')">
        {{ buttonName }}
      </div>
    </div>
    <div class="value">
      <input
        type="text"
        :value="value"
        @input="handleInputInput"
        @change="handleInputChange"
        :placeholder="placeholder"
      />
    </div>
		<!-- #ifdef MP-WEIXIN -->
    <div class="iconfont iconfont-address" @click="handleSelectAddress"></div>
		<!-- #endif -->
  </view>
</template>

<script>
import { chooseLocation, getLocation, showModal } from '@/utils/uni-api'
/**
 * 申报 选择地址组件
 * @description 申报 选择地址组件
 */
export default {
  name: 'ezSelectAddressMultitype',
  props: {
    isShowBtn: {
      type: [Boolean],
      default: true,
    },
    buttonName: {
      type: [String],
      default: '复用户籍地址',
    },
    label: {
      type: [String],
      default: '现居住地址',
    },
    placeholder: {
      type: [String],
      default: '请选择现居住地址',
    },
    value: {
      type: [String],
      required: true,
    },
	required:{
		type: [Boolean],
		default: true,
	}
  },
  data() {
    return {
      userLocationInfo: {},
    }
  },
  components: {},
  created() {},
  mounted() {},
  methods: {
    // 输入框Input事件
    handleInputInput(e) {
      const value = e.target.value
      this.$emit('input', value)
    },
    // 输入框change事件
    handleInputChange(e) {
      const value = e.target.value
      this.$emit('input', value)
    },
    // 点击选择地址的图标
    handleSelectAddress() {
      const userLocationInfo = this.userLocationInfo
      getLocation()
        .then((res) => {
          this.userLocationInfo = { ...res }
          const { latitude, longitude } = res
          this.getUserChooseLocation(latitude, longitude)
        })
        .catch(() => {
          if (userLocationInfo.latitude) {
            this.getUserChooseLocation(
              userLocationInfo.latitude,
              userLocationInfo.longitude
            )
          } else {
            showModal('获取用户地理位置信息失败！')
          }
        })
    },
    // 获取用户选择的地理位置
    getUserChooseLocation(latitude, longitude) {
      chooseLocation(latitude, longitude).then((res) => {
        const { address } = res
        this.$emit('input', address)
      })
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped>
.ez-select-address-multitype-wrapper {
  width: 100%;
  min-height: $cell-height;
  border-bottom: solid 1px $border-color;
  position: relative;
  padding: 30rpx 0;
  line-height: 1.4;
  font-weight: 700;
  .key {
    font-size: 30rpx;
    letter-spacing: 0rpx;
    color: $color;
    padding-left: 12rpx;
    position: relative;
    display: flex;
    align-items: center;
    .tag {
      font-size: 24rpx;
      color: $primary;
      padding: 4rpx 8rpx;
      border-radius: 4rpx;
      background-color: $primary;
      color: #fff;
      margin-left: 24rpx;
    }
  }
  .required{
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
    font-size: 30rpx;
    color: #9b9b9f;
    margin-top: 36rpx;
    padding-left: 12rpx;
    input {
      font-size: 30rpx;
      color: #9b9b9f;
      line-height: 1.4;
    }
  }

  .iconfont {
    position: absolute;
    top: 30rpx;
    right: 0;
    font-size: 40rpx;
    color: $primary;
  }
}
</style>
