<!-- 月还款 -->
<template>
  <common-layout :step-map="stepMap"></common-layout>
</template>

<script>
import { mapMutations } from 'vuex'
import ENUMS from '@osppm/common/enum.js'
import one from './part/one.vue'
import two from './part/two.vue'

const stepMap = [
  {
    title: '选择贷款',
    component: one,
    previous: ENUMS.STEP.GO_BACK,
    next: ENUMS.STEP.ONE,
  },
  {
    title: '还款信息确认',
    component: two,
    previous: ENUMS.STEP.ZERO,
    next: ENUMS.STEP.FINISH,
    sceneCode: 'S0001',
    authType: ENUMS.AUTH_TYPE.FACE_OR_SMS,
  },
]

export default {
  name: 'MonthlyRepayment',
  data() {
    return { stepMap }
  },
  onLoad(options) {
    if (options?.ywdjh) this.setYwdjh(options.ywdjh)
  },
  methods: {
    ...mapMutations('monthRepayment', ['setYwdjh']),
  },
}
</script>
<style scoped></style>
