<template>
  <view class="ez-select-current-address-wrapper">
    <div class="key">{{ label }}</div>
    <div class="value" @click.stop="show = true">
      <div class="value-value" v-if="value">
        {{ value }}
      </div>
      <div class="value-placeholder" v-else>{{ placeholder }}</div>
    </div>
    <!-- <div class="iconfont iconfont-address"></div> -->
    <!-- 现居住地址 -->
    <ComponentSelectAddress
      v-model="show"
      @change="handleChange"
      requestSystemType="China"
      :level="level"
    ></ComponentSelectAddress>
  </view>
</template>

<script>
import ComponentSelectAddress from '@/components/project/ez-select-address/ez-select-address.vue'
/**
 * 申报 选择现居住地址组件 待解决 => 初始化地址
 * @description 申报 选择现居住地址组件
 */
export default {
  name: 'ezSelectCurrentAddress',
  props: {
    label: {
      type: [String],
      default: '现居住地址',
    },
    level: {
      type: [Number],
      default: 4,
    },
    placeholder: {
      type: [String],
      default: '请选择现居住地址',
    },
    value: {
      type: [String],
      required: true,
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
    // 户籍地址改变
    handleChange(e, eArr) {
      const value = e.join('-')
      this.$emit('input', value)
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped>
.ez-select-current-address-wrapper {
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
