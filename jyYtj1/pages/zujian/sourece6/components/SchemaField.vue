<template>
  <u-form-item
    v-if="field.visible"
    :label="field.label"
    :prop="field.field"
    :required="field.required || hasRequiredRule"
    v-bind="field.formItemProps"
  >
    <component
      :is="currentComponent"
      :value="value"
      :field="field"
      :disabled="field.disabled"
      :readonly="field.readonly"
      :mode="mode"
      @input="handleInput"
      @change="handleChange"
    />
  </u-form-item>
</template>

<script>
import InputField from '../fields/InputField.vue'
import SelectField from '../fields/SelectField.vue'
import DateField from '../fields/DateField.vue'

export default {
  name: 'SchemaField',
  components: {
    InputField,
    SelectField,
    DateField,
  },
  props: {
    field: {
      type: Object,
      default: function () {
        return {}
      },
    },
    value: {
      type: null,
      default: '',
    },
    mode: {
      type: String,
      default: 'edit',
    },
  },
  computed: {
    currentComponent() {
      if (this.field.component) {
        return this.field.component
      }
      var map = {
        input: 'InputField',
        select: 'SelectField',
        date: 'DateField',
      }
      return map[this.field.type] || 'InputField'
    },
    hasRequiredRule() {
      var rules = this.field.rules || []
      return rules.some(function (item) {
        return item && item.required
      })
    },
  },
  methods: {
    handleInput(value) {
      this.$emit('input', value)
    },
    handleChange(detail) {
      this.$emit('change', detail)
    },
  },
}
</script>
