<template>
  <view>
    <box-title title="原贷款信息"/>
    <van-form ref="form" :scroll-to-error="true">
      <van-form-item-map
          v-for="(item, index) in formConfig.fields"
          :key="index"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />
    </van-form>
    <box-title title="新贷款信息"/>
    <van-notice-bar color="#1677ff" background="#cce1ff" left-icon="info-o">
      非 Ⅰ 类银行卡易受交易限额限制，影响正常还款扣款。
    </van-notice-bar>
    <van-form ref="form" :scroll-to-error="true">
      <van-form-item-map
          v-for="(item, index) in formConfig.fields2"
          :key="index"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />
    </van-form>
  </view>
</template>
<script>
import mixin from '@osppm/store/person/loan/loanRepaymentAccountChange/one/mixin'

export default {
  name: 'one',
  mixins: [mixin],
}
</script>
<style scoped lang="scss">

</style>
