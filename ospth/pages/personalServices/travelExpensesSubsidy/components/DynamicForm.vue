<template>
  <UForm ref="uForm" :model="form" :rules="rules" label-width="140">
    <template v-for="(field, index) in visibleSchema">
      <!-- 模块标题 -->
      <view v-if="field.type === 'section'" :key="'section-' + index" class="title-line-blue">
        <view class="title">{{ field.title }}</view>
      </view>

      <!-- 表单字段 -->
      <FormField
        v-else
        :key="field.prop"
        :field="field"
        :form="form"
        :form-disabled="formDisabled"
        :force-disabled-fields="forceDisabledFields"
        @field-change="handleFieldChange"
      >
        <!-- custom slot -->
        <template v-if="field.type === 'custom'" v-slot:[field.slot]="slotProps">
          <slot :name="field.slot" v-bind="slotProps" />
        </template>
      </FormField>
    </template>
  </UForm>
</template>

<script>
import UForm from 'uview-ui/components/u-form/u-form.vue'
import FormField from './FormField.vue'

export default {
  name: 'DynamicForm',
  components: { UForm, FormField },
  props: {
    schema: { type: Array, required: true },
    value: Object, // v-model
    disabled: { type: Boolean, default: false },
    events: {
      // ⭐ 新增
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      form: {},
      rules: {},
      formDisabled: false,
      forceDisabledFields: {},
    }
  },
  computed: {
    visibleSchema() {
      return this.schema.filter((f) => !f.showWhen || f.showWhen(this.form))
    },
  },
  watch: {
    schema: {
      immediate: true,
      handler(schema) {
        this.initForm(schema)
        this.buildRules(schema)
      },
    },
  },
  methods: {
    /* 初始化表单 */
    initForm(schema) {
      const obj = {}
      schema.forEach((f) => {
        if (f.type === 'section') return
        if (!f.prop) return
        obj[f.prop] = f.defaultValue ?? ''
      })

      // 扩展字段（不参与 schema，但需要进 form）
      const extraFields = ['ycc299_desc']
      extraFields.forEach((key) => {
        if (!(key in obj)) {
          obj[key] = ''
        }
      })

      this.form = obj
      this.$emit('input', { ...obj })
    },

    /* 构建校验规则（核心） */
    buildRules(schema) {
      const rules = {}

      schema.forEach((field) => {
        if (field.type === 'section') return
        if (!field.prop) return

        const list = []

        const required = typeof field.required === 'function' ? field.required(this.form) : field.required

        if (required) {
          list.push({
            required: true,
            message: field.requiredMessage || `请输入${field.label}`,
            trigger: ['change', 'blur'],
          })
        }

        if (field.validator) {
          list.push({
            validator: (rule, value, callback) => {
              const msg = field.validator(value, this.form)
              msg ? callback(new Error(msg)) : callback()
            },
            trigger: ['change', 'blur'],
          })
        }

        if (list.length) rules[field.prop] = list
      })

      this.rules = { ...rules }

      // ⭐⭐⭐ uView1 必须显式同步
      this.$nextTick(() => {
        this.$refs.uForm?.setRules(this.rules)
      })
    },

    /* 字段变化时，主动触发校验 */
    handleFieldChange({ field, value, type }) {
      this.$emit('input', { ...this.form })
      this.$nextTick(() => {
        const uForm = this.$refs.uForm
        if (!uForm) return
        if (field && this.rules[field.prop]) {
          this.validateSingleField(field.prop)
        }

        //事件触发
        if (field && field.onChange && this.events[field.onChange]) {
          this.events[field.onChange](value, field, this.form)
        }
        const eventsMap = this.getFieldEvents(field)
        if (!eventsMap) return

        const handler = eventsMap[type]
        if (!handler) return

        // schema 内函数
        if (typeof handler === 'function') {
          handler(value, field, this.form)
          return
        }

        // schema 字符串 → page
        if (typeof handler === 'string' && this.events[handler]) {
          this.events[handler](value, field, this.form)
        }
      })
    },
    validateSingleField(prop) {
      const uForm = this.$refs.uForm
      if (!uForm) return

      // 1️⃣ 暂存完整 rules
      const fullRules = this.rules

      // 2️⃣ 只保留当前字段规则
      const singleRule = { [prop]: fullRules[prop] }

      // 3️⃣ 设置临时 rules
      uForm.setRules(singleRule)

      // 4️⃣ 执行校验
      uForm.validate(() => {
        // 5️⃣ 还原 rules（非常重要）
        this.$nextTick(() => {
          uForm.setRules(fullRules)
        })
      })
    },
    getFieldEvents(field) {
      if (!field) return null
      // 新写法优先
      if (field.on) return field.on

      // 兼容老写法
      if (field.onChange) {
        return {
          change: field.onChange,
        }
      }

      return null
    },

    /* 对外校验 API */
    validate() {
      return new Promise((resolve) => {
        this.$refs.uForm.validate((valid) => resolve(valid))
      })
    },

    reset() {
      this.$refs.uForm.resetFields()
    },

    disable() {
      this.formDisabled = true
    },
    enable() {
      this.formDisabled = false
    },

    setFieldValue(obj) {
      for (const [prop, value] of Object.entries(obj)) {
        if (prop in this.form) {
          this.$set(this.form, prop, value)
          this.handleFieldChange({ field: { prop } })
        }
      }
    },

    disableField(arr) {
      arr.forEach((prop) => {
        this.$set(this.forceDisabledFields, prop, true)
      })
    },
    enableField(arr) {
      arr.forEach((prop) => {
        this.$delete(this.forceDisabledFields, prop)
      })
    },
  },
}
</script>

<style scoped lang="scss">
.title-line-blue {
  .title {
    font-size: 32rpx;
    font-weight: bold;
    background: #fff;
    padding: 32rpx;
    position: relative;

    &::before {
      content: '';
      width: 6rpx;
      height: 36rpx;
      background-color: #2979ff;
      position: absolute;
      left: 0;
      top: 38rpx;
    }
  }
}
</style>
