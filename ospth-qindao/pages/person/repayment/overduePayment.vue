<template>
  <!--  逾期还款  -->
  <common-layout :title="title" :leftArrow="true" :clickLeft="clickLeft">
    <sel-loan-acc v-if="stepNum === 0" :startInit="stepNum === 0" @next="stepNum++" />
    <pay-method-info v-if="stepNum === 1" @next="goNextStep" ref="payMethodInfo"/>
    <pay-info v-if="stepNum === 2" :startInit="stepNum === 2" :need-input-money="true"
              :init-pay-account-info="initPayAccountInfo"
              :need-choose-bank-card="false"
              :need-inp-merge-repay-bank="false"
              :needInputMoney="false"
              @next="(payInfo) => { payAccountInfo = payInfo; stepNum++ }">
      <template slot-scope="{info}">
        <van-cell title="逾期偿还本金(元)：" :value="info.advanceRpyAmount | moneyFormat"></van-cell>
        <van-cell title="逾期金额(元)：" :value="info.loanRepaymentAmount | moneyFormat"></van-cell>
      </template>
    </pay-info>
    <hf-phone-or-face-auth v-if="stepNum === 3" :commonBizApply="commonBizApply" @cancel="stepNum--"
                           @nextStep="completed" :sheet-actions="sheetActions"/>
    <hf-biz-evaluation v-if="stepNum === 4"
                       :biz-apply-register-no="commonBizApply.bizApplyRegisterNo"
                       :multiple-prompt="bizProcessResultPrompts"
                       :show-evaluation="true"
                       successText="业务受理成功">
<!--      <div slot="everyTip">该业务已通过审核，还款成功后我们将及时通知您。</div>-->
    </hf-biz-evaluation>
  </common-layout>
</template>

<script>
import hfPhoneOrFaceAuth from '@/components/auth/hf-phone-or-face-auth';
import selLoanAcc from './part/selLoanAcc';
import payInfo from './part/payInfo';
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'
import {REPAYMENT_BUS_TYPE, REPAYMENT_PAY_TYPE, REPAYMENT_CHG_WAY} from '@pm/common/biz-constants'
import PayMethodInfo from "./part/payMethodInfo";

export default {
  name: "overduePayment",
  components: {PayMethodInfo, hfPhoneOrFaceAuth, payInfo, selLoanAcc, },
  data () {
    return {
      stepNum: -1,
      bizProcessResultPrompts: [],
      collapseValue: '',
      initPayAccountInfo: {
        // 逾期金额
        loanRepaymentAmount: 0,
      },
      sheetActions: [{name: '人脸识别认证'}, {name: '原绑定手机认证'},],
    }
  },
  computed: {
    ...mapGetters('loanRepayment', ['chooseLoanInfo']),
    ...mapState('loanRepayment', ['cardInfo','loanPerList', ]),
    title() {
      const titleArr = ['选择贷款', '选择缴款方式', '计算本息', '身份认证', '办理结果']
      return titleArr[this.stepNum]
    },
    userInfo() {
      return this.$store.state.login.userInfo
    },
  },
  async mounted () {
    this.initRepaymentData({
      // 逾期还款
      repaymentBusType: REPAYMENT_BUS_TYPE.OVERDUE_PAYMENT,
      // 实时扣款
      // repaymentPayType: REPAYMENT_PAY_TYPE.REALTIME_DEDUCTIONS,
      // 期限不变，月还款额减少
      repaymentChgWay: REPAYMENT_CHG_WAY.MONTHLY_PAYMENTS_REDUCED
    })
    try {
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
    ...mapActions('loanRepayment', ['submitRepaymentBusiness', 'loanRepaymentCalculate']),
    ...mapMutations('loanRepayment', ['initRepaymentData','saveEstimatedTime']),
    clickLeft () {
      switch (this.stepNum) {
        case 0:
        case 4:
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
          this.stepNum--
          break
        default:
          break
      }
    },
    async goNextStep (chooseLoanInfo) {
      // 逾期还款需要先计算
      try {
        const response = await this.loanRepaymentCalculate({
          repaymentAmount: this.chooseLoanInfo.loanBal,
          ...this.commonBizApply,
        })
        const loanRepaymentAmount = parseFloat(response.loanRepaymentAmount)
        const maxMny = parseFloat(this.loanPerList[0].maxMny)
        console.log(maxMny, loanRepaymentAmount)
        if (chooseLoanInfo.payMethod === '03' && maxMny < loanRepaymentAmount) {
          this.$toast("公积金余额小于需要偿还的金额，不支持使用公积金余额进行逾期还款!请重新选择缴款方式")
          return
        }
        this.initPayAccountInfo.loanRepaymentAmount = loanRepaymentAmount
        this.stepNum++
      }catch (error) {
        this.$toast(error)
      }
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
          `业务类型：逾期还款`,
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
