<!-- 变更手机 -->
<template>
  <view>
    <box-title title="变更手机" />
    <van-form ref="form" class="form" :scroll-to-error="true">
      <view v-for="(item, index) in formConfig.fields" :key="index">
        <van-form-item-map
            v-if="!item.if || item.if(formData)"
            :formItemConfig.sync="item"
            :formData="formData"
        />
      </view>
    </van-form>
  </view>
</template>

<script>
import mixin from '@osppm/store/person/marshal/personalPhoneManage/two/mixin'

export default {
  name: 'personalPhoneManageTwo',
  mixins: [mixin],
}
</script>

<style scoped lang="scss">

</style>
