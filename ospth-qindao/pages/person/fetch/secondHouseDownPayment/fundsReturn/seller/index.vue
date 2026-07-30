<!-- 资金退回-卖方 -->
<template>
  <common-layout :step-map="stepMap"></common-layout>
</template>

<script>
import one from './parts/one.vue'
import ENUMS from '@osppm/common/enum'

const stepMap = [
  {
    title: '房屋信息确认',
    component: one,
    previous: ENUMS.STEP.GO_BACK,
    next: ENUMS.STEP.FINISH,
  },
]

export default {
  name: 'fundsReturnSeller',
  data() {
    return {
      stepMap,
    }
  },
}
</script>
