<template>
  <div>
    <box-title title="提取金额"/>
    <van-form ref="form" :scroll-to-error="true">
      <van-form-item-map
          v-for="(item, index) in formConfig.fields"
          :key="index"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />
    </van-form>

    <fetch-bank-info v-if="formData.skzh === '-1'" @cancel="cancelAddBankCard" @add="addBankCard"/>
  </div>
</template>
<script>
import mixin from '@osppm/store/person/fetch/repayLoan/four/mixin'
import fetchBankInfo from '@/pages/person/fetch/commonParts/fetchBankInfo.vue'

export default {
  name: 'three',
  components: {fetchBankInfo},
  mixins: [mixin],
}
</script>
<style scoped lang="scss">

</style>
