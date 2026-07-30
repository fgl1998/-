<template>
  <!--  提前部分还款  -->
  <common-layout :title="title" :leftArrow="true" :clickLeft="clickLeft">
    <sel-loan-acc v-if="stepNum === 0" :startInit="stepNum === 0" @next="stepNum++"/>
    <pay-method-info v-if="stepNum === 1" :is-show-estimated="true" @next="goNextStep" ref="payMethodInfo"/>
    <pay-info v-if="stepNum === 2" @next="(payInfo) => { payAccountInfo = payInfo; stepNum++ }">
      <template slot-scope="{info,calInfo}">
        <van-cell title="提前偿还利息(元)：" :value="info.advancePaymentRateMny | moneyFormat"></van-cell>
        <van-cell title="按月还款金额(元)：" :value="info.monthlyRepaymentAmount | moneyFormat"></van-cell>
        <van-cell title="本次还款合计(元)：" :value="info.loanRepaymentAmount | moneyFormat"></van-cell>
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
    <hf-phone-or-face-auth v-if="stepNum === 3" :commonBizApply="commonBizApply" @cancel="stepNum--" @nextStep="completed" />
    <hf-biz-evaluation v-if="stepNum === 4" :biz-apply-register-no="commonBizApply.bizApplyRegisterNo"
      :multiple-prompt="bizProcessResultPrompts" :show-evaluation="true" successText="业务提交成功">
    </hf-biz-evaluation>
  </common-layout>
</template>

<script>
import hfPhoneOrFaceAuth from '@/components/auth/hf-phone-or-face-auth';
import payMethodInfo from "./part/payMethodInfo";
import selLoanAcc from './part/selLoanAcc';
import payInfo from './part/payInfo';
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'
import {REPAYMENT_BUS_TYPE, REPAYMENT_PAY_TYPE, REPAYMENT_CHG_WAY} from '@pm/common/biz-constants'
export default {
  name: 'advancePartRepayment',
  components: {hfPhoneOrFaceAuth, payMethodInfo, payInfo, selLoanAcc, },
  data () {
    return {
      stepNum: -1,
      bizProcessResultPrompts: [],
      collapseValue: '',
      repaymentTime: '',// 实际还款时间
      reportParams: '',
    }
  },
  computed: {
    ...mapGetters('loanRepayment', ['chooseLoanInfo']),
    ...mapState('loanRepayment', ['cardInfo']),
    title() {
      const titleArr = ['选择贷款', '选择缴款方式', '计算本息', '电子签名', '身份认证', '办理结果']
      return titleArr[this.stepNum]
    },
    userInfo() {
      return this.$store.state.login.userInfo
    },
  },
  async mounted () {
    try {
      this.initRepaymentData({
        // 部分提前还款
        repaymentBusType: REPAYMENT_BUS_TYPE.PARTIAL_PREPAYMENT,
        // 事后代扣
        repaymentPayType: REPAYMENT_PAY_TYPE.EX_POST_WITHHOLDING,
        // 期限不变，月还款额减少
        repaymentChgWay: REPAYMENT_CHG_WAY.MONTHLY_PAYMENTS_REDUCED
      })
      await this.generateBizApplyRegisterNo()
      this.stepNum = 0
    }catch (error) {
      this.$dialog.alert({
        confirmButtonText: '确定',
        messageAlign: 'left',
        message: error
      }).then(() => {
        this.$router.push('/businessHall')
      })
    }
  },
  methods: {
    ...mapActions('loanRepayment', ['submitRepaymentBusiness']),
    ...mapMutations('loanRepayment', ['initRepaymentData', 'saveEstimatedTime', 'setChooseLoanInfo']),
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
        default:
          break
      }
    },
    async goNextStep (chooseLoanInfo) {
      if (!chooseLoanInfo.payMethod) {
        this.$toast("未获取到缴款方式!请重新选择缴款方式")
        await this.$router.push('/repayment')
      }
      this.repaymentTime = chooseLoanInfo.repaymentTime
      this.stepNum++
    },
    async completed () {
      try {
        const params = {...this.commonBizApply,}
        // 还款本金
        params.repaymentAmount = this.payAccountInfo.advanceRpyAmount
        // 还款总额
        params.repaymentAmountTotal = this.payAccountInfo.loanRepaymentAmount
        // 业务提交
        await this.submitRepaymentBusiness(params)

        this.bizProcessResultPrompts = [
          `用户姓名：${this.userInfo.userName}`,
          `业务类型：提前部分还款`,
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
