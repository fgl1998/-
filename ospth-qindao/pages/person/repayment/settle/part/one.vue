<template>
  <view class="step_container">
    <box-title title="当前贷款信息" />
    <van-form ref="form" :scroll-to-error="true">
      <template v-for="(item, index) in formConfig.fields">
        <van-form-item-map
          :key="index"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
        />
      </template>
    </van-form>
  </view>
</template>

<script>
import mixin from '@osppm/store/person/loan/loanRepayment/settle/one/mixin'

export default {
  name: 'SettleRepaymentOne',
  mixins: [mixin],
}
</script>

<style lang="less" scoped>
</style>
