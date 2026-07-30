<!-- 个人信息变更 -->
<template>
  <common-layout :step-map="stepMap" />
</template>

<script>
import ENUMS from '@osppm/common/enum.js'
import { mapMutations } from 'vuex'

const one = () => import('./parts/one.vue')

const stepMap = [
  {
    title: '个人信息变更',
    component: one,
    previous: ENUMS.STEP.GO_BACK,
    next: ENUMS.STEP.FINISH,
  },
]

export default {
  name: 'personalInfoChange',
  data() {
    return {
      stepMap,
    }
  },
  onLoad(options) {
    const projectNo = options?.projectNo
    if (projectNo) this.setYwdjh(projectNo)
  },
  methods: {
    ...mapMutations('personalInfoChange', ['setYwdjh']),
  },
}
</script>
