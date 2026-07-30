<template>
  <common-layout :step-map="stepMap" />
</template>

<script>
import ENUMS from '@osppm/common/enum.js'
import one from './parts/one.vue'
import two from './parts/two.vue'

export default {
  name: 'loanCalculator',
  data() {
    return {
      stepMap: [
        {
          title: '贷款额度测算',
          component: one,
          previous: ENUMS.STEP.GO_BACK,
          next: 1,
        },
        {
          title: '月还款额试算',
          component: two,
          previous: 0,
          next: ENUMS.STEP.FINISH,
        },
      ],
    }
  },
}
</script>
