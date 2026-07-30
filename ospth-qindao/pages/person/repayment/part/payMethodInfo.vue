<template>
  <div class="content-layout">
    <div v-if="!isShowBankCard">
      <p class="payMethod-title">缴款方式选择</p>
      <van-radio-group v-model="payMethod" @change="changePayMethod">
        <div class="card-list" v-for="(item, index) in payMethodList" :key="index">
          <van-radio :name="item.value">{{ item.name }}</van-radio>
        </div>
      </van-radio-group>

      <div v-if="payMethod === '05'">
        <van-cell-group inset>
          <van-cell title="代扣时间" label="请选择代扣时间" is-link
                    :value="estimatedDate" @click="showPicker = true" />
        </van-cell-group>
        <van-calendar v-model="showPicker" color="#4888FE" title="代扣时间"
                      :min-date="minDate" @confirm="estimatedConfirm" :show-confirm="false"/>
      </div>
    </div>
    <select-bank-card v-if="isShowBankCard" :needChooseBankCard="needChooseBankCard"/>
    <van-dialog v-model="isShowRepayTitle" :confirm-button-color="$theme.color" :confirm-button-text="content"
                :before-close="beforeClose" title="还款提示" show-cancel-button>
      <div class="dialog_layout">
        <p v-if="payMethod === '03'">本次还款资金将从您的【<span class="tip-init">账户余额</span>】中进行扣款；业务办理成功后【<span class="tip-init">立即执行</span>】账户余额冲还；请确认您的账户能够正常使用，并已将还款资金足额存入到还款账户中</p>
        <p v-if="payMethod === '04'">本次还款资金将从您的银行卡账号【<span class="tip-init">{{ bankCardNo }}</span>】中进行扣款；业务办理成功后【<span class="tip-init">立即执行</span>】银行卡冲还；请确认您的银行卡能够正常使用，并已将还款资金足额存入到还款银行卡账户中</p>
        <p v-if="payMethod === '05'">本次还款资金将从您的银行卡账号【<span class="tip-init">{{ bankCardNo }}</span>】中进行扣款；业务办理成功后将于【<span class="tip-init">{{ estimatedDate }}】</span>日进行扣款；请确认您的银行卡能够正常使用，并已将还款资金足额存入到还款银行卡账户中</p>
      </div>
    </van-dialog>
    <hf-next-btn v-if="!isShowBankCard" @nextStep="goNextStepFirst"></hf-next-btn>
    <hf-next-btn v-if="isShowBankCard" @nextStep="goNextStep"></hf-next-btn>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'
import {REPAYMENT_PAY_TYPE} from '@pm/common/biz-constants'
import selectBankCard from "./selectBankCard";
import moment from "moment";
export default {
  name: 'payMethodInfo',
  components: { selectBankCard, },
  props: {
    isShowEstimated: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      payMethodList: [
        REPAYMENT_PAY_TYPE.ACCUMULATION_FUND,
        REPAYMENT_PAY_TYPE.REALTIME_DEDUCTIONS
      ],
      payMethod: '',
      // 显示事后代扣日期选择
      showPicker: false,
      // 代扣时间
      estimatedDate: undefined,
      isShowRepayTitle: false,
      content: '确认阅读',
      isClick: false,
      // 强制阅读5秒
      interval: 5,
      // 定时任务的标志
      clock: null,
      bankCardNo: '',
      needChooseBankCard: false,
      isShowBankCard: false,
      repaymentTime: null, // 实际设置的还款时间
      // 日期组件最小时间
      minDate: moment().startOf('month').toDate()
    }
  },
  computed: {
    ...mapState('login',['userInfo']),
    ...mapState('loanRepayment', ['loanInfo', 'estimatedTime', 'cardInfo']),
    ...mapGetters('loanRepayment', ['chooseLoanInfo']),
  },
  async mounted() {
    if (this.isShowEstimated) {
      this.$set(this.payMethodList, this.payMethodList.length, REPAYMENT_PAY_TYPE.EX_POST_WITHHOLDING)
    }

    // 如果是存贷款户只能是实时扣款
    if (this.userInfo.marPer !== '1') {
      this.payMethodList = [REPAYMENT_PAY_TYPE.REALTIME_DEDUCTIONS]
    }
  },
  methods: {
    ...mapActions('loanRepayment', ['queryRepaymentBankInfo']),
    ...mapMutations('loanRepayment', ['initRepaymentData','setCardInfo']),
    async changePayMethod() {
      // 初始化信息
      switch (this.payMethod) {
        case '03':
          this.initRepaymentData({
            // 公积金
            repaymentPayType: REPAYMENT_PAY_TYPE.ACCUMULATION_FUND,
          })
          break
        case '04':
          this.initRepaymentData({
            // 实时扣款
            repaymentPayType: REPAYMENT_PAY_TYPE.REALTIME_DEDUCTIONS,
          })
          break
        case '05':
          this.initRepaymentData({
            // 事后扣款
            repaymentPayType: REPAYMENT_PAY_TYPE.EX_POST_WITHHOLDING,
          })
          break
        default: break
      }
    },
    async estimatedConfirm(value) {
      // 获取当前月的 1 号日期
      const startOfMonth = moment().startOf('month');
      // 判断是否在 nextPayTime 之前，且是否在当月 1 号之后
      if (moment(this.chooseLoanInfo.nextPayTime).isBefore(moment(value)) ) {
        this.$toast(`代扣时间须在贷款还款日【${this.chooseLoanInfo.nextPayTime}】之前`,5)
        return
      } else if (moment(value).isBefore(startOfMonth)){
        this.$toast(`代扣时间须在当月1号之后`,5)
        return
      }
      this.estimatedDate = moment(value).format('YYYY-MM-DD')
      this.showPicker = false
    },
    async goNextStepFirst () {
      if (!this.payMethod){
        this.$toast.fail('请先选择缴款方式')
        return
      }
      if (this.payMethod === '03') {
        this.$commonJs.forcedRead(this, '', this.clock)
        this.isShowRepayTitle = true
        this.isShowBankCard = false
        this.needChooseBankCard = false
      }
      if (this.payMethod === '04' || this.payMethod === '05'){
        this.isShowBankCard = true
        this.needChooseBankCard = true
      }
      await this.queryRepaymentBankInfo({loanBusinessNo: this.chooseLoanInfo.loanBusinessNo, ...this.commonBizApply})
      this.setCardInfo(undefined)
    },
    async goNextStep () {
      if (!this.cardInfo){
        this.$toast.fail('请先选择付款银行卡')
        return
      }
      this.bankCardNo = this.cardInfo.repaymentAccount.value
      this.$commonJs.forcedRead(this, '', this.clock)
      this.isShowRepayTitle = true
    },
    // 关闭前的回调
    async beforeClose(action, done) {
      if (action === 'cancel') {
        this.isClick = this.isShowRepayTitle = false
        this.interval = 5
        this.content = '确认阅读'
        window.clearInterval(this.clock)
        done()
        return
      }
      if (!this.isClick) {
        try {
          // 下一步
          if (this.payMethod === '03' || this.payMethod === '04') {
            this.repaymentTime = moment().format('YYYY-MM-DD')
            this.chooseLoanInfo.estimatedTime = this.estimatedTime
          }
          if (this.payMethod === '05') {
            this.repaymentTime = moment(this.estimatedDate).format('YYYY-MM-DD')
          }
          this.chooseLoanInfo.payMethod = this.payMethod
          this.chooseLoanInfo.repaymentTime = this.repaymentTime
          this.$emit('next', this.chooseLoanInfo)
          done()
        } catch (error) {
          this.$dialog.alert({
            title: 'left',
            message: error
          }).then(() => {
            this.$router.push('/businessHall')
          })
        }
      } else {
        done(false)
      }
    },
    backPreNext() {
      if (this.isShowBankCard) {
        this.isShowBankCard = false
        this.needChooseBankCard = false
        return false
      }else {
        return true
      }
    },
  },
}
</script>

<style lang="less" scoped>
.content-layout {
  background: #F5F5F5;
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.payMethod-title{
  height: 20px;
  line-height: 20px;
  margin: 24px 0px 2px 17px;
  font-size: 16px;
  color: #4788FE;
}
.dialog_layout {
  padding: 16px;
  font-size: 14px;
  line-height: 25px;
}
.tip-init {
  font-weight: 500;
  color: #FF0000;
}
.btn_box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 16px;
  height: 40px;
  margin: 16px 0px;
}
.btn_down {
  flex: 2;
  border-radius: 8px;
  vertical-align: middle;
  margin-left: 10px;
}
</style>
