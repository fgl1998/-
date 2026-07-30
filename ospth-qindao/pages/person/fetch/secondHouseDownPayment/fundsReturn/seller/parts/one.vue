<!-- 资金退回-卖方-房屋信息确认 -->
<template>
  <view>
    <van-loading v-if="loading" type="spinner" class="loading" />
    <template v-else>
      <box-title title="房屋信息" />
      <van-cell-group class="info-group">
        <van-cell title="首付款支付协议编号" :value="houseInfo.payProtocolNo || '-'" />
        <!--      <van-cell title="省" :value="houseInfo.province || '-'" />-->
        <!--      <van-cell title="市" :value="houseInfo.city || '-'" />-->
        <!--      <van-cell title="区" :value="houseInfo.area || '-'" />-->
        <van-cell title="房屋坐落" :value="houseInfo.houseAddress || '-'" />
        <!--      <van-cell title="房屋性质" :value="houseInfo.houseProperty || '-'" />-->
        <!--      <van-cell title="不动产房屋编号" :value="houseInfo.realEstateHouseNo || '-'" />-->
        <!--      <van-cell title="建成年月" :value="houseInfo.buildYearMonth || '-'" />-->
        <van-cell title="建筑面积" :value="houseInfo.buildArea || '-'" />
        <van-cell title="房屋总价" :value="houseInfo.totalPrice || '-'" />
        <van-cell title="首付金额" :value="houseInfo.downPayment || '-'" />
        <van-cell title="购房日期" :value="houseInfo.buyDate || '-'" />
        <van-cell title="转账金额" :value="200000" />
        <!--      <van-cell title="备注" :value="houseInfo.remark || '-'" />-->
        <!--      <van-cell title="是否为保障性住房" :value="houseInfo.isSecurityHouse || '-'" />-->
      </van-cell-group>

      <van-cell-group class="info-group">
        <van-form-item-map
          :formItemConfig.sync="decisionConfig"
          :formData="formData"
        />
      </van-cell-group>
    </template>
  </view>
</template>

<script>
import mixin from '@osppm/store/person/fetch/secondHouseDownPayment/fundsReturnSeller/one/mixin'

export default {
  name: 'fundsReturnSellerOne',
  mixins: [mixin],
}
</script>

<style scoped lang="scss">
.loading {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}
.info-group {
  margin-bottom: 16px;
}
</style>
