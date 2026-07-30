<template>
  <view class="page-wrap">
    <box-title title="房屋信息" />
    <van-cell-group class="card-group">
      <van-cell title="房屋编号" :value="houseInfo.houseNo || '-'" />
      <van-cell title="房屋地址" :value="houseInfo.houseAddress || '-'" />
      <van-cell title="建筑面积" :value="houseInfo.buildArea || '-'" />
      <van-cell title="购房日期" :value="houseInfo.buyDate || '-'" />
      <van-cell title="首付金额" :value="houseInfo.downPaymentAmount ? houseInfo.downPaymentAmount + ' 元' : '-'" />
    </van-cell-group>

    <box-title title="提取人信息" />
    <view v-if="extractorList.length">
      <van-cell-group
        v-for="(item, index) in extractorList"
        :key="index"
        class="card-group extractor-card"
      >
        <van-cell title="提取人" :value="item.relation || '-'" />
        <van-cell title="税务登记号" :value="item.taxRegistrationNo || '-'" />
        <van-cell title="提取人姓名" :value="item.extractorName || '-'" />
        <van-cell title="身份证号码" :value="item.idCardNo || '-'" />
        <van-cell title="提取金额" :value="item.extractAmount ? item.extractAmount + ' 元' : '-'" />
        <van-cell title="提取时间" :value="item.extractTime || '-'" />
      </van-cell-group>
    </view>
    <van-empty v-else description="暂无提取人信息" />

    <box-title title="发票信息" />
    <van-form ref="form" :scroll-to-error="true">
      <van-form-item-map
          v-for="(item, index) in formConfig.fields"
          :key="index"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />
    </van-form>
  </view>
</template>

<script>
import mixin from '@osppm/store/person/fetch/invoiceManagement/one/mixin'

export default {
  name: 'one',
  mixins: [mixin]
}
</script>

<style scoped lang="scss">
.page-wrap {
  background: #f5f5f5;
  box-sizing: border-box;
}

.card-group {
  overflow: hidden;
}

.extractor-card {
}
</style>
