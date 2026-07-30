<template>
  <view class="step_container">
    <box-title title="还款录入信息" />
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
    <box-title title="申请人信息" style="margin-top: 16rpx" />
    <van-form>
      <template v-for="(item, index) in applicantFormConfig.fields">
        <van-form-item-map
          :key="'app_'+index"
          v-if="!item.if || item.if(applicantData)"
          :formItemConfig.sync="item"
          :formData="applicantData"
        />
      </template>
    </van-form>
  </view>
</template>

<script>
import mixin from '@osppm/store/person/loan/loanRepayment/overdue/two/mixin'

export default {
  name: 'OverdueRepaymentTwo',
  mixins: [mixin],
}
</script>

<style lang="less" scoped>
</style>
