<!-- 购房提取 -->
<template>
  <div>
    <common-layout :step-map="stepMap"></common-layout>
  </div>
</template>
<script>
import one from './parts/one.vue'
import two from './parts/two.vue'
import three from './parts/three.vue'
import ENUMS from '@osppm/common/enum'
import fetchUndertaking from '@/pages/person/fetch/commonParts/fetchUndertaking.vue'

const stepMap = [
  // sceneCode: 材料情形码；authType: 认证方式
  {
    title: '提取类型', component: fetchUndertaking, previous: ENUMS.STEP.GO_BACK, next: ENUMS.STEP.ONE,
    nextText: '我已阅知并承诺',
  },
  {
    title: '提取类型', component: one, previous: ENUMS.STEP.ZERO, next: ENUMS.STEP.TWO
  },
  {
    title: '提取类型', component: two, previous: ENUMS.STEP.ONE, next: ENUMS.STEP.THREE
  },
  {
    title: '提取类型', component: three, previous: ENUMS.STEP.TWO, next: ENUMS.STEP.FINISH, sceneCode: 'S0000',
    authType: ENUMS.AUTH_TYPE.FACE_OR_SMS
  },
]
export default {
  name: 'index',
  data() {
    return {
      stepMap
    }
  },
}
</script>
<style scoped lang="scss">

</style>
