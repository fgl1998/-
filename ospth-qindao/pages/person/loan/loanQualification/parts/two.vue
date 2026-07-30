<!-- two -->
<template>
  <view class="step-container">
    <box-title :title="text.commercialLoanTitle" />
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
import mixin from '@osppm/store/person/loan/loanQualification/two/mixin'

export default {
  name: 'two',
  components: {},
  mixins: [mixin],
  data() {
    return {}
  },
  computed: {},
  watch: {},
  methods: {},
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

.field-tip {
  padding: 0 24rpx 24rpx;
  font-size: 24rpx;
  line-height: 1.6;
  color: #8c8c8c;
}
</style>
