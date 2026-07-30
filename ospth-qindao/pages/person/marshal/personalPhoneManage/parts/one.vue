<!-- 身份认证 -->
<template>
  <view>
    <box-title title="身份认证" />
    <van-form ref="form" class="form" :scroll-to-error="true">
      <view v-for="(item, index) in formConfig.fields" :key="index">
        <van-form-item-map
            v-if="!item.if || item.if(formData)"
            :formItemConfig.sync="item"
            :formData="formData"
        />
      </view>
    </van-form>

    <van-dialog
      v-model="showFaceDialog"
      title="提示"
      show-cancel-button
      @confirm="handleFaceAgree"
      @cancel="handleFaceCancel"
    >
      <view class="face-dialog-content">
        是否同意将您的个人身份信息提交微信进行人脸识别身份认证。详询0743-12329。
      </view>
    </van-dialog>

    <van-dialog
      v-model="showQrCode"
      title="人脸识别"
      show-cancel-button
      @confirm="handleQrCodeClose"
      @cancel="handleQrCodeClose"
    >
      <view class="qr-code-container">
        <view class="qr-code-placeholder">
          二维码占位
        </view>
      </view>
    </van-dialog>
  </view>
</template>

<script>
import mixin from '@osppm/store/person/marshal/personalPhoneManage/one/mixin'

export default {
  name: 'personalPhoneManageOne',
  mixins: [mixin],
}
</script>

<style scoped lang="scss">
.face-dialog-content {
  padding: 30rpx;
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  text-align: center;
}

.qr-code-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40rpx;
}

.qr-code-placeholder {
  width: 300rpx;
  height: 300rpx;
  background-color: #f5f5f5;
  border: 2rpx dashed #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
  color: #999;
}
</style>
