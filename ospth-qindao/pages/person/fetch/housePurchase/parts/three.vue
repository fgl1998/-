<template>
  <view>
    <fetchNotice/>
    <box-title title="提取信息"/>
    <van-form ref="form" :scroll-to-error="true">
      <van-form-item-map
          v-for="(item, index) in formConfig.fields"
          :key="item.name"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />

      <box-title title="授权"/>
      <van-radio-group v-model="radio">
        <van-cell-group>
          <van-cell title="贷款征信授权" clickable @click="radio = '1'">
            <template #right-icon>
              <van-radio name="1"/>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-form>
    <fetch-bank-info v-if="formData.skzh === '-1'" @cancel="cancelAddBankCard" @add="addBankCard"/>
  </view>
</template>
<script>
import mixin from '@osppm/store/person/fetch/housePurchase/three/mixin'
import fetchBankInfo from '@/pages/person/fetch/commonParts/fetchBankInfo.vue'
import fetchNotice from '@/pages/person/fetch/commonParts/fetchNotice.vue'

export default {
  name: 'three',
  components: {fetchBankInfo, fetchNotice},
  mixins: [mixin],
}
</script>
<style scoped lang="scss">

</style>
