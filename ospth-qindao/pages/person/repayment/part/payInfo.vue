<template>
  <div class="content">
    <div>
      <div class="box">
        <van-cell v-if="!needInputMoney" title="公积金贷款余额(元)：" :value="chooseLoanInfo.loanBal | moneyFormat"/>
        <p v-if="needInputMoney" class="money-tip">请输入还款金额</p>
        <div class="money-box" v-if="needInputMoney">
          <van-field v-model="payAccountInfo.advanceRpyAmount" ref="moneyRef" type="number"
                     :formatter="formatter" class="money-input" @blur="inputBlur">
            <span slot="left-icon" class="money-icon">￥</span>
          </van-field>
          <div class="placeholder" v-if="needInputMoney && payAccountInfo.advanceRpyAmount === ''" @click="onClick">
            {{ `最大还款金额${chooseLoanInfo?chooseLoanInfo.loanBal :''}元` }}
          </div>
        </div>
        <slot :info="payAccountInfo" :calInfo="calPaymentInfo"/>
      </div>
      <yunXinQian ref="yunXinQian"
                  v-if="reportParams"
                  :value="payAccountInfo.signFlag"
                  :reportParams="reportParamsFormat"
                  :loanFlag="true"
                  :reportTitle="this.reportTitle"
                  @input="(value)=> payAccountInfo.signFlag = value"
      />
    </div>
    <hf-next-btn @nextStep="goNextStep"/>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'
import YunXinQian from '@/components/yunXinQian/index.vue'

const defaultCalPaymentInfo = {
  nextMonthRepaymentPrincipal: 0,
  nextMonthRateMny: 0,
  nextMonthRepaymentTotal: 0,
  repaymentAftLoanMonth: 0,
}
const defaultPayAccountInfo = {
  // 提前还款本金
  advanceRpyAmount: '',
  // 提前还款利息
  advancePaymentRateMny: '',
  // 贷款偿还金额
  loanRepaymentAmount: '',
  // 按月还款金额
  monthlyRepaymentConstant: '',
}
export default {
  name: 'payInfo',
  components: { YunXinQian },
  props: {
    startInit: {
      default: false,
    },
    // 是否需要输入提取金额
    needInputMoney: {
      default: true
    },
    initPayAccountInfo: {
      required: false,
      type: Object,
    },
  },
  mounted() {
    const repaymentBusType = this.repaymentBusType.value
    //逾期-最大还款金额就是逾期金额(公积金和银行卡都是一样)
    if (!this.needInputMoney) {
      this.payAccountInfo.advanceRpyAmount = this.chooseLoanInfo.loanBal
      if (repaymentBusType === '04') {
        this.payAccountInfo.advancePaymentRateMny = this.initPayAccountInfo.advancePaymentRateMny
        this.payAccountInfo.loanRepaymentAmount = this.initPayAccountInfo.loanRepaymentAmount
      }
      if (repaymentBusType === '02') {
        this.payAccountInfo.advanceRpyAmount = this.initPayAccountInfo.loanRepaymentAmount
        this.payAccountInfo.loanRepaymentAmount = this.initPayAccountInfo.loanRepaymentAmount
      }
    }
    if (this.startInit && !this.needInputMoney) {
      this.calculate()
    }
    // 不等于按月还款
    if (repaymentBusType !== '01') {
      this.reportParams = this.reportParamsFormat()
    }else {
      this.reportParams = undefined
    }
  },
  data () {
    return {
      payAccountInfo: {
        // 提前还款本金
        advanceRpyAmount: '',
        // 提前还款利息
        advancePaymentRateMny: '',
        // 贷款偿还金额
        loanRepaymentAmount: '',
        // 按月还款金额
        monthlyRepaymentConstant: '',
      },
      calPaymentInfo: defaultCalPaymentInfo,
      recordMoney: null,
      reportParams: undefined,
      showReport: false
    }
  },
  computed: {
    ...mapGetters('loanRepayment',['chooseLoanInfo']),
    ...mapState('loanRepayment',['cardInfo', 'repaymentBusType', 'repaymentPayType', 'repaymentChgWay', 'reportTitle'])
  },
  methods: {
    ...mapActions('loanRepayment', ['loanRepaymentCalculate', 'downloadReportParam', 'verifyReportData']),
    ...mapMutations('loanRepayment', ['saveEstimatedTime']),
    async goNextStep () {
      if (this.needInputMoney && (!this.payAccountInfo.advanceRpyAmount || this.payAccountInfo.advanceRpyAmount === '0')) {
        this.$toast('请先输入提前还款本金')
        return
      }
      if (this.needInputMoney && this.payAccountInfo.advanceRpyAmount !== this.recordMoney) {
        await this.calculate()
      }
      if (!this.payAccountInfo.signFlag && this.repaymentBusType.value !== '01') {
        this.$toast.fail(`请勾选《${this.reportTitle}》`)
        return
      }
      const result = await this.verifyReportData({...this.commonBizApply, ...this.calPaymentInfo, ...this.payAccountInfo})
      if (!result && this.repaymentBusType.value !== '01') {
        this.$refs.yunXinQian.signFlag = false
        this.$toast.fail("提交的数据与报表中的数据不匹配，请重新进行报表电子")
      }else {
        this.$emit('next', this.payAccountInfo)
      }
    },
    inputBlur () {
      this.payAccountInfo.advanceRpyAmount = parseFloat(this.payAccountInfo.advanceRpyAmount)
      this.calculate()
    },
    formatter (val) {
      let rtnVal = val
      rtnVal = rtnVal.replaceAll('-', '')
      rtnVal = rtnVal === '' ? '' : parseFloat(rtnVal)
      if (val.includes('.') && val[val.length - 1] === '.' && val.indexOf('.') === val.lastIndexOf('.')) {
        rtnVal += '.'
      } else if (val.includes('.') && val[val.length - 1] === '0' && val.indexOf('.') === val.lastIndexOf('.')) {
        rtnVal += '.0'
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
    calculate () {
      return new Promise(async (resolve, reject) => {
        // 还款本金
        if ((!this.payAccountInfo.advanceRpyAmount)) {
          this.calPaymentInfo = defaultCalPaymentInfo
          this.payAccountInfo = defaultPayAccountInfo
          reject()
          return
        }
        if (this.payAccountInfo.advanceRpyAmount < 0) {
          this.$toast('提前还款本金不能小于0')
          reject()
          return
        }
        const repaymentBusType = this.repaymentBusType.value
        if (repaymentBusType === '03') {
          if ((this.payAccountInfo.advanceRpyAmount % 10000) !== 0) {
            this.$toast('提前还款本金只能是10000的整数倍')
            return
          }
        }
        // 逾期还款
        if (repaymentBusType === '02'){
          if (this.payAccountInfo.advanceRpyAmount > this.initPayAccountInfo.loanRepaymentAmount) {
            this.$toast('提前还款本金不能超过逾期金额')
            this.payAccountInfo.advanceRpyAmount = this.initPayAccountInfo.loanRepaymentAmount
            return
          }
        }
        if (this.repaymentPayType === '05') {
          this.saveEstimatedTime(this.chooseLoanInfo.repaymentTime)
        }
        if (repaymentBusType !== '02' && repaymentBusType !== '04') { // 不是逾期还款和提前结清
          try {
            let response = await this.loanRepaymentCalculate({
              repaymentAmount: this.payAccountInfo.advanceRpyAmount,
              ...this.commonBizApply
            })
            this.calPaymentInfo = response
            this.recordMoney = this.payAccountInfo.advanceRpyAmount
            this.payAccountInfo.advancePaymentRateMny = response.advancePaymentRateMny
            this.payAccountInfo.loanRepaymentAmount = response.loanRepaymentAmount
            this.payAccountInfo.monthlyRepaymentAmount = response.monthlyRepaymentAmount
            this.payAccountInfo.monthlyRepaymentConstant = response.monthlyRepaymentConstant
            resolve()
          }catch (error) {
            this.$dialog.alert({title: '温馨提示', message: error})
            this.payAccountInfo.advancePaymentRateMny = 0
            this.payAccountInfo.loanRepaymentAmount = 0
            this.payAccountInfo.advanceRpyAmount = ''
            this.payAccountInfo.monthlyRepaymentConstant = ''
            this.calPaymentInfo = {
              nextMonthRepaymentPrincipal: 0,
              nextMonthRateMny: 0,
              nextMonthRepaymentTotal: 0,
              repaymentAftLoanMonth: 0,
            }
          }
        }else {
          resolve()
        }
      })
    },
    onClick () {
      this.$refs.moneyRef.focus()
    },
    reportParamsFormat() {
      return this.downloadReportParam({...this.commonBizApply, ...this.calPaymentInfo, ...this.payAccountInfo})
    }
  },
}
</script>

<style lang="less" scoped>
.content{
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
}

.box {
  width: calc(100% - 20px);
  margin: 14px auto;
  border-radius: 8px;
  background: #fff;
  padding: 0 0 16px;
  overflow: hidden;
}

.money-input {
  font-size: 30px;
  /deep/ .van-field__left-icon {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    // width: calc(50% - 3.5rem);
    text-align: right;
  }

  .money-icon {
    font-size: 30px;
    padding-bottom: 0px;
  }
}
.money-box {
  position: relative;
}

.money-tip {
  padding: 20px 16px;
  font-size: 20px;
  text-align: left;
  font-weight: 700;
  background: #fff;
}
.placeholder {
  position: absolute;
  left: 50px;
  top: 23px;
  color: #999;
}
</style>
