<template>
  <view class="step-container">
<!--    <box-title :title="text.contactInfoTitle" />-->

    <van-form ref="form" :scroll-to-error="true">
<!--      <template v-for="(item, index) in formConfig.contactFields">-->
<!--        <view :key="`contact-${index}`">-->
<!--          <van-form-item-map-->
<!--            v-if="!item.if || item.if(formData)"-->
<!--            :formItemConfig.sync="item"-->
<!--            :formData="formData"-->
<!--          />-->
<!--          <view v-if="item.name === 'fixedPhone'" class="field-tip">{{ text.fixedPhoneTip }}</view>-->
<!--        </view>-->
<!--      </template>-->

      <box-title :title="text.depositInfoTitle" />

      <template v-for="(item, index) in formConfig.depositFields">
        <view :key="`deposit-${index}`">
          <van-form-item-map
            v-if="!item.if || item.if(formData)"
            :formItemConfig.sync="item"
            :formData="formData"
          />
<!--          <view v-if="item.name === 'latestContinuousDepositStartMonth'" class="field-tip">-->
<!--            {{ text.depositTip }}-->
<!--          </view>-->
        </view>
      </template>
    </van-form>
  </view>
</template>

<script>
import mixin from '@osppm/store/person/loan/remoteDeposit/two/mixin'

export default {
  name: 'remoteDepositTwo',
  mixins: [mixin],
}
</script>

<style scoped lang="scss">
.step-container {
  padding: 0 0 24rpx;
}

.field-tip {
  padding: 0 24rpx 24rpx;
  font-size: 24rpx;
  line-height: 1.6;
  color: #8c8c8c;
}
</style>
