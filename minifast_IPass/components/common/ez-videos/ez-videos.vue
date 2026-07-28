<template>
  <div class="videos-wrapper">
    <ComponentPanel title="帮助视频">
      <div class="panel-content d-f jc-sa ai-c">
        <div class="video-content">
          <video
            id="myVideo"
            :src="videoSrc1"
            :enable-danmu="false"
            :danmu-btn="false"
            controls
            :show-center-play-btn="true"
          ></video>
          <div class="title">一键查询篇</div>
        </div>
        <div class="video-content">
          <video
            id="myVideo"
            :src="videoSrc2"
            :enable-danmu="false"
            :danmu-btn="false"
            controls
            :show-center-play-btn="true"
          ></video>
          <div class="title">一键申报篇</div>
        </div>
      </div>
    </ComponentPanel>
  </div>
</template>

<script>
import config from '@/config/index'
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
export default {
  name: 'videos',
  data() {
    return {
      videoSrc1: config.requestUrl + '/localPath/video/002.m4v', // 宣传视频地址
      videoSrc2: config.requestUrl + '/localPath/video/001.m4v' // 宣传视频地址
    }
  },
  components: {
    ComponentPanel
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.videos-wrapper {
  width: 100%;

  .panel-content {
    width: 100%;

    .video-content {
      video {
        width: 300rpx;
        height: 150rpx;
        border-radius: 8rpx;
      }

      .title {
        color: #2b5998;
      }
    }
  }
}
</style>