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
    <box-title title="协议信息" />
    <van-radio-group v-model="radio">
      <van-cell-group>
        <van-cell title="委托划扣协议" clickable @click="radio = '1'">
          <template #right-icon>
            <van-radio name="1"/>
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
  </view>
</template>

<script>
import mixin from '@osppm/store/person/freelance/freelanceSignManage/one/mixin'

export default {
  name: 'FlexempDeductionAgreementOne',
  mixins: [mixin],
  data() {
    return {
      radio: '',
    }
  },
}
</script>

<style lang="less" scoped>
</style>
