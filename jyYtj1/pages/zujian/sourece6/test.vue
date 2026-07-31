<template>
  <view class="demo-page">
    <view class="demo-card">
      <view class="demo-title">Schema Form MVP</view>
      <view class="demo-subtitle">
        Demo: echo data, visible/hidden fields, disabled fields, option linkage, and cross-field revalidation.
      </view>

      <view class="demo-actions">
        <view class="demo-action">
          <u-button text="Load Echo Data" type="primary" size="small" @click="loadEchoData" />
        </view>
        <view class="demo-action">
          <u-button
            :text="formDisabled ? 'Enable Form' : 'Disable Form'"
            type="warning"
            size="small"
            @click="toggleDisabled"
          />
        </view>
        <view class="demo-action">
          <u-button text="Validate" type="success" size="small" @click="submitForm" />
        </view>
        <view class="demo-action">
          <u-button text="Reset" type="info" size="small" @click="resetForm" />
        </view>
      </view>

      <schema-form
        ref="schemaForm"
        :schema="schema"
        :value="initialValue"
        :disabled="formDisabled"
        label-position="top"
        @input="handleFormInput"
      />

      <view class="result-block">
        <view class="result-title">Current Values</view>
        <view class="result-code">{{ previewText }}</view>
      </view>

      <view class="result-block">
        <view class="result-title">Last Submit Payload</view>
        <view class="result-code">{{ submitText }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import SchemaForm from './index.vue'

var serviceSlotOptions = {
  online: [
    { label: 'Video Call', value: 'video' },
    { label: 'Phone Call', value: 'phone' },
  ],
  offline: [
    { label: 'Office Visit', value: 'visit' },
    { label: 'Store Visit', value: 'store' },
  ],
}

export default {
  components: {
    SchemaForm,
  },
  data() {
    return {
      formDisabled: false,
      initialValue: {
        name: 'Tom',
        employmentType: 'onboard',
        companyName: 'Employment Service Center',
        serviceType: 'online',
        serviceSlot: 'video',
        startDate: '2026-03-20',
        endDate: '2026-03-26',
      },
      formPreview: {},
      submitValue: null,
    }
  },
  computed: {
    previewText() {
      return JSON.stringify(this.formPreview, null, 2)
    },
    submitText() {
      return this.submitValue ? JSON.stringify(this.submitValue, null, 2) : '-'
    },
    schema() {
      return [
        {
          field: 'name',
          type: 'input',
          label: 'Name',
          defaultValue: '',
          componentProps: {
            placeholder: 'Please input name',
            clearable: true,
          },
          rules: [{ required: true, message: 'Please input name', trigger: ['blur', 'change'] }],
        },
        {
          field: 'employmentType',
          type: 'select',
          label: 'Employment Status',
          defaultValue: '',
          componentProps: {
            placeholder: 'Please select status',
            title: 'Employment Status',
          },
          options: [
            { label: 'Onboard', value: 'onboard' },
            { label: 'Left', value: 'left' },
          ],
          rules: [{ required: true, message: 'Please select status', trigger: ['change'] }],
          revalidateFields: ['endDate'],
        },
        {
          field: 'companyName',
          type: 'input',
          label: 'Company',
          defaultValue: '',
          componentProps: {
            placeholder: 'Please input company',
            clearable: true,
          },
          disabled: function (ctx) {
            return ctx.values.employmentType !== 'onboard'
          },
          rules: function (ctx) {
            if (ctx.values.employmentType !== 'onboard') {
              return []
            }
            return [{ required: true, message: 'Please input company', trigger: ['blur', 'change'] }]
          },
        },
        {
          field: 'leaveDate',
          type: 'date',
          label: 'Leave Date',
          defaultValue: '',
          visible: function (ctx) {
            return ctx.values.employmentType === 'left'
          },
          clearOnHide: true,
          componentProps: {
            placeholder: 'Please select leave date',
            title: 'Leave Date',
          },
          rules: [{ required: true, message: 'Please select leave date', trigger: ['change'] }],
          revalidateFields: ['endDate'],
        },
        {
          field: 'serviceType',
          type: 'select',
          label: 'Service Type',
          defaultValue: '',
          componentProps: {
            placeholder: 'Please select service type',
            title: 'Service Type',
          },
          options: [
            { label: 'Online', value: 'online' },
            { label: 'Offline', value: 'offline' },
          ],
          rules: [{ required: true, message: 'Please select service type', trigger: ['change'] }],
          onChange: function (ctx) {
            ctx.setValue('serviceSlot', '', { silent: true })
            ctx.clearValidate(['serviceSlot'])
          },
        },
        {
          field: 'serviceSlot',
          type: 'select',
          label: 'Service Slot',
          defaultValue: '',
          componentProps: {
            placeholder: 'Please select service slot',
            title: 'Service Slot',
          },
          disabled: function (ctx) {
            return !ctx.values.serviceType
          },
          options: function (ctx) {
            return serviceSlotOptions[ctx.values.serviceType] || []
          },
          rules: function (ctx) {
            if (!ctx.values.serviceType) {
              return []
            }
            return [{ required: true, message: 'Please select service slot', trigger: ['change'] }]
          },
        },
        {
          field: 'startDate',
          type: 'date',
          label: 'Start Date',
          defaultValue: '',
          componentProps: {
            placeholder: 'Please select start date',
            title: 'Start Date',
          },
          rules: [{ required: true, message: 'Please select start date', trigger: ['change'] }],
          revalidateFields: ['endDate'],
        },
        {
          field: 'endDate',
          type: 'date',
          label: 'End Date',
          defaultValue: '',
          componentProps: {
            placeholder: 'Please select end date',
            title: 'End Date',
          },
          rules: function (ctx) {
            return [
              { required: true, message: 'Please select end date', trigger: ['change'] },
              {
                trigger: ['change'],
                validator: function (rule, value, callback) {
                  if (!value || !ctx.values.startDate) {
                    callback()
                    return
                  }
                  if (value < ctx.values.startDate) {
                    callback(new Error('End date must not be earlier than start date'))
                    return
                  }
                  if (ctx.values.employmentType === 'left' && ctx.values.leaveDate && value < ctx.values.leaveDate) {
                    callback(new Error('End date must not be earlier than leave date'))
                    return
                  }
                  callback()
                },
              },
            ]
          },
        },
      ]
    },
  },
  created() {
    this.formPreview = Object.assign({}, this.initialValue)
  },
  methods: {
    handleFormInput(values) {
      this.formPreview = values
    },
    loadEchoData() {
      var editData = {
        name: 'Lucy',
        employmentType: 'left',
        companyName: '',
        leaveDate: '2026-03-18',
        serviceType: 'offline',
        serviceSlot: 'visit',
        startDate: '2026-03-01',
        endDate: '2026-03-25',
      }
      this.initialValue = editData
      this.formPreview = editData
      this.submitValue = null
      if (this.$refs.schemaForm) {
        this.$refs.schemaForm.setValues(editData, {
          resetInitial: true,
          clearValidate: true,
        })
      }
      uni.showToast({
        title: 'Echo data loaded',
        icon: 'none',
      })
    },
    toggleDisabled() {
      this.formDisabled = !this.formDisabled
    },
    submitForm() {
      var self = this
      this.$refs.schemaForm
        .validate()
        .then(function () {
          self.submitValue = self.$refs.schemaForm.getSubmitValues()
          uni.showToast({
            title: 'Validation passed',
            icon: 'none',
          })
        })
        .catch(function () {
          self.submitValue = null
        })
    },
    resetForm() {
      this.$refs.schemaForm.reset()
      this.submitValue = null
    },
  },
}
</script>

<style lang="scss" scoped>
.demo-page {
  min-height: 100vh;
  padding: 24px;
  box-sizing: border-box;
  background: #f5f7fb;
}

.demo-card {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
}

.demo-title {
  font-size: 22px;
  font-weight: 600;
  color: #333333;
}

.demo-subtitle {
  margin-top: 12px;
  margin-bottom: 24px;
  font-size: 14px;
  line-height: 22px;
  color: #666666;
}

.demo-actions {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.demo-action {
  margin-right: 12px;
  margin-bottom: 12px;
}

.result-block {
  margin-top: 24px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
}

.result-title {
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #333333;
}

.result-code {
  white-space: pre-wrap;
  word-break: break-all;
  font-size: 13px;
  line-height: 21px;
  color: #4b5563;
}
</style>
