<template>
    <common-layout :step-map="stepMap"></common-layout>
</template>

<script>
import { mapMutations,} from "vuex";
import yhSelect from "@/pages/person/fetch/retirement/parts/yhSelect.vue";
import one from "./parts/one.vue";
import ENUMS from "@osppm/common/enum";
import two from "@/pages/person/fetch/loanEntrustDrawContract/parts/two.vue";
const stepMap = [
    {title: '选择房屋信息', component: one, previous: ENUMS.STEP.GO_BACK,next: ENUMS.STEP.ONE,},
    { title: '办理信息', component: two, previous: ENUMS.STEP.ZERO, next: ENUMS.STEP.FINISH, }
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
    },
    methods: {
        ...mapMutations('loanEntrustDrawContract', ['setYwdjh']),
    },

}
</script>

<style lang="scss">
.main{
  background-color: white;
  margin-top: 10px;
  min-height: 93%;
  border-radius: 8px;
}
/* 全局或本页面都行 */
.van-field__control {
  --cell-border: 0 !important;        /* vant 4 变量 */
}
/* 如果上面不生效，再补一条更细的 */
.van-cell::after {
  display: none !important;
}
</style>
