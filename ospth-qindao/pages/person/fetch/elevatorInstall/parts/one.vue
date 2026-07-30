<!-- 提取人身份 -->
<template>
  <div>
    <van-form ref="form" :scroll-to-error="true">
      <box-title title="提取类型"/>
      <van-form-item-map
          v-for="(item, index) in formConfig.fields"
          :key="item.name"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />
      <box-title title="产权人信息" v-if="formConfig.isSelf(formData)"/>
      <van-form-item-map
          v-for="(item, index) in formConfig.fields2"
          :key="item.name"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />
      <box-title :title="formConfig.isInLawRelative(formData)" v-if="formConfig.isInLawRelative(formData)"/>
      <van-form-item-map
          v-for="(item, index) in formConfig.fields3"
          :key="item.name"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />
    </van-form>
  </div>
</template>
<script>
import mixin from '@osppm/store/person/fetch/elevatorInstall/one/mixin'

export default {
  name: 'one',
  mixins: [mixin],
}
</script>
<style scoped lang="scss">

</style>
