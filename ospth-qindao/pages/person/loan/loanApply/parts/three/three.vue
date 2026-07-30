<template>
  <div class="step_container">
    <!-- 选择codeValues -->
    <div class="content">
      <van-cell-group inset>
        <van-cell
          title="最大可贷年限"
          :value="loanLimitInfo.zdkdnx + '年'"
        />
        <van-cell
          title="最高可贷额度"
          :value="loanLimitInfo.zdkdje + '元'"
        />
      </van-cell-group>
      <van-form
        v-show="true"
        validate-first
        ref="inputForm"
      >
        <h1 class="title"><van-icon name="gold-coin-o"/> 贷款基本信息</h1>
         <loan-base-info ></loan-base-info>
        <h1 class="title"><van-icon name="balance-list-o"/> 贷款金额信息</h1>
         <repay-info ></repay-info>
      </van-form>
    </div>
   <!-- <div class="btn_box">
      <van-button
        class="btn"
        @click="saveLoanBase"
        type="primary"
      >保存</van-button>
    </div> -->
  </div>
</template>

<script>
import {mapActions, mapMutations, mapState,} from 'vuex'
import RepayInfo from "./parts/repayInfo";
import LoanBaseInfo from "./parts/loanBaseInfo";
export default {
  name: 'loanApplyBaseInfo',
  components: {RepayInfo,LoanBaseInfo},
  props: {
  },
  data () {
    return {
      commonBizApply: { bizApplyType: 'MP020', bizApplyRegisterNo: '' },
      dkzdnx: '', // 最大可贷年限
      dkzded: '',// 最高可贷额度
    }
  },
  computed: {
    ...mapState('perloanApply', ['dkywh', 'shareBaseInfo', 'shareHouseInfo','llzxbz', 'selectedHouseInfoRows','loanLimitInfo','baseData']),
    // filed是否是disabled的取自disabledObj对象
    disabledObj () {
      return {
        defaultDis: true,
        isDisabled: true,
      }
    },
  },
  watch: {
  },
  async mounted() {
    this.setBaseData({...this.baseData,...this.shareBaseInfo})
    if(this.baseData.llfdbl ===null || this.baseData.llfdbl === undefined || this.baseData.llfdbl === ''){
      this.baseData.llfdbl = 0
    }
    // 房屋总价从房屋信息获取 (shareHouseInfo中字段名为gffwzj)
    this.baseData.fwzj = this.shareHouseInfo.gffwzj || this.baseData.fwzj || ''
    // 利率执行标准: 取自房屋套数(统一补零为两位), 默认01(首次公积金贷款)
    const fwts = this.shareHouseInfo.fwts
    this.baseData.llzxbz = fwts ? (fwts.length === 2 ? fwts : '0' + fwts) : (this.baseData.llzxbz || '01')
    // 贷款担保类型默认抵押
    if (!this.baseData.dkdblx) this.baseData.dkdblx = '01'
    // 首付金额比例: 从保存数据的sfbl映射到sfjebl(去除%号)
    if (!this.baseData.sfjebl && this.baseData.sfbl) {
      this.baseData.sfjebl = String(this.baseData.sfbl).replace('%', '')
    }
    await this.obtainLoanLimitInfo()
  },
  methods: {
    ...mapActions('perloanApply', ['uriForObtainLoanLimitInfo','uriForSaveLoanBaseInfo']),
    ...mapMutations('perloanApply',['setBaseData']),
    // 计算最大可贷信息
    async obtainLoanLimitInfo () {
      try{
       await this.uriForObtainLoanLimitInfo({
          llzxbz:this.shareHouseInfo?.fwts,
          ywdjh: this.commonBizApply?.bizApplyRegisterNo,
          dkywh: this.dkywh,
          fwzj: this.shareHouseInfo?.gffwzj,
          dkjylx:this.shareHouseInfo?.dkjylx,
          fwxz : this.shareHouseInfo?.fwxz,
          sfzcdk:this.baseData?.sfzcdk,
          fangling : this.shareHouseInfo?.fangling,
          ...this.commonBizApply
        })
      }catch (error){
        this.$toast(error?.message || error || '保存失败')
        return
      }
    },
    // 保存
    saveLoanBase () {
        this.$refs.inputForm.validate().then(() => {
          this.submit()
        })
    },
    async submit () {
      const formData = JSON.parse(JSON.stringify(this.baseData))
      Object.assign(formData, this.repayInfo, this.commonBizApply, this.shareHouseInfo)
      formData.ywdjh = this.commonBizApply.bizApplyRegisterNo
      formData.dkywh = this.dkywh
      formData.dkjylx = this.shareHouseInfo.dkjylx
      formData.fzxjg = this.selectedHouseInfoRows.fzxjg
      const moneyValidutilResult = await this.validateLoanAmounts(formData)
      if(moneyValidutilResult){
        try{
          await this.uriForSaveLoanBaseInfo(formData)
          await this.$emit('refreshLoanSavedInfo')
        }catch (error){
          this.$toast(error)
          return
        }
      }
    },

    async validateLoanAmounts (formData) {
      // 检查公积金贷款金额是否为10000的整数倍
      if (!this.isMultipleOfTenThousand(formData.htdkje)) {
        this.$toast.fail('公积金贷款金额必须是10000的整数倍')
        return false
      }
      // 检查组合贷款商贷金额是否大于0
      if (formData.dklx === '02' && !this.isPositiveAmount(formData.sydkje)) {
        this.$toast.fail('组合贷款商贷金额必须大于0')
        return false
      }
      return true
    },
    isMultipleOfTenThousand (amount) {
      return amount % 10000 === 0
    },
    isPositiveAmount (amount) {
      return amount > 0
    },
    async formValidate() {
      try {
        await this.$refs.inputForm.validate()
        return true
      } catch {
        return false
      }
    },
    async beforeNext() {
      try {
        await this.saveLoanBase()
        return true
      } catch (err) {
        this.$toast(err)
        return false
      }
    },

  }
}
</script>

<style lang="less" scoped>
.title {
  font-size: 15px;
  font-weight: 600;
  color: #323233;
  margin: 16px 16px 12px;
  padding-left: 10px;
  border-left: 4px solid #1677ff;
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 22px;
}

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
