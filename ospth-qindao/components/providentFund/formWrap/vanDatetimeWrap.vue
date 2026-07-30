<template>
  <div>
    <van-field
        v-bind="finalProps"
        v-on="finalEvents"
        :value="innerValue"
        readonly
        is-link
        @click="showPicker = true"
    />

    <van-popup v-model="showPicker" position="bottom">
      <van-datetime-picker
          v-model="currentDate"
          :type="pickerType"
          :title="pickerTitle"
          @confirm="onConfirm"
          @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'vanDatetimeWrap',
  props: {
    formItemConfig: {
      type: Object,
      required: true
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      innerValue: this.value,
      showPicker: false,
      currentDate: this.stringToDate(this.value) // 初始化自动转
    }
  },
  computed: {
    pickerType() {
      const type = this.formItemConfig.type
      return type === 'month' ? 'year-month' : 'date'
    },
    pickerTitle() {
      const label = this.formItemConfig.label || ''
      return this.pickerType === 'year-month' ? `选择${label}年月` : `选择${label}日期`
    },
    finalProps() {
      const config = this.formItemConfig
      const {mobile = {}, ...common} = config
      return {
        placeholder: config.label ? `请选择${config.label}` : '',
        label: config.label,
        name: config.name,
        required: config.required,
        rules: config.rules,
        disabled: config.disabled,
        inputAlign: 'right',
        ...common,
        ...mobile,
        type: undefined
      }
    },
    finalEvents() {
      const config = this.formItemConfig
      return {
        ...config.events,
        ...config.mobileEvents
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.innerValue = val
        this.currentDate = this.stringToDate(val) // 外部变化同步
      }
    }
  },
  methods: {
    // 字符串转 Date 对象（关键修复）
    stringToDate(str) {
      if (!str) return new Date()
      return new Date(str)
    },
    onConfirm(val) {
      const date = val
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      let formatted = ''
      if (this.formItemConfig.type === 'month') {
        formatted = `${year}-${month}`
      } else {
        formatted = `${year}-${month}-${day}`
      }

      if (this.formItemConfig.format) {
        formatted = this.formItemConfig.format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
      }

      this.innerValue = formatted
      this.$emit('input', formatted)
      this.$emit('change', formatted)
      this.showPicker = false
    }
  }
}
</script>

<style scoped lang="less">
::v-deep .van-field__control {
  --cell-border: 0 !important;
}

::v-deep .van-cell::after {
  border: none !important;
}
</style>
