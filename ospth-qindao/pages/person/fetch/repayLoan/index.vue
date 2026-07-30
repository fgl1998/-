<!-- 偿还贷提取 -->
<template>
  <common-layout :step-map="stepMap"></common-layout>
</template>

<script>
import one from "./parts/one.vue";
import two from "./parts/two.vue";
import three from "./parts/three.vue";
import four from './parts/four.vue'
import ENUMS from "@osppm/common/enum";
import {mapState} from 'vuex'
import fetchUndertaking from '@/pages/person/fetch/commonParts/fetchUndertaking.vue'
const stepMap = [
  {title: '提取类型', component: fetchUndertaking, previous: ENUMS.STEP.GO_BACK, next: ENUMS.STEP.ONE, nextText: '我已阅知并承诺',},
  {title: '办理信息', component: one, previous: ENUMS.STEP.ZERO, next: ENUMS.STEP.TWO,},
  {title: '办理信息', component: two, previous: ENUMS.STEP.ONE, next: ENUMS.STEP.THREE,},
  // {title: '办理信息', component: three, previous: ENUMS.STEP.TWO, next: ENUMS.STEP.FOUR},
  {
    title: '办理信息', component: four, previous: ENUMS.STEP.TWO, next: ENUMS.STEP.FINISH,
    sceneCode: undefined, authType: ENUMS.AUTH_TYPE.FACE_OR_SMS
  },
]
export default {
  name: "index",
  data(){
    return{
      stepMap
    }
  },
  watch: {
    tqlx(val){
      if (val === '公积金贷款') {
        this.$set(this.stepMap[3], 'sceneCode', undefined)
        this.$set(this.stepMap[1], 'next', ENUMS.STEP.THREE)
        this.$set(this.stepMap[3], 'previous', ENUMS.STEP.ONE)
      }

      if (val !== '公积金贷款') {
        this.$set(this.stepMap[1], 'next', ENUMS.STEP.TWO)
        this.$set(this.stepMap[3], 'previous', ENUMS.STEP.TWO)
        this.$set(this.stepMap[3], 'sceneCode', 'S0000')
      }
    }
  },
  computed:{
    ...mapState('repayLoan', ['tqlx'])
  },
  methods: {

  },
}
</script>

<style lang="scss">
</style>
