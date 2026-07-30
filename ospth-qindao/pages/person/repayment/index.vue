<template>
  <common-layout :step-map="stepMap"></common-layout>
</template>

<script>
import ENUMS from '@osppm/common/enum.js'
import menu from './parts/menu.vue'

const stepMap = [
  {
    title: '贷款还款管理',
    component: menu,
    previous: ENUMS.STEP.GO_BACK,
    next: ENUMS.STEP.GO_BACK,
  },
]

export default {
  name: 'RepaymentIndex',
  data() {
    return { stepMap }
  },
}
</script>

<style scoped>
</style>
