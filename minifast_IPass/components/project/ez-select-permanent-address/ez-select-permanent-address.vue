<template>
  <view class="ez-select-permanent-address-wrapper">
    <div class="key">{{ label }}</div>
    <div class="value" @click.stop="openPopup">
      <div class="value-value" v-if="value">
        {{ value }}
      </div>
      <div class="value-placeholder" v-else>{{ placeholder }}</div>
    </div>
    <!-- <div class="iconfont iconfont-address"></div> -->
    <block v-if="!disabled">
      <ComponentSelectAddress
        v-model="show"
        @change="handleChange"
        :address="[]"
        :filter="addressFilter"
        :remove="addressRemove"
        :customRequestParams="addressParams"
        requestSystemType="SP"
        idKey="orgid"
        :DValue="2"
        :level="level"
        renderKey="orgname"></ComponentSelectAddress>
    </block>
  </view>
</template>

<script>
import ComponentSelectAddress from '@/components/project/ez-select-address/ez-select-address.vue'

/**
 * 申报 选择户籍地址组件 待解决 => 初始化地址
 * @description 申报 选择户籍地址组件
 */
export default {
  name: 'ezSelectPermanentAddress',
  props: {
    label: {
      type: [String],
      default: '户籍地址',
    },
    placeholder: {
      type: [String],
      default: '请选择户籍地址',
    },
    value: {
      type: [String],
      required: true,
    },
    addressFilter: {
      type: [String],
      default: '',
    },
    disabled: {
      type: [Boolean],
      required: false,
    },
    level: {
      type: [Number],
      default: 3,
    },
    // 非要过滤层级时使用 orgid orgleve 传入
    addressParams: {
      type: [Object],
      default: () => {
        return {}
      },
    },
    // 去掉某一地址
    addressRemove: {
      type: [String],
      default: '',
    },
  },
  data() {
    return {
      show: false,
    }
  },
  components: {
    ComponentSelectAddress,
  },
  created() {},
  mounted() {},
  methods: {
    openPopup() {
      const disabled = this.disabled
      if (disabled) {
        return false
      }
      this.show = true
    },
    // 户籍地址改变
    handleChange(e, eArr) {
      const value = e.join('-')
      this.$emit('input', value)
      this.$emit('change', eArr)
    },
  },
  computed: {
    // 获取选择过后的值 暂未使用
    valueStr() {
      const value = this.value
      let str = ''
      // if (value && value.length > 0) {
      //   str = value.join('')
      // }
      return str
    },
  },
  watch: {},
}
</script>

<style lang="scss" scoped>
.ez-select-permanent-address-wrapper {
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
