<!-- 资金解冻-买方 -->
<template>
  <common-layout :step-map="stepMap"></common-layout>
</template>

<script>
import one from './parts/one.vue'
import ENUMS from '@osppm/common/enum'
import { mapState } from 'vuex'

export default {
  name: 'fundsUnfreezeBuyer',
  computed: {
    ...mapState('fundsUnfreezeBuyer', ['decision']),
    stepMap() {
      return [
        {
          title: '发票信息',
          component: one,
          previous: ENUMS.STEP.GO_BACK,
          next: ENUMS.STEP.FINISH,
          sceneCode: this.decision === 'agree' ? 'S1111' : '',
        },
      ]
    },
  },
}
</script>
