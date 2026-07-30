<template>
  <div>
      <van-cell-group inset>
        <yhSelect :value="baseData.dklx"
                  :code-values="codeValues.DKLXColumns.filter(ele => '01,02'.includes(ele.value)) || []"
                  :required="true"
                  @input="(v)=> {baseData.dklx=v;dklxSel()}"
                  label="贷款类型"/>
        <yhSelect :value="baseData.hklx"
                  :code-values="codeValues.HKLXColumns"
                  :required="true"
                  @input="(v)=> {baseData.hklx=v;}"
                  label="还款类型"/>
        <van-field label="约定还款日"
                   v-model="baseData.ydhkr"
                   input-align="right"
                   type="number"
                   :min="0"
                   :max="30"
                   v-show="baseData.hklx === '01'"
                   :required="baseData.hklx === '01'"
                   placeholder="请填写约定还款日"/>
        <yhSelect :value="baseData.dkhkfs"
                  :code-values="codeValues.DKHKFSColumns.filter(ele => '01,02'.includes(ele.value))"
                  :required="true"
                  @input="(v)=> baseData.dkhkfs = v"
                  label="还款方式"/>
        <yhSelect :value="baseData.dkdblx"
                  :code-values="codeValues.DKDBLXColumns.filter(ele => '01,04'.includes(ele.value))"
                  :required="true"
                  @input="(v)=> baseData.dkdblx = v"
                  :disabled="true"
                  label="贷款担保类型"/>
        <yhSelect :value="baseData.sfzcdk"
                  :code-values="codeValues.SHIFOUColumns"
                  :required="true"
                  @input="(v)=> {baseData.sfzcdk = v;this.obtainLoanLimitInfo()}"
                  label="是否再次贷款"/>
        <yhSelect :value="baseData.llzxbz"
                  :code-values="[{'value':'01','label':'第一次公积金贷款'},{'value':'02','label':'第二次公积金贷款'}]"
                  :required="true"
                  :disabled="true"
                  @input="(v)=> {baseData.llzxbz = v;}"
                  label="利率执行标准"/>
        <yhSelect :value="baseData.sfbfdy"
                  :code-values="codeValues.SHIFOUColumns"
                  :required="true"
                  :disabled="true"
                  @input="(v)=> {baseData.sfbfdy = v;}"
                  label="是否本房抵押"/>
        <van-field label="贷款年限" v-model="baseData.dknx" input-align="right"
                   type="number"
                   :rules="[{ required:true, }]" placeholder="请填写贷款年限"
                   @change="filldkqs"/>
        <van-field label="贷款期数" v-model="baseData.dkqs" input-align="right"
                   type="number"
                   :disabled="true"
                   :rules="[{ required:true, }]" placeholder="请填写贷款期数"/>
        <van-field label="房屋总价"
                   v-model="baseData.fwzj"
                   input-align="right"
                   type="number"
                   :disabled="true"
                   :rules="[{ required:true, }]" placeholder="请填写房屋总价"/>
        <van-field label="首付金额" v-model="baseData.sfje" input-align="right"
                   type="number"
                   :rules="[{ required:true, }]"
                   @blur="fillsfjebl"
                   placeholder="请填写首付金额"/>
        <van-field label="首付金额比例(%)" v-model="baseData.sfjebl" input-align="right"
                   type="number"
                   :disabled="true"
                   :rules="[{ required:true, }]"
                   placeholder="首付金额比例(%)"/>

        <!-- 组合贷款/商转公时显示商业贷款相关信息 -->
        <template v-if="baseData.dklx === '02'">
          <yhSelect :value="baseData.sydkyhdm"
                    :code-values="codeValues.YHHBColumns || []"
                    :required="true"
                    @input="(v)=> {$set(baseData,'sydkyhdm',v); loadSydkBranches(v)}"
                    label="商业贷款银行"/>
          <yhSelect :value="baseData.sydkzhdm"
                    :code-values="sydkBranchList"
                    :required="true"
                    @input="(v)=> $set(baseData,'sydkzhdm',v)"
                    label="商业贷款支行"/>
        <!--  <van-field label="商业贷款金额(元)" v-model="baseData.sydkje" input-align="right"
                     type="number"
                     :disabled="true"
                     placeholder="商业贷款金额（自动计算）"/>
          <van-field label="商业贷款余额(元)" v-model="baseData.sydkye" input-align="right"
                     type="number"
                     :disabled="true"
                     placeholder="商业贷款余额"/> -->
          <van-field label="商业贷款期数" v-model="baseData.sydkqs" input-align="right"
                     type="number"
                     :rules="[{ required:true }]"
                     required
                     placeholder="请填写商业贷款期数"
                     @blur="getMonthPayInfo"/>
          <van-field label="商业贷款发放日期" v-model="baseData.sydkffrq" input-align="right"
                     readonly
                     :required="true"
                     :rules="[{ required:true }]"
                     placeholder="请选择发放日期"
                     @click="showSydkffrqPicker = true"/>
          <van-popup v-model="showSydkffrqPicker" position="bottom">
            <van-datetime-picker
              v-model="sydkffrqDate"
              type="date"
              title="选择发放日期"
              :max-date="maxDate"
              @confirm="confirmSydkffrq"
              @cancel="showSydkffrqPicker = false"
            />
          </van-popup>
          <van-field label="商贷执行利率(%)" v-model="baseData.txdksdzxll" input-align="right"
                     type="number"
                     :rules="[{ required:true }]"
                     placeholder="请填写商贷执行利率"
                     @blur="getMonthPayInfo"/>
        </template>

      </van-cell-group>
  </div>
</template>
<script>
import {mapActions, mapState,} from 'vuex'
import yhSelect from '../../../parts/common/yhSelect.vue'
export default {
  name: 'loanBaseInfo',
  props: {
  },
  components:{yhSelect},
  data() {
    return {
      commonBizApply: { bizApplyType: 'MP020', bizApplyRegisterNo: '' },
      showDateTimeFrame:false,
      showPopup: false,
      ydhkrFlag:false,
      showSydkffrqPicker: false,
      sydkffrqDate: new Date(),
      maxDate: new Date(),
      sydkBranchList: [],
    }
  },
  computed: {
    ...mapState('perloanApply', ['dkywh', 'shareHouseInfo', 'selectedHouseInfoRows','codeValues','baseData']),
    // filed是否是disabled的取自disabledObj对象
    disabledObj () {
      return {
        defaultDis: true,
        isDisabled: true,
      }
    },
    userInfo() {
              return this.$user?.getUser()
    },
  },
  async mounted() {
    // 加载已保存数据时,如果有首付金额和房屋总价但没有首付比例,则自动计算
    const { sfje, fwzj, sfjebl } = this.baseData
    if (sfje && fwzj && !sfjebl) {
      await this.initLoanBaseInfo()
    }
  },
  watch:{
    // 组合贷: 公积金贷款金额变化时自动计算商业贷款金额
    'baseData.htdkje': {
      handler(newVal) {
        if (this.baseData.dklx !== '02' || !newVal || !this.baseData.sfje) return
        const loanTotal = this.$commonJs.calculateMoney([this.baseData.fwzj, this.baseData.sfje], '-')
        this.baseData.sydkje = this.$commonJs.calculateMoney([loanTotal, newVal], '-')
      }
    },
    // 组合贷: 商业贷款金额/期数/利率任一变化, 即调后台计算商贷首月还款额等信息
    'baseData.sydkje': {
      handler(newVal) {
        if (this.baseData.dklx === '02' && newVal) { this.getMonthPayInfo() }
      }
    },
    'baseData.sydkqs': {
      handler(newVal) {
        if (this.baseData.dklx === '02' && newVal) { this.getMonthPayInfo() }
      }
    },
    'baseData.txdksdzxll': {
      handler(newVal) {
        if (this.baseData.dklx === '02' && newVal) { this.getMonthPayInfo() }
      }
    }
  },
  methods: {
    ...mapActions('perloanApply', ['uriForCheckFpaymenScale','uriForCreateMonthPay','uriForObtainLoanLimitInfo','uriForQueryLoanBankBranch']),
    dklxSel () {
      // 重置公积金贷款金额、商业贷款金额、商贷执行利率
      this.baseData.htdkje = ''
      this.baseData.sydkje = ''
      this.baseData.txdksdzxll = ''
      this.baseData.sydkyhdm = ''
      this.baseData.sydkzhdm = ''
      this.baseData.sydkye = ''
      this.baseData.sydkqs = ''
      this.baseData.sydkffrq = ''
      this.sydkBranchList = []
    },

    // 加载商业贷款支行列表
    async loadSydkBranches(bankCode) {
      if (!bankCode) { this.sydkBranchList = []; return }
      try {
        const res = await this.uriForQueryLoanBankBranch({ bankCode, ...this.commonBizApply })
        this.sydkBranchList = (res?.data?.list || []).map(item => ({ value: item.branchCode || item.value, label: item.branchName || item.label }))
      } catch (e) {
        this.sydkBranchList = []
      }
    },

    // 确认商业贷款发放日期
    confirmSydkffrq(val) {
      const y = val.getFullYear()
      const m = String(val.getMonth() + 1).padStart(2, '0')
      const d = String(val.getDate()).padStart(2, '0')
      this.baseData.sydkffrq = `${y}-${m}-${d}`
      this.showSydkffrqPicker = false
    },

    async fillsfjebl () {
      const { fwzj, dklx, sfje } = this.baseData
      if (!fwzj || !sfje) return
      // 判断首付金额是否大于房屋总价
      if (this.$commonJs.calculateMoney([sfje, fwzj], '-') > 0) {
        this.$toast('购房首付款不能高于房屋总价')
        this.baseData.sfje = ''
        return
      }
      // 贷款总额 = 房屋总价 - 首付款
      const loanTotal = this.$commonJs.calculateMoney([fwzj, sfje], '-')
      if (dklx === '01') {
        // 纯公积金贷款: 公积金贷款金额=贷款总额
        this.baseData.htdkje = loanTotal
        this.baseData.sydkje = ''
        this.baseData.sydkqs = ''
        this.baseData.txdksdzxll = ''
        this.baseData.sdsyhke = ''
      } else {
        // 组合贷: 清空公积金贷款金额, 等待用户手动输入
        this.baseData.htdkje = ''
        this.baseData.sydkje = ''
        this.baseData.sydkqs = ''
        this.baseData.txdksdzxll = ''
        this.baseData.sdsyhke = ''
      }
      // 获取首付比例并调用月还款计算
      await this.initLoanBaseInfo()
    },
    // 验证购房首付比并计算月还款信息
    async initLoanBaseInfo () {
      let formData = {
        sfje: this.baseData.sfje,
        fwzj: this.shareHouseInfo.gffwzj,
        dkjylx: this.shareHouseInfo.dkjylx,
        ...this.commonBizApply
      }
      let response
      try{
        response = await this.uriForCheckFpaymenScale(formData)
      }catch (error){
        this.$toast(error)
        return
      }
      this.baseData.sfjebl = response?.data?.sfjebl || response?.sfjebl || this.baseData.sfjebl
      await this.getMonthPayInfo()
    },
	
	

    async getMonthPayInfo(){
      let formData = {
        sfje: this.baseData.sfje,
        fwzj: this.shareHouseInfo.gffwzj,
        dkjylx: this.shareHouseInfo.dkjylx,
        ...this.commonBizApply
      }
      formData.dkywh = this.dkywh
      formData.llzxbz = this.llzxbz
      formData.dklx = this.baseData.dklx
      formData.htdkje = this.baseData.htdkje
      formData.sydkje = this.baseData.sydkje
      formData.dkjylx = this.shareHouseInfo.dkjylx
      formData.rateFloatScale = this.baseData.llfdbl ?? '0'
      formData.dkhkfs = this.baseData.dkhkfs
      formData.dkqs = this.baseData.dkqs
      formData.dknx = this.baseData.dknx
      formData.dkdblx = this.baseData.dkdblx
      formData.fwts = this.shareHouseInfo.fwts
      formData.txdksdzxll = this.baseData.txdksdzxll
      formData.sydkqs = this.baseData.sydkqs
      let res
      try{
        res = await this.uriForCreateMonthPay(formData)
      }catch (error){
        this.$toast(error)
        return
      }
      this.repayInfo = res
      const fieldsToSet = {}
      for (const key in res) {
        if (res[key] !== null && res[key] !== undefined) {
          fieldsToSet[key] = res[key]
        }
      }
      Object.assign(this.baseData, fieldsToSet)
    },

    async filldkqs() {
      // 贷款期数为贷款年限*12
      this.baseData.dkqs = this.baseData.dknx * 12
      await this.getMonthPayInfo()
    },
    // 计算最大可贷信息
    async obtainLoanLimitInfo () {
      try{
        await this.uriForObtainLoanLimitInfo({
          llzxbz:this.shareHouseInfo.fwts,
          ywdjh: this.commonBizApply.bizApplyRegisterNo,
          dkywh: this.dkywh,
          fwzj: this.shareHouseInfo.gffwzj,
          dkjylx:this.shareHouseInfo.dkjylx,
          fwxz : this.shareHouseInfo.fwxz,
          sfzcdk:this.baseData.sfzcdk,
          fangling : this.shareHouseInfo.fangling,
          dknx : this.baseData.dknx,
          sydkqs: this.baseData.sydkqs,
          sfje : this.baseData.sfje,
          dkhkfs:this.baseData.dkhkfs,
          ...this.commonBizApply
        })
      }catch (error){
        this.$toast(error)
        return
      }
    },
  }
}
</script>
<style lang="less" scoped>
/deep/ .van-cell-group--inset {
  margin: 0 16px 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/deep/ .van-field__label {
  min-width: 7rem;
}
</style>
