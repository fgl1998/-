/** * 组件详解：具体使用请请考 /pages/mini-button/index.vue。
注：本文件注释代码中的示例只列举了某一个参数 * 参数： 必填参数： 可选参数：
className：自定义类名，利用css层叠改变样式。 注：在使用该参数时必须去除父组件
style 标签上的 scoped 属性。 name： 按钮名称。 size： 按钮大小，即高度。
目前支持的类型： small large。 默认高度为 90rpx（未确定） small: 小尺寸 高度为
80rpx large: 大尺寸 高度为 100rpx loading： 设置按钮为加载中状态。 默认值为
false inline： 设置按钮高宽自适应。 上下左右间距分别为 12rpx 12rpx 10rpx
10rpx。默认值为 false full： 设置按钮两边联通，去除左右padding和圆角。 默认值为
false type: 按钮类型，不同背景色。目前支持的类型： primary info warn danger
default（默认值） shape： 按钮形状，即针对圆角。默认自带圆角8rpx。目前支持类型
circle（半圆） square（无圆角） styles： 自定义按钮样式。 示例：
<MiniButton
  :styles="{ 'background-color': '#534678', height: '84rpx', color: '#f00' }"
></MiniButton>
disabled： 设置按钮为禁用状态。默认值为 false
dataIndex：按钮id，多按钮通过数据循环生成时使用 openType：
微信开放能力，具体参数请参考微信官方文档 onlyIcon：
只有icon做按钮，使用该参数时必须同时使用iconData参数 默认值 false iconData：
按钮上icon数据。 示例：
<MiniButton type="primary" :iconData="iconData" name="按钮"></MiniButton>
iconData: { src: '/static/images/icon.png', width: '40rpx', height: '38rpx' }
事件： click: 点击按钮时触发 当使用请微信开放能力时具体事件请参考微信官方文档 */
<template>
  <div
    class="mini-button-wrapper"
    :class="[
      className ? className : '',
      full ? 'full' : '',
      inline ? 'inline' : '',
      onlyIcon ? 'only-icon' : '',
    ]"
  >
    <button
      class="btn"
      :disabled="disabled"
      @click.stop="click"
      :class="[
        type ? type : '',
        disabled ? 'disabled' : '',
        shape ? shape : '',
        size ? size : '',
      ]"
      :style="buttonStyle"
      :data-index="dataIndex"
      :open-type="openType"
      @getuserinfo="$emit('getuserinfo', $event)"
      @contact="$emit('contact', $event)"
      @getphonenumber="$emit('getphonenumber', $event)"
      @error="$emit('error', $event)"
      @opensetting="$emit('opensetting', $event)"
      @launchapp="$emit('launchapp', $event)"
    >
      <div class="left">
        <i class="icon icon-loading" v-if="loading"></i>
        <img
          :src="iconData.src"
          :alt="iconData.alt"
          v-if="iconData"
          :style="imgStyle"
        />
      </div>
      <div class="right" v-if="!onlyIcon">{{ name }}</div>
    </button>
  </div>
</template>
<script>
export default {
  name: 'mini-button',
  props: {
    // 自定义类名
    className: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '按钮',
    },
    size: {
      type: String,
      default: 'middle',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    full: {
      type: Boolean,
      default: false,
    },
    onlyIcon: {
      type: Boolean,
      default: false,
    },
    // 类型
    type: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // circle square
    shape: {
      type: String,
      default: '',
    },
    styles: {
      type: Object,
      default: {},
    },
    dataIndex: {
      type: [String, Number],
      default: '',
    },
    // getUserInfo share
    openType: {
      type: String,
      default: '',
    },
    iconData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      isShowLoading: false,
    }
  },
  created() {},
  components: {},
  computed: {
    // 按钮样式
    buttonStyle() {
      let styleStr = ''
      const styles = this.styles
      if (!!styles) {
        for (let item in styles) {
          if (item !== 'name' && item !== 'icon') {
            styleStr += `${item}:${styles[item]};`
          }
        }
      }
      return styleStr
    },
    // img样式
    imgStyle() {
      let styleStr = ''
      const styles = this.iconData
      if (!!styles && styles.width) {
        styleStr += `width:${styles.width};`
      }
      if (!!styles && styles.height) {
        styleStr += `height:${styles.height};`
      }
      return styleStr
    },
  },
  methods: {
    click(event) {
      this.$emit('click', event)
    },
  },
  onLoad(options) {},
}
</script>
<style lang="scss" scoped>
/* 
    共用 全局属性 
*/
// 左右间距
$space-LR: 30rpx;
$fontSize: 30rpx;

// 主色调
$color-primary: #2d8cf0;
// Light Primary 常用于 hover
$color-light-primary: #5cadff;
// Dark Primary 常用于 active。
$color-dark-primary: #2b85e4;

// 辅助色
$color-info: #2db7f5;
$color-success: #19be6b;
$color-wraning: #ff9900;
$color-error: #ed4014;

// 标题
$color-title: #464c5b;
// 正文
$color-content: #657180;
// 辅助
$color-sub: #9ea7b4;
// 失效
$color-disabled: #c5c8ce;
// 边框
$color-border: #dcdee2;
// 背景
$color-background: #f8f8f9;
// 分割线
$color-divider: #e8eaec;

// 标题
$font-size-title: 28rpx;
// 正文
$font-size-content: 28rpx;
// 辅助
$font-size-sub: 24rpx;

/* 
    input 组件变量
*/
$mini-input-label-width: 180rpx;
$mini-input-label-fontSize: 28rpx;
$mini-input-input-fontSize: 26rpx;
$mini-input-height: 84rpx;
$mini-input-borderColor: #e5e5e5;
$mini-input-backgroundColor: #fff;
$mini-input-color: #36404a;
$mini-input-paddingLeft: 0rpx;
$mini-input-clear-backgroundColor: #999;
$mini-input-clear-size: 16px;
$mini-input-clear-color: #fff;

/* 
    radio 组件变量
*/
$mini-radio-height: 84rpx;
$mini-radio-borderColor: #e5e5e5;
$mini-radio-backgroundColor: #fff;
$mini-radio-iconSize: 48rpx;
$mini-radio-fontSize: 28rpx;

/* 
    checkbox 组件变量
*/
$mini-checkbox-height: 84rpx;
$mini-checkbox-borderColor: #e5e5e5;
$mini-checkbox-backgroundColor: #fff;
$mini-checkbox-iconSize: 48rpx;
$mini-checkbox-fontSize: 28rpx;

/* 
    swiperOut 组件变量
*/
$mini-button-height: 90rpx;
$mini-button-samll-height: 80rpx;
$mini-button-large-height: 100rpx;
$mini-button-borderColor: #eee;
$mini-button-primary-background: #1989fa;
$mini-button-info-background: #4b9cdd;
$mini-button-warn-background: #ff976a;
$mini-button-danger-background: #ee0a24;

// 页面背景色
$page-background-color: #f5f5f5;
$border-color: #e9e9ec;

/* 文字基本颜色 */
$text-color-title: #3d424d; // 基本色
$text-color: #45474d; // 基本色
$text-color-grey: #8a8f99; //辅助灰色，如加载更多的提示信息
$text-color-inverse: #fff; //反色
$text-color-placeholder: #808080;
$text-color-disable: #c0c0c0;
$text-color-active: #3882ff; // 选中的颜色
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: normal;
  line-height: 1;
  outline: 0;
  margin: 0;
  padding: 0 10rpx;
  width: 100%;
  background-color: transparent;
  color: #666;
  height: $mini-button-height;
  border: 1px solid $mini-button-borderColor;
  border-radius: 8rpx;
  &:after {
    display: none;
  }
  &:active {
    opacity: 0.8;
  }
}
.mini-button-wrapper {
  display: flex;
  width: 100%;
  padding: 0 $space-LR;
  .btn {
    &.primary {
      color: #fff;
      background-color: $mini-button-primary-background;
      border: 0;
    }
    &.info {
      color: #fff;
      background-color: $mini-button-info-background;
      border: 0;
    }
    &.warn {
      color: #fff;
      background-color: $mini-button-warn-background;
      border: 0;
    }
    &.danger {
      color: #fff;
      background-color: $mini-button-danger-background;
      border: 0;
    }
    &.disabled {
      opacity: 0.6;
      &:active {
        opacity: 0.6;
      }
    }
    &.circle {
      border-radius: 50rem;
    }
    &.square {
      border-radius: 0;
    }
    &.small {
      height: $mini-button-samll-height;
    }
    &.large {
      height: $mini-button-large-height;
    }
    // 获取验证码按钮固定样式
    &.code {
      width: 220rpx;
      height: 60rpx;
      font-size: 28rpx;
      border-radius: 8rpx;
      background-color: rgb(124, 236, 161);
      color: #fff;
      border: 0;
    }
  }
  .left {
    display: flex;
  }
  .right {
    display: flex;
  }
  // 自适应
  &.inline {
    display: inline-flex;
    padding: 0;
    width: auto;
    .btn {
      width: auto;
      height: auto;
      padding: 10rpx 12rpx;
      font-size: 28rpx;
      line-height: 1;
    }
  }
  // 只有icon图标作为按钮
  &.only-icon {
    display: inline-flex;
    padding: 0;
    width: auto;
    .btn {
      width: auto;
      height: auto;
      padding: 0;
      border: 0;
      border-radius: 0;
      background-color: transparent;
      img {
        margin-right: 0;
      }
    }
  }
  img {
    width: 32rpx;
    height: 32rpx;
    margin-right: 10rpx;
  }
  // 联通两边的按钮
  &.full {
    padding: 0;
    .btn {
      border-radius: 0;
    }
  }
  .icon-loading {
    transform: rotate(0);
    animation: rotate 1s linear infinite;
    margin-right: 10rpx;
    font-size: 36rpx;
    color: #fff;
  }
}
// 360度旋转
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
