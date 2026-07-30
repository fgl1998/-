<template>
  <div>
    <box-title title="提取金额"/>
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
import mixin from '@osppm/store/person/fetch/elevatorInstall/three/mixin'

export default {
  name: 'three',
  mixins: [mixin],
}
</script>
<style scoped lang="scss">

</style>
