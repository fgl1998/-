<template>
  <div class="step_container">
    <van-form validate-first ref="inputHouseForm" style="margin-top: 40rpx;">
	  <h1 class="title">
	    贷款购房信息
	  </h1>
      <house-info  ref="houseInfo"></house-info>
	  <h1 class="title">
	    收款账号信息
	  </h1>
      <sell-account-info ></sell-account-info>
	  <h1 class="title">
	    还款信息
	  </h1>
      <pay-account-info ></pay-account-info>
    </van-form>
  </div>
</template>
<script>
import moment from 'moment'
import {mapActions, mapMutations, mapState,} from 'vuex'
import HouseInfo from "./parts/houseInfo";
import SellAccountInfo from "./parts/sellAccountInfo";
import PayAccountInfo from "./parts/payAccountInfo";
import loanApplyMixin from "@osppm/store/person/loan/loanApply/mixin";

export default {
  name: 'loanApplyHouseInfo',
  components: {PayAccountInfo, SellAccountInfo, HouseInfo},
  mixins:[loanApplyMixin],
  props: {
  },
  data() {
    return {
      commonBizApply: { bizApplyType: 'MP020', bizApplyRegisterNo: '' },
      sellAccDisabled: true, // 售房人账户号码disabled
    }
  },
  computed: {
    ...mapState('perloanApply', ['dkywh', 'shareHouseInfo', 'selectedHouseInfoRows','codeValues','houseData']),
    // filed是否是disabled的取自disabledObj对象
    disabledObj() {
      return {
        isDisabled: true,
        defaultDis: true,
        falseDis: false,
        sellAccDisabled: this.sellAccDisabled,
        showNewHouseInfo: this.showNewHouseInfo,
        showResaleHouseInfo: this.showResaleHouseInfo,
        showBuildHouseInfo: this.showBuildHouseInfo,
        showNewHouseInfoAndNotShowCurrrent: this.showNewHouseInfo && !this.showCurrrentHouseInfoAndBuildHouseInfo,
        showCurrrentHouseInfoAndshowResaleHouseInfo: this.showResaleHouseInfo || this.showCurrrentHouseInfoAndBuildHouseInfo,
        showThirdBuildHouseAndResaleHouseInfo: this.showResaleHouseInfo || this.showBuildHouseInfo || this.showCurrrentHouseInfoAndBuildHouseInfo,
      }
    },
    userInfo() {
      return this.$user?.getUser()
    },
  },
  mounted() {
    this.setHouseData({...this.houseData, hkzhmc: this.userInfo?.userName, ...this.shareHouseInfo, ...this.selectedHouseInfoRows})
  },
  watch: {
  },
  methods: {
    ...mapActions('perloanApply', ['uriForSaveLoanHouseInfo']),
    ...mapMutations('perloanApply', ['saveRatelevel','setHouseData']),
    saveHouseInfo() {
      this.$refs.inputHouseForm.validate().then(() => {
          this.submit()
        })
    },
    async submit() {
      const formData = JSON.parse(JSON.stringify(this.houseData))
      formData.bizApplyRegisterNo = this.commonBizApply.bizApplyRegisterNo
      formData.bizApplyType = this.commonBizApply.bizApplyType
      formData.hkzh = formData.hkzh.replaceAll(' ', '')
      formData.sfrzhhm = formData.sfrzhhm.replaceAll(' ', '')
      formData.fzxjg = this.selectedHouseInfoRows.fzxjg
      formData.ywdjh = this.commonBizApply.bizApplyRegisterNo
      formData.dkywh = this.dkywh
      //formData.agreementTime = moment(formData.agreementTime).format('YYYY-MM-DD')
      formData.cbyhwdName = (this.$refs.houseInfo?.cbyhwdList || []).find(obj => obj.value === formData.cbyhwd)?.label || ''
      if (formData.dkjylx === '03' || formData.dkjylx === '06') {
        formData.skzhlx = '01'
      } else {
        formData.skzhlx = '02'
      }
      if (formData.fangling) {
        if (parseInt(formData.fangling) > 20) {
          this.$toast(`二手房龄不能超过20年`)
          return
        }
      }
      const isdkjylxInvalid = formData.dkjylx !== '01' && formData.dkjylx !== '02';
      const isdkjylx02Andfwxz03 = formData.dkjylx === '02' && formData.fwxz === '03';
      if (isdkjylxInvalid || isdkjylx02Andfwxz03) {
        formData.skzhlx = '01';
      } else {
        formData.skzhlx = '02';
      }
      if (formData.fwjyrq) {
        formData.fwjyrq = moment(formData.fwjyrq).format('YYYY-MM-DD')
      }

      if (formData.wqbarq) {
        formData.wqbarq = moment(formData.wqbarq).format('YYYY-MM-DD')
      }

      if (formData.jgrq) {
        formData.jgrq = moment(formData.jgrq).format('YYYY')
        formData.buildYear = moment(formData.jgrq).format('YYYY')
      }
      // eslint-disable-next-line no-unused-vars
      let response
      try {
        response = await this.uriForSaveLoanHouseInfo(formData)
        const ratelevel = formData.fwts === '01' ? '01' : '02'
        this.saveRatelevel(ratelevel)
        this.refreshLoanSavedInfo()
      } catch (error) {
        this.$toast(error?.message || error || '保存失败')
        return
      }
    },
    async formValidate() {
      try {
        await this.$refs.inputHouseForm.validate()
        return true
      } catch {
        return false
      }
    },
    async beforeNext() {
      try {
        await this.saveHouseInfo()
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
	// 统一section标题
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

	// 卡片式表单组
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
