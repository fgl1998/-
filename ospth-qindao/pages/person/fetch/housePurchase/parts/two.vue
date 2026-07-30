<template>
  <view>
    <box-title title="房屋信息"/>
    <van-form ref="form" :scroll-to-error="true">
      <van-form-item-map
          v-for="(item, index) in formConfig.fields"
          :key="item.name"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />
    </van-form>

    <van-popup v-if="showPopup" v-model="showPopup" class="file-popup" position="bottom"
               :style="{height: '50%', display: 'flex', flexDirection: 'column'}" round>
      <van-area title="标题" :area-list="areaList" @confirm="confirm" />
    </van-popup>

  </view>
</template>
<script>
import mixin from '@osppm/store/person/fetch/housePurchase/two/mixin'

export default {
  name: 'three',
  mixins: [mixin],
}
</script>
<style scoped lang="scss">
.file-popup {
  height: 50%;
  padding-top: 24rpx;
  display: flex;
  flex-direction: column;

  .file-popup-button {
    margin-top: auto;
  }
}
</style>
