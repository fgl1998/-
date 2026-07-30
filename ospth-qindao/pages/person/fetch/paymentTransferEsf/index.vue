<!-- 建造、翻修、大修 -->
<template>
  <common-layout :step-map="stepMap"/>
</template>

<script>
// import one from "./parts/one.vue";
import two from "./parts/two.vue";
import three from "./parts/three.vue";
import ENUMS from "@osppm/common/enum";
const stepMap = [
  // sceneCode: 材料情形码；authType: 认证方式
  {
    title: '二手房支付首付款', component: two, previous: ENUMS.STEP.GO_BACK, next: ENUMS.STEP.ONE
  },
  {
    title: '二手房支付首付款', component: three, previous: ENUMS.STEP.ZERO, next: ENUMS.STEP.FINISH,
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
  mounted() {
    console.log(123)
  },
  methods: {
  },
}
</script>

<style lang="scss">
</style>
