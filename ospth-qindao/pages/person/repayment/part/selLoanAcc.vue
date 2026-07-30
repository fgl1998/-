<template>
  <div class="content">
    <div>
      <user-header bg="#fff" paddingBottom="16px" fontColor="#333" />
      <van-radio-group v-model="checkInfo">
        <div class="card-list" v-for="(item, index) in loanInfo" :key="index" @click="checkInfo = item.personLoanAccountNo.value">
          <van-radio :name="item">{{ item.loanType | descEmptyToLine }}</van-radio>
          <div class="card-item">
            <div class="l">贷款账号</div>
            <div class="r">
              {{ item.personLoanAccountNo.value | middleFormat | emptyToLine}}
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
          <div v-if="chooseLoanInfo && chooseLoanInfo.personLoanAccountNo.value === item.personLoanAccountNo.value">
            <div class="rang"></div>
            <div class="icon">
              <van-icon name="success" />
            </div>
          </div>
        </div>
      </van-radio-group>
    </div>

    <hf-next-btn @nextStep="goNextStep"></hf-next-btn>
  </div>
</template>

<script>
import userHeader from '@/components/userHeader'
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'

export default {
  name: 'selLoanAcc',
  components: { userHeader },
  mounted() {
    this.init()
 },
  data () {
    return {
    }
  },
  computed: {
    ...mapState('loanRepayment', ['loanInfo']),
    ...mapGetters('loanRepayment', ['chooseLoanInfo']),
    checkInfo: {
      get() {
        return this.chooseLoanInfo
      },
      set(value) {
        this.setChooseLoanInfo(value)
      }
    }
  },
  methods: {
    ...mapActions('loanRepayment', ['loanRepaymentQuery','loanRepaymentCheck']),
    ...mapMutations('loanRepayment', ['setChooseLoanInfo', 'initRepaymentData']),
    async init () {
      try {
        await this.loanRepaymentQuery(this.commonBizApply)
        if (this.loanInfo?.length < 1) {
          this.$dialog.alert({
            title: '温馨提示',
            message: '未查询到当前用户的贷款信息'
          }).then(() => {
            this.$router.push('/businessHall')
          })
        }
      } catch (error) {
        this.$dialog.alert({
          title: '温馨提示',
          message: error
        }).then(() => {
          this.$router.push('/businessHall')
        })
      }
    },
    async goNextStep () {
      try {
        if (!this.chooseLoanInfo) {
          this.$toast('请选择贷款信息')
          return
        }
        await this.loanRepaymentCheck({...this.commonBizApply,})
        this.$emit('next', this.chooseLoanInfo)
      }catch (error) {
        this.$dialog.alert({
          title: '温馨提示',
          message: error
        }).then(() => {
          this.$router.push('/businessHall')
        })
      }
    },
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
</style>
