<template>
  <common-layout :step-map="stepMap" />
</template>

<script>
import ENUMS from '@osppm/common/enum.js'
import one from './part/one.vue'

export default {
  name: 'nameIdChangeIndex',
  data() {
    return {
      stepMap: [
        {
          title: '姓名身份证变更',
          component: one,
          previous: ENUMS.STEP.GO_BACK,
          next: ENUMS.STEP.FINISH,
          sceneCode: 'S0000',
          authType: ENUMS.AUTH_TYPE.FACE_OR_SMS,
        },
      ],
    }
  },
}
</script>

<style scoped>
</style>
