<template>
  <cover-view class="btns" :class="getDeviceClass">
    <button class="btn" @click="$emit('clickSave')">
      <cover-image :src="imageIconSave" alt="" class="icon icon-save" />
      <cover-view class="text">保存图片</cover-view>
    </button>
    <button class="btn" @click="$emit('clickShare')">
      <cover-image :src="imageIconShare02" alt="" class="icon icon-share" />
      <cover-view class="text">去分享</cover-view>
    </button>
  </cover-view>
</template>
<script>
import { getSystemInfoSync } from '@/utils/uni-api'
import { IMAGE_ANNUAL_ACCOUNT } from '@/config/constants'

const imageIconSave = IMAGE_ANNUAL_ACCOUNT + '/icon-save.png'
const imageIconShare02 = IMAGE_ANNUAL_ACCOUNT + '/icon-share-02.png'
export default {
  name: 'annualAccountSaveShare',
  props: {
    /**
     * 当前页面步骤
     */
    step: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      imageIconSave,
      imageIconShare02,
    }
  },
  components: {},
  onLoad(e) {},
  methods: {},
  computed: {
    getDeviceClass() {
      let str = ''
      const sysInfo = getSystemInfoSync()
      const { screenHeight } = sysInfo

      if (screenHeight <= 667) {
        str = `sm`
      } else if (screenHeight <= 736) {
        str = `md`
      } else {
        str = ``
      }
      return str
    },
  },
  mounted() {},
}
</script>

<style lang="scss" scoped>
.btns {
  position: fixed;
  z-index: 99;
  bottom: 130rpx;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .btn {
    background-color: transparent;
    margin-right: 190rpx;
    .icon {
      width: 128rpx;
      height: 128rpx;
      margin: 0 auto;
    }
    .text {
      color: #5e0d0e;
      font-size: 24rpx;
      text-align: center;
      line-height: 28rpx;
      padding-top: 4rpx;
    }
    &:last-child {
      margin-right: 0;
    }
  }

  &.sm {
    bottom: 30rpx;
    .btn {
      .icon {
        width: 112rpx;
        height: 112rpx;
      }
    }
  }
  &.md {
    bottom: 30rpx;
    .btn {
      .icon {
        width: 120rpx;
        height: 120rpx;
      }
    }
  }
}
</style>
