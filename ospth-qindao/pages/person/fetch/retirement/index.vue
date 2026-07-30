<!-- 离退休提取 -->
<template>
    <common-layout :step-map="stepMap"></common-layout>
</template>

<script>
import { mapMutations,} from "vuex";
import yhSelect from "@/pages/person/fetch/retirement/parts/yhSelect.vue";
import one from "./parts/one.vue";
import ENUMS from "@osppm/common/enum";
import fetchUndertaking from '@/pages/person/fetch/commonParts/fetchUndertaking.vue'

const stepMap = [
  {
    title: '办理信息', component: fetchUndertaking, previous: ENUMS.STEP.GO_BACK, next: ENUMS.STEP.ONE,
    nextText: '我已阅知并承诺',
  },
  {
    title: '办理信息', component: one, previous: ENUMS.STEP.ZERO, next: ENUMS.STEP.FINISH,
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
    components: {yhSelect},
    onLoad(options) {
        const projectNo = options?.projectNo;
        if (projectNo) this.setYwdjh(projectNo);
        this.user = this.$base.getUser();
        this.setAccInfo({ skzhmc: this.user?.employeesBo?.xingming ?? '' });
    },
    methods: {
        ...mapMutations('retire', ['setYwdjh','setAccInfo']),
    },

}
</script>

<style lang="scss">
</style>
