<template>
  <van-field
      v-bind="finalProps"
      v-on="finalEvents"
      :value="innerValue"
      :type="formItemConfig.precision >= 0 ? 'number' : 'digit'"
      @input="handleInput"
  />
</template>

<script>
export default {
  name: 'vanNumberWrap',
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
      innerValue: this.value
    }
  },
  computed: {
    // 合并所有属性：通用 + 移动端专属
    finalProps() {
      const config = this.formItemConfig
      const {mobile = {}, ...common} = config

      return {
        // 基础默认值
        placeholder: config.label ? `请输入${config.label}` : '',
        label: config.label,
        name: config.name,
        required: config.required,
        rules: config.rules,
        disabled: config.disabled,
        inputAlign: 'right',

        // 通用配置覆盖
        ...common,

        // 移动端独有配置（优先级最高）
        ...mobile
      }
    },

    // 合并事件：通用事件 + 移动端事件
    finalEvents() {
      const config = this.formItemConfig
      return {
        ...config.events,
        ...config.mobileEvents
      }
    }
  },
  watch: {
    // 监听外部 value 变化，同步内部值（双向绑定关键）
    value: {
      immediate: true,
      handler(val) {
        this.innerValue = val
      }
    }
  },
  methods: {
    handleInput(val) {
      const {precision = 0} = this.formItemConfig

      // 整数
      if (precision === 0) {
        val = val.replace(/[^\d]/g, '')
      }
      // 小数
      else {
        const reg = new RegExp(`^\\d*(\\.?\\d{0,${precision}})`, 'g')
        val = (val.match(reg) || [''])[0] || ''
      }

      this.innerValue = val
      this.$emit('input', val)
      this.$emit('change', val)
    },
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
