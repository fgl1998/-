<template>
  <common-layout :step-map="stepMap" />
</template>

<script>
import ENUMS from '@osppm/common/enum.js'
import one from './parts/one.vue'

export default {
  name: 'extractServiceIndex',
  data() {
    return {
      stepMap: [
        {
          title: '银行卡管理',
          component: one,
          previous: ENUMS.STEP.GO_BACK,
          next: ENUMS.STEP.FINISH,
        },
      ],
    }
  },
}
</script>

<style scoped>
</style>
