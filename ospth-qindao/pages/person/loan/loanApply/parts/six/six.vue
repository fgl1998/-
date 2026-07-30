<template>
  <div class="step_container">
    <van-form validate-first ref="inputForm">
      <h1 class="title">
        <van-icon name="search" />
        征信联网核查
      </h1>
      <van-cell-group inset>
        <van-field label="方案1期还款汇总金额" v-model="creditData.plan1Repay" input-align="right"
                   :disabled="true" readonly placeholder="--"/>
        <van-field label="方案1负债汇总金额" v-model="creditData.plan1Debt" input-align="right"
                   :disabled="true" readonly placeholder="--"/>
        <van-field label="方案2期还款汇总金额" v-model="creditData.plan2Repay" input-align="right"
                   :disabled="true" readonly placeholder="--"/>
        <van-field label="方案2负债汇总金额" v-model="creditData.plan2Debt" input-align="right"
                   :disabled="true" readonly placeholder="--"/>
        <van-field label="认定方案" v-model="creditData.creditPlanDesc" input-align="right"
                   :rules="[{required: true, message: '请选择认定方案'}]"
                   is-link readonly @click="showCreditPlanPick = true"
                   placeholder="请选择认定方案"/>
        <van-field label="资产总额(元)" v-model="creditData.assetTotal" input-align="right"
                   type="number"
                   :rules="[{required: true, message: '请填写资产总额'}]"
                   placeholder="请填写资产总额"/>
        <van-field label="审核说明" v-model="creditData.checkRemark" input-align="right"
                   placeholder="请填写审核说明"/>
      </van-cell-group>
    </van-form>

    <van-popup v-model="showCreditPlanPick" position="bottom">
      <van-picker show-toolbar :columns="creditPlanColumns"
                  @confirm="onCreditPlanConfirm"
                  @cancel="showCreditPlanPick = false"/>
    </van-popup>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
  name: 'LoanCredit',
  data() {
    return {
      showCreditPlanPick: false,
      creditPlanColumns: [
        { text: '方案1', value: '01' },
        { text: '方案2', value: '02' },
        { text: '方案3', value: '03' },
      ],
    }
  },
  computed: {
    ...mapState('perloanApply', ['creditData', 'dkywh']),
  },
  methods: {
    ...mapActions('perloanApply', ['creditInquiry']),
    ...mapMutations('perloanApply', ['setCreditData']),
    onCreditPlanConfirm(item) {
      this.setCreditData({ creditPlan: item.value, creditPlanDesc: item.text })
      this.showCreditPlanPick = false
    },
    async formValidate() {
      try {
        await this.$refs.inputForm.validate()
        return true
      } catch {
        return false
      }
    },
    async beforeNext() {
      try {
        await this.$refs.inputForm.validate()
        await this.creditInquiry({
          dkywh: this.dkywh,
          ...this.creditData,
        })
        return true
      } catch (err) {
        this.$toast(err)
        return false
      }
    },
  },
}
</script>

<style scoped lang="less">
.step_container {
  padding: 0 16px;
}
.title {
  font-size: 16px;
  margin-left: 16px;
  line-height: 2;
}
</style>
