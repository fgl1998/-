<!-- 发票管理提取 -->
<template>
  <common-layout :step-map="stepMap"></common-layout>
</template>

<script>
import one from "./parts/one.vue";
import ENUMS from "@osppm/common/enum";

const stepMap = [
  {
    title: '办理信息', component: one, previous: ENUMS.STEP.GO_BACK, next: ENUMS.STEP.FINISH, sceneCode: 'S1111', authType: ENUMS.AUTH_TYPE.FACE_OR_SMS
  },
]

export default {
  name: "invoiceManagement",
  data() {
    return {
      stepMap
    }
  },
  onLoad(options) {
  },
}
</script>

<style lang="scss">
.main {
  background-color: white;
  margin-top: 10px;
  min-height: 93%;
  border-radius: 8px;
}
</style>
