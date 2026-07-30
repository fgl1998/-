<template>
  <div class="main">
    <box-title title="提取信息"/>
    <van-form ref="form" :scroll-to-error="true">
      <van-form-item-map
          v-for="(item, index) in formConfig.fields"
          :key="index"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />
    </van-form>
    <fetch-bank-info v-if="formData.skzh === '-1'"/>
  </div>
</template>

<script>
import fetchBankInfo from '@/pages/person/fetch/commonParts/fetchBankInfo.vue'
import {mapActions, mapMutations, mapState} from 'vuex'
import {Dialog} from 'vant'
import mixin from '@osppm/store/person/fetch/overseas/one/mixin'

export default {
  name: 'one',
  components: {fetchBankInfo},
  mixins: [mixin],
  data() {
    return {
      YHKZLColumns: [],
      YHHBColumns: [],
      TQFSColumns: [],
      user: {},
      showBankDlg: false,
      selBank: undefined
    }
  },
  computed: {
    ...mapState('overseas', ['accInfo', 'codeValues', 'bankAccList', 'fetchInfo']),
  },
  watch: {
    // 一旦检测到空就补默认值
    'accInfo.skzhmc'(val) {
      if (!val?.trim()) {
        this.setAccInfo({
          ...this.accInfo,
          skzhmc: this.user?.employeesBo?.xingming ?? ''
        })
      }
    }
  },
  async mounted() {
    try {
      await this.init()
      await this.preCheck()
      await this.getFetchAmount()
      this.user = this.$base.getUser()
      // 兜底空数组
      const {YHKZLColumns = [], YHHBColumns = [], TQFSColumns = []} = this.codeValues || {}
      this.YHKZLColumns = YHKZLColumns
      this.YHHBColumns = YHHBColumns
      this.TQFSColumns = TQFSColumns.filter(item => ['02', '97'].includes(item.value))
      // 一次性补默认值
      if (!this.accInfo.skzhmc?.trim()) {
        this.setAccInfo({...this.accInfo, skzhmc: this.user?.employeesBo?.xingming ?? ''})
      }
    } catch (e) {
      terminalUtil._alertMsgWindow('提示', '受理失败：' + e.message, 'error')
    }
  },

  methods: {
    ...mapMutations('exitFetch', ['setYwdjh', 'setAccInfo']),
    ...mapActions('exitFetch', ['queryBankCardInfo', 'getFetchAmount', 'preCheck', 'fetchCommit', 'init']),
    async methodFundTransferFn(v) {
      try {
        await this.queryBankCardInfo({tqfs: v,})
        if (this.bankAccList?.length > 0) {
          this.showBankDlg = true
        } else {
          this.setAccInfo({
            ...this.accInfo,
            skzhmc: this.user?.employeesBo?.xingming
          })
        }
      } catch (e) {
        terminalUtil._alertMsgWindow('提示', '受理失败：' + e.message, 'error')
      }

    },
    handleOk() {
      if (!this.selBank) {
        terminalUtil._alertMsgWindow('提示', '请选择银行卡', 'error')
        return
      }
      this.setAccInfo(this.selBank)
      this.selBank = undefined
      this.showBankDlg = false
    },
    async beforeNext() {
      return await new Promise((resolve) => {
        this.$refs.infoForm.validate().then(async () => {
          try {
            if (!this.fetchInfo) {
              terminalUtil._alertMsgWindow('提示', '金额计算失败', 'error')
              return
            }
            await this.fetchCommit({...this.accInfo})
            resolve(true)
            Dialog.confirm({
              title: '提示',
              message: '提交成功',
            }).then(() => {
              window.history.go(-1)
            })
          } catch (e) {
            terminalUtil._alertMsgWindow('提示', '受理失败：' + e.message, 'error')
            resolve(false)
          }
        })
        return false
      })
    },
  }
}
</script>

<style scoped>

</style>
