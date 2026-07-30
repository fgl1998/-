<template>
  <view class="step_container">
    <view v-for="(section, si) in formConfig.sections" :key="si">
      <box-title :title="section.title" />
      <van-form :ref="'form_' + si" :scroll-to-error="true">
        <template v-for="(item, index) in section.fields">
          <van-form-item-map
            :key="index"
            v-if="!item.if || item.if(formData)"
            :formItemConfig.sync="item"
            :formData="formData"
          />
        </template>
      </van-form>
    </view>
  </view>
</template>

<script>
import mixin from '@osppm/store/person/freelance/fvContributionAdjust/one/mixin'

export default {
  name: 'FvContributionAdjustOne',
  mixins: [mixin],
}
</script>

<style lang="less" scoped>
</style>
