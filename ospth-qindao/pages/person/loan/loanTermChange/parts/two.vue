<template>
  <view>
    <box-title title="关联人信息"/>
    <div class="extract-page">
      <view v-for="(item,index) in relatedPersonList">
        <view style="margin-right: 24rpx; text-align: right; padding-top: 24rpx">
          <van-tag plain type="primary" v-show="index === 0">未签字</van-tag>
          <van-tag plain color="#07c160" v-show="index === 1">已签字</van-tag>
        </view>
        <view class="user-info-card">
          <view class="user-info-left">
            <van-icon name="contact" class="icon" />
            <view class="info-text">
              <view>姓名：{{item.xm}}</view>
              <view>证件号码：{{item.zjhm}}</view>
              <view>月收入：{{item.ysr }}</view>
            </view>
          </view>
          <view class="right-text">
            <van-button type="info" size="small" @click="showEventPopup = true">操作</van-button>
          </view>
        </view>
      </view>
    </div>

    <van-popup v-model="showEventPopup" position="bottom">
      <van-picker title="操作" show-toolbar
                  :columns="[{label: '签字', value: '签字'}, {label: '修改月收入', value: '修改月收入'}]"
                  value-key="label"
                  @confirm="eventPopupConfirm"
                  @cancel="showEventPopup = false"
      />
    </van-popup>

    <van-popup v-model="showSignPopup" position="bottom" :style="{ height: '60%',display: 'flex', flexDirection: 'column' }">
      《住房公积金贷款期限调整申请审批表》
      <van-button type="info" block @click="showSignPopup = false" style="margin-top: auto">签字</van-button>
    </van-popup>
  </view>
</template>
<script>
import mixin from '@osppm/store/person/loan/loanTermChange/two/mixin'

export default {
  name: 'two',
  mixins: [mixin],
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
