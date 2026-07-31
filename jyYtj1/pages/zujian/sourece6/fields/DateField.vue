<template>
  <view class="schema-date-field">
    <view class="schema-date-field__trigger" @tap="openPicker">
      <u-input
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="true"
        :border="border"
        suffix-icon="calendar"
      />
    </view>
    <u-datetime-picker
      :show="showPicker"
      :value="pickerValue"
      :mode="pickerMode"
      :title="title"
      :min-date="minDate"
      :max-date="maxDate"
      :close-on-click-overlay="true"
      @confirm="handleConfirm"
      @cancel="closePicker"
      @close="closePicker"
    />
  </view>
</template>

<script>
function padZero(value) {
  return value < 10 ? '0' + value : '' + value
}

function formatDate(value, mode) {
  if (!value) {
    return ''
  }
  var date = new Date(value)
  if (isNaN(date.getTime())) {
    return ''
  }
  var year = date.getFullYear()
  var month = padZero(date.getMonth() + 1)
  var day = padZero(date.getDate())
  if (mode === 'year-month') {
    return year + '-' + month
  }
  if (mode === 'datetime') {
    var hour = padZero(date.getHours())
    var minute = padZero(date.getMinutes())
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute
  }
  return year + '-' + month + '-' + day
}

function toTimestamp(value, fallbackValue) {
  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'string' && value) {
    var normalized = value.replace(/-/g, '/')
    var timestamp = new Date(normalized).getTime()
    if (!isNaN(timestamp)) {
      return timestamp
    }
  }
  return fallbackValue
}

export default {
  name: 'SchemaDateField',
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
    pickerMode() {
      return this.field.componentProps && this.field.componentProps.mode
        ? this.field.componentProps.mode
        : 'date'
    },
    placeholder() {
      return this.field.componentProps && this.field.componentProps.placeholder
        ? this.field.componentProps.placeholder
        : 'Please select date'
    },
    title() {
      return this.field.componentProps && this.field.componentProps.title
        ? this.field.componentProps.title
        : this.field.label
    },
    border() {
      return this.field.componentProps && this.field.componentProps.border
        ? this.field.componentProps.border
        : 'surround'
    },
    displayValue() {
      if (typeof this.value === 'string') {
        return this.value
      }
      return formatDate(this.value, this.pickerMode)
    },
    pickerValue() {
      return toTimestamp(this.value, Date.now())
    },
    minDate() {
      var minDate = this.field.componentProps && this.field.componentProps.minDate
      return toTimestamp(minDate, new Date('2000/01/01').getTime())
    },
    maxDate() {
      var maxDate = this.field.componentProps && this.field.componentProps.maxDate
      return toTimestamp(maxDate, new Date('2099/12/31').getTime())
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
      var nextValue = formatDate(event.value, this.pickerMode)
      this.closePicker()
      this.$emit('input', nextValue)
      this.$emit('change', {
        value: nextValue,
        timestamp: event.value,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.schema-date-field__trigger {
  width: 100%;
}
</style>
