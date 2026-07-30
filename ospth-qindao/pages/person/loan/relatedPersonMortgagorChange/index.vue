<!-- 关联人/抵押人变更 -->
<template>
  <common-layout :step-map="stepMap"></common-layout>
</template>

<script>
import { mapMutations } from 'vuex'
import ENUMS from '@osppm/common/enum.js'
import one from './parts/one.vue'
import two from './parts/two.vue'

const stepMap = [
  {
    title: '关联人信息变更',
    component: one,
    previous: ENUMS.STEP.GO_BACK,
    next: ENUMS.STEP.ONE,
  },
  {
    title: '抵押人信息变更',
    component: two,
    previous: ENUMS.STEP.ZERO,
    next: ENUMS.STEP.FINISH,
    sceneCode: 'S0001',
    authType: ENUMS.AUTH_TYPE.FACE_OR_SMS,
  },
]

export default {
  name: 'RelatedPersonMortgagorChange',
  data() {
    return { stepMap }
  },
  onLoad(options) {
    if (options?.ywdjh) this.setYwdjh(options.ywdjh)
  },
  methods: {
    ...mapMutations('relatedPersonMortgagorChange', ['setYwdjh']),
  },
}
</script>

<style scoped></style>
