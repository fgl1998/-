<template>
  <view class="schema-form">
    <u-form
      ref="uForm"
      :model="innerValue"
      :rules="formRules"
      :label-position="labelPosition"
      :label-width="labelWidth"
      :error-type="errorType"
    >
      <schema-field
        v-for="field in runtimeFields"
        :key="field.field"
        :field="field"
        :value="innerValue[field.field]"
        :mode="mode"
        @input="handleFieldInput(field.field, $event)"
      />
    </u-form>
  </view>
</template>

<script>
import SchemaField from './components/SchemaField.vue'

function isFunction(value) {
  return typeof value === 'function'
}

function hasOwn(target, key) {
  return Object.prototype.hasOwnProperty.call(target || {}, key)
}

function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]'
}

function cloneValue(value) {
  if (Array.isArray(value)) {
    return value.map(function (item) {
      return cloneValue(item)
    })
  }
  if (isObject(value)) {
    var result = {}
    Object.keys(value).forEach(function (key) {
      result[key] = cloneValue(value[key])
    })
    return result
  }
  return value
}

function isEmptyValue(value) {
  return (
    value === undefined ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  )
}

export default {
  name: 'SchemaForm',
  components: {
    SchemaField,
  },
  props: {
    schema: {
      type: Array,
      default: function () {
        return []
      },
    },
    value: {
      type: Object,
      default: function () {
        return {}
      },
    },
    mode: {
      type: String,
      default: 'edit',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    labelPosition: {
      type: String,
      default: 'top',
    },
    labelWidth: {
      type: [String, Number],
      default: 160,
    },
    errorType: {
      type: String,
      default: 'message',
    },
  },
  data() {
    return {
      innerValue: {},
      initialModel: {},
      runtimeFields: [],
      formRules: {},
      lastExternalValue: '',
    }
  },
  watch: {
    schema: {
      deep: true,
      handler() {
        this.setValues(this.innerValue, {
          resetInitial: false,
          clearValidate: false,
        })
      },
    },
    value: {
      deep: true,
      immediate: true,
      handler(nextValue) {
        var serialized = JSON.stringify(nextValue || {})
        if (serialized === this.lastExternalValue) {
          return
        }
        this.lastExternalValue = serialized
        this.setValues(nextValue, {
          resetInitial: true,
          clearValidate: true,
          emit: false,
        })
      },
    },
    disabled() {
      this.refreshRuntime()
    },
    mode() {
      this.refreshRuntime()
    },
  },
  methods: {
    resolveDynamic(source, context, fallbackValue) {
      if (isFunction(source)) {
        return source(context)
      }
      return source === undefined ? fallbackValue : source
    },
    getEmptyValue(field) {
      if (field.defaultValue !== undefined) {
        return cloneValue(field.defaultValue)
      }
      return field.type === 'select' || field.type === 'date' ? '' : ''
    },
    buildContext(fieldName, value) {
      return {
        field: fieldName,
        value: value,
        values: this.innerValue,
        schema: this.schema,
        mode: this.mode,
        getValue: this.getFieldValue,
        setValue: this.setFieldValue,
        clearValidate: this.clearValidate,
        validateField: this.validateField,
      }
    },
    normalizeOptions(options) {
      if (!Array.isArray(options)) {
        return []
      }
      return options.map(function (item) {
        if (isObject(item)) {
          return {
            label: item.label !== undefined ? item.label : item.text,
            value: item.value !== undefined ? item.value : item.id,
            raw: item,
          }
        }
        return {
          label: item,
          value: item,
          raw: item,
        }
      })
    },
    normalizeRules(rules) {
      if (!rules) {
        return []
      }
      return Array.isArray(rules) ? rules.filter(Boolean) : [rules]
    },
    createModel(sourceValue) {
      var model = {}
      var source = sourceValue || {}
      this.schema.forEach(
        function (field) {
          var nextValue
          if (hasOwn(source, field.field)) {
            nextValue = hasOwn(field, 'transformIn') && isFunction(field.transformIn)
              ? field.transformIn(source[field.field], source)
              : source[field.field]
          } else {
            var context = {
              field: field.field,
              value: undefined,
              values: model,
              schema: this.schema,
              mode: this.mode,
            }
            nextValue = this.resolveDynamic(field.defaultValue, context, this.getEmptyValue(field))
          }
          model[field.field] = cloneValue(nextValue)
        }.bind(this)
      )
      return model
    },
    refreshRuntime() {
      var nextFields = []
      var nextRules = {}
      this.schema.forEach(
        function (field) {
          var currentValue = this.innerValue[field.field]
          var context = this.buildContext(field.field, currentValue)
          var visible = this.resolveDynamic(field.visible, context, true) !== false
          var disabled = this.disabled || this.mode === 'view' || this.resolveDynamic(field.disabled, context, false) === true
          var readonly = this.mode === 'view' || this.resolveDynamic(field.readonly, context, false) === true
          var options = this.normalizeOptions(this.resolveDynamic(field.options, context, field.options || []))
          var componentProps = this.resolveDynamic(field.componentProps, context, {}) || {}
          var formItemProps = this.resolveDynamic(field.formItemProps, context, {}) || {}
          var rules = this.normalizeRules(this.resolveDynamic(field.rules, context, []))
          var runtimeField = Object.assign({}, field, {
            visible: visible,
            disabled: disabled,
            readonly: readonly,
            options: options,
            componentProps: componentProps,
            formItemProps: formItemProps,
            rules: rules,
          })

          if (!visible && field.clearOnHide) {
            this.$set(this.innerValue, field.field, this.getEmptyValue(field))
          }

          if (field.type === 'select' && visible && options.length) {
            var optionMatched = options.some(
              function (item) {
                return item.value === this.innerValue[field.field]
              }.bind(this)
            )
            if (!optionMatched && !isEmptyValue(this.innerValue[field.field])) {
              this.$set(this.innerValue, field.field, this.getEmptyValue(field))
            }
          }

          if (visible) {
            nextFields.push(runtimeField)
          }
          if (visible && !disabled && !readonly && rules.length) {
            nextRules[field.field] = rules
          }
        }.bind(this)
      )

      this.runtimeFields = nextFields
      this.formRules = nextRules

      this.$nextTick(
        function () {
          if (this.$refs.uForm && this.$refs.uForm.setRules) {
            this.$refs.uForm.setRules(this.formRules)
          }
        }.bind(this)
      )
    },
    setValues(values, options) {
      var config = options || {}
      var nextModel = this.createModel(values || {})
      this.innerValue = nextModel
      if (config.resetInitial !== false) {
        this.initialModel = cloneValue(nextModel)
      }
      this.refreshRuntime()
      this.$nextTick(
        function () {
          if (config.clearValidate !== false) {
            this.clearValidate()
          }
          if (config.emit) {
            this.emitFormChange('', null)
          }
        }.bind(this)
      )
    },
    setFieldValue(fieldName, value, options) {
      var config = options || {}
      this.$set(this.innerValue, fieldName, cloneValue(value))
      if (config.silent) {
        this.refreshRuntime()
        return
      }
      this.runFieldEffects(fieldName, value)
    },
    getFieldValue(fieldName) {
      return this.innerValue[fieldName]
    },
    getValues() {
      return cloneValue(this.innerValue)
    },
    getSubmitValues() {
      var result = {}
      this.schema.forEach(
        function (field) {
          var currentValue = this.innerValue[field.field]
          if (isFunction(field.transformOut)) {
            result[field.field] = field.transformOut(currentValue, this.innerValue)
          } else {
            result[field.field] = cloneValue(currentValue)
          }
        }.bind(this)
      )
      return result
    },
    handleFieldInput(fieldName, value) {
      this.$set(this.innerValue, fieldName, cloneValue(value))
      this.runFieldEffects(fieldName, value)
    },
    runFieldEffects(fieldName, value) {
      var field = this.schema.find(function (item) {
        return item.field === fieldName
      })
      if (field && isFunction(field.onChange)) {
        field.onChange(this.buildContext(fieldName, value))
      }
      this.refreshRuntime()
      this.$nextTick(
        function () {
          if (field && field.type !== 'input') {
            this.validateField([fieldName]).catch(function () {})
          }
          if (field && Array.isArray(field.revalidateFields) && field.revalidateFields.length) {
            this.validateField(field.revalidateFields).catch(function () {})
          }
        }.bind(this)
      )
      this.emitFormChange(fieldName, value)
    },
    emitFormChange(fieldName, value) {
      var payload = cloneValue(this.innerValue)
      this.$emit('input', payload)
      this.$emit('change', {
        field: fieldName,
        value: cloneValue(value),
        values: payload,
      })
    },
    validate() {
      if (!this.$refs.uForm) {
        return Promise.resolve(true)
      }
      return this.$refs.uForm.validate()
    },
    validateField(fields) {
      if (!this.$refs.uForm) {
        return Promise.resolve(true)
      }
      return new Promise(
        function (resolve, reject) {
          this.$refs.uForm.validateField([].concat(fields), function (errors) {
            if (errors && errors.length) {
              reject(errors)
              return
            }
            resolve(true)
          })
        }.bind(this)
      )
    },
    clearValidate(fields) {
      if (this.$refs.uForm && this.$refs.uForm.clearValidate) {
        this.$refs.uForm.clearValidate(fields)
      }
    },
    reset() {
      this.innerValue = cloneValue(this.initialModel)
      this.refreshRuntime()
      this.$nextTick(
        function () {
          this.clearValidate()
          this.emitFormChange('', null)
        }.bind(this)
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.schema-form {
  width: 100%;
}
</style>
