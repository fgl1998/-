<template>
  <div>
    <van-notice-bar
        left-icon="info-o"
        :text="noticeText"
        :scrollable="true"
        style="margin-bottom: 16px;"
    />
  </div>
</template>
<script>
export default {
  name: 'repaymentTip',
  props: ['repaymentPayType', 'repaymentAccount', 'estimatedTime'],
  data() {
    return {
      noticeText: ''
    }
  },
  mounted() {
    if (this.repaymentPayType === '03') {
      this.noticeText = '本次还款将从您当前的【账户余额】中进行扣款；提交申请后【立即执行】账户余额冲还。'
    } else if (this.repaymentPayType === '04') {
      this.noticeText = '本次还款将从您的银行卡账号【' + this.repaymentAccount + '】中进行扣款；提交还款申请后【立即执行】，请保证银行卡账户资金充足。'
    } else if (this.repaymentPayType === '05') {
      this.noticeText = '本次还款资金将从您的银行卡账号【' + this.repaymentAccount + '】中进行扣款；业务办理成功后将于' + this.estimatedTime + '日进行扣款；请确认您的银行卡能够正常使用，并已将还款资金足额存入到还款银行卡账户中。'
    }
  }
}
</script>
<style scoped lang="less">

</style>
