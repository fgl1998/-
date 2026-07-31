<template>
  <u-input
    :value="value"
    :type="inputType"
    :placeholder="placeholder"
    :maxlength="maxlength"
    :disabled="disabled"
    :readonly="readonly"
    :clearable="clearable"
    :border="border"
    v-bind="field.componentProps"
    @input="handleInput"
    @change="handleChange"
  />
</template>

<script>
export default {
  name: 'SchemaInputField',
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
  computed: {
    inputType() {
      return this.field.componentProps && this.field.componentProps.type
        ? this.field.componentProps.type
        : 'text'
    },
    placeholder() {
      return this.field.componentProps && this.field.componentProps.placeholder
        ? this.field.componentProps.placeholder
        : 'Please input'
    },
    maxlength() {
      return this.field.componentProps && this.field.componentProps.maxlength !== undefined
        ? this.field.componentProps.maxlength
        : -1
    },
    clearable() {
      return !!(this.field.componentProps && this.field.componentProps.clearable)
    },
    border() {
      return this.field.componentProps && this.field.componentProps.border
        ? this.field.componentProps.border
        : 'surround'
    },
  },
  methods: {
    handleInput(value) {
      this.$emit('input', value)
    },
    handleChange(value) {
      this.$emit('change', value)
    },
  },
}
</script>
