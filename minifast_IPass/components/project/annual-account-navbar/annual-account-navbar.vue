<template>
  <cover-view class="annual-account-nav-bar" v-if="userInfo.scene !== 1154" :style="getStyle">
    <cover-view class="img-box" @click="onClick">
      <cover-image class="icon-back" :src="imageIconBack" />
    </cover-view>
  </cover-view>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { getSystemInfoSync, navigateBack, switchTab } from '@/utils/uni-api'

  import { USER_INFO } from '@/store/constants' // 常量
  import { IMAGE_ANNUAL_ACCOUNT } from '@/config/constants'
  const imageIconBack = IMAGE_ANNUAL_ACCOUNT + '/icon-back.png'

  export default {
    name: 'annualAccountNavBar',
    data() {
      return { imageIconBack }
    },
    components: {},
    onLoad(e) {},
    methods: {
      /**
       * 返回上一页
       */
      onClick() {
        navigateBack(1)
          .then()
          .catch(() => {
            switchTab('home')
          })
      }
    },
    computed: {
      ...mapGetters([USER_INFO]),
      getStyle() {
        let str = ''
        const { statusBarHeight } = getSystemInfoSync()

        str = `top: ${statusBarHeight * 2}rpx;`
        return str
      }
    },
    mounted() {}
  }
</script>

<style lang="scss" scoped>
  .annual-account-nav-bar {
    width: 100%;
    position: fixed;
    left: 0;
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 88rpx;
    padding-left: 20rpx;
    padding-right: 200rpx;
    .img-box {
      padding: 10rpx;
    }
    .icon-back {
      width: 20rpx;
      height: 40rpx;
    }
  }
</style>
