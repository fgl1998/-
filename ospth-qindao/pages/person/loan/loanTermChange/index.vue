<!-- 贷款期限变更 -->
<template>
  <common-layout :step-map="stepMap"/>
</template>

<script>
import one from "./parts/one.vue";
import two from "./parts/two.vue";
import ENUMS from "@osppm/common/enum";
const stepMap = [
  {
    title: '逝者信息', component: one, previous: ENUMS.STEP.GO_BACK, next: ENUMS.STEP.ONE
  },
  {
    title: '逝者信息', component: two, previous: ENUMS.STEP.GO_BACK, next: ENUMS.STEP.FINISH,
    sceneCode: 'S0000',
    authType: ENUMS.AUTH_TYPE.FACE_OR_SMS,
  },
]

export default {
  name: 'loanTermChange',
  data() {
    return {
      stepMap,
      formData: {
        lastChangeTime: '',
        oldLoanPeriods: '',
        oldRepayPrincipal: '',
        oldRepayInterest: '',
        oldMonthlyRepayAmount: '',
        oldLoanRate: '',
        loanRemainingPeriods: '',
        maxLoanPeriods: '',
        minLoanPeriods: '',
        newLoanPeriods: '',
        newRepayPrincipal: '',
        newRepayInterest: '',
        newMonthlyRepayAmount: '',
        newLoanRate: '',
        changedRemainingPeriods: '',
      },
      formConfig: {
        fields: [
          {
            type: 'date',
            name: 'lastChangeTime',
            label: '上次变更时间',
            labelWidth: '280rpx',
          },
          {
            type: 'number',
            name: 'oldLoanPeriods',
            label: '原贷款期数（月）',
            labelWidth: '280rpx',
            precision: 0,
            required: true,
          },
          {
            type: 'number',
            name: 'oldRepayPrincipal',
            label: '原还款本金（元）',
            labelWidth: '280rpx',
            precision: 2,
          },
          {
            type: 'number',
            name: 'oldRepayInterest',
            label: '原还款利息（元）',
            labelWidth: '280rpx',
            precision: 2,
          },
          {
            type: 'number',
            name: 'oldMonthlyRepayAmount',
            label: '原月还款额（元）',
            labelWidth: '280rpx',
            precision: 2,
          },
          {
            type: 'number',
            name: 'oldLoanRate',
            label: '原贷款利率（%）',
            labelWidth: '280rpx',
            precision: 4,
          },
          {
            type: 'number',
            name: 'loanRemainingPeriods',
            label: '贷款剩余期数（月）',
            labelWidth: '280rpx',
            precision: 0,
          },
          {
            type: 'number',
            name: 'maxLoanPeriods',
            label: '最大可贷期数（月）',
            labelWidth: '280rpx',
            precision: 0,
          },
          {
            type: 'number',
            name: 'minLoanPeriods',
            label: '最小可贷期数（月）',
            labelWidth: '280rpx',
            precision: 0,
          },
          {
            type: 'number',
            name: 'newLoanPeriods',
            label: '新贷款期数（月）',
            labelWidth: '280rpx',
            precision: 0,
          },
          {
            type: 'number',
            name: 'newRepayPrincipal',
            label: '新还款本金（元）',
            labelWidth: '280rpx',
            precision: 2,
          },
          {
            type: 'number',
            name: 'newRepayInterest',
            label: '新还款利息（元）',
            labelWidth: '280rpx',
            precision: 2,
          },
          {
            type: 'number',
            name: 'newMonthlyRepayAmount',
            label: '新月还款额（元）',
            labelWidth: '280rpx',
            precision: 2,
          },
          {
            type: 'number',
            name: 'newLoanRate',
            label: '贷款利率（%）',
            labelWidth: '280rpx',
            precision: 4,
          },
          {
            type: 'number',
            name: 'changedRemainingPeriods',
            label: '变更后剩余期数（月）',
            labelWidth: '280rpx',
            precision: 0,
            required: true,
          },
        ],
      },
    }
  },
}
</script>

<style scoped lang="scss">
.con_layout {
  min-height: 100vh;
  padding: 24rpx;
  padding-top: calc(24rpx + env(safe-area-inset-top));
  background: #f5f5f5;
  box-sizing: border-box;
}

.page_title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 24rpx;
}

.form {
  border-radius: 12rpx;
  overflow: hidden;
}

.warn_tip {
  color: #ee0a24;
  font-size: 24rpx;
  line-height: 1.6;
  padding: 0 24rpx 18rpx;
  background: #fff;
}
</style>
