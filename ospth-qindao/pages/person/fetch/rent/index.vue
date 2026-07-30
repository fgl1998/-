<!-- 租赁提取 -->
<template>
  <common-layout :step-map="stepMap"></common-layout>
</template>

<script>
import one from './part/one.vue'
import guaranteed from './part/guaranteed.vue'
import two from './part/two.vue'
import ENUMS from '@osppm/common/enum'
import { mapState } from 'vuex'

export default {
  name: 'index',
  computed: {
    ...mapState('rent', ['extractType']),
    stepMap() {
      const isGuaranteed = this.extractType === '1'
      return [
        {
          title: '提取类型',
          component: one,
          previous: ENUMS.STEP.GO_BACK,
          next: isGuaranteed ? ENUMS.STEP.ONE : ENUMS.STEP.TWO
        },
        {
          title: '合同信息',
          component: guaranteed,
          previous: ENUMS.STEP.ZERO,
          next: ENUMS.STEP.TWO
        },
        {
          title: '提取金额',
          component: two,
          previous: isGuaranteed ? ENUMS.STEP.ONE : ENUMS.STEP.ZERO,
          sceneCode: 'S0000',
          next: ENUMS.STEP.FINISH
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
</style>
