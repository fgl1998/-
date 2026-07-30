<!-- 冲还贷款签约 -->
<template>
    <common-layout :step-map="stepMap" />
</template>
<script>
import ENUMS from '@osppm/common/enum.js'
import { mapMutations,} from "vuex";

// 定义步骤映射，用于多步骤表单导航
const one = () => import(/* webpackPrefetch: true */ './parts/one.vue')
const two = () => import(/* webpackPrefetch: true */ './parts/two.vue')
// 每个步骤包含标题、组件、上一步和下一步的索引
const stepMap = [
    {
      title: '选择贷款信息', component: one, previous: ENUMS.STEP.GO_BACK, next: ENUMS.STEP.FINISH,
      authType: ENUMS.AUTH_TYPE.FACE_OR_SMS
    },
    // { title: '办理信息', component: two, previous: ENUMS.STEP.ZERO, next: ENUMS.STEP.FINISH, }
]
export default {
    name: 'index',
    components: { one, two, },
    data () {
        return {
            stepMap,
        }
    },
    onLoad(options) {
        const projectNo = options?.projectNo;
        if (projectNo) this.setYwdjh(projectNo);
    },
    methods: {
        ...mapMutations('offsetMortgage', ['setYwdjh']),
    },
}
</script>

<style scoped lang="less">

</style>
