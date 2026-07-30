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
    <van-form ref="form" :scroll-to-error="true">
      <van-form-item-map
          v-for="(item, index) in formConfig.fields2"
          :key="index"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />
    </van-form>
    <view style="color: #1677ff;text-align: right;margin-top: 24rpx">查看还款计划</view>
  </view>
</template>
<script>
import mixin from '@osppm/store/person/loan/loanRepaymentMethodChange/one/mixin'

export default {
  name: 'one',
  mixins: [mixin],
}
</script>
<style scoped lang="scss">

</style>
