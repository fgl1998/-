<template>
  <div class="ez-load-more-wrapper">
    <ComponentButton
      name="加载更多"
      type="primary"
      height="76rpx"
      v-if="!isOver"
      @click="$emit('click')"
    ></ComponentButton>
    <div class="tip" v-else>
      <span class="text" :style="tipStyle">我是有底线的</span>
      <span class="line"></span>
    </div>
  </div>
</template>

<script>
/**
 * 加载更多
 * @description 加载更多
 */
import ComponentButton from '@/components/common/ez-button/ez-button.vue'
export default {
  components: {
    ComponentButton,
  },
  props: {
    // 按钮名称
    name: {
      type: [String],
      default: '',
    },
    // 按钮高度
    height: {
      type: [String],
      default: '',
    },
    // 支持类型 primary secondary
    type: {
      type: [String],
      default: '',
    },
    isOver: {
      type: [Boolean],
      default: false,
    },
    // 我是有底线的 文字与线的间距
    space: {
      type: [String],
      default: '20rpx',
    },
    bgc: {
      type: [String],
      default: '#fff',
    },
  },
  data() {
    return {}
  },

  created() {},
  mounted() {},
  methods: {},
  computed: {
    tipStyle() {
      let str = ''
      const space = this.space
      const bgc = this.bgc
      if (space) {
        str += `padding: 0 ${space}; `
      }
      if (bgc) {
        str += `background-color: ${bgc}; `
      }
      return str
    },
  },
  watch: {},
}
</script>

<style lang="scss" scoped>
.ez-load-more-wrapper {
  width: 100%;
  padding: 30rpx 0;
  .tip {
    font-size: 24rpx;
    line-height: 2;
    color: $color-placeholder;
    position: relative;
    text-align: center;
    .text {
      position: relative;
      z-index: 2;
      background-color: #fff;
      padding: 0 20rpx;
    }
    .line {
      position: absolute;
      width: 100%;
      height: 1px;
      background-color: $border-color;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      z-index: 1;
    }
  }
}
</style>
