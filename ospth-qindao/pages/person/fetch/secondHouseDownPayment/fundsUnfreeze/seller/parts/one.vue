<!-- 资金解冻-卖方-查询不动产信息 -->
<template>
  <view>
    <van-form ref="form" :scroll-to-error="true">
      <box-title title="查询条件" />
      <van-form-item-map
        v-for="(item, index) in formConfig.fields"
        :key="index"
        :formItemConfig.sync="item"
        :formData="formData"
      />
    </van-form>
  </view>
</template>

<script>
import mixin from '@osppm/store/person/fetch/secondHouseDownPayment/fundsUnfreezeSeller/one/mixin'

export default {
  name: 'fundsUnfreezeSellerOne',
  mixins: [mixin],
}
</script>
