<template>
  <view class="step-container">
    <box-title :title="text.houseInfoTitle" />

    <van-form ref="form" :scroll-to-error="true">
      <template v-for="(item, index) in formConfig.houseFields">
        <view :key="index">
          <van-form-item-map v-if="!item.if || item.if(formData)" :formItemConfig.sync="item" :formData="formData" />
          <view v-if="item.name === 'buyerDocumentNo'" class="field-tip">{{ text.buyerDocumentTip }}</view>
        </view>
      </template>
    </van-form>
  </view>
</template>

<script>
import mixin from '@osppm/store/person/loan/remoteDeposit/three/mixin'

export default {
  name: 'remoteDepositThree',
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
