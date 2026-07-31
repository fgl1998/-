<!--  -->
<template>
  <div class="video">
    <video
      style="width: 100%; height: 100%"
      ref="videoPlayer"
      :src="videoSrc"
      :poster="poster"
      width="100%"
      controls
      @timeupdate="updateCurrentTime"
    >
      您的浏览器不支持视频播放
    </video>
  </div>
</template>

<script>
export default {
  name: 'video1',
  components: {},
  props: {
    videoList: {
      type: Array,
      default: () => [],
    },
    config: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      videoSrc: 'https://example.com/sample.mp4',
      poster: 'https://example.com/poster.jpg',
      currentTime: 0,
      isMuted: false,
      selectedVideo: 'https://example.com/sample.mp4',
      // videoList: [
      //   { name: '视频1', src: 'https://example.com/sample.mp4' },
      //   { name: '视频2', src: 'https://example.com/sample2.mp4' },
      // ],
    }
  },
  computed: {},
  watch: {},
  mounted() {
    if (this.videoList && this.videoList.length > 0) {
      this.startplay()
    } else {
      this.nextFn()
    }
  },
  methods: {
    updateCurrentTime() {
      this.currentTime = this.$refs.videoPlayer.currentTime
    },
    play() {
      this.$refs.videoPlayer.play()
    },
    pause() {
      this.$refs.videoPlayer.pause()
    },
    startplay() {},
    nextFn() {
      this.pause()
      this.timer = setTimeout(() => {
        this.$emit('end', {
          ace928: '2',
        })
      }, 5000)
    },
  },
}
</script>
<style lang="less" scoped>
.video {
  width: 100%;
  height: 100vh;
  background-position: center;
  background-size: 100% 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
