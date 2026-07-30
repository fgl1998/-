<!-- 灵活就业开户 -->
<template>
  <common-layout :step-map="stepMap"></common-layout>
</template>
<script>
import one from "./parts/one.vue";
import ENUMS from "@osppm/common/enum";
const stepMap = [
  {title: '办理信息', component: one, previous: ENUMS.STEP.GO_BACK, next: ENUMS.STEP.FINISH,
    authType: ENUMS.AUTH_TYPE.FACE_OR_SMS
  },
]
export default {
  name: "flexempRegisterIndex",
  data(){
    return{
      stepMap
    }
  },
}
</script>
<style lang="scss">
</style>
