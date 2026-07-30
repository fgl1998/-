<template>
  <div class="step_container">
    <box-title title="变更前信息" />
    <van-form ref="form" validate-first :scroll-to-error="true">
      <template v-for="(item, index) in formConfig.fields">
        <van-form-item-map
            :key="index"
            v-if="!item.if || item.if(formData)"
            :formItemConfig.sync="item"
            :formData="formData"
        />
      </template>
    </van-form>
    <box-title title="变更后信息" />
    <van-form ref="form" validate-first :scroll-to-error="true">
      <template v-for="(item, index) in formConfig.fields">
        <van-form-item-map
          :key="index"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
        />
      </template>
    </van-form>
  </div>
</template>

<script>
import mixin from '@osppm/store/person/loan/nameIdChange/one/mixin'

export default {
  name: 'nameIdChangeOne',
  mixins: [mixin],
}
</script>

<style scoped lang="less">
.step_container {
}
</style>
