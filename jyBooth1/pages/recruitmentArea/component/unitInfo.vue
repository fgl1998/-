<template>
  <view class="unitInfo" v-show="infoShow">
    <view class="screen-box">
      <view class="screen-center">
        <unit-preview :infoShow="infoShow" :boothsInfo="boothsInfo"></unit-preview>
      </view>
      <view class="screen-bottom">
        <view class="btn-close" @click="closeInfo">关 闭</view>
      </view>
    </view>
  </view>
</template>

<script>
import unitPreview from './unitPreview.vue'

export default {
  name: 'unitInfo',
  components: {
    unitPreview,
  },
  props: {
    infoShow: {
      type: Boolean,
    },
    boothsInfo: {
      type: Object,
    },
  },
  data() {
    return {}
  },
  methods: {
    closeInfo(value) {
      this.$emit('closeInfo', {
        type: false,
        info: [],
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.unitInfo {
  width: 1920px;
  height: 1080px;
  z-index: 5;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba($color: #000000, $alpha: 0.5);
}

.screen-box {
  position: absolute;
  left: 59px;
  right: 59px;
  top: 100px;
  bottom: 60px;
}

.screen-center {
  width: 100%;
  height: calc(100% - 90px);
  border-radius: 12px;
  border: 16px solid #ffffff;
  box-sizing: border-box;
}

.screen-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-close {
  width: 474px;
  height: 62px;
  line-height: 62px;
  text-align: center;
  background: #eaeff8;
  border-radius: 4px;
  font-size: 24px;
  color: #666666;
  margin-right: 36px;
}

.btn-release {
  width: 474px;
  height: 62px;
  line-height: 62px;
  text-align: center;
  background: #1f8cff;
  border-radius: 4px;
  font-size: 24px;
  color: #ffffff;
}
</style>
