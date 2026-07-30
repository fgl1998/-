<template>
  <div class="step_container">
    <van-form ref="queryFormRef" :scroll-to-error="true">
      <template v-for="(item, index) in queryFields">
        <van-form-item-map
          :key="index"
          :formItemConfig.sync="item"
          :formData="queryForm"
        />
      </template>
    </van-form>

    <view v-if="queryForm.yhkzl" class="card_box edit_box">
      <view class="status_title">{{ formTitle }}</view>

      <template v-if="queryForm.yhkzl !== 'class1'">
        <view class="bound_info">
          <view class="info_item">收款账户名称：{{ currentBoundInfo.skzhmc }}</view>
          <view class="info_item">收款银行行别：{{ bankLabel(currentBoundInfo.yhbb) }}</view>
          <view class="info_item">收款银行账号：{{ currentBoundInfo.skzh }}</view>
        </view>
      </template>

      <template v-else>
        <van-form ref="editFormRef" :scroll-to-error="true">
          <template v-for="(item, index) in editFields">
            <van-form-item-map
              :key="index"
              :formItemConfig.sync="item"
              :formData="editForm"
            />
          </template>
        </van-form>
      </template>
    </view>
  </div>
</template>

<script>
import mixin from '@osppm/store/person/fetch/extractService/mixin'

export default {
  name: 'extractServiceOne',
  mixins: [mixin],
}
</script>

<style scoped lang="less">
.step_container {
  padding: 16rpx 24rpx;
}

.card_box {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
}

.edit_box {
  padding: 24rpx;
}

.status_title {
  font-size: 30rpx;
  color: #333;
  font-weight: 600;
  margin-bottom: 16rpx;
}

.bound_info {
  padding: 16rpx;
  background: #f8fbff;
  border-radius: 12rpx;
}

.info_item {
  color: #555;
  font-size: 26rpx;
  line-height: 1.8;
}
</style>
