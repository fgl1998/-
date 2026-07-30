<template>
  <view>
    <view class="bind-card">
      <van-form ref="form" class="bind-form" :scroll-to-error="true">
        <view v-for="(item, index) in formConfig.fields" :key="index">
          <van-form-item-map
            :formItemConfig.sync="item"
            :formData="formData"
          />
        </view>
      </van-form>
    </view>

    <view class="message-card">
      <view class="section-title">短信类消息设置</view>
      <view class="setting-row" v-for="item in smsMessageList" :key="item.key">
        <text class="setting-name">{{ item.name }}</text>
        <view class="setting-right">
          <text class="setting-status">{{ formData[item.key] ? '已开通' : '未开通' }}</text>
          <switch
            class="setting-switch"
            :checked="formData[item.key]"
            color="#2D8CF0"
            @change="onSwitchChange(item.key, $event)"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import mixin from '@osppm/store/person/marshal/messageSubscription/one/mixin'

export default {
  name: 'one',
  mixins: [mixin],
  computed: {
    ...mapState('messageSubscription', ['ywdjh']),
  },
  methods: {
    ...mapActions('messageSubscription', ['saveMessageSubscription']),
    async beforeNext() {
      return new Promise(resolve => {
        this.$refs.form.validate().then(async () => {
          try {
            resolve(true)
          } catch (e) {
            resolve(false)
          }
        }).catch(() => resolve(false))
      })
    },
  },
}
</script>

<style scoped lang="scss">
.bind-card,
.message-card {
  background: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
}

.bind-card {
  margin-bottom: 24rpx;
}

.bind-form {
  border-radius: 16rpx;
  overflow: hidden;
}

.section-title {
  height: 72rpx;
  line-height: 72rpx;
  padding: 0 24rpx;
  font-size: 34rpx;
  color: #9a9a9a;
  background: #f0f0f0;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 96rpx;
  padding: 0 24rpx;
  border-bottom: 1rpx solid #efefef;

  &:last-child {
    border-bottom: none;
  }
}

.setting-name {
  flex: 1;
  padding-right: 12rpx;
}

.setting-right {
  display: flex;
  align-items: center;
}

.setting-status {
  font-size: 36rpx;
  color: #b0aca4;
  margin-right: 16rpx;
}

.setting-switch {
  transform: scale(0.9);
  transform-origin: center center;
}
</style>
