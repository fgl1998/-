<template>
  <view class="ez-input-wrapper" :class="inputWrapperClass">
    <view class="ez-label-box" v-if="label" :style="labelStyle">
      <label class="ez-label" :for="labelFor">{{ label }}</label>
    </view>
    <view class="ez-input-box">
      <view class="ez-input-prefix"><slot name="prefix"></slot></view>
      <input
        class="ez-input"
        :id="labelFor"
        :name="labelFor"
        :class="inputClass"
        :type="type"
        :disabled="disabled"
        :focus="focus"
        :value="value"
        :hold-keyboard="holdKeyboard"
        :placeholder="placeholder"
        :placeholder-style="placeholderStyle"
        :maxlength="maxlength"
        @focus="handleInputFocus"
        @blur="handleInputBlur"
        @change="handleInputChange"
        @input="handleInputInput"
      />

      <view class="ez-input-sufix">
        <text
          class="icon icon-clear"
          v-show="isShowClear"
          @click="handleClear"
        ></text>
        <slot name="sufix"></slot>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * Input 输入框
 * @description input输入框组件
 * @property {Number} maxlength  最大输入长度，设置为 -1 的时候不限制最大长度 默认为140
 * @property {Boolean} collapseKeyboard = [false|true] 控制键盘的自动收起 当设置了maxlength时才有效果
 * @property {String} type = [text|password] 输入框类型
 *  @value text 文本输入框
 * @property {Boolean} disabled = [false|true] 是否禁用输入框
 */
export default {
  props: {
    disabled: {
      type: [Boolean],
      default: false,
    },
    focus: {
      type: [Boolean],
      default: false,
    },
    clear: {
      type: [Boolean],
      default: false,
    },
    block: {
      type: [Boolean],
      default: false,
    },
    collapseKeyboard: {
      type: [Boolean],
      default: false,
    },
    border: {
      type: [Boolean],
      default: false,
    },
    value: {
      type: [String, Number],
      required: true,
    },
    width: {
      type: [String, Number],
    },
    label: {
      type: [String],
      default: '',
    },
    className: {
      type: [String],
      default: '',
    },
    type: {
      type: [String],
      default: 'text',
    },
    placeholder: {
      type: [String],
      default: 'Please input some...',
    },
    placeholderColor: {
      type: [String],
      default: '#b2b2b2',
    },
    labelFor: {
      type: [String],
      default: '',
    },
    maxlength: {
      type: [Number],
      default: 140,
    },
  },
  data() {
    return {
      inputIsFocus: false,
      isShowClear: false,
      holdKeyboard: false,
    }
  },
  created() {
    if (this.clear) {
      this.holdKeyboard = true
    }
  },
  mounted() {
    // console.log(this.$scopedSlots.prefix)
  },
  methods: {
    handleInputFocus(e) {
      this.inputIsFocus = true
      // 显示清除 并且 有值
      if (this.clear && this.value) {
        this.isShowClear = true
      }
      this.$emit('focus', e)
    },
    handleInputBlur(e) {
      this.inputIsFocus = false
      // 显示清除 并且 有值
      if (this.clear && this.value) {
        setTimeout(() => {
          this.isShowClear = false
        }, 500)
      }
      this.$emit('blur', e)
    },
    handleInputChange(e) {
      this.$emit('change', e)
    },
    handleInputInput(e) {
      const value = e.target.value
      const cursor = e.target.cursor
      const maxlength = this.maxlength
      if (maxlength === cursor && this.collapseKeyboard) {
        uni.hideKeyboard()
      }
      this.$emit('input', value)
    },
    handleClear() {
      console.log('click clear')
      this.$emit('input', '')
    },
  },
  computed: {
    labelStyle() {
      const width = this.width
      let str = ''
      if (width) {
        str += 'width: ' + width + 'rpx;'
      }
      return str
    },
    inputWrapperClass() {
      const className = this.className
      const block = this.block
      const isFocus = this.inputIsFocus
      const border = this.border
      const isHasPrefix = this.$scopedSlots.prefix
      let str = ''
      if (isFocus) {
        str += 'focus '
      }
      if (border) {
        str += 'border '
      }
      if (isHasPrefix) {
        str += 'prefix '
      }
      if (className) {
        str += className + ' '
      }
      if (block) {
        str += 'block '
      }
      return str
    },
    inputClass() {
      let str = ''

      return str
    },
    placeholderStyle() {
      let str = ''
      const color = this.placeholderColor

      if (!!color) {
        str = 'color: ' + color
      }
      return str
    },
  },
  watch: {
    value(newValue) {
      const clear = this.clear
      if (newValue && clear) {
        this.isShowClear = true
      } else {
        this.isShowClear = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
$input-bgc: #fff;
$input-height: 88rpx;
$label-width: 180rpx;
$label-height: 88rpx;
$label-color: #36404a;
$input-color: #36404a;
$input-focus-color: #40a9ff;
$border-color: #eee;
$input-focus-border-color: #40a9ff;
view,
label,
input {
  box-sizing: border-box;
}
.ez-input-wrapper {
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  background-color: $input-bgc;
  transition: all 0.3s;
  &.border {
    border-bottom: 1px solid $border-color;
    &.focus {
      border-color: $input-focus-border-color;
    }
  }
  &.block {
    flex-wrap: wrap;
    .ez-label-box {
      width: 100%;
    }
  }
}
.ez-label-box {
  width: $label-width;
  font-size: 28rpx;
  color: $label-color;
  line-height: 1.2;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  height: $label-height;
}
.ez-input-box {
  flex: 1;
  height: $input-height;
  display: flex;
  align-items: center;
  flex-direction: row;
  position: relative;
}
.ez-input-prefix {
  display: flex;
}
.ez-input {
  flex: 1;
  display: flex;
  height: 100%;
  margin: 0;
  outline: 0;
  background-color: transparent;
  font-size: 26rpx;
  line-height: 1.4;
  color: $input-color;
  padding: 0 12rpx;
}
.ez-input-sufix {
  display: flex;
}
.icon-clear {
  font-size: 36rpx;
  margin-right: 12rpx;
}
</style>
