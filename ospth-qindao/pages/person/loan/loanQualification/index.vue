<template>
  <common-layout :step-map="stepMap" />
</template>

<script>
import ENUMS from '@osppm/common/enum.js'
import one from './parts/one.vue'
import two from './parts/two.vue'
import three from './parts/three.vue'
import four from './parts/four.vue'

const stepMap = [
  {
    title: '申请及房屋信息',
    component: one,
    previous: ENUMS.STEP.GO_BACK,
    next: ENUMS.STEP.ONE,
  },
  {
    title: '商贷及银行信息',
    component: two,
    previous: ENUMS.STEP.ZERO,
    next: ENUMS.STEP.TWO,
  },
  {
    title: '共同借款人与经办信息',
    component: three,
    previous: ENUMS.STEP.ONE,
    next: ENUMS.STEP.THREE,
  },
  {
    title: '意见书及授权协查',
    component: four,
    previous: ENUMS.STEP.TWO,
    next: ENUMS.STEP.FINISH,
    sceneCode: 'S0000',
    authType: ENUMS.AUTH_TYPE.FACE_OR_SMS,
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

<style scoped></style>
