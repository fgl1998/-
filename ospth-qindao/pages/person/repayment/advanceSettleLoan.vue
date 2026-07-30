<template>
  <!--  提前结清贷款  -->
  <common-layout :title="title" :leftArrow="true" :clickLeft="clickLeft">
    <sel-loan-acc v-if="stepNum === 0" :startInit="stepNum === 0" @next="stepNum++" />
    <pay-method-info v-if="stepNum === 1" @next="goNextStep" ref="payMethodInfo"/>
    <pay-info v-if="stepNum === 2" :need-input-money="false" :init-pay-account-info="initPayAccountInfo"
      @next="(payInfo) => { payAccountInfo = payInfo;stepNum++ }"
      :need-choose-bank-card="false" :need-inp-merge-repay-bank="false">
      <template slot-scope="{info}">
        <van-cell title="提前还款本金(元)：" :value="chooseLoanInfo.loanBal | moneyFormat"></van-cell>
        <van-cell title="提前偿还利息(元)：" :value="info.advancePaymentRateMny | moneyFormat"></van-cell>
        <van-cell title="本次还款合计(元)：" :value="info.loanRepaymentAmount | moneyFormat"></van-cell>
      </template>
    </pay-info>
    <hf-phone-or-face-auth v-if="stepNum === 3" :commonBizApply="commonBizApply" @cancel="stepNum--"
      @nextStep="completed" />
    <hf-biz-evaluation v-if="stepNum === 4" :biz-apply-register-no="commonBizApply.bizApplyRegisterNo"
      :multiple-prompt="bizProcessResultPrompts" :show-evaluation="true" successText="业务提交成功">
    </hf-biz-evaluation>
  </common-layout>
</template>

<script>
import selLoanAcc from './part/selLoanAcc';
import payInfo from './part/payInfo';
import hfPhoneOrFaceAuth from '@/components/auth/hf-phone-or-face-auth';
import { PermissionAttribute } from '@/common/permission-attribute'
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'
import {REPAYMENT_BUS_TYPE, REPAYMENT_PAY_TYPE, REPAYMENT_CHG_WAY} from '@pm/common/biz-constants'
import PayMethodInfo from "./part/payMethodInfo";

export default {
  name: 'advanceSettleLoan',
  extends: PermissionAttribute,
  components: {PayMethodInfo, hfPhoneOrFaceAuth, payInfo, selLoanAcc, },
  data () {
    return {
      stepNum: -1,
      bizProcessResultPrompts: [],
      collapseValue: '',
      initPayAccountInfo: {
        // 结清金额
        loanRepaymentAmount: 0,
        // 按月还款金额
        monthlyRepaymentAmount: 0
      },
    }
  },
  computed: {
    ...mapGetters('loanRepayment', ['chooseLoanInfo']),
    ...mapState('loanRepayment', ['cardInfo', 'loanPerList']),
    title () {
      const titleArr = ['选择贷款', '选择缴款方式', '计算本息', '身份认证', '办理结果']
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
      // 实时扣款
      repaymentPayType: REPAYMENT_PAY_TYPE.REALTIME_DEDUCTIONS,
      repaymentChgWay: REPAYMENT_CHG_WAY.MONTHLY_PAYMENTS_REDUCED,
    })
  },
  methods: {
    ...mapActions('loanRepayment', ['submitRepaymentBusiness', 'loanRepaymentCalculate']),
    ...mapMutations('loanRepayment', ['initRepaymentData','saveEstimatedTime', 'setChooseLoanInfo']),
    clickLeft () {
      switch (this.stepNum) {
        case 0:
        case 4:
          this.setChooseLoanInfo('')
          this.$router.push('/businessHall')
          break
        case 1:
          // eslint-disable-next-line no-case-declarations
          const result = this.$refs.payMethodInfo.backPreNext()
          if (result) {
            this.stepNum--
          }
          break
        case 2:
          this.saveEstimatedTime(this.chooseLoanInfo.estimatedTime)
          this.stepNum--
          break
        case 3:
          break
        default:
          break
      }
    },
    async goNextStep (chooseLoanInfo) {
      if (!chooseLoanInfo.payMethod) {
        this.$toast("未获取到缴款方式!请重新选择缴款方式")
        return
      }
      // 提前结清需要先计算
      try {
        const response = await this.loanRepaymentCalculate({
          repaymentAmount: this.chooseLoanInfo.loanBal,
          ...this.commonBizApply,
        })
        const loanRepaymentAmount = parseFloat(response.loanRepaymentAmount)
        const maxMny = parseFloat(this.loanPerList[0].maxMny)
        if (chooseLoanInfo.payMethod === '03' && maxMny < loanRepaymentAmount) {
          const that = this
          that.$toast("公积金余额小于需要偿还的金额，不支持使用公积金缴款进行提前结清!请重新选择缴款方式")
          return
        }
        // 提前偿还利息
        this.initPayAccountInfo.advancePaymentRateMny = response.advancePaymentRateMny
        // 提前偿还总金额
        this.initPayAccountInfo.loanRepaymentAmount = response.loanRepaymentAmount
        this.stepNum++
      }catch (error) {
        this.$dialog.alert({title: '温馨提示', message: error})
      }
    },
    async completed () {
      try {
      const params = { ...this.commonBizApply }
      //还款本金
      params.repaymentAmount = this.chooseLoanInfo.loanBal
      //还款总额
      params.repaymentAmountTotal = this.payAccountInfo.loanRepaymentAmount
      await this.submitRepaymentBusiness(params)
      this.bizProcessResultPrompts = [
        `用户姓名：${this.userInfo.userName}`,
        `业务类型：提前结清贷款`,
        `还款金额：${this.$commonJs.format_number(this.payAccountInfo.loanRepaymentAmount)}`,
        `还款账号：${this.$commonJs.format_sen(4, 4, this.cardInfo.repaymentAccount.value)}`,
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
  },
}
</script>

<style lang="less" scoped>
.tip {
  color: #FF3B30;
  font-size: 12px;
  line-height: 1.2rem;
  padding: .75rem 16px 0;
}
</style>
