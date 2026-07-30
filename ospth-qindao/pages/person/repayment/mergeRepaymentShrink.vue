<template>
  <!--  组合还贷缩期  -->
  <common-layout :title="title" :leftArrow="true" :clickLeft="clickLeft">
    <sel-loan-acc v-show="stepNum === 0" :startInit="stepNum === 0"
      :agreementTypeArr="['YEHDQSTSCGJJDK']" @next="val => { chooseLoanInfo = val; stepNum++ }" />
    <pay-info v-show="stepNum === 1" ref="payInfo" :startInit="stepNum === 1"  :needInpMergeRepayBank="true" @next="payInfoNext">
      <template slot-scope="{info,calInfo}">
        <van-cell title="提前偿还利息(元)：" :value="info.advancePaymentRateMny | moneyFormat" />
        <van-cell title="本次还款合计(元)：" :value="info.loanRepaymentAmount | moneyFormat" />
        <van-collapse accordion v-model="collapseValue">
          <van-collapse-item :name="1" title="查看还款计划变更">
            <van-cell title="还款后下月应还本金(元)：" :value="calInfo.nextMonthRepaymentPrincipal | moneyFormat" />
            <van-cell title="还款后下月应还利息(元)：" :value="calInfo.nextMonthRateMny | moneyFormat" />
            <van-cell title="还款后下月应还总额(元)：" :value="calInfo.nextMonthRepaymentTotal | moneyFormat" />
            <van-cell title="还款后还款期数：" :value="calInfo.repaymentAftLoanMonth" />
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
import { PermissionAttribute } from '@/common/permission-attribute'
import hfPhoneOrFaceAuth from '@/components/auth/hf-phone-or-face-auth'
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'
import {REPAYMENT_BUS_TYPE, REPAYMENT_CHG_WAY, REPAYMENT_PAY_TYPE} from '@pm/common/biz-constants'
export default {
  name: 'mergeRepaymentShrink',
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
      const titleArr = ['选择贷款', '计算本息', '身份认证', '办理结果']
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
      // 期限缩短，月还款额不变
      repaymentChgWay: REPAYMENT_CHG_WAY.TERM_SHORTENED,
      // 公积金+实时扣款
      repaymentPayType: REPAYMENT_PAY_TYPE.CPF_REALTIME_DEDUCTION
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
    payInfoNext (payInfo, calPaymentInfo) {
      if (payInfo.mergeRepayBank === '' || payInfo.mergeRepayGjj === '') {
        this.$toast('请录入银行卡还款金额')
        return
      }
      if (this.$commonJs.calculateMoney([payInfo.mergeRepayBank, payInfo.mergeRepayGjj]) !== payInfo.loanRepaymentAmount) {
        this.$toast('请重新录入银行卡还款金额')
        return
      }
      this.payAccountInfo = { ...payInfo, ...this.payAccountInfo }
      this.calPaymentInfo = calPaymentInfo
      this.stepNum ++
    },
    async completed () {
      try {
      const params = { ...this.commonBizApply, }
      params.repaymentAmount = this.payAccountInfo.advanceRpyAmount
      params.repaymentAmountTotal = this.payAccountInfo.loanRepaymentAmount
      params.repaymentAmountOfGjj = this.payAccountInfo.mergeRepayGjj
      await this.submitRepaymentBusiness(params)
      this.bizProcessResultPrompts = [
        `用户姓名：${this.userInfo.userName}`,
        `业务类型：组合还贷缩期`,
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
