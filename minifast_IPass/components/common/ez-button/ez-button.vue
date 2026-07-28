<template>
  <div class="ez-button-wrapper">
    <button
      class="ez-button"
      :style="buttonStyle"
      :disabled="disabled"
      :open-type="openType"
      :class="[
        size ? 'size-' + size : '',
        type ? 'type-' + type : '',
        full ? 'ez-btn-full' : '',
        disabled ? 'ez-btn-disabled' : '',
        circle ? 'ez-btn-circle' : ''
      ]"
      @chooseavatar="$emit('chooseavatar', $event)"
      @click="$emit('click', $event)"
      @getuserinfo="$emit('getuserinfo', $event)"
      @getphonenumber="$emit('getphonenumber', $event)"
      :withCredentials="withCredentials"
    >
      <block>
        <i
          class="iconfont"
          v-if="iconClassName || loading"
          :class="[
            iconClassName ? iconClassName : '',
            iconAlign ? iconAlign : '',
            loading ? 'iconfont-loading' : ''
          ]"
        ></i>
        <span v-if="name">{{ name }}</span>
        <span v-else><slot></slot></span>
      </block>
    </button>
  </div>
</template>

<script>
/**
 * Button 按钮
 * @description Button 按钮
 */
export default {
  props: {
    withCredentials: {
      type: [Boolean],
      default: true
    },
    // 按钮高度
    height: {
      type: [String],
      default: ''
    },
    // 背景颜色
    backgroundColor: {
      type: [String],
      default: ''
    },
    // 边框
    border: {
      type: [String],
      default: ''
    },
    // 边框颜色
    borderColor: {
      type: [String],
      default: ''
    },
    // 圆角
    borderRadius: {
      type: [String],
      default: ''
    },
    // 阴影
    boxShadow: {
      type: [String],
      default: ''
    },
    // margin
    margin: {
      type: [String],
      default: ''
    },
    // 字体颜色
    color: {
      type: [String],
      default: ''
    },
    // 字体大小
    fontSize: {
      type: [String],
      default: ''
    },
    // 字体
    fontWeight: {
      type: [String, Number],
      default: ''
    },
    // 按钮宽度
    width: {
      type: [String],
      default: ''
    },
    // 按钮名称
    name: {
      type: [String],
      default: ''
    },
    // 图标类名 使用类名之后需在全局样式中设置图标样式
    iconClassName: {
      type: [String],
      default: ''
    },
    // 图标放置位置 目前支持 left right 默认 left
    iconAlign: {
      type: [String],
      default: 'left'
    },
    // 支持类型 primary secondary
    type: {
      type: [String],
      default: ''
    },
    // 支持类型 small
    size: {
      type: [String],
      default: ''
    },
    // full
    full: {
      type: [Boolean],
      default: false
    },
    // disabled
    disabled: {
      type: [Boolean],
      default: false
    },
    // circle 圆角
    circle: {
      type: [Boolean],
      default: false
    },
    // loading 加载中
    loading: {
      type: [Boolean],
      default: false
    },
    // 微信开发能力
    openType: {
      type: [String],
      default: ''
    }
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {},
  computed: {
    buttonStyle() {
      let str = ''
      const width = this.width
      const height = this.height
      const fontSize = this.fontSize
      const backgroundColor = this.backgroundColor
      const color = this.color
      const borderColor = this.borderColor
      const borderRadius = this.borderRadius
      const fontWeight = this.fontWeight
      const border = this.border
      const margin = this.margin
      const boxShadow = this.boxShadow

      if (width) {
        str += `width: ${width};`
      }
      if (height) {
        str += `height: ${height};`
      }
      if (fontSize) {
        str += `font-size: ${fontSize};`
      }
      if (backgroundColor) {
        str += `background-color: ${backgroundColor};`
      }
      if (color) {
        str += `color: ${color};`
      }
      if (borderColor) {
        str += `border-color: ${borderColor};`
      }
      if (borderRadius) {
        str += `border-radius: ${borderRadius};`
      }
      if (fontWeight) {
        str += `font-weight: ${fontWeight};`
      }
      if (border) {
        str += `border: ${border};`
      }
      if (margin) {
        str += `margin: ${margin};`
      }
      if (boxShadow) {
        str += `box-shadow: ${boxShadow};`
      }

      return str
    }
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
$ez-button-height: 80rpx;
$ez-button-small-height: 72rpx;
$ez-button-border-radius: 8rpx;
@keyframes spin {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
view,
button {
  box-sizing: border-box;
}
.ez-button {
  width: 100%;
  height: $ez-button-height;
  font-size: 28rpx;
  font-weight: 400;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border-radius: $ez-button-border-radius;
  border: 1px solid rgba($primary, 0.25);
  margin: auto;
  transition: opacity 0.3s ease-in-out;
  i {
    order: 1;
    &.left {
      margin-right: 12rpx;
    }
    &.right {
      order: 3;
      margin-left: 12rpx;
    }
  }
  span {
    order: 2;
  }
  &.button-hover,
  &:active {
    opacity: 0.5;
  }
  &.size-small {
    font-size: 26rpx;
    height: $ez-button-small-height;
    line-height: $ez-button-small-height;
    border-radius: 6rpx;
  }
  &.type-primary {
    color: #fff;
    background-color: $primary;
    border-color: $primary;
  }
  &.type-secondary {
    background-color: #fff;
    color: $primary;
    border-color: $primary;
  }
  &.ez-btn-full {
    width: 100%;
    border-radius: 0;
  }
  &.ez-btn-circle {
    border-radius: 500px;
  }
  &.ez-btn-disabled {
    opacity: 0.3;
    &.button-hover,
    &:active {
      opacity: 0.3;
      transition: all 0.3s ease-in-out;
    }
  }
  .iconfont-loading {
    animation: spin 1.2s infinite cubic-bezier(0.5, 0, 0.5, 1);
  }
}
</style>
