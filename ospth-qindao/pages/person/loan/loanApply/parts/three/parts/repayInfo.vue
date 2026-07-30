<template>
  <div>
      <van-cell-group inset>
        <van-field label="公积金贷款金额"
                   v-model="baseData.htdkje"
                   input-align="right"
                   @blur="calLoanInfo"
                   :rules="[{ required:true, }]" placeholder="请输入公积金贷款金额"/>
        <van-field label="商业贷款金额"
                   v-model="baseData.sydkje"
                   v-show = "baseData.dklx==='02'"
                   :required="baseData.dklx==='02'"
                   input-align="right"
                   :disabled="true"
                   placeholder="请输入商业贷款金额"/>
        <van-field label="商贷首月还款额"
                   v-model="baseData.sdsyhke"
                   input-align="right"
                   :disabled="true"
                   v-show = "baseData.dklx==='02'"
                   :required ="baseData.dklx==='02'"
                   placeholder="请输入商贷首月还款额"/>

        <van-field label="公积金首月还款额"
                   v-model="baseData.syhke"
                   input-align="right"
                   :disabled="true"
                   :rules="[{ required:true, }]" placeholder="请输入公积金首月还款额"/>
        <van-field label="公积金月还款总金额(元)"
                   v-model="baseData.yhkzje"
                   input-align="right"
                   :disabled="true"
                   :rules="[{ required:true, }]" placeholder="请输入公积金月还款总金额"/>
        <van-field label="家庭月收入(元)"
                   v-model="baseData.jtysr"
                   input-align="right"
                   :disabled="true"
                   :rules="[{ required:true, }]" placeholder="请输入家庭月收入"/>
        <!-- 月供收入比网厅不显示 -->
        <!-- <van-field label="月供收入比" v-model="baseData.ygsrb" ... /> -->
        <van-field label="公积金贷款年利率(%)"
                   v-model="baseData.nianll"
                   input-align="right"
                   :disabled="true"
                   :rules="[{ required:true, }]" placeholder="请输入贷款年利率"/>
        <van-field label="公积金贷款执行利率(%)"
                   v-model="baseData.jkhtll"
                   input-align="right"
                   :disabled="true"
                   :rules="[{ required:true, }]" placeholder="请输入公积金贷款执行利率"/>
        <van-field label="利率浮动比例(%)"
                   v-model="baseData.llfdbl"
                   input-align="right"
                   :disabled="true"
                   :rules="[{ required:true, }]" placeholder="请输入公积金贷款利率浮动比例"/>
        <van-field label="公积金月还常数(元)"
                   v-model="baseData.yhkcs"
                   input-align="right"
                   :disabled="true"
                   :rules="[{ required:true, }]" placeholder="请输入公积金月还常数"/>

      </van-cell-group>
  </div>
</template>
<script>
import {mapActions, mapState,} from 'vuex'
export default {
  name: 'repayInfo',
  props: {
  },
  components:{},
  data() {
    return {
      commonBizApply: { bizApplyType: 'MP020', bizApplyRegisterNo: '' },
      showDateTimeFrame:false,
      showPopup: false,
    }
  },
  watch:{
    'baseData.sdsyhke'(){
        this.obtainLoanLimitInfo()
    },
    'baseData.sfje'(){

    }
  },
  computed: {
    ...mapState('perloanApply', ['dkywh', 'shareHouseInfo', 'selectedHouseInfoRows','codeValues','baseData']),
    disabledObj () {
      return {
        defaultDis: true,
        isDisabled: true,
      }
    },
    userInfo() {
      return this.$store.state.login.userInfo
    },
  },
  async mounted() {
    if(this.baseData.htdkje){
      await this.getMonthPayInfo()
    }
  },
  methods: {
    ...mapActions('perloanApply', ['uriForCheckFpaymenScale','uriForCreateMonthPay','uriForObtainLoanLimitInfo']),
    handleInput(value) {
      // 只允许输入整数
      // 去除非数字字符
      value = value.replace(/[^\d]/g, "");
      // 如果以0开头，去掉开头的0
      if (value.startsWith("0")) {
        value = value.replace(/^0+/, "");
      }

      this.baseData.sydkqs = value.replace(/\D/g, '');
    },

    handletxdksdzxllInput(value) {
      // 将输入转换为字符串以便处理小数点
      const valueStr = value.toString();
      // 检查是否以0开头且不是小数
      if (valueStr.startsWith('0') && !valueStr.startsWith('0.')) {
        // 如果是以0开头的整数，清空输入
        this.baseData.txdksdzxll = '';
        return;
      }
      // 检查小数点后是否超过三位
      const decimalIndex = valueStr.indexOf('.');
      if (decimalIndex !== -1 && valueStr.length - decimalIndex - 1 > 3) {
        // 截取到小数点后三位
        this.baseData.txdksdzxll = parseFloat(valueStr.slice(0, decimalIndex + 4));
      } else {
        this.baseData.txdksdzxll = value;
      }
    },
    calLoanInfo () {
      const { htdkje, dklx, sfje, fwzj } = this.baseData
      if (!dklx || !sfje || !fwzj || !htdkje) return
      // 贷款总额 = 房屋总价 - 首付金额
      const loanTotal = this.$commonJs.calculateMoney([fwzj, sfje], '-')
      // 公积金贷款金额不能超过贷款总额
      if (parseFloat(htdkje) > parseFloat(loanTotal)) {
        this.$toast('公积金贷款金额不能超过房屋总价减去首付金额')
        this.baseData.htdkje = ''
        this.baseData.sydkje = ''
        return
      }
      if (dklx === '02') {
        // 组合贷: 商业贷款金额 = 贷款总额 - 公积金贷款金额
        this.baseData.sydkje = this.$commonJs.calculateMoney([loanTotal, htdkje], '-')
      }
      this.getMonthPayInfo()
    },

    dklxSel () {
      // 重置公积金贷款金额、商业贷款金额、商贷执行利率
      this.baseData.htdkje = ''
      this.baseData.sydkje = ''
      this.baseData.txdksdzxll = ''
    },

    async fillsfjebl () {
      const { fwzj, dklx, sfje } = this.baseData
      if (fwzj && sfje) {
        // 判断首付金额是否大于房屋总价
        if (this.$commonJs.calculateMoney([sfje, fwzj], '-') > 0) {
          this.$toast('购房首付款不能高于房屋总价')
          this.baseData.sfje = ''
          this.baseData.htdkje = ''
          return
        }
        // 贷款金额 = 房屋总价 - 首付款
        if (dklx == '01') {
          this.baseData.htdkje = this.$commonJs.calculateMoney([fwzj, sfje], '-')
        }
        // 验证购房首付比
        await this.initLoanBaseInfo()
      }
    },
    // 验证购房首付比
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
      this.baseData.sfjebl = response.sfjebl  // 首付比例
      await this.getMonthPayInfo()
    },

    async getMonthPayInfo(){
      // 确保在失去焦点时，值只保留小数点后三位
      if(this.baseData.txdksdzxll){
        const valueStr = this.baseData.txdksdzxll.toString();
        const decimalIndex = valueStr.indexOf('.');
        if (decimalIndex !== -1 && valueStr.length - decimalIndex - 1 > 3) {
          this.baseData.txdksdzxll = parseFloat(valueStr.slice(0, decimalIndex + 4));
        }
      }
      let formData = {
        sfje: this.baseData.sfje,
        fwzj: this.shareHouseInfo.gffwzj,
        dkjylx: this.shareHouseInfo.dkjylx,
        ...this.commonBizApply
      }
      // 获取月还款信息
      formData.dkywh = this.dkywh
      formData.llzxbz = this.llzxbz
      formData.dklx = this.baseData.dklx
      formData.htdkje = this.baseData.htdkje
      formData.sydkje = this.baseData.sydkje
      formData.dkjylx = this.shareHouseInfo.dkjylx
      formData.dkhkfs = this.baseData.dkhkfs
      formData.dkqs = this.baseData.dkqs
      formData.dknx = this.baseData.dknx
      formData.llfdbl = this.baseData.llfdbl ?? '0'
      formData.dblx = this.baseData.dblx
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
      // 动态设置表单值
      const fieldsToSet = {}
      for (const key in res) {
        // eslint-disable-next-line no-prototype-builtins
        if (res.hasOwnProperty(key) && res[key] !== null) {
          fieldsToSet[key] = res[key]
        }
      }
      Object.assign(this.baseData,{...this.baseData,...fieldsToSet})
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
          buscode: this.commonBizApply.bizApplyRegisterNo,
          dkywh: this.dkywh,
          fwzj: this.shareHouseInfo.gffwzj,
          dkjylx:this.shareHouseInfo.dkjylx,
          fwxz : this.shareHouseInfo.fwxz,
          sfzcdk:this.baseData.sfzcdk,
          fangling : this.shareHouseInfo.fangling,
          dklx : this.baseData.dklx,
          dkqs : this.baseData.dkqs,
          dknx : this.baseData.dknx,
          sdsyhke: this.baseData.sdsyhke,
          sydkqs: this.baseData.sydkqs,
          syhke : this.baseData.syhke,
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
