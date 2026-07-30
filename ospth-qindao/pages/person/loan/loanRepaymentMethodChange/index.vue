<!-- 还款方式变更登记 -->
<template>
  <common-layout :step-map="stepMap"/>
</template>

<script>
import one from "./parts/one.vue";
import two from "./parts/two.vue";
import ENUMS from "@osppm/common/enum";
const stepMap = [
  {
    title: '逝者信息', component: one, previous: ENUMS.STEP.GO_BACK, next: ENUMS.STEP.ONE
  },
  {
    title: '逝者信息', component: two, previous: ENUMS.STEP.GO_BACK, next: ENUMS.STEP.FINISH,
    sceneCode: 'S0000',
    authType: ENUMS.AUTH_TYPE.FACE_OR_SMS,
  },
]
export default {
  name: 'loanRepaymentMethodChange',
  data() {
    return {
      stepMap,
    }
  },
}
</script>

<style scoped lang="scss">
.con_layout {
  min-height: 100vh;
  padding: 24rpx;
  padding-top: calc(24rpx + env(safe-area-inset-top));
  background: #f5f5f5;
  box-sizing: border-box;
}

.page_title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 24rpx;
}

.form {
  border-radius: 12rpx;
  overflow: hidden;
}
</style>
