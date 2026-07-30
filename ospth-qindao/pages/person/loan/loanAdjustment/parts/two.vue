<template>
<div>
    <van-form validate-first ref="infoForm">
        <van-cell-group title="收款账户信息"  >
            <van-field v-model="selectData.dkzh" placeholder="请输入收款账户名称"
                       :rules="[{ required: true}]" :readonly="true"
                       input-align="right" required label="公积金贷款账号"/>
            <yhSelect :value="selectData.swtyhdm"
                      :code-values="YHHBColumns"
                      :required="true"
                      :readonly="true"
                      :disabled="true"
                      label="贷款银行"/>
            <yhSelect :value="selectData.dklx"
                      :code-values="DKLXColumns"
                      :required="true"
                      :readonly="true"
                      :disabled="true"
                      label="贷款类型"/>
            <van-field v-model="selectData.qyxylx"
                       :rules="[{ required: true}]" :readonly="true"
                       input-align="right" required label="签约协议类型"/>
            <van-field v-model="selectData.ydhkr"
                       :rules="[{ required: true}]" :readonly="true"
                       input-align="right" required label="约定冲还日"/>
            <van-field v-model="selectData.fwzl"
                       :rules="[{ required: true}]" :readonly="true"
                       input-align="right" required label="房屋坐落"/>
            <van-field v-model="selectData.bzxx"
                       :rules="[{ required: true}]"
                       v-if="chdywlx==='3'"
                       input-align="right" required label="解约原因"/>
        </van-cell-group>
    </van-form>
</div>
</template>

<script>
import yhSelect from "@/pages/person/fetch/retirement/parts/yhSelect.vue";
import {mapActions, mapMutations, mapState} from "vuex";
export default {
    name: "two",
    components: {yhSelect},
    data(){
        return{
            YHHBColumns:[],
            DKLXColumns:[]
        }
    },
    computed: {
        ...mapState('offsetMortgage', ['selectData', 'chdywlx','codeValues']),
    },
    mounted() {
        this.YHHBColumns=this.codeValues.YHHBColumns
        this.DKLXColumns=this.codeValues.DKLXColumns
    },
    methods: {
        ...mapActions('offsetMortgage', ['cancelRepaymentExtraSign', 'repaymentExtraSign']),
        async beforeNext () {
            return await new Promise((resolve) => {
                this.$refs.infoForm.validate().then(async () => {
                        try {
                            if (this.chdywlx === '1') {
                                await this.repaymentExtraSign()
                                resolve(true)
                            } else {
                                await this.cancelRepaymentExtraSign({...this.selectData})
                                resolve(true)
                            }
                        } catch (e) {
                            terminalUtil._alertMsgWindow('提示', '受理失败：' + e.message, 'error')
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
