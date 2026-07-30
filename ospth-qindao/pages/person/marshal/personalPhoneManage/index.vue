<!-- 个人手机号管理 -->
<template>
  <common-layout :step-map="stepMap"></common-layout>
</template>
<script>
import one from "./parts/one.vue";
import two from "./parts/two.vue";
import ENUMS from "@osppm/common/enum";
const stepMap = [
  {title: '身份认证', component: one, previous: ENUMS.STEP.GO_BACK, next: ENUMS.STEP.ONE},
  {title: '变更手机', component: two, previous: ENUMS.STEP.ZERO, next: ENUMS.STEP.FINISH},
]
export default {
  name: "personalPhoneManage",
  data(){
    return{
      stepMap
    }
  },
}
</script>
<style lang="scss">
</style>
