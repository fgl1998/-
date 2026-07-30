<template>
  <common-layout :step-map="stepMap"></common-layout>
</template>

<script>
import ENUMS from '@osppm/common/enum.js'
import one from './parts/one.vue'

export default {
  name: 'loanCollateralAddressChange',
  data() {
    return {
      stepMap: [
        {
          title: '贷款抵押信息',
          component: one,
          previous: ENUMS.STEP.GO_BACK,
          next: ENUMS.STEP.FINISH,
          authType: ENUMS.AUTH_TYPE.FACE_OR_SMS,
        },
      ],
    }
  },
}
</script>

<style scoped>
</style>
