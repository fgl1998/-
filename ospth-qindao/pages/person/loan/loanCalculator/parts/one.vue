<template>
  <view class="step_container">
    <box-title title="房屋信息" />
    <van-form ref="houseForm">
      <template v-for="(item, index) in formConfig.houseFields">
        <van-form-item-map
          :key="'house_' + index"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
          @change="onHouseFieldChange(item.name)"
        />
      </template>
    </van-form>

    <box-title title="借款人信息" />
    <van-form ref="borrowerForm">
      <template v-for="(item, index) in formConfig.borrowerFields">
        <van-form-item-map
          :key="'borrower_' + index"
          :formItemConfig.sync="item"
          :formData="formData"
          @change="onBorrowerFieldChange(item.name)"
        />
      </template>
    </van-form>

    <template v-if="showSpouse">
      <box-title title="借款人配偶信息" />
      <van-form ref="spouseForm">
        <template v-for="(item, index) in formConfig.spouseFields">
          <van-form-item-map
            :key="'spouse_' + index"
            :formItemConfig.sync="item"
            :formData="formData"
            @change="onBorrowerFieldChange(item.name)"
          />
        </template>
      </van-form>
    </template>

    <template v-if="formData.zgkdje">
      <box-title title="最高可贷信息" />
      <van-cell-group>
        <van-cell title="最高可贷金额" :value="formData.zgkdje + ' 元'" />
        <van-cell title="最高可贷年限" :value="formData.zgkdqx + ' 年'" />
      </van-cell-group>
    </template>
  </view>
</template>

<script>
import mixin from '@osppm/store/person/loan/loanCalculator/one/mixin'

export default {
  name: 'LoanCalculatorOne',
  mixins: [mixin],
}
</script>

<style lang="less" scoped>
</style>
