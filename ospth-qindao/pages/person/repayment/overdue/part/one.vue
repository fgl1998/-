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
    <box-title title="逾期/欠还信息" style="margin-top: 16rpx" />
    <van-form>
      <template v-for="(item, index) in overdueFormConfig.fields">
        <van-form-item-map
          :key="'od_'+index"
          v-if="!item.if || item.if(overdueData)"
          :formItemConfig.sync="item"
          :formData="overdueData"
        />
      </template>
    </van-form>
  </view>
</template>

<script>
import mixin from '@osppm/store/person/loan/loanRepayment/overdue/one/mixin'

export default {
  name: 'OverdueRepaymentOne',
  mixins: [mixin],
}
</script>

<style lang="less" scoped>
</style>
