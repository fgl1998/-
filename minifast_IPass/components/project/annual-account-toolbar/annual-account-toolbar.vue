<template>
  <cover-view class="annual-account-toolbar" :class="'len-' + imageSponsor[areaCode].length" :style="getStyle">
    <cover-view class="sponsor-wrapper" v-if="imageSponsor[areaCode].length !== 3">
      <template v-if="step === 1 && imageSponsor[areaCode]">
        <cover-view class="sponsor">
          <template v-for="(item, index) in imageSponsor[areaCode]">
            <cover-view class="item" v-if="item && index < 2" :key="index">
              <cover-image class="icon" :src="item.imageSrc" alt="" v-if="item.imageSrc" />
              <cover-view class="text" v-if="item.text">{{ item.text }}</cover-view>
            </cover-view>
          </template>
        </cover-view>
        <cover-view class="sponsor" v-if="imageSponsor[areaCode].length > 2">
          <template v-for="(item, index) in imageSponsor[areaCode]">
            <cover-view class="item" v-if="item && index > 1" :key="index">
              <cover-image class="icon" :src="item.imageSrc" alt="" v-if="item.imageSrc" />
              <cover-view class="text" v-if="item.text">{{ item.text }}</cover-view>
            </cover-view>
          </template>
        </cover-view>
      </template>
    </cover-view>
    <cover-view class="icons" :class="isPlay ? 'play' : 'no-play'" v-if="userInfo.scene !== 1154">
      <cover-image :src="isPlay ? imageOpen : imageClose" class="icon-music" alt="" @click="onClick" />
      <button class="btn-share" open-type="share">
        <cover-image :src="imageShare" class="icon-share" alt="" />
      </button>
    </cover-view>
    <cover-view class="sponsor-wrapper" v-if="imageSponsor[areaCode].length === 3">
      <template v-if="step === 1 && imageSponsor[areaCode]">
        <cover-view class="sponsor sponsor-511600-01">
          <template v-for="(item, index) in imageSponsor[areaCode]">
            <cover-view class="item" v-if="item" :key="index">
              <cover-image class="icon" :src="item.imageSrc" alt="" v-if="item.imageSrc" />
              <cover-view class="text" v-if="item.text">{{ item.text }}</cover-view>
            </cover-view>
          </template>
        </cover-view>
      </template>
    </cover-view>
  </cover-view>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { getSystemInfoSync, showShareMenu } from '@/utils/uni-api'

  import config from '@/config'
  import { IMAGE_ANNUAL_ACCOUNT } from '@/config/constants'
  import { USER_INFO } from '@/store/constants' // 常量
  import { imageSponsor } from './sponsor'

  const { areaCode, requestUrl } = config
  const imageOpen = IMAGE_ANNUAL_ACCOUNT + '/icon-music-open.png'
  const imageClose = IMAGE_ANNUAL_ACCOUNT + '/icon-music-close.png'
  const imageShare = IMAGE_ANNUAL_ACCOUNT + '/icon-share.png'

  export default {
    name: 'annualAccountToolbar',
    props: {
      step: {
        type: Number,
        required: true
      },
      /**
       * 是否播放音频
       */
      isPlay: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        areaCode,
        imageOpen,
        imageClose,
        imageShare,
        // 音频地址
        src: requestUrl + '/static/mp3/nianduzhangdan.mp3',
        // 创建内部 audio 上下文 InnerAudioContext 对象
        innerAudioContext: null,

        // 支撑部门
        imageSponsor
      }
    },
    components: {},

    methods: {
      /**
       * 播放
       */
      play() {
        const { scene } = this.userInfo
        if (scene === 1154) {
          return
        }
        this.$nextTick(() => {
          if (this.innerAudioContext) {
            this.innerAudioContext.play()
          } else {
            this.innerAudioContext = uni.createInnerAudioContext({
              useWebAudioImplement: false // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
            })
            this.innerAudioContext.loop = true
            this.innerAudioContext.src = this.src

            this.innerAudioContext.play()
          }
        })
      },
      /**
       * 暂停
       */
      pause() {
        this.innerAudioContext && this.innerAudioContext.pause()
      },
      /**
       * 点击图标播放/暂停播放
       */
      onClick() {
        this.$emit('changeMusic', !this.isPlay)
      }
    },
    computed: {
      ...mapGetters([USER_INFO]),
      getStyle() {
        let str = ''
        const { scene } = this.userInfo
        const { statusBarHeight } = getSystemInfoSync()
        if (scene === 1154) {
          str = `top: ${statusBarHeight * 2 + 30}rpx;`
        } else {
          str = `top: ${statusBarHeight * 2 + 88 + 30}rpx;`
        }

        return str
      }
    },
    created() {
      showShareMenu()
    },
    destroyed() {
      this.innerAudioContext && this.innerAudioContext.destroy()
    },
    watch: {
      isPlay: {
        handler(val) {
          if (val) {
            this.play()
          } else {
            this.pause()
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @keyframes rotate360 {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .annual-account-toolbar {
    width: 100%;
    position: fixed;
    top: 200rpx;
    left: 0;
    z-index: 99;
    display: flex;
    justify-content: space-between;
    padding: 0 40rpx;
    .sponsor-wrapper {
      flex: 1;
      overflow: hidden;
      padding-top: 4rpx;
      .sponsor {
        width: 100%;
        display: flex;
        align-items: center;
        margin-bottom: 12rpx;

        .item {
          display: flex;
          align-items: center;
          margin-right: 68rpx;

          .icon {
            width: 44rpx;
            height: 44rpx;
            margin-right: 16rpx;
          }
          .text {
            font-size: 28rpx;
            line-height: 1.4;
            color: #fff;
          }
          &:last-child {
            margin-right: 0;
          }
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .icons {
      height: 54rpx;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-left: 30rpx;
      .icon-music {
        width: 54rpx;
        height: 54rpx;
        // animation: rotate360 infinite linear 10s;
      }
      .btn-share {
        width: 54rpx;
        height: 54rpx;
        margin-left: 20rpx;
        background-color: transparent;
        .icon-share {
          width: 100%;
          height: 100%;
        }
      }

      &.play {
        .icon-music {
          animation-play-state: running;
        }
      }
      &.no-play {
        .icon-music {
          animation-play-state: paused;
        }
      }
    }
    &.len-3 {
      flex-direction: column;

      .sponsor-wrapper {
        position: relative;
        top: -50rpx;
        .sponsor {
          .item {
            margin-right: 8rpx;
            .text {
              font-size: 26rpx;
            }
            .icon {
              width: 40rpx;
              height: 40rpx;
              margin-right: 8rpx;
            }

            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
    }
  }
</style>
