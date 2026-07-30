<template>
  <view class="step-container">
<!--    <box-title :title="text.lookupTitle" />-->
<!--    <van-notice-bar color="#1677ff" background="#cce1ff" left-icon="info-o">-->
<!--      {{ text.lookupTip }}-->
<!--    </van-notice-bar>-->
<!--    <van-field-->
<!--      v-model="formData.personalInfoCode"-->
<!--      :label="text.personalInfoCode"-->
<!--      name="personalInfoCode"-->
<!--      label-width="220rpx"-->
<!--      input-align="right"-->
<!--      maxlength="32"-->
<!--      :placeholder="getPlaceholder(text.personalInfoCode, false)"-->
<!--    />-->

<!--    <view class="action-row">-->
<!--      <van-button class="action-btn action-btn-plain" plain hairline size="small" type="info" @click="openGuide">-->
<!--        {{ text.operationGuide }}-->
<!--      </van-button>-->
<!--      <van-button class="action-btn" size="small" type="info" @click="handleLookup">-->
<!--        {{ text.lookupAction }}-->
<!--      </van-button>-->
<!--    </view>-->
    <box-title :title="text.basicInfoTitle" />

    <van-form ref="form" :scroll-to-error="true" :show-error="false" :show-error-message="true">
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
import mixin from '@osppm/store/person/loan/remoteDeposit/one/mixin'

export default {
  name: 'remoteDepositOne',
  mixins: [mixin],
}
</script>

<style scoped lang="scss">
.step-container {
  padding: 0 0 24rpx;
}

.action-row {
  display: flex;
  padding: 0 24rpx 16rpx;
}

.action-btn {
  flex: 1;
}

.action-btn + .action-btn {
  margin-left: 16rpx;
}
</style>
