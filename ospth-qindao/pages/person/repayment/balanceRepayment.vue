<template>
  <!--  余额还贷  -->
  <common-layout :title="title" :leftArrow="true" :clickLeft="clickLeft">
    <sel-loan-acc v-if="stepNum === 0" :startInit="stepNum === 0"
       :agreementTypeArr="['YEHDTSCGJJDK']" @next="val => { chooseLoanInfo = val; stepNum++ }" />
    <pay-info v-if="stepNum === 1" :startInit="stepNum === 1" :needChooseBankCard="false"
      @next="(payInfo) => { payAccountInfo = payInfo; stepNum++ }">
      <template slot-scope="{info,calInfo}">
        <van-cell title="提前偿还利息(元)：" :value="info.advancePaymentRateMny | moneyFormat"></van-cell>
        <van-cell title="本次还款合计(元)：" :value="info.loanRepaymentAmount | moneyFormat"></van-cell>
<!--        <van-cell title="按月还款金额(元)：" :value="info.monthlyRepaymentConstant | moneyFormat"></van-cell>-->
        <van-collapse accordion v-model="collapseValue">
          <van-collapse-item :name="1" title="查看还款计划变更">
            <van-cell title="还款后下月应还本金(元)："
              :value="calInfo.nextMonthRepaymentPrincipal | moneyFormat"></van-cell>
            <van-cell title="还款后下月应还利息(元)：" :value="calInfo.nextMonthRateMny | moneyFormat"></van-cell>
            <van-cell title="还款后下月应还总额(元)：" :value="calInfo.nextMonthRepaymentTotal | moneyFormat"></van-cell>
            <van-cell title="还款后还款期数：" :value="calInfo.repaymentAftLoanMonth"></van-cell>
            <p class="tip">下月应还款额仅供参考，如遇人民银行利率调整按规定进行调整</p>
          </van-collapse-item>
        </van-collapse>
        <p class="tip"> 注：以上结果未考虑本次还款业务后再发生提前还款、利率变动等因素</p>
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
import {mapActions, mapGetters, mapMutations} from 'vuex'
import {REPAYMENT_BUS_TYPE, REPAYMENT_CHG_WAY, REPAYMENT_PAY_TYPE} from '@pm/common/biz-constants'
export default {
  name: 'balanceRepayment',
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
      // 部分提前还款
      repaymentBusType: REPAYMENT_BUS_TYPE.PARTIAL_PREPAYMENT,
      // 期限不变，月还款额减少
      repaymentChgWay: REPAYMENT_CHG_WAY.MONTHLY_PAYMENTS_REDUCED,
      // 公积金
      repaymentPayType: REPAYMENT_PAY_TYPE.ACCUMULATION_FUND
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
      const params = { ...this.commonBizApply }
      //还款本金
      params.repaymentAmount = this.payAccountInfo.advanceRpyAmount
      // 公积金冲还金额
      params.repaymentAmountOfGjj = this.payAccountInfo.loanRepaymentAmount
      //还款总额
      params.repaymentAmountTotal = this.payAccountInfo.loanRepaymentAmount
      await this.submitRepaymentBusiness(params)
      this.bizProcessResultPrompts = [
        `用户姓名：${this.userInfo.userName}`,
        `业务类型：余额部分还款`,
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
.tip {
  color: #FF3B30;
  font-size: 12px;
  line-height: 1.2rem;
  padding: .75rem 16px 0;
}
</style>
