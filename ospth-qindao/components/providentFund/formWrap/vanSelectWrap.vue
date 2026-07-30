<template>
  <div class="van-select-wrap">
    <van-field
        v-bind="finalProps"
        v-on="finalEvents"
        :value="labelName"
        readonly
        :disabled="finalDisabled"
        @click="openFrame"
    />

    <van-popup v-model="showPopup" position="bottom">
      <van-picker
          show-toolbar
          :title="finalPickerTitle"
          value-key="label"
          :columns="finalColumns"
          @confirm="confirm"
          @cancel="showPopup = false"
      />
    </van-popup>
  </div>
</template>

<script>
import codeManager from '@osppm/common/codeManager'

export default {
  name: 'vanSelectWrap',
  props: {
    formItemConfig: {
      type: Object,
      required: true
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      labelName: '',
      showPopup: false,
      codeValueColumns: []
    }
  },
  computed: {
    finalDisabled() {
      return this.formItemConfig.disabled
    },
    finalPickerTitle() {
      return this.formItemConfig.label || ''
    },
    finalColumns() {
      if (this.formItemConfig.options?.length) {
        return this.formItemConfig.options
      }
      return this.codeValueColumns
    },
    finalProps() {
      const config = this.formItemConfig
      return {
        placeholder: config.label ? `请选择${config.label}` : '',
        label: config.label,
        name: config.name,
        required: config.required,
        rules: config.rules || [{ required: config.required }],
        disabled: config.disabled,
        inputAlign: 'right',
        ...config,
        type: undefined
      }
    },
    finalEvents() {
      const config = this.formItemConfig
      return {
        ...config.events
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (!val) {
          this.labelName = ''
          return
        }
        const option = this.finalColumns.find(opt => opt.value === val)
        this.labelName = option?.label || ''
      }
    },
    formItemConfig: {
      deep: true,
      handler(newConfig) {
        if (newConfig.collectionType) {
          this.loadCodeValue(newConfig.collectionType)
        }
      }
    }
  },
  async mounted() {
    if (this.formItemConfig.collectionType) {
      await this.loadCodeValue(this.formItemConfig.collectionType)
    }
  },
  methods: {
    async loadCodeValue(collectionType) {
      try {
        const codeValue = await codeManager.getCodeValue(collectionType)
        this.codeValueColumns = [...codeValue]

        const option = this.codeValueColumns.find(opt => opt.value === this.value)
        if (option) {
          this.labelName = option.label
        }
      } catch (err) {
        console.error('加载码值失败：', err)
        this.codeValueColumns = []
      }
    },
    openFrame() {
      if (!this.finalDisabled) {
        this.showPopup = true
      }
    },
    confirm(selected) {
      const value = selected.value ?? selected
      const label = selected.label ?? selected

      this.labelName = label
      this.$emit('input', value)
      this.$emit('change', value, label)
      this.showPopup = false
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
