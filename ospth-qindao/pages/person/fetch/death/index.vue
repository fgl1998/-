<!-- 死亡提取 -->
<template>
  <common-layout :step-map="stepMap"/>
</template>

<script>
import one from "./parts/one.vue";
import two from "./parts/two.vue"
import ENUMS from "@osppm/common/enum";
import fetchUndertaking from '@/pages/person/fetch/commonParts/fetchUndertaking.vue'
const stepMap = [
  // sceneCode: 材料情形码；authType: 认证方式
  {
    title: '办理信息', component: fetchUndertaking, previous: ENUMS.STEP.GO_BACK, next: ENUMS.STEP.ONE,
  },
  {
    title: '逝者信息', component: one, previous: ENUMS.STEP.ZERO, next: ENUMS.STEP.TWO
  },
  {
    title: '提取信息', component: two, previous: ENUMS.STEP.ONE, next: ENUMS.STEP.THREE,
  },
  {
    title: '档案材料', component: null, previous: ENUMS.STEP.TWO, next: ENUMS.STEP.FINISH,
    sceneCode: 'S0000',
    authType: ENUMS.AUTH_TYPE.FACE_OR_SMS
  },
]
export default {
  name: "index",
  data(){
    return{
      stepMap
    }
  },
  methods: {
  },
}
</script>

<style lang="scss">
</style>
