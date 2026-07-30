<!-- 录入逝者信息 -->
<template>
  <div>
    <box-title title="逝者信息"/>
    <van-form ref="form" :scroll-to-error="true">
      <van-form-item-map
          v-for="(item, index) in formConfig.fields"
          :key="index"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />
    </van-form>
  </div>
</template>
<script>
import mixin from '@osppm/store/person/fetch/death/one/mixin'

export default {
  name: 'deadInfo',
  mixins: [mixin],
}
</script>
<style scoped lang="scss">

</style>
