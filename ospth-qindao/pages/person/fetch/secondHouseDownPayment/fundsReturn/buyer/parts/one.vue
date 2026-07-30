<!-- 资金退回-买方-查询房屋信息 -->
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
import mixin from '@osppm/store/person/fetch/secondHouseDownPayment/fundsReturnBuyer/one/mixin'

export default {
  name: 'fundsReturnBuyerOne',
  mixins: [mixin],
}
</script>
