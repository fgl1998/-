<template>
  <div class="video-wrapper">
    <video
      id="myVideo"
      :src="videoSrc"
      :enable-danmu="false"
      :danmu-btn="false"
      controls
    ></video>
  </div>
</template>
<script>
import config from '@/config/index'

export default {
  data() {
    return {
      videoSrc: '', // 宣传视频地址
    }
  },
  components: {},
  onLoad(e) {
    const { requestUrl } = config
    this.videoSrc = requestUrl + '/localPath/mv/01.mp4'
  },
  onShow() {},
  onHide() {},
  methods: {},
  computed: {},
}
</script>
<style lang="scss" scoped>
.video-wrapper {
  width: 100%;
  height: 100%;
  height: 100vh;
  text-align: center;
  color: #fff;
  position: relative;
  background-color: #000;
  video {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
  }
}
</style>
