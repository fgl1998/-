<template>
  <!--  余额结清贷款  -->
  <common-layout :title="title" :leftArrow="true" :clickLeft="clickLeft">
    <sel-loan-acc v-if="stepNum === 0" :startInit="stepNum === 0"
       :agreementTypeArr="['YEJQDKTSCGJJDK']"
      @next="val => { chooseLoanInfo = val; stepNum++ }" />
    <pay-info v-if="stepNum === 1" :startInit="stepNum === 1" :needChooseBankCard="false"
      :needInputMoney="false" @next="(payInfo) => { payAccountInfo = payInfo; stepNum++ }">
      <template slot-scope="{info}">
        <van-cell title="提前还款本金(元)："
          :value="chooseLoanInfo.loanBal | moneyFormat"></van-cell>
        <van-cell title="提前偿还利息(元)：" :value="info.advancePaymentRateMny | moneyFormat"></van-cell>
        <van-cell title="本次还款合计(元)：" :value="info.loanRepaymentAmount | moneyFormat"></van-cell>
      </template>
    </pay-info>
    <hf-phone-or-face-auth v-if="stepNum === 2" :commonBizApply="commonBizApply" @cancel="stepNum--"
      @nextStep="completed" />
    <hf-biz-evaluation v-if="stepNum === 3" :biz-apply-register-no="commonBizApply.bizApplyRegisterNo"
      :multiple-prompt="bizProcessResultPrompts" :show-evaluation="true" successText="业务受理成功">
    </hf-biz-evaluation>
  </common-layout>
</template>

<script>
import selLoanAcc from './part/selLoanAcc';
import payInfo from './part/payInfo';
import { PermissionAttribute } from '@/common/permission-attribute'
import hfPhoneOrFaceAuth from '@/components/auth/hf-phone-or-face-auth';
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'
import {REPAYMENT_BUS_TYPE, REPAYMENT_CHG_WAY, REPAYMENT_PAY_TYPE} from '@pm/common/biz-constants'
export default {
  name: 'balanceSettleLoan',
  extends: PermissionAttribute,
  components: { hfPhoneOrFaceAuth, payInfo, selLoanAcc, },
  data () {
    return {
      stepNum: -1,
      bizProcessResultPrompts: [],
      collapseValue: '',
    }
  },
  computed: {
    ...mapGetters('loanRepayment', ['chooseLoanInfo']),
    title () {
      const titleArr = ['选择贷款', '计算本息', '身份认证', '办理结果']
      return titleArr[this.stepNum]
    },
    ...mapState('login', ['userInfo']),
  },
  async mounted () {
    this.generateBizApplyRegisterNo().then(() => {
      this.stepNum = 0
    })
    this.initRepaymentData({
      // 提前结清
      repaymentBusType: REPAYMENT_BUS_TYPE.SETTLE_EARLY,
      // 公积金
      repaymentPayType: REPAYMENT_PAY_TYPE.ACCUMULATION_FUND,
      repaymentChgWay:REPAYMENT_CHG_WAY.MONTHLY_PAYMENTS_REDUCED
    })
  },
  methods: {
    ...mapActions('loanRepayment', ['submitRepaymentBusiness']),
    ...mapMutations('loanRepayment', ['initRepaymentData']),
    clickLeft () {
      if (this.stepNum === 0 || this.stepNum === 3) {
        this.$router.push('/businessHall')
      } else {
        this.stepNum--
      }
    },
    async completed () {
      try {
      const params = { ...this.commonBizApply, }
      // 还款本金
      params.repaymentAmount = this.payAccountInfo.advanceRpyAmount
      // 公积金还款金额
      params.repaymentAmountOfGjj = this.payAccountInfo.loanRepaymentAmount
      // 还款总额
      params.repaymentAmountTotal = this.payAccountInfo.loanRepaymentAmount
      await this.submitRepaymentBusiness(params)
      this.bizProcessResultPrompts = [
        `用户姓名：${this.userInfo.userName}`,
        `业务类型：余额结清贷款`,
        `还款金额：${this.$commonJs.format_number(this.payAccountInfo.loanRepaymentAmount)}`,
        `还款账号：${this.$commonJs.format_sen(4, 4, this.chooseLoanInfo.repaymentAccount)}`,
      ]
      this.stepNum++
      } catch (e) {
        this.$dialog.alert({
          confirmButtonText: '确定',
          messageAlign: 'left',
          message: e
        }).then(() => {
          this.$router.push('/businessHall')
        })
      }
    },
  }
}
</script>

<style lang="less" scoped>
</style>
