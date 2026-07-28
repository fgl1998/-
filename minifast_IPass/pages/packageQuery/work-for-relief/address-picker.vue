<template>
  <div class="ez-picker-wrapper" :style="pickerWrapperStyle">
    <block v-if="type === 'address'">
      <div class="picker-content" @click="handleAddressPicker">
        <div class="picker-value">
          {{ address_value_desc }}
        </div>
        <div class="iconimg"></div>
      </div>
    </block>
    <block v-if="type == 'address'">
      <block v-if="areaCode == '511500' || areaCode == '511100'">
        <ComponentSelectAddress
          v-model="showAddressPopup"
          @change="handleAddressChange"
          :address="address"
          requestSystemType="FFDS"
          :isSchoolQuery="isSchoolQuery"
          idKey="orgid"
          :DValue="2"
          :level="2"
          renderKey="orgname"></ComponentSelectAddress>
      </block>
      <block v-else>
        <ComponentSelectAddress
          v-if="isOpenYGFF"
          v-model="showAddressPopup"
          @change="handleAddressChange"
          :address="address"
          requestSystemType="FF"
          :isSchoolQuery="isSchoolQuery"
          idKey="orgid"
          :DValue="2"
          :level="2"
          renderKey="orgname"></ComponentSelectAddress>
        <ComponentSelectAddress
          v-else
          v-model="showAddressPopup"
          @change="handleAddressChange"
          :address="address"
          requestSystemType="SP"
          idKey="orgid"
          :DValue="2"
          :level="2"
          renderKey="orgname"></ComponentSelectAddress>
      </block>
    </block>
  </div>
</template>
<script>
  import config from '@/config'

  import ComponentMUIPopup from '@/components/common/ez-popup/ez-popup.vue'
  import ComponentSelectAddress from './ez-select-address.vue'
  /**
  picker 选择
 * @description picker 选择
 * @param {Boolean} custom 是否启用自定义picker
 * @param {String} rangeKey 渲染key 默认 name
 * @param {String} mode 类型
*/
  export default {
    name: 'addressPicker',
    props: {
      range: {
        type: [Array],
        default: () => {
          return []
        }
      },
      address: {
        type: [Array],
        default: () => {
          return []
        }
      },
      renderValue: {
        type: [String],
        default: ''
      },
      // id
      idName: {
        type: [String],
        default: ''
      },

      rangeKey: {
        type: [String],
        default: 'name'
      },
      valueKey: {
        type: [String],
        default: 'value'
      },
      mode: {
        type: [String],
        default: 'selector'
      },
      value: {
        type: [String],
        default: ''
      },
      placeholder: {
        type: [String],
        default: '请选择'
      },
      // address 地址选择 picker 下拉选择
      type: {
        type: [String],
        default: 'picker'
      },
      width: {
        type: [String],
        default: '100%'
      },
      custom: {
        type: [Boolean],
        default: false
      },
      disabled: {
        type: [Boolean],
        default: false
      },
      // 日期粒度 有效值 year、month、day，表示选择器的粒度
      fields: {
        type: [String],
        default: 'day'
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
      // 是否查询学校
      isSchoolQuery: {
        type: [Boolean],
        default: false
      }
    },
    components: { ComponentMUIPopup, ComponentSelectAddress },
    data() {
      return {
        pickerValue: 0,
        // 自定义 picker 当前选中的 index
        customPickerValue: 0,
        // picker 中文描述
        picker_value_desc: '',
        // 是否显示地址选择弹窗
        showAddressPopup: false,
        address_value_desc: '',
        requestParams: {}, // 地址请求参数
        isOpenYGFF: false,
        areaCode: ''
      }
    },

    created() {
      const { FFAddressRequestParams, isOpenYGFF, areaCode } = config
      this.requestParams = FFAddressRequestParams
      this.isOpenYGFF = isOpenYGFF
      this.areaCode = areaCode
    },
    mounted() {},
    methods: {
      // 打开弹窗
      openPopup() {
        this.$refs.popup.open()
      },
      // 关闭弹窗
      closePopup() {
        this.$refs.popup.close()
      },
      // picker change
      handleChangePicker(e) {
        const { value } = e.target
        const range = this.range
        const item = range[value]
        const rangeKey = this.rangeKey
        const valueKey = this.valueKey

        if (this.mode == 'date') {
          this.picker_value_desc = value
          this.pickerValue = value
        } else {
          this.picker_value_desc = item[rangeKey]
          this.pickerValue = item[valueKey]
        }
        this.$emit('input', this.pickerValue)
        this.$emit('change', this.idName, this.pickerValue)
      },
      handleAddressPicker() {
        const disabled = this.disabled
        if (disabled) {
          return
        }
        this.showAddressPopup = true
      },
      // 初始化
      initPickerValue() {
        const type = this.type
        if (this.renderValue) {
          this.picker_value_desc = this.renderValue
        }
        if (type === 'address') {
          const value = this.value
          this.address_value_desc = value
        }
      },
      // 自定义 picker change
      handleCustomPickerChange(e) {
        const { value } = e.target
        this.customPickerValue = value[0]
      },
      // 点击自定义 picker 唤起弹窗
      handleCustomPicker() {
        this.openPopup()
      },
      // 自定义 picker 取消按钮 点击回调函数
      handleCustomCancel() {
        this.closePopup()
        this.$emit('cancel')
      },
      // 自定义 picker 确定按钮 点击回调函数
      handleCustomComfirm() {
        const customPickerValue = this.customPickerValue
        const range = this.range
        const valueKey = this.valueKey
        const rangeKey = this.rangeKey
        const value = range[customPickerValue][valueKey || 'code']

        this.picker_value_desc = range[customPickerValue][rangeKey || 'name']

        this.$emit('input', value)
        this.closePopup()
      },
      // 地址选择改变
      handleAddressChange(e, eArr) {
        const len = e.length
        this.address_value_desc = e[len - 1]
        this.$emit('input', this.address_value_desc)
        this.$emit('change', this.idName, eArr)
      }
    },
    computed: {
      pickerWrapperStyle() {
        const width = this.width
        let str = ''
        if (width) {
          str += `width: ${width};`
        }
        return str
      }
    },
    watch: {
      value: {
        handler() {
          this.initPickerValue()
        },
        immediate: true
      }
    }
  }
</script>
<style lang="scss" scoped>
  $height-picker: 72rpx;
  $picker-toolbar-height: 44px;
  $space: 26rpx;
  .ez-picker-wrapper {
    .picker {
      width: 100%;
    }
    .picker-content {
      width: 100%;
      height: $height-picker;
      line-height: $height-picker;
      background-color: #fff;
      border-radius: 12rpx;
      // padding: 0 $space - 8rpx 0 $space;
      font-size: 32rpx;
      color: #444444;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .picker-value {
        flex: 1;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        // padding-right: $space - 8rpx;
      }
      .iconimg {
        width: 34rpx;
        height: 30rpx;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAA8CAMAAADovOwsAAAAUVBMVEUAAACjqbWiqLSiqLOip7ShqLSiqLWkrLaor7e/v7+iqLShqLShqLSiqLOhqLOiqLSiqbWjqLWiqLSiqbWkqLejqreqqrOmsbyqqsahqLShp7N1OjNvAAAAGnRSTlMARvXK75Z+IBAE+uTj2Lmna2ZYTzUnGwsJxDVguhsAAACgSURBVFjD7dRZCsMwDATQSRzH2fekqe5/0EI/QherWA4ECnoHEIjRCEoppS42m4o80vuMYCOxRgS6ZcRKC4RJ6IfkmiHydXg5sXKEKg0xTIlga8oss0JgIK8BIh15dJDZPAllG4Qm+jJBrKcPPeSKmt7UBSIkzL3LWHphEWdv6dDuiLQc/61aEC2X945voilxgnvm3Dic4mzTWAellPojD271KyynL8l2AAAAAElFTkSuQmCC)
          no-repeat center center;
        background-size: 100% 100%;
      }
    }
  }

  .popup-content {
    width: 100%;
    background-color: #fff;
    .picker-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: $picker-toolbar-height;
      border-bottom: 1px solid #ddd;
      .btn {
        background-color: transparent;
        width: auto;
        height: $picker-toolbar-height;
        line-height: $picker-toolbar-height;
        color: #999;
        font-size: 32rpx;
        padding: 0 30rpx;
        &.confirm {
          color: $primary;
        }
      }
    }
    .picker-view {
      color: #333;
      font-size: 32rpx;
    }
    .picker-view-column {
      height: $picker-toolbar-height * 5;
      text-align: center;
      overflow: hidden;
    }
    .picker-view-column-value {
      // color: #f00;
      height: $picker-toolbar-height !important;
      line-height: $picker-toolbar-height;
      &.disabled {
        color: #f00;
      }
    }
  }
</style>
