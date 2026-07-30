<template>
<div>
    <van-form validate-first ref="infoForm">
        <van-cell-group title="业务类型"  >
            <yhSelect :value="wtywlx"
                      :code-values="WTYWLXColumns"
                      :required="true"
                      :readonly="true"
                      @input="onYwlxChange"
                      label="签约类型"/>
        </van-cell-group>
        <van-cell-group v-if="houseList.length>0" title="房屋信息"  >
        <house-info
                :list-info="houseList"
                @selectHouseInfo="selectHouseInfo"
        >

        </house-info>
        </van-cell-group>
    </van-form>
</div>
</template>

<script>
import yhSelect from "@/pages/person/fetch/retirement/parts/yhSelect.vue";
import {mapActions, mapMutations, mapState} from "vuex";
import HouseInfo from "@/pages/person/fetch/loanEntrustDrawContract/parts/houseInfo.vue";

export default {
    name: "one",
    components: {HouseInfo, yhSelect},
    data(){
        return{
            houseList: [],
            WTYWLXColumns:[]
        }
    },
    computed: {
        ...mapState('loanEntrustDrawContract', ['wtywlx','codeValues']),
    },
    async mounted() {
        // 清空 houseInfo，防止第二步返回的时候 houseInfo 还有值
        this.setHouseInfo(undefined)
        this.init()
        await this.loadCodeValues()
        this.WTYWLXColumns=this.codeValues.WTYWLXColumns
    },
    methods: {
        ...mapMutations('loanEntrustDrawContract', ['setHouseInfo', 'init']),
        ...mapActions('loanEntrustDrawContract', ['obtainEntrustExtractHouseInfo', 'checkIfEnableDoSign', 'repaymentHistoryOfCommercialLoans','loadCodeValues']),
        async onYwlxChange (value) {
            try {
                const response = await this.obtainEntrustExtractHouseInfo({ wtywlx: value, })
                response.forEach((obj) => {
                    obj.isChecked = false
                })
                this.houseList = response
                this.setHouseInfo(undefined)
            } catch (e) {
                this.setHouseInfo(undefined)
                this.houseList = []
                terminalUtil._alertMsgWindow('提示', '受理失败：' + e.message, 'error')
            }
        },
        selectHouseInfo (val) {
            this.setHouseInfo(undefined)
            this.setHouseInfo(val)

        },
        beforePrevious () {
            return false
        },
        async beforeNext () {
            return await new Promise((resolve) => {
                this.$refs.infoForm.validate().then(async () => {
                        try {
                            const res = await this.checkIfEnableDoSign()
                            if (res?.data.flag === '9') {
                                terminalUtil._alertMsgWindow('提示', '受理失败：' + res?.data.msgStr, 'error')
                                return false
                            }
                            await this.repaymentHistoryOfCommercialLoans()
                            resolve(true)
                        } catch (e) {
                            terminalUtil._alertMsgWindow('提示', e.message, 'error')
                            return false
                        }
                })
                return false
            })
        },
    },
}
</script>

<style scoped>

</style>
