<!-- 低保提取 -->
<template>
  <common-layout :step-map="stepMap"></common-layout>
</template>

<script>
import { mapMutations,} from "vuex";
import yhSelect from "@/pages/person/fetch/retirement/parts/yhSelect.vue";
import one from "./parts/one.vue";
import ENUMS from "@osppm/common/enum";
const stepMap = [
  {title: '办理信息', component: one, previous: ENUMS.STEP.GO_BACK, next: ENUMS.STEP.FINISH,
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
  components: {yhSelect},
  onLoad(options) {
    const projectNo = options?.projectNo;
    if (projectNo) this.setYwdjh(projectNo);
    this.user = this.$base.getUser();
    this.setAccInfo({ skzhmc: this.user?.employeesBo?.xingming ?? '' });
  },
  methods: {
    ...mapMutations('lowIncome', ['setYwdjh','setAccInfo']),
  },

}
</script>

<style lang="scss">
</style>
