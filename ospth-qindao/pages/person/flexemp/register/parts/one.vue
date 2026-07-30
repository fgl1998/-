<template>
  <view>
    <view v-for="(section, si) in formConfig.sections" :key="si">
      <box-title :title="section.title" />
      <van-notice-bar color="#1677ff" background="#cce1ff"  v-show="section.title==='个人缴存信息'">
        月缴存额上下限（范围：1200元 ~ 7000元）
      </van-notice-bar>
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
        <van-cell title="灵活就业人员开户协议" clickable @click="radio = '1'">
          <template #right-icon>
            <van-radio name="1"/>
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
  </view>
</template>

<script>
import mixin from '@osppm/store/person/freelance/freelanceOpenAccount/one/mixin'

export default {
  name: 'FlexempRegisterOne',
  mixins: [mixin],
  data() {
    return {
      radio: '',
    }
  },
}
</script>
