<template>
  <view
    class="ez-declare-picker-wrapper"
    :style="wrapperStyle"
    :class="[required ? 'required' : '']">
    <div class="label" :style="labelStyle">{{ label }}</div>
    <block v-if="pickerType == 'picker'">
      <div class="value">
        <picker
          class="picker"
          :style="pickerStyle"
          :mode="mode"
          :disabled="disabled"
          :range="range"
          :range-key="rangeKey"
          :fields="fields"
          :value="pickerIndex"
          :start="startTime"
          :end="endTime"
          @change="hanldeChange">
          <div class="picker-value" :class="[align]" :style="pickerStyle" v-if="valueDesc">
            <span>
              {{ valueDesc }}
            </span>
          </div>
          <div class="picker-placeholder" :class="[align]" :style="pickerStyle" v-else>
            <span>
              {{ placeholder }}
            </span>
          </div>
          <div class="iconimg iconimg-arrow-right"></div>
        </picker>
      </div>
    </block>
  </view>
</template>

<script>
/**
 * 申报 picker 组件
 * @description 申报组件
 */
export default {
  name: 'ezDeclarePicker',
  props: {
    // label 名称
    label: {
      type: [String],
      default: 'picker label',
    },
    // disabled
    disabled: {
      type: [Boolean],
      default: false,
    },
    renderValue: {
      type: [String],
      default: '',
    },
    // label 宽度控制
    labelWidth: {
      type: [String, Number],
      default: '',
    },
    // 高度
    height: {
      type: [String, Number],
      default: '',
    },
    // 日期粒度 有效值 year、month、day，表示选择器的粒度
    fields: {
      type: [String],
      default: 'day',
    },
    // 未选择提示
    placeholder: {
      type: [String],
      default: '请选择',
    },
    // 未选择提示
    required: {
      type: [Boolean],
      default: true,
    },
    // 演示
    isDemo: {
      type: [Boolean],
      default: false,
    },
    // 模式
    mode: {
      type: [String],
      default: 'selector',
    },
    // value 码值
    value: {
      type: [String],
      required: '',
    },
    // 用于获取码表对应的中文值
    idName: {
      type: [String],
      default: '',
    },
    // 渲染 key
    rangeKey: {
      type: [String],
      default: 'aaa103',
    },
    // 值 key
    valueKey: {
      type: [String],
      default: 'aaa102',
    },
    // mode 为 date 时使用 表示有效日期范围的开始，字符串格式为"YYYY-MM-DD"
    startTime: {
      type: [String],
      default: '',
    },
    // mode 为 date 时使用 表示有效日期范围的结束，字符串格式为"YYYY-MM-DD"
    endTime: {
      type: [String],
      default: '',
    },
    range: {
      type: [Array],
      default: () => {
        return []
      },
    },
    // 数据显示方向  right left
    align: {
      type: [String],
      default: 'right',
    },
    pickerType: {
      type: [String],
      default: 'picker',
    },
    valueDesc: {
      type: [String],
      default: '',
    },
  },
  data() {
    return {
      pickerIndex: '', // 选取值所在序号
    }
  },
  components: {},
  created() {},
  mounted() {},
  methods: {
    handleCheckValue(value) {
      this.$emit('input', value)
    },
    initPicker() {
      const mode = this.mode
      const value = this.value
      const range = [...this.range]
      const valueKey = this.valueKey

      if (mode === 'selector') {
        this.pickerIndex = '0'
        for (let i = 0, len = range.length; i < len; i++) {
          const item = range[i]
          if (item[valueKey] === value) {
            this.pickerIndex = i + ''
            break
          }
        }
      }
      if (mode === 'date') {
        this.pickerIndex = ''
      }
    },
    hanldeChange(e) {
      const idName = this.idName
      const mode = this.mode
      if (this.pickerType == 'combox') {
        let { code, inputVal } = e
        this.$emit('change', idName, inputVal, code)
        this.$emit('input', code)
        return
      }
      const { value } = e.target
      if (mode === 'selector') {
        const range = this.range
        const item = range[value]
        this.pickerIndex = value
        this.$emit('change', item)
      }

      if (mode === 'date') {
        this.$emit('change', value)
      }

      // console.log('e=================',e)
      // if (mode === 'selector') {
      //   const range = this.range
      //   const rangeKey = this.rangeKey
      //   const valueKey = this.valueKey
      //   const item = range[value]

      //   this.pickerIndex = value
      //   this.value_desc = item[rangeKey]
      //   this.$emit('input', item[valueKey])
      //   this.$emit('change', idName, this.value_desc, item[valueKey])
      // }
      // if (mode === 'date') {
      //   this.value_desc = value
      //   this.$emit('input', value)
      //   this.$emit('change', value)
      //   console.log(value, 123456789)
      // }
    },
  },
  computed: {
    wrapperStyle() {
      const height = this.height
      let str = ''
      if (height) {
        if (typeof height === 'string') {
          str += `height: ${height}; `
        }
        if (typeof height === 'number') {
          str += `height: ${height}rpx; `
        }
      }
      return str
    },
    pickerStyle() {
      const height = this.height
      let str = ''
      if (height) {
        if (typeof height === 'string') {
          str += `height: ${height}; `
        }
        if (typeof height === 'number') {
          str += `height: ${height}rpx; `
        }
      }
      return str
    },
    labelStyle() {
      const labelWidth = this.labelWidth
      let str = ''
      if (labelWidth) {
        if (typeof labelWidth === 'string') {
          str += `width: ${labelWidth}; `
        }
        if (typeof labelWidth === 'number') {
          str += `width: ${labelWidth}rpx; `
        }
      }
      return str
    },
  },
  watch: {
    value: {
      handler() {
        this.initPicker()
      },
      immediate: true,
    },
    range: {
      handler(val) {
        if (val && val.length > 0) {
          this.initPicker()
        }
      },
      immediate: true,
    },
    startTime: {
      handler(val) {
        // console.log('startTime', val)
      },
    },
    endTime: {
      handler(val) {
        // console.log('endTime', val)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
$height-picker: 96rpx;
$picker-toolbar-height: 44px;
$space: 30rpx;
.ez-declare-picker-wrapper {
  width: 100%;
  font-size: 30rpx;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  .label {
    font-weight: 500;
    position: relative;
    color: #4e5767;
    line-height: 1;
    padding-left: 12rpx;
    margin-right: 10rpx;
  }
  .value {
    flex: 1;
    overflow: hidden;
    width: 100%;
    height: 100%;
    font-weight: 700;
    color: shade($color-placeholder, 20%);
    border-radius: 10rpx;
    position: relative;
  }
  .picker {
    width: 100%;
    height: $height-picker;
    padding-right: 30rpx;
    position: relative;
  }
  .picker-placeholder,
  .picker-value {
    width: 100%;
    height: 100%;
    color: #4e5767;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: $height-picker;
    padding-left: 20rpx;
    font-weight: 400;

    span {
      line-height: 1.4;
    }
  }
  .picker-placeholder {
    color: #999;
  }

  .iconimg {
    width: 32rpx;
    height: 32rpx;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }

  &.required {
    .label {
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
  }
}
</style>
