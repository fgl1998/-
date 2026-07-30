<!-- 退役军人缴款 -->
<template>
  <common-layout :step-map="stepMap"></common-layout>
</template>

<script>
import one from './parts/one.vue'
import ENUMS from '@osppm/common/enum'

export default {
  name: 'fvContributionPayIndex',
  data() {
    return {
      stepMap: [
        {
          title: '办理信息',
          component: one,
          previous: ENUMS.STEP.GO_BACK,
          next: ENUMS.STEP.FINISH,
          sceneCode: 'S0001',
          authType: ENUMS.AUTH_TYPE.FACE_OR_SMS,
        },
      ],
    }
  },
}
</script>

<style scoped>
</style>
