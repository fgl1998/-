<template>
  <!--  组合结清贷款  -->
  <common-layout :title="title" :leftArrow="true" :clickLeft="clickLeft">
    <sel-loan-acc v-show="stepNum === 0" :startInit="stepNum === 0"
      :agreementTypeArr="['YEJQDKTSCGJJDK']" @next="val => { chooseLoanInfo = val; stepNum++ }" />
    <pay-info v-show="stepNum === 1" ref="payInfo" :startInit="stepNum === 1"
      :needInputMoney="false" :needInpMergeRepayBank="true" @next="payInfoNext">
      <template slot-scope="{info}">
        <van-cell title="提前偿还利息(元)：" :value="info.advancePaymentRateMny | moneyFormat" />
        <van-cell title="本次还款合计(元)：" :value="info.loanRepaymentAmount | moneyFormat" />
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
import hfPhoneOrFaceAuth from '@/components/auth/hf-phone-or-face-auth';
import { PermissionAttribute } from '@/common/permission-attribute'
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'
import {REPAYMENT_BUS_TYPE, REPAYMENT_CHG_WAY, REPAYMENT_PAY_TYPE} from '@pm/common/biz-constants'
export default {
  name: 'mergeSettleLoan',
  extends: PermissionAttribute,
  components: { hfPhoneOrFaceAuth, payInfo, selLoanAcc },
  data () {
    return {
      stepNum: -1,
      bizProcessResultPrompts: [],
      collapseValue: '',
      calPaymentInfo: {},
      payAccountInfo: { mergeRepayGjj: '' },
    }
  },
  computed: {
    ...mapGetters('loanRepayment', ['chooseLoanInfo']),
    ...mapState('loanRepayment', ['cardInfo']),
    title () {
      const titleArr = ['选择贷款', '计算本息', '办理结果']
      return titleArr[this.stepNum]
    },
    userInfo () {
      return this.$store.state.login.userInfo
    },
  },
  async mounted () {
    this.generateBizApplyRegisterNo().then(() => {
      this.stepNum = 0
    })
    this.initRepaymentData({
      // 提前结清
      repaymentBusType: REPAYMENT_BUS_TYPE.SETTLE_EARLY,
      // 公积金+实时扣款
      repaymentPayType: REPAYMENT_PAY_TYPE.CPF_REALTIME_DEDUCTION,
    // 期限不变，月还款额减少
    repaymentChgWay: REPAYMENT_CHG_WAY.MONTHLY_PAYMENTS_REDUCED,
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
    async chooseAgreeFn (chooseLoanInfo) {
      if (chooseLoanInfo.loanCategory && chooseLoanInfo.loanCategory.code === '01') {
        return 0
      } else {
        return 1
      }
    },
    formatter (val) {
      let rtnVal = val
      rtnVal = rtnVal.replaceAll('-', '')
      rtnVal = rtnVal === '' ? 0 : parseFloat(rtnVal)
      if (val.includes('.') && val[val.length - 1] === '.' && val.indexOf('.') === val.lastIndexOf('.')) {
        rtnVal += '.'
      }
      const rtnValArr = (rtnVal + '').split('.')
      if (rtnValArr[1] && rtnValArr[1].length > 2) {
        rtnValArr[1] = rtnValArr[1].slice(0, 2)
        rtnVal = rtnValArr.join('.')
      }
      if (this.chooseLoanInfo && rtnVal > this.chooseLoanInfo.loanBal) {
        this.$toast('提前还款本金不能超过贷款余额')
        rtnVal = 0
      }
      return rtnVal
    },
    payInfoNext (payInfo, card, calPaymentInfo) {
      if (payInfo.mergeRepayBank === '' || payInfo.mergeRepayGjj === '') {
        this.$toast('请录入银行卡还款金额')
        return
      }
      if (this.$commonJs.calculateMoney([payInfo.mergeRepayBank, payInfo.mergeRepayGjj]) !== payInfo.loanRepaymentAmount) {
        this.$toast('请重新录入银行卡还款金额')
        return
      }
      this.payAccountInfo = { ...payInfo, ...this.payAccountInfo }
      this.selBankCard = card
      this.calPaymentInfo = calPaymentInfo
      this.stepNum++
    },
    async completed () {
      try {
      const params = { ...this.commonBizApply }
      params.repaymentAmount = this.chooseLoanInfo.loanBal
      params.repaymentAmountTotal = this.payAccountInfo.loanRepaymentAmount
      params.repaymentAmountOfGjj = this.payAccountInfo.mergeRepayGjj
      await this.submitRepaymentBusiness(params)
      this.bizProcessResultPrompts = [
        `用户姓名：${this.userInfo.userName}`,
        `业务类型：组合结清贷款`,
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

<style lang="less" scoped></style>
