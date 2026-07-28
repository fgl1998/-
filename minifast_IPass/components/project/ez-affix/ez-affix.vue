<template>
  <view class="ez-affix-wrapper" :style="wrapperStyle" @click="$emit('click')">
    <img :src="src" alt="" />
    <div>
      {{ label }}
    </div>
  </view>
</template>

<script>
/**
 * 将页面元素固定在特定可视区域
 * @description 将页面元素固定在特定可视区域
 */
export default {
  name: 'ezAffix',
  props: {
    type: {
      type: [String],
      default: '',
    },
    label: {
      type: [String],
      default: '按钮',
    },
    // 图片可访问地址 base64 网络图片 本地图片
    src: {
      type: [String],
      default: '按钮',
    },
    // 背景色
    backgroundColor: {
      type: [String],
      default: '',
    },
    // 距离底部边界距离
    bottom: {
      type: [String],
      default: '',
    },
    // 距离顶部边界距离
    top: {
      type: [String],
      default: '',
    },
  },
  components: {},
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {},
  computed: {
    wrapperStyle() {
      let str = ''
      const backgroundColor = this.backgroundColor
      const bottom = this.bottom
      const top = this.top
      if (backgroundColor) {
        str += `background-color: ${backgroundColor}; `
      }
      if (bottom) {
        str += `bottom: ${bottom}; `
      }
      if (top) {
        str += `top: ${top}; `
      }
      return str
    },
  },
  watch: {},
}
</script>

<style lang="scss" scoped>
.ez-affix-wrapper {
  display: flex;
  align-items: center;
  position: fixed;
  z-index: 98;
  font-weight: 700;
  font-size: 26rpx;
  line-height: 64rpx;
  color: #ffffff;
  padding: 0 16rpx;
  bottom: 80rpx;
  right: 0;
  background-color: $primary;
  box-shadow: 0rpx 2rpx 10rpx 0rpx $primary;
  border-top-left-radius: 32px;
  border-bottom-left-radius: 32px;
  img {
    width: 32rpx;
    height: 32rpx;
    margin-right: 8rpx;
  }
}
</style>
