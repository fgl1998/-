<!-- three -->
<template>
  <view class="step-container">
    <box-title :title="text.coBorrowerTitle" />
<!--    <van-form ref="form" :scroll-to-error="true" :show-error="false" :show-error-message="true">-->
<!--      <template v-for="(item, index) in formConfig.fields">-->
<!--        <van-form-item-map-->
<!--          :key="index"-->
<!--          v-if="!item.if || item.if(formData)"-->
<!--          :formItemConfig.sync="item"-->
<!--          :formData="formData"-->
<!--        />-->
<!--      </template>-->
<!--    </van-form>-->

    <view class="extract-page">
      <view class="user-info-card" v-for="item in personList">
        <view class="user-info-left">
          <van-icon name="contact" class="icon" />
          <view class="info-text">
            <view>姓名：{{item.coBorrower1Name}}</view>
            <view>证件号码：{{item.coBorrower1IdNo}}</view>
          </view>
        </view>
        <view class="right-text">
          <van-button type="info" size="small" @click="showEventPopup = true">操作</van-button>
        </view>
      </view>
      <!-- 新增提取人按钮 -->
      <van-contact-card style="padding: 48rpx 24rpx" type="add" add-text="添加共同借款人" @click="openPopup"/>
    </view>

    <van-popup v-if="showPopup" v-model="showPopup" position="bottom" round
               :style="{ height: '60%',display: 'flex', flexDirection: 'column' }">
      <van-form ref="form" :scroll-to-error="true" :show-error="false" :show-error-message="true">
        <template v-for="(item, index) in formConfig.fields">
          <van-form-item-map
            :key="index"
            v-if="!item.if || item.if(formData)"
            :formItemConfig.sync="item"
            :formData="formData"
          />
        </template>
      </van-form>
      <van-button style="margin-top: auto" type="info" block @click="addPersonInfo">确定</van-button>
    </van-popup>

    <van-popup v-model="showEventPopup" position="bottom">
      <van-picker title="操作" show-toolbar
                  :columns="[{label: '删除', value: '删除'},{label: '修改', value: '修改'}]"
                  value-key="label"
                  @confirm="onConfirm"
                  @cancel="showEventPopup = false"
      />
    </van-popup>
  </view>
</template>
<script>
import mixin from '@osppm/store/person/loan/loanQualification/three/mixin'

export default {
  name: 'three',
  components: {},
  mixins: [mixin],
  data() {
    return {}
  },
  computed: {},
  watch: {},
  methods: {},
}
</script>
<style scoped lang="scss">
.step-container {
  padding: 0 0 24rpx;
}

.action-row {
  display: flex;
  padding: 0 24rpx 16rpx;
}

.action-btn {
  flex: 1;
}

.action-btn + .action-btn {
  margin-left: 16rpx;
}

.field-tip {
  padding: 0 24rpx 24rpx;
  font-size: 24rpx;
  line-height: 1.6;
  color: #8c8c8c;
}

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
