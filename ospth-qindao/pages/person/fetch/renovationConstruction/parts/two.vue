<!-- 房屋信息、项目信息 -->
<template>
  <view>
    <box-title title="房屋信息"/>

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
import mixin from '@osppm/store/person/fetch/renovationConstruction/two/mixin'

export default {
  name: 'two',
  mixins: [mixin],
  data() {
    return {
    }
  }
}
</script>
<style scoped lang="scss">
.search-content{
  display: flex;
  flex-direction: column;
  padding-bottom: 24rpx;

  .search-button{
    width: 145rpx;
    height: 70rpx;
    margin-right: 20rpx;
  }
}
</style>
