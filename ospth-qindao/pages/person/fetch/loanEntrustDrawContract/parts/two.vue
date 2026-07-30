<template>
<div>
    <van-form validate-first ref="infoForm">
        <van-cell-group title="收款账户信息"  >
            <van-field v-model="signData.skzhmc" placeholder="请输入收款账户名称"
                       :rules="[{ required: true}]" :disabled="true"
                       input-align="right" required label="收款账户名称"/>
            <yhSelect :value="signData.tqfs"
                      :code-values="TQFSColumns"
                      :required="true"
                      :readonly="true"
                      :disabled="wtywlx==='3'"
                      @input="methodFundTransferFn"
                      label="资金划拨方式"/>
            <yhSelect :value="signData.yhkzl"
                      :code-values="YHKZLColumns"
                      :required="true"
                      :readonly="true"
                      :disabled="wtywlx==='3'"
                      @input="(v)=> signData.yhkzl=v"
                      label="账户种类"/>
            <van-field v-model="signData.skzh" placeholder="请输入收款银行账号"
                       :disabled="wtywlx==='3'"
                       :rules="[{ required: true,}]" type="digit"
                       input-align="right" required label="收款银行账号">
            </van-field>
            <yhSelect :value="signData.yhhb"
                      :code-values="YHHBColumns"
                      :disabled="wtywlx==='3'"
                      :required="true"
                      @input="(v)=> signData.yhhb = v"
                      ref="bankCategory"
                      label="收款银行行别"/>
        </van-cell-group>
        <van-cell-group title="签约信息"  >
            <yhSelect :value="agreementData.qylx"
                      :code-values="QYLXColumns"
                      :required="true"
                      :disabled="wtywlx !== '1'"
                      @input="(v)=> agreementData.qylx = v"
                      ref="bankCategory"
                      label="签约类型"/>
            <yhSelect :value="agreementData.sdwttqpl"
                      :code-values="fetchFrequencyList"
                      :required="true"
                      :disabled="wtywlx !== '1'"
                      @input="(v)=> agreementData.sdwttqpl = v"
                      ref="bankCategory"
                      label="商贷签约频率"/>
            <van-field v-model="agreementData.xyje" placeholder="请输入协议金额（元）"
                       :rules="[{ required: true,}]" type="digit"
                       :readonly="wtywlx !== '1'"
                       input-align="right" required label="协议金额（元）">
            </van-field>
            <van-field :value="`每月${agreementData.sdwttqrq}日`"
                       input-align="right" readonly required label="商贷签约日期"/>
            <van-field :value="dateFormat(agreementData.qssj)" input-align="right" readonly required
                       label="协议起始时间"/>
            <van-field :value="dateFormat(agreementData.jssj)" input-align="right" :readonly="wtywlx !== '1'"
                       required
                       @click="showCalendar = true&&wtywlx === '1' " label="协议结束时间"/>
            <yhSelect v-if="wtywlx === '3'" :value="agreementData.jyyy"
                      :code-values="jyyyColumns"
                      :required="true"
                      :readonly="true"
                      @input="(v)=> agreementData.jyyy = v"
                      label="解约原因"/>
        </van-cell-group>
    </van-form>
    <van-popup v-model="showCalendar" position="bottom">
        <van-datetime-picker type="date" title="选择年月日" :min-date="minDate"
                             v-model="currentDate"
                             @cancel="showCalendar = false"
                             @confirm="calendarConfirm"/>
    </van-popup>
</div>
</template>

<script>
import yhSelect from "@/pages/person/fetch/retirement/parts/yhSelect.vue";
import {mapActions, mapMutations, mapState} from "vuex";
import moment from "moment";

export default {
    name: "two",
    components: {yhSelect},
    data(){
        return{
            TQFSColumns:[],
            YHKZLColumns:[],
            YHHBColumns:[],
            // 签约频率码表
            fetchFrequencyList: [],
            // 是否显示时间选择框
            showCalendar: false,
            jyyyColumns:[],
            QYLXColumns:[],
            user:{}
        }
    },
    computed: {
        ...mapState('loanEntrustDrawContract', ['signData', 'agreementData','wtywlx','codeValues']),
        minDate() {
            return moment(this.agreementData.qssj).toDate()
        },
        currentDate: {
            get() {
                return moment(this.agreementData.jssj).toDate()
            },
            set() {
            }
        }
    },
    watch: {
        // 一旦检测到空就补默认值
        'signData.skzhmc'(val) {
            if (!val?.trim()) {
                this.setSignData( {
                    ...this.signData,
                    skzhmc: this.user?.employeesBo?.xingming ?? ''
                })
            }
        }
    },
    mounted() {
        this.user = this.$base.getUser();
        const { YHKZLColumns = [], YHHBColumns = [], TQFSColumns = [],jyyyColumns=[],QYLXColumns=[] } = this.codeValues || {};
        this.YHKZLColumns = YHKZLColumns
        this.YHHBColumns = YHHBColumns
        this.TQFSColumns = TQFSColumns.filter(item => ['02', '97'].includes(item.value))
        this.QYLXColumns=QYLXColumns
        this.jyyyColumns=jyyyColumns
        this.fetchFrequencyList = [{ value: '2', label: '按年提取', }, { value: '3', label: '按月提取', }]
        this.setSignData( {
            ...this.signData,
            skzhmc: this.user?.employeesBo?.xingming ?? ''
        })
    },
    methods: {
        ...mapMutations('loanEntrustDrawContract', ['setSignData']),
        ...mapActions('loanEntrustDrawContract', ['queryBankCardInfo', 'submitEntrustExtractContract', 'repaymentHistoryOfCommercialLoans']),
        async methodFundTransferFn (value) {
            try {
                await this.queryBankCardInfo({ tqfs: value, })
            } catch (e) {
                terminalUtil._alertMsgWindow('提示', '受理失败：' + e.message, 'error')
            }
        },
        dateFormat(date) {
            if(date){
                return moment(date).format('yyyy-MM-DD')
            }else {
                return ''
            }

        },
        calendarConfirm(value) {
            this.agreementData.jssj = moment(value)
            this.showCalendar = false
        },
        async beforeNext () {
            return await new Promise((resolve) => {
                this.$refs.infoForm.validate().then(async () => {
                        try {
                            await this.submitEntrustExtractContract({...this.signData,...this.agreementData})
                            resolve(true)
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
