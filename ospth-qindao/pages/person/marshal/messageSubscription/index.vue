<!-- 消息订阅 -->
<template>
  <common-layout :step-map="stepMap" />
</template>

<script>
import ENUMS from '@osppm/common/enum.js'
import { mapMutations } from 'vuex'

const one = () => import('./parts/one.vue')

const stepMap = [
  {
    title: '消息订阅',
    component: one,
    previous: ENUMS.STEP.GO_BACK,
    next: ENUMS.STEP.FINISH,
  },
]

export default {
  name: 'messageSubscription',
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
    ...mapMutations('messageSubscription', ['setYwdjh']),
  },
}
</script>
