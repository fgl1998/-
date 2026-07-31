<template>
  <div class="carousel-wrapper">
    <template v-for="(item, index) in ce37List">
      <div class="carousel" v-show="activeIndex === index">
        <img
          class="carousel-img"
          :src="loadedFlags[index] ? imageSrcs[index] : placeholder"
          :alt="item.title || 'carousel'"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { getImageUrlWithCache } from '../../../static/public/utils/image-db'
export default {
  name: 'carousel',
  components: {},
  props: {
    ce37List: {
      type: Array,
      default() {
        return []
      },
    },
    config: {
      type: Object,
      default() {
        return {
          ace929: '1',
          ace931: '2',
          ace932: '8',
          lunboTime: '1',
        }
      },
    },
  },
  data() {
    return {
      intervalTimer: null,
      timer: null,
      timer2: null,
      activeIndex: -1,
      loadedFlags: [],
      isEnd: false,
      lunboTime: '1',
      preloadSet: new Set(),
      placeholder:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="%231e3c72" offset="0%"/><stop stop-color="%232a5298" offset="100%"/></linearGradient><rect width="120" height="80" fill="url(%23g)"/></svg>',
      imageSrcs: [],
    }
  },
  computed: {},
  watch: {
    ce37List: {
      handler(newVal) {
        if (newVal.length > 0) {
          this.init()
        }
      },
      deep: true,
    },
  },
  mounted() {
    if (Array.isArray(this.ce37List) && this.ce37List.length > 0) {
      this.init()
    } else {
      this.$utils.showToast('未配置轮播图')
      this.nextFn()
    }
  },
  beforeDestroy() {
    this.clearTimers()
  },
  methods: {
    clearTimers() {
      clearInterval(this.intervalTimer)
      clearTimeout(this.timer)
      clearTimeout(this.timer2)
      this.intervalTimer = null
      this.timer = null
      this.timer2 = null
    },
    init() {
      if (!Array.isArray(this.ce37List) || this.ce37List.length === 0) return

      this.clearTimers()
      this.preloadSet.clear()

      const { ace929, ace931, ace932, lunboTime } = this.config
      this.lunboTime = lunboTime || 1
      this.loadedFlags = this.ce37List.map(() => false)
      this.imageSrcs = this.ce37List.map(() => this.placeholder)
      this.activeIndex = -1

      this.showImage(0).then(() => {
        this.preloadRemaining()

        if (ace929 === '2') {
          this.startCarousel()
          this.timer2 = setTimeout(() => {
            this.nextFn()
          }, (ace932 || 0) * 1000)
        }
        if (ace929 === '1') {
          this.startCarousel(ace931)
        }
      })
    },
    loadAndCache(url, idx) {
      if (!url) return Promise.resolve()
      if (this.preloadSet.has(url) && this.loadedFlags[idx] && this.imageSrcs[idx]) {
        return Promise.resolve(this.imageSrcs[idx])
      }
      this.preloadSet.add(url)
      return getImageUrlWithCache(url)
        .then((src) => {
          this.$set(this.imageSrcs, idx, src || url)
          this.setLoaded(idx)
          return src
        })
        .catch(() => {
          this.$set(this.imageSrcs, idx, url)
          this.setLoaded(idx)
          return url
        })
    },
    preloadRemaining() {
      const tasks = this.ce37List.map((item, idx) => {
        if (!item || !item.img) return Promise.resolve()
        return this.loadAndCache(item.img, idx)
      })

      return Promise.all(tasks)
    },
    async showImage(idx) {
      if (!Array.isArray(this.ce37List) || this.ce37List.length === 0) return

      const current = this.ce37List[idx]
      if (!current || !current.img) return

      this.activeIndex = idx
      const url = current.img
      this.loadAndCache(url, idx)

      const nextIdx = (idx + 1) % this.ce37List.length
      const next = this.ce37List[nextIdx]
      if (next && next.img) {
        this.loadAndCache(next.img, nextIdx)
      }
    },
    setLoaded(idx) {
      if (!this.loadedFlags[idx]) {
        this.$set(this.loadedFlags, idx, true)
      }
    },
    startCarousel(lun = 1) {
      if (!Array.isArray(this.ce37List) || this.ce37List.length === 0) return

      let index = 0
      let count = 0
      this.showImage(index)

      this.intervalTimer = setInterval(() => {
        index = (index + 1) % this.ce37List.length
        this.showImage(index)

        if (index === 0) {
          count += 1
          if (count >= lun) {
            clearInterval(this.intervalTimer)
            this.intervalTimer = null
            this.nextFn()
          }
        }
      }, this.lunboTime * 1000)
    },
    nextFn() {
      this.timer = setTimeout(() => {
        if (!this.isEnd) {
          this.$emit('end', {
            ace928: '1',
          })
          this.isEnd = true
        }
      }, 3000)
    },
  },
}
</script>
<style lang="less" scoped>
.carousel-wrapper {
  width: 100%;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
}
.carousel {
  width: 100%;
  height: 100vh;
  background-color: #000;
}
.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
