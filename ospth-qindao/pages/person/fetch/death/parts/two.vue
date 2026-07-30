<!-- 录入逝者信息 -->
<template>
  <div>
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

    <fetch-bank-info v-if="formData.skzh === '-1'" @cancel="cancelAddBankCard" @add="addBankCard"/>
  </div>
</template>
<script>
import mixin from '@osppm/store/person/fetch/death/two/mixin'
import fetchBankInfo from '@/pages/person/fetch/commonParts/fetchBankInfo.vue'

export default {
  name: 'deadInfo',
  components: {fetchBankInfo},
  mixins: [mixin],
  created() {
  },
  mounted() {
  },
  methods: {
    // 使用弹窗的方式选择提取类型
    chooseExtractType() {
      this.$dialog.confirm({
        title: '温馨提示',
        message: '您是否有继承公证书或法院裁判文书？',
        confirmButtonText: '是',
        cancelButtonText: '否',
      }).then(() => {
        this.formData.tqlxLabel = '公证'
        this.$set(this.formData, 'tqlx', '1')
      }).catch(() => {
        this.formData.tqlxLabel = '非公证'
        this.$set(this.formData, 'tqlx', '2')
      })
    }
  },
}
</script>
<style scoped lang="scss">

</style>
