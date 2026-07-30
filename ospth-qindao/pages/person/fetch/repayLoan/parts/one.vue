<template>
  <div>
    <box-title title="提取类型"/>
    <van-form ref="form" :scroll-to-error="true">
      <van-form-item-map
          v-for="(item, index) in formConfig.fields"
          :key="item.name"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />

      <box-title v-if="formConfig.isNotSelf(formData)" title="借款人信息"/>
      <van-form-item-map
          v-for="(item, index) in formConfig.fields3"
          :key="item.name"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />

      <box-title v-if="formConfig.isSpouseParent(formData)" title="配偶信息"/>
      <van-form-item-map
          v-for="(item, index) in formConfig.fields2"
          :key="item.name"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />
    </van-form>
  </div>
</template>
<script>
import mixin from '@osppm/store/person/fetch/repayLoan/one/mixin'

export default {
  name: 'one',
  components: {},
  mixins: [mixin],

}
</script>
<style scoped lang="scss">

</style>
