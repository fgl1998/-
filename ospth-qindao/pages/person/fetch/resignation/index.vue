<!-- 离职提取 -->
<template>
    <common-layout :step-map="stepMap"></common-layout>
</template>

<script>
import { mapMutations,} from "vuex";
import one from "./parts/one.vue";
import ENUMS from "@osppm/common/enum";
import fetchUndertaking from '@/pages/person/fetch/commonParts/fetchUndertaking.vue'

const stepMap = [
  // sceneCode: 材料情形码；authType: 认证方式
  {
    title: '办理信息', component: fetchUndertaking, previous: ENUMS.STEP.GO_BACK, next: ENUMS.STEP.ONE,
    nextText: '我已阅知并承诺',
  },
  {
    title: '办理信息', component: one, previous: ENUMS.STEP.ZERO, next: ENUMS.STEP.FINISH,
    sceneCode: 'S0000', authType: ENUMS.AUTH_TYPE.FACE_OR_SMS
  },
]
export default {
    name: "index",
    data(){
        return{
            stepMap
        }
    },
    onLoad(options) {
        // const projectNo = options?.projectNo;
        // if (projectNo) this.setYwdjh(projectNo);
        // this.user = this.$base.getUser();
        // this.setAccInfo({ skzhmc: this.user?.employeesBo?.xingming ?? '' });
    },
    methods: {
        ...mapMutations('resign', ['setYwdjh','setAccInfo']),
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
