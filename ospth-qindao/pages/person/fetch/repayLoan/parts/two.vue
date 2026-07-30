<template>
  <div>
    <box-title title="贷款信息"/>
    <van-form ref="form" :scroll-to-error="true">
      <van-form-item-map
          v-for="(item, index) in formConfig.fields"
          :key="item.name"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />
    </van-form>

    <box-title title="房屋信息"/>
    <van-form ref="form" :scroll-to-error="true">
      <van-form-item-map
          v-for="(item, index) in formConfig.fields4"
          :key="item.name"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />
    </van-form>
  </div>
</template>
<script>
import mixin from '@osppm/store/person/fetch/repayLoan/two/mixin'
export default {
  name: 'two',
  components: {},
  mixins: [mixin],
}
</script>
<style scoped lang="scss">

</style>
