<template>
  <view class="ez-declare-picker-wrapper" :style="wrapperStyle" :class="[required ? '' : 'no-required']">
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
          <div class="picker-value" :class="[align]" :style="pickerStyle" v-if="value_desc">
            <span>
              {{ value_desc }}
            </span>
          </div>
          <div class="picker-placeholder" :class="[align]" :style="pickerStyle" v-else>
            <span>
              {{ placeholder }}
            </span>
          </div>
          <div class="iconimg"></div>
        </picker>
      </div>
    </block>
    <block v-if="pickerType == 'combox'">
      <div class="value d-f ai-c">
        <ComponentCombox
          style="width: 100%"
          :rangeKey="rangeKey"
          @checkValue="handleCheckValue"
          @change="hanldeChange"
          :valueKey="valueKey"
          :candidates="range"
          :placeholder="placeholder"
          v-model="value_desc"></ComponentCombox>
      </div>
    </block>
  </view>
</template>

<script>
  import ComponentMUIPopup from '@/components/common/ez-popup/ez-popup.vue'
  import ComponentCombox from '@/components/common/ez-combox/ez-combox.vue'
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
        default: 'picker label'
      },
      // disabled
      disabled: {
        type: [Boolean],
        default: false
      },
      renderValue: {
        type: [String],
        default: ''
      },
      // label 宽度控制
      labelWidth: {
        type: [String, Number],
        default: ''
      },
      // 高度
      height: {
        type: [String, Number],
        default: ''
      },
      // 日期粒度 有效值 year、month、day，表示选择器的粒度
      fields: {
        type: [String],
        default: 'day'
      },
      // 未选择提示
      placeholder: {
        type: [String],
        default: '请选择'
      },
      // 未选择提示
      required: {
        type: [Boolean],
        default: true
      },
      // 演示
      isDemo: {
        type: [Boolean],
        default: false
      },
      // 模式
      mode: {
        type: [String],
        default: 'selector'
      },
      // value 码值
      value: {
        type: [String],
        required: ''
      },
      // 用于获取码表对应的中文值
      idName: {
        type: [String],
        default: ''
      },
      // 渲染 key
      rangeKey: {
        type: [String],
        default: 'aaa103'
      },
      // 值 key
      valueKey: {
        type: [String],
        default: 'aaa102'
      },
      // mode 为 date 时使用 表示有效日期范围的开始，字符串格式为"YYYY-MM-DD"
      startTime: {
        type: [String],
        default: ''
      },
      // mode 为 date 时使用 表示有效日期范围的结束，字符串格式为"YYYY-MM-DD"
      endTime: {
        type: [String],
        default: ''
      },
      range: {
        type: [Array],
        default: () => {
          return []
        }
      },
      // 数据显示方向  right left
      align: {
        type: [String],
        default: 'right'
      },
      pickerType: {
        type: [String],
        default: 'picker'
      }
    },
    data() {
      return {
        pickerIndex: '', // 选取值所在序号
        value_desc: '' // 中文 选取值
      }
    },
    components: {
      ComponentMUIPopup,
      ComponentCombox
    },
    created() {},
    mounted() {},
    methods: {
      // 失焦无数据则清空
      handleBlur(value) {
        if (value == 0) {
          this.value_desc = ''
        }
      },
      handleCheckValue(value) {
        this.$emit('input', value)
      },
      initPicker() {
        const mode = this.mode
        const value = this.value
        const range = [...this.range]
        const rangeKey = this.rangeKey
        const valueKey = this.valueKey
        const renderValue = this.renderValue
        const isDemo = this.isDemo

        if (renderValue && isDemo) {
          this.value_desc = renderValue
          return
        }

        if (mode === 'selector') {
          this.pickerIndex = '0'
          this.value_desc = ''
          // console.log('==========================================', range)
          // console.log('==========================================', value)
          for (let i = 0, len = range.length; i < len; i++) {
            const item = range[i]
            if (item[valueKey] === value) {
              const value_desc = item[rangeKey]
              this.pickerIndex = i + ''
              this.value_desc = value_desc
              break
            }
          }
        }
        if (mode === 'date') {
          this.pickerIndex = ''
          this.value_desc = value
        }
        // console.log(this.idName,value,this.value_desc,'=================s')
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
          const rangeKey = this.rangeKey
          const valueKey = this.valueKey
          const item = range[value]

          this.pickerIndex = value
          this.value_desc = item[rangeKey]
          this.$emit('input', item[valueKey])
          this.$emit('change', idName, this.value_desc, item[valueKey])
        }
        if (mode === 'date') {
          this.value_desc = value
          this.$emit('input', value)
          this.$emit('change', value)
          // console.log(value, 123456789)
        }
      }
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
      }
    },
    watch: {
      value: {
        handler() {
          this.initPicker()
        },
        immediate: true
      },
      range: {
        handler(val) {
          if (val && val.length > 0) {
            this.initPicker()
          }
        },
        immediate: true
      },
      startTime: {
        handler(val) {
          // console.log('startTime', val)
        }
      },
      endTime: {
        handler(val) {
          // console.log('endTime', val)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  $height-picker: 72rpx;
  $picker-toolbar-height: 44px;
  $space: 26rpx;
  .ez-declare-picker-wrapper {
    width: 100%;
    height: $cell-height;
    display: flex;
    align-items: center;
    font-size: 30rpx;
    border-bottom: 1px solid $border-color;
    .label {
      color: $color;
      font-weight: 700;
      position: relative;
      padding-left: 14rpx;
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
      width: 100%;
      // overflow: hidden;
      height: 100%;
      font-weight: 700;
      color: shade($color-placeholder, 20%);
      position: relative;
    }
    .picker {
      width: 100%;
      height: $cell-height;
      padding-right: 30rpx;
      position: relative;
      text-align: right;
    }
    .picker-placeholder,
    .picker-value {
      width: 100%;
      height: 100%;
      color: shade($color-placeholder, 20%);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: $cell-height;
      &.left {
        justify-content: flex-start;
      }
      span {
        line-height: 1.4;
      }
    }
    .picker-placeholder {
      color: $color-input-placeholder;
    }
    .iconimg {
      position: absolute;
      width: 24rpx;
      height: 24rpx;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADf0lEQVR4Xu2YS0/UYBSG39PBCMZbdOPK3+DGjS6URDcwLUYMTEdoAY1iiJd4iZcETXCBC1zgAo2XMOOFGcaEQDsiC43RRP+NiZdEosAc0xkgisC0na+DpV+3Pec973l6vktKiPhDEe8fEoCcgIgTkEsg4gMgN0G5BOQSiDgBuQQiPgDyFJBLQC6BiBOge5OTG7d/LTyIIocv25Tu4h6Qy03tmJ6btQDeHwkQRB/x81eTaR79vLgJPpmY2LLhh2IxcHCdQ3gfm4tpbW0N35w+/zoFhoff1VLtd4tAh9clBMabupppraWlZXqhv3+OwVwuF5uerbNAaFhnEF7v3rVZq6+vn/2zrxXvAemMNQ5Q0zqBYJm6umwvq16E0hn7JYBj4YbAY6auNa/UQ9mbYDpjvwCQDCmEUVNXE6t5LwvASU5n8imAzXBB4OemrrWX8+wKQBFC1n4Exslygv/Fe8KwmVC73HhxDcARe5qxhxg440Z4rWII9NDQ46fd1vcEYB7CIAPn3BaoahzzkJnUerzU9AzAEU9lrQFiuuSlUOCxjEEzqV7wWscXgOKeMGL3g3DNa8Fg4mnA1ONX/Gj7BlA6Haw+gHr9FBaVQ0C/oas3/OpVBKAEYaIXUPr8Gqgkj4j6jET8VkUalSQv5KYz+asA3xGh5V6Dbpp6/Lb7+OUjK56ARQhZ+yIYdys15Cqf+LqZ0IQAFwaguByy+bNgvueqCZ9BxHTZSMaFgRYKYP6e0M3AfZ/9rZpGwHlDV4UCFg6gBCF/gsGPhUJg7jGT2pBQzaV/hESKp7K2QYy0CE0CThm6+kiE1lKNQCZgoUhqxNKJaKQS4wTuNHQtVYnGarmBAijdE2znh4rzY8XzoxDa2hOq8z8isCdwAKXTwWoC07iXLhRFaW1vbcx5yfETWxUAjrHhF3ZDLIYJZtSUM0qFQrNxvGmsXJyI91UDUJyE0fwhFNgCULeSeWJoRlK1RTTnRqOqAIpH5Ih1gIkcCFuXGJwpsKJ1Jhun3BgXFVN1AI7xZ5n8vgKKk7Cz2AjhBzO0Dl19K6oxtzprAsAx9zxr7Z1jZxKojhXSOlobP7g1LTJuzQCUNsZXe1iZ2dSlH/kksikvWmsKwIvRoGIlgKDIhkVXTkBYvlRQPuUEBEU2LLpyAsLypYLyKScgKLJh0ZUTEJYvFZRPOQFBkQ2LbuQn4DcBVNpG/ocuKAAAAABJRU5ErkJggg==)
        no-repeat center center;
      background-size: 100% 100%;
    }
    &.no-required {
      .label {
        &::before {
          content: '';
        }
      }
    }
  }
</style>
