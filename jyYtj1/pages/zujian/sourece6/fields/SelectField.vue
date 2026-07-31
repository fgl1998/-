<template>
  <view class="schema-select-field">
    <view class="schema-select-field__trigger" @tap="openPicker">
      <u-input
        :value="displayLabel"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="true"
        :border="border"
        suffix-icon="arrow-down"
      />
    </view>
    <u-picker
      :show="showPicker"
      :columns="[normalizedOptions]"
      key-name="label"
      :default-index="[selectedIndex]"
      :title="title"
      :close-on-click-overlay="true"
      @confirm="handleConfirm"
      @cancel="closePicker"
      @close="closePicker"
    />
  </view>
</template>

<script>
export default {
  name: 'SchemaSelectField',
  props: {
    value: {
      type: null,
      default: '',
    },
    field: {
      type: Object,
      default: function () {
        return {}
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showPicker: false,
    }
  },
  computed: {
    normalizedOptions() {
      return Array.isArray(this.field.options) ? this.field.options : []
    },
    title() {
      return this.field.componentProps && this.field.componentProps.title
        ? this.field.componentProps.title
        : this.field.label
    },
    placeholder() {
      return this.field.componentProps && this.field.componentProps.placeholder
        ? this.field.componentProps.placeholder
        : 'Please select'
    },
    border() {
      return this.field.componentProps && this.field.componentProps.border
        ? this.field.componentProps.border
        : 'surround'
    },
    displayLabel() {
      var matched = this.normalizedOptions.find(
        function (item) {
          return item.value === this.value
        }.bind(this)
      )
      return matched ? matched.label : ''
    },
    selectedIndex() {
      var index = this.normalizedOptions.findIndex(
        function (item) {
          return item.value === this.value
        }.bind(this)
      )
      return index > -1 ? index : 0
    },
  },
  methods: {
    openPicker() {
      if (this.disabled || this.readonly) {
        return
      }
      this.showPicker = true
    },
    closePicker() {
      this.showPicker = false
    },
    handleConfirm(event) {
      var selected = event && event.value && event.value[0] ? event.value[0] : null
      var nextValue = selected ? selected.value : ''
      this.closePicker()
      this.$emit('input', nextValue)
      this.$emit('change', {
        value: nextValue,
        option: selected,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.schema-select-field__trigger {
  width: 100%;
}
</style>
