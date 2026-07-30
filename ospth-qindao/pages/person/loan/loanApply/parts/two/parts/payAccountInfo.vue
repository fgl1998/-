<template>
  <div>
      <van-cell-group inset>
        <yhSelect :value="houseData.zhkhyhdm"
                  :code-values="this.codeValues.YHHBColumns"
                  :disabled ="true"
                  :required="true"
                  @input="(v)=> {houseData.zhkhyhdm = v}"
                  label="还款账户开户银行"/>
        <van-field label="还款账户名称" v-model="houseData.hkzhmc" input-align="right"
                   :disabled="true"
                   :required="true"
                   :rules="[{required:true}]"
                    placeholder="还款账户名称"/>
        <van-field label="还款账户号码" v-model="houseData.hkzh" input-align="right"
                   :required="true"
                   :rules="[{required:true}]"
                   placeholder="还款账户号码"/>
        <yhSelect :value="houseData.hkzhzl"
                  :code-values="this.codeValues.YHKZLColumns.filter(ele => '01,02'.includes(ele.value)) || []"
                  :required="true"
                  :rules="[{required:true}]"
                  @input="(v)=> {houseData.hkzhzl = v}"
                  label="还款账户种类"/>
      </van-cell-group>
  </div>
</template>
<script>
import {mapActions, mapMutations, mapState,} from 'vuex'
import yhSelect from '../../../parts/common/yhSelect.vue'
export default {
  name: 'payAccountInfo',
  props: {
  },
  components:{yhSelect},
  data() {
    return {
    }
  },
  computed: {
    ...mapState('perloanApply', ['loanbuscode', 'shareHouseInfo', 'selectedHouseInfoRows','codeValues','houseData']),
    userInfo() {
         return this.$user?.getUser()
    },
  },
  mounted() {
    // 保存最纯净的贷款基本信息
    this.initHouseData = JSON.parse(JSON.stringify(this.houseData))
  },
  methods: {
    ...mapActions('perloanApply', ['uriForQueryLoanApplyAuthBuild', 'uriForObtainAcceptLoanProj', 'uriForQueryLoanBankBranch',
      'uriForQueryBuildingInfo', 'uriForObtainAllHouseInfo', 'uriForSaveLoanHouseInfo', 'uriForObtainAcceptLoanProjCorpInfo']),
    ...mapMutations('perloanApply', ['saveRatelevel']),
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
