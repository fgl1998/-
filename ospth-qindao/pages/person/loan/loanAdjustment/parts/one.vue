<template>
  <view>
    <van-form ref="form" :scroll-to-error="true">
      <box-title title="签约类型"/>
      <van-form-item-map
          v-for="(item, index) in formConfig.fields"
          :key="index"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />
      <view v-if="showLoanAndContractInfo">
        <box-title title="贷款信息"/>
        <van-form-item-map
            v-for="(item, index) in formConfig.loanFields"
            :key="index"
            v-if="!item.if || item.if(formData)"
            :formItemConfig.sync="item"
            :formData="formData"
        />
        <box-title title="签约信息"/>
        <van-form-item-map
            v-for="(item, index) in formConfig.contractInfoFields"
            :key="index"
            v-if="!item.if || item.if(formData)"
            :formItemConfig.sync="item"
            :formData="formData"
        />
      </view>
    </van-form>

    <van-popup v-model="showPopup" position="bottom" :style="{height: '50%',display: 'flex', flexDirection: 'column'}">
      <van-form-item-map
          v-for="(item, index) in formConfig.borrowerFields"
          :key="index"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />
      <van-button type="info" style="margin-top: auto" block @click="showPopup = false">查询</van-button>
    </van-popup>
  </view>
</template>

<script>
import {mapActions, mapMutations, mapState} from 'vuex'
import LoanInfo from '@/pages/person/loan/loanAdjustment/parts/loanInfo.vue'
import mixin from '@osppm/store/person/loan/loanAdjustment/one/mixin'

export default {
  name: 'one',
  components: {LoanInfo},
  mixins: [mixin],
  data() {
    return {
      loanInfoList: [],
      WTYWLXColumns: []
    }
  },
  computed: {
    ...mapState('offsetMortgage', ['chdywlx', 'codeValues']),
  },
  async mounted() {
    // 清空 houseInfo，防止第二步返回的时候 houseInfo 还有值
    try {
      this.loanInfoList = await this.extractRegistrationQuery()
      await this.loadCodeValues()
      this.WTYWLXColumns = this.codeValues.WTYWLXColumns.filter(item => ['1', '3'].includes(item.value))
    } catch (e) {
      terminalUtil._alertMsgWindow('提示', '受理失败：' + e.message, 'error')
    }

  },
  methods: {
    ...mapActions('offsetMortgage', ['extractRegistrationQuery', 'validLoan', 'loadCodeValues']),
    ...mapMutations('offsetMortgage', ['SETSELECTDATA', 'setChaywlx']),
    async onYwlxChange(value) {
      this.setChaywlx(value)
    },
    selectLoanInfo(val) {
      this.SETSELECTDATA(undefined)
      this.SETSELECTDATA(val)

    },
    beforePrevious() {
      return false
    },
    async beforeNext() {
      // return await new Promise((resolve) => {
      //   this.$refs.infoForm.validate().then(async () => {
      //     try {
      //       await this.validLoan()
      //       resolve(true)
      //     } catch (e) {
      //       terminalUtil._alertMsgWindow('提示', e.message, 'error')
      //       return false
      //     }
      //   })
      //   return false
      // })
      return true
    },
  },
}
</script>

<style scoped>

</style>
