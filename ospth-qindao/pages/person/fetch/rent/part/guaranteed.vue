<template>
  <view>
    <van-form ref="form" :scroll-to-error="true">
      <template v-if="contractList.length > 0">
        <box-title title="合同选择"/>
        <van-form-item-map
          :formItemConfig.sync="contractSelectField"
          :formData="formData"
        />
      </template>
      <van-form-item-map
          :formItemConfig.sync="rentTypeField"
          :formData="formData"
      />
      <box-title title="合同信息"/>
      <van-form-item-map
        v-for="(item, index) in contractFields"
        :key="index"
        :formItemConfig.sync="item"
        :formData="formData"
      />
      <box-title title="发票信息"/>
      <div class="extract-page">
        <view class="user-info-card" v-for="item in invoiceList">
          <view class="user-info-left">
            <van-icon name="contact" class="icon" />
            <view class="info-text">
              <view>起始年月：{{item.qsny}}</view>
              <view>结束年月：{{item.jsny}}</view>
              <view>发票金额：{{item.fpje}}</view>
            </view>
          </view>
          <view class="right-text">
            <van-button type="info" size="small" @click="showEventPopup = true">操作</van-button>
          </view>
        </view>
        <!-- 新增提取人按钮 -->
        <van-contact-card style="padding: 48rpx 24rpx" type="add" add-text="新增发票" @click="openPopup"/>
      </div>
    </van-form>

    <van-popup v-if="showPopup" v-model="showPopup" position="bottom" round
               :style="{ height: '60%',display: 'flex', flexDirection: 'column' }">
      <van-form>
        <van-form ref="form" :scroll-to-error="true">
          <van-form-item-map
              v-for="(item, index) in formConfig.invoiceFields"
              :key="index"
              v-if="!item.if || item.if(invoiceFormData)"
              :formItemConfig.sync="item"
              :formData="invoiceFormData"
          />
        </van-form>
      </van-form>
      <van-button style="margin-top: auto" type="info" block @click="addInvoiceInfo">确定</van-button>
    </van-popup>
  </view>
</template>

<script>
import mixin from '@osppm/store/person/fetch/rent/guaranteed/mixin'

export default {
  name: 'guaranteed',
  mixins: [mixin]
}
</script>

<style scoped lang="scss">
.extract-page {
  background-color: #FFFFFF;

  .user-info-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx;
    margin-bottom: 24rpx;

    position: relative;
  }

  .user-info-card::before {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 2px;
    background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
    background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
    background-size: 80px;
    content: '';
    z-index: 1; /* 保证显示在最上层 */
  }

  /* 左侧整体布局 */
  .user-info-left {
    display: flex;
    align-items: center;
  }

  /* 图标 */
  .icon {
    margin-right: 24rpx;
  }

  /* 文字区域 */
  .info-text {
    font-size: 28rpx;
    line-height: 1.5;
  }

  /* 右侧文字 */
  .right-text {
  }
}
</style>
