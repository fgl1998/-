<template>
  <div>
    <van-cell-group inset>
      <div class="img">
        <img v-if="isMan" :src="require('@/assets/images/common/mobile_pay.svg')">
        <img v-else :src="require('@/assets/images/common/credit_card_payments.svg')">
      </div>
    </van-cell-group>

    <van-radio-group v-model="loanInfo">
      <div class="card-list" v-for="(item, index) in loanInfoList" :key="index"
           @click="click(item)">
        <van-radio :name="item">{{ item.loanType | descEmptyToLine }}</van-radio>
        <div class="card-item">
          <div class="l">贷款账号</div>
          <div class="r">
            {{ item.personLoanAccountNo.value | middleFormat | emptyToLine }}
          </div>
        </div>
        <div class="card-item">
          <div class="l">贷款余额</div>
          <div class="r">
            {{ item.loanBal | moneyFormat }}
          </div>
        </div>
        <div class="card-item">
          <div class="l">贷款银行</div>
          <div class="r">{{ item.loanBk | descEmptyToLine }}</div>
        </div>
        <div v-if="loanInfo && loanInfo.personLoanAccountNo.value === item.personLoanAccountNo.value">
          <div class="rang"></div>
          <div class="icon">
            <van-icon name="success"/>
          </div>
        </div>
      </div>
    </van-radio-group>
  </div>
</template>
<script>

export default {
  name: 'loanInfoList',
  data() {
    return {
      loanInfo: undefined
    }
  },
  props: ['loanInfoList', 'isMan'],
  methods: {
    click(data) {
      this.loanInfo = data
      this.$emit('loanInfoChange', data)
    }
  }
}
</script>
<style scoped lang="less">
.img {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 24px 0;

  img {
    width: 60%;
  }
}
</style>
