<template>
  <div>
    <van-dialog v-model="show" title="温馨提示" @confirm="$emit('close')">
      <div class="dialog_layout">
        <p class="step1_title">
          您的公积金贷款为按月还款，
          提前大额还款的同时需要先偿还当月应还本息，
          根据您输入的提前还款本金，
          请确认您本次还款的具体信息：</p>
        <p>当月应还本息：{{ $commonJs.calculateMoney([calPaymentInfo.currentPeriodIntRpy,
        calPaymentInfo.currentPeriodPrnRpy]) }}</p>
        <p>提前偿还本金：{{ $commonJs.format_number(calPaymentInfo.advanceRpyAmount) }}</p>
        <p>提前偿还利息：{{ $commonJs.format_number(calPaymentInfo.currentShouldRpyInt) }}</p>
        <p>本次还款本金：{{ $commonJs.format_number(calPaymentInfo.currentShouldRpyPrn) }}</p>
        <p>本次还款合计：{{
          $commonJs.calculateMoney([calPaymentInfo.advanceRpyAmount, calPaymentInfo.currentPeriodIntRpy,
          calPaymentInfo.currentPeriodPrnRpy])
        }}</p>
      </div>
    </van-dialog>
  </div>
</template>

<script>
export default {
  name: 'monthModal',
  props: {
    repaymentModal: {
      default: false
    },
    calPaymentInfo: {
      default: {}
    }
  },
  watch: {
    repaymentModal () {
      this.show = this.repaymentModal
    }
  },
  data () {
    return {
      show: false,
    }
  },
}
</script>

<style lang="less" scoped>
.dialog_layout {
  padding: 16px;
  font-size: 14px;
  line-height: 25px;
}
</style>
