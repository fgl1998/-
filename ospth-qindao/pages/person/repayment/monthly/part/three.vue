<template>
  <div class="content">
    <van-form validate-first ref="infoForm">
      <van-cell-group inset style="padding: 24px 0">
        <div class="img">
          <img :src="require('@/assets/images/common/digitalCurrency.svg')">
        </div>
        <repayment-tip :repayment-pay-type="repaymentPayType"
                       :repaymentAccount="bankInfo?.repaymentAccount"/>
        <van-field :value="loanInfo.personLoanAccountNo.value" placeholder="请输入公积金贷款账号"
                   :rules="[{ required: true}]" :disabled="true"
                   input-align="right" required label="公积金贷款账号"/>

        <van-field :value="loanInfo.loanBal" placeholder="请输入公积金贷款余额(元)"
                   :rules="[{ required: true}]" :disabled="true"
                   input-align="right" required label="公积金贷款余额(元)"/>

        <van-field :value="repaymentMoneyInfo.loanRepaymentAmount" placeholder="请输入贷款偿还金额(元)"
                   :rules="[{ required: true}]" :disabled="true"
                   input-align="right" required label="贷款偿还金额(元)"/>

        <van-field :value="repaymentMoneyInfo.monthlyRepaymentAmount" placeholder="请输入按月还款金额"
                   :rules="[{ required: true}]" :disabled="true"
                   input-align="right" required label="按月还款金额"/>

      </van-cell-group>
    </van-form>

    <hf-next-btn @nextStep="goNextStep"/>
  </div>
</template>
<script>
import {mapActions, mapMutations, mapState} from 'vuex'
import RepaymentTip from '@/views/repayment/part/repaymentTip.vue'

export default {
  name: 'three',
  components: {RepaymentTip},
  computed: {
    ...mapState('monthlyRepayment', ['loanInfo', 'repaymentMoneyInfo', 'stepNum', 'repaymentPayType', 'bankInfo'])
  },
  async mounted() {
    try {
      await this.loanRepaymentCalculate()
    } catch (e) {
      this.$dialog.alert({
        title: '温馨提示',
        message: e
      }).then(() => {
        this.setStepNum(this.stepNum - 1)
      })
    }
  },
  methods:{
    ...mapActions('monthlyRepayment', ['loanRepaymentCalculate']),
    ...mapMutations('monthlyRepayment', ['setStepNum']),
    goNextStep(){
      this.$dialog.confirm({
        title:'温馨提示',
        message:'业务提交后将自动办结生效，是否办理该业务。'
      }).then(()=>{
        // 进入下一步
        this.setStepNum(this.stepNum + 1)
      })
    }
  },
}
</script>
<style scoped lang="less">
.content{
  padding-top: 1rem;
}

.img {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;

  img {
    width: 60%;
  }
}
</style>
