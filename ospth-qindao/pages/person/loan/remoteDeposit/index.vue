<template>
  <common-layout :step-map="stepMap" />
</template>

<script>
import ENUMS from '@osppm/common/enum.js'
import one from './parts/one.vue'
import two from './parts/two.vue'
import three from './parts/three.vue'

const stepMap = [
  {
    title: '基础信息',
    component: one,
    previous: ENUMS.STEP.GO_BACK,
    next: ENUMS.STEP.ONE,
  },
  {
    title: '缴存信息',
    component: two,
    previous: ENUMS.STEP.ZERO,
    next: ENUMS.STEP.FINISH,
    authType: ENUMS.AUTH_TYPE.FACE_OR_SMS,
  },
  {
    title: '购房信息',
    component: three,
    previous: ENUMS.STEP.ONE,
    next: ENUMS.STEP.FINISH,
  },
]

export default {
  name: 'remoteDeposit',
  data() {
    return {
      stepMap,
    }
  },
}
</script>

<style scoped>
</style>
