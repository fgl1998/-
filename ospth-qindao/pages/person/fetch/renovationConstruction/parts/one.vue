<!-- 提取人身份 -->
<template>
  <view>
    <box-title title="提取人身份"/>
    <van-form ref="form" :scroll-to-error="true">
      <van-form-item-map
          v-for="(item, index) in formConfig.fields"
          :key="index"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />
    </van-form>
  </view>
</template>
<script>
import mixin from '@osppm/store/person/fetch/renovationConstruction/one/mixin'

export default {
  name: 'one',
  mixins: [mixin],
}
</script>
<style scoped lang="scss">

</style>
