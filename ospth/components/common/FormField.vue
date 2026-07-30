<template>
  <UFormItem :label="field.label" :prop="field.prop" :required="isRequired">
    <!-- input -->
    <UInput
      v-if="field.type === 'input'"
      v-model="localValue"
      :placeholder="field.placeholder || '请输入' + field.label"
      :disabled="isDisabled"
    />

    <!-- date -->
    <template v-else-if="field.type === 'date'">
      <UInput
        :value="localValue"
        readonly
        input-align="right"
        :placeholder="field.placeholder || '请选择' + field.label"
        @click="openPicker"
        :disabled="isDisabled"
      />
      <UPicker
        v-model="pickerVisible"
        mode="time"
        :params="dateParams"
        @confirm="onConfirm"
        @cancel="pickerVisible = false"
      />
    </template>

    <!-- mini-picker -->
    <mini-picker
      v-else-if="field.type === 'mini-picker'"
      v-model="localValue"
      :collection="field.codeType"
      :range="resolvedOptions"
      :placeholder="field.placeholder || '请选择' + field.label"
      :disabled="isDisabled"
      @change="emitChange('change')"
    />

    <!--户籍地-->
    <template v-else-if="field.type === 'address'">
      <UInput
        :value="addressLabel"
        input-align="right"
        :placeholder="field.placeholder || '请选择' + field.label"
        @click="openArea(field)"
        :disabled="isDisabled"
      />
      <aae017SelectTree
        style="width: 0"
        :ref="'aae017SelectTree_' + field.prop"
        :data="aae017Data"
        :showSearch="true"
        placeholder="请选择审核人社机构"
        @change="handleAae017Change"
      />
    </template>

    <!-- custom -->
    <template v-else-if="field.type === 'custom'">
      <slot :name="field.slot" :form="form" :setValue="setValue" />
    </template>
  </UFormItem>
</template>

<script>
import UFormItem from 'uview-ui/components/u-form-item/u-form-item.vue'
import UInput from 'uview-ui/components/u-input/u-input.vue'
import URadioGroup from 'uview-ui/components/u-radio-group/u-radio-group.vue'
import URadio from 'uview-ui/components/u-radio/u-radio.vue'
import UPicker from 'uview-ui/components/u-picker/u-picker.vue'

import aae017SelectTree from '@/components/aae017SelectTree/aae017SelectTree.vue'

export default {
  name: 'FormField',
  components: { UFormItem, UInput, URadioGroup, URadio, UPicker },
  props: {
    field: Object,
    form: Object,
    formDisabled: Boolean,
    forceDisabledFields: Object,
    optionsMap: Object,
  },
  data() {
    return {
      pickerVisible: false,
      aae017Data: [],
      addressLabel: '',
    }
  },
  computed: {
    localValue: {
      get() {
        return this.form[this.field.prop]
      },
      set(val) {
        this.$set(this.form, this.field.prop, val)
      },
    },

    isRequired() {
      return typeof this.field.required === 'function' ? this.field.required(this.form) : !!this.field.required
    },
    isDisabled() {
      if (this.formDisabled) return true
      if (this.forceDisabledFields?.[this.field.prop]) return true
      if (typeof this.field.disabled === 'function') {
        return this.field.disabled(this.form)
      }
      return !!this.field.disabled
    },
    dateParams() {
      const p = this.field.picker || 'date'
      if (p === 'year') return { year: true, month: false, day: false }
      if (p === 'month') return { year: true, month: true, day: false }
      return { year: true, month: true, day: true }
    },
    resolvedOptions() {
      const opts = this.field.options
      if (Array.isArray(opts)) return opts
      if (typeof opts === 'string') return this.optionsMap?.[opts] || []
      return []
    },
  },
  watch: {
    localValue(val) {
      if (this.field.type === 'address') {
        this.syncAddressLabel(val)
      }
    },
    aae017Data: {
      handler() {
        if (this.field.type === 'address') {
          this.syncAddressLabel(this.localValue)
        }
      },
      deep: true,
    },
  },
  created() {
    const userInfo = this.$base.getUser(true, true)
    if (userInfo && userInfo.naturalBo) {
      this.userInfo = userInfo.naturalBo
    } else {
      this.userInfo = {}
    }
  },
  mounted() {
    this.initAae017Data()
  },

  methods: {
    emitChange(type, value = this.localValue) {
      // this.$emit('field-change', this.field.prop)
      this.$emit('field-change', {
        field: this.field,
        value,
        type,
      })
    },
    setValue(val) {
      this.localValue = val
      // this.emitChange()
    },
    openPicker() {
      if (!this.isDisabled) this.pickerVisible = true
    },
    onConfirm(e) {
      const y = e.year
      const m = e.month ? String(e.month).padStart(2, '0') : ''
      const d = e.day ? String(e.day).padStart(2, '0') : ''
      let val = y
      if (this.field.picker === 'month') val = `${y}-${m}`
      if (!this.field.picker || this.field.picker === 'date') val = `${y}-${m}-${d}`
      this.localValue = val
      this.pickerVisible = false
      this.emitChange('change', val)
    },
    // 初始化就业地数据
    async initAae017Data() {
      if (this.field.type !== 'address') return

      const selectTree = this.$refs['aae017SelectTree_' + this.field.prop]
      if (!selectTree || !selectTree.queryAae017Data) return

      try {
        this.aae017Data = await selectTree.queryAae017Data(this.userInfo.certNo)
        // // ⭐ 回显：只有 value，也能显示 label
        // console.log(this.localValue, 'localValue')

        // if (this.localValue) {
        //   const node = this.findNodeByValue(this.aae017Data, this.localValue)
        //   if (node) {
        //     this.addressLabel = node.label
        //   }
        // }
      } catch (e) {
        console.error('初始化就业地数据失败', e)
      }
    },
    syncAddressLabel(val) {
      if (!val || !this.aae017Data?.length) {
        this.addressLabel = ''
        return
      }
      const node = this.findNodeByValue(this.aae017Data, val)
      this.addressLabel = node ? node.label : ''
    },
    findNodeByValue(list, value) {
      for (const item of list || []) {
        if (item.value === value) return item
        if (item.children) {
          const found = this.findNodeByValue(item.children, value)
          if (found) return found
        }
      }
      return null
    },
    openArea(field) {
      this.$refs['aae017SelectTree_' + field.prop].handleShowPopup()
    },
    handleAae017Change({ value, label }) {
      this.localValue = value // 存 value
      this.addressLabel = label // 显示 label
      this.emitChange('change', value)
    },
  },
}
</script>

<style scoped>
.form-field-error {
  color: #f56c6c;
  font-size: 12px;
}

.date-wrapper {
  flex: 1;
}

/* 防止 disabled 变灰（uView1） */
.date-wrapper .u-input--disabled {
  opacity: 1;
}
</style>
