<!-- 提取金额 -->
<template>
  <view>
    <van-form ref="form" :scroll-to-error="true">
      <template v-if="extractType === '2'">
        <box-title title="提取身份"/>
        <van-form-item-map
          v-for="(item, index) in identityFields"
          :key="`identity-${index}`"
          :formItemConfig.sync="item"
          :formData="formData"
        />
      </template>

      <box-title title="提取金额"/>
      <van-form-item-map
        v-for="(item, index) in amountFields"
        :key="`amount-${index}`"
        :formItemConfig.sync="item"
        :formData="formData"
      />

      <box-title title="银行卡信息"/>
      <van-form-item-map
        v-for="(item, index) in bankFields"
        :key="`bank-${index}`"
        :formItemConfig.sync="item"
        :formData="formData"
      />
    </van-form>

    <fetch-bank-info v-if="formData.skzh === '-1'" @cancel="cancelAddBankCard" @add="addBankCard"/>
  </view>
</template>

<script>
import mixin from '@osppm/store/person/fetch/rent/two/mixin'
import fetchBankInfo from '@/pages/person/fetch/commonParts/fetchBankInfo.vue'
import { mapState } from 'vuex'

export default {
  name: 'two',
  components: { fetchBankInfo },
  mixins: [mixin],
  computed: {
    ...mapState('rent', ['extractType']),
    identityFields() {
      return this.formConfig.fields.filter(item => item.group === 'identity' && (!item.if || item.if(this.formData)))
    },
    amountFields() {
      return this.formConfig.fields.filter(item => item.group === 'amount' && (!item.if || item.if(this.formData)))
    },
    bankFields() {
      return this.formConfig.fields.filter(item => item.group === 'bank' && (!item.if || item.if(this.formData)))
    }
  },
  created() {
    if (this.extractType === '2' && !this.formData.identityType) {
      this.$set(this.formData, 'identityType', '1')
    }
  }
}
</script>

<style scoped lang="scss">
</style>
