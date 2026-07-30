<template>
  <div>
    <van-form ref="form">
      <van-form-item-map
          v-for="(item, index) in businessFormConfig.fields"
          :key="index"
          v-if="!item.if || item.if(businessFormData)"
          :formItemConfig.sync="item"
          :formData="businessFormData"
      />
      <div>当前配置中的值：{{ businessFormData }}</div>
    </van-form>
    <van-button @click="onConfirm">确认</van-button>
  </div>
</template>
<script>
import form from '@osppm/store/person/fetch/test/formJS'

export default {
  data() {
    return {
      businessFormData: {},
      businessFormConfig: form
    }
  },
  created() {
    // 自动生成属性名（只生成 key，值为空）
    this.businessFormConfig.fields.forEach(item => {
      this.$set(this.businessFormData, item.name, '') // 初始为空
    })

    this.businessFormData.name = '123'
  },
  mounted() {

  },
  methods: {
    onConfirm(value, index) {
      this.$refs.form.validate()
      let values = this.$refs.form.getValues()
      console.log(values, this.businessFormConfig.fields)
    },
  },
}
</script>
