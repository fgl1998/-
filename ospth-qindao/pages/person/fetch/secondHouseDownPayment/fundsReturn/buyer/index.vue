<!-- 资金退回-买方 -->
<template>
  <common-layout :step-map="stepMap"></common-layout>
</template>

<script>
import one from './parts/one.vue'
import two from './parts/two.vue'
import ENUMS from '@osppm/common/enum'

const stepMap = [
  // {
  //   title: '发起退回申请',
  //   component: one,
  //   previous: ENUMS.STEP.GO_BACK,
  //   next: ENUMS.STEP.ONE,
  // },
  {
    title: '发起退回申请',
    component: two,
    previous: ENUMS.STEP.GO_BACK,
    next: ENUMS.STEP.FINISH,
  },
]

export default {
  name: 'fundsReturnBuyer',
  data() {
    return {
      stepMap,
    }
  },
}
</script>
