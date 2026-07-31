<!--  -->
<template>
  <div class="company">
    <div v-for="(item, index) in positionList" :key="index">
      <companyInfo :companyInfo="item" @end="finish" v-show="currentIndex === index" :config="config" />
    </div>
  </div>
</template>

<script>
import companyInfo from './companyInfo.vue'
export default {
  name: 'company',
  components: {
    companyInfo,
  },
  props: {
    positionList: {
      type: Array,
      default: () => [],
    },
    config: {
      type: Object,
      default() {
        return {
          ace929: '1',
          ace931: '2',
          ace932: '8',
          lunboTime: '1',
          ace936: '',
          ace937: '',
        }
      },
    },
  },
  data() {
    return {
      currentIndex: 0,
      timer1: null,
      lunboTime: '1',
      isEnd: false,
    }
  },
  computed: {},
  watch: {
    // positionList(val) {
    //   if (val && val.length > 0) {
    //     this.init()
    //   } else {
    //     this.$utils.showToast('未配置岗位详情列表')
    //     this.nextFn()
    //   }
    // },
  },
  mounted() {
    if (this.positionList && this.positionList.length > 0) {
      // this.startCarousel()
      this.init()
    } else {
      this.$utils.showToast('未配置岗位详情列表')
      this.nextFn()
    }
  },
  methods: {
    finish(data) {
      // this.$emit('end', data)
    },
    init() {
      const { ace929, ace931, ace932, lunboTime } = this.config
      this.lunboTime = lunboTime || 1
      //按时间
      if (ace929 === '2') {
        this.startCarousel()
        this.timer2 = setTimeout(() => {
          this.nextFn()
        }, ace932 * 1000)
      }
      //按轮次
      if (ace929 === '1') {
        this.startCarousel(ace931)
      }
    },
    startCarousel(lun = 1) {
      let index = 0
      let count = 0
      this.intervalTimer = setInterval(() => {
        this.currentIndex = index
        index++
        if (index === this.positionList.length) {
          index = 0
          count++
          if (count >= lun) {
            clearInterval(this.intervalTimer)
            this.nextFn()
          }
        }
      }, this.lunboTime * 1000)
    },
    nextFn() {
      this.timer = setTimeout(() => {
        if (!this.isEnd) {
          this.$emit('end', {
            ace928: '4',
          })
          this.isEnd = true
        }
      }, 3000)
    },
  },
}
</script>
<style lang="less" scoped>
.company {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
}
</style>
