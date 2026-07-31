<template>
  <div class="introduceInfoOuter">
    <div class="title" :style="{ backgroundColor: ace936, color: ace937 }">{{ introduceInfo.title }}</div>
    <div class="bottom" ref="bottom">
      <div :style="style" ref="introduce">
        <div v-for="(item, index) in introduceInfo.data" :key="index">
          <div class="box-title">{{ item.title }}</div>
          <div v-for="(item2, index2) in item.text" :key="index2">
            <!-- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item2}} -->
            <div v-dompurify-html="item2"></div>
            <!-- <div>{{ item }}</div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'introduceInfo',
  props: {
    introduceInfo: {
      type: Object,
    },
    speed: {
      type: String,
      default: '1',
    },
    time: {
      type: Number,
      default: 3000,
    },
    round: {
      type: String,
      default: '2',
    },
    config: {
      type: Object,
      default() {
        return {
          ace929: '1',
          ace931: '2',
          ace932: '8',
        }
      },
    },
  },
  data() {
    return {
      timer1: null,
      timerPause: null,
      bH: 0,
      style: 'transform: translate(0px, 0px)',
      currentRound: 0,
      ace936: '',
      ace937: '',
      ace944: '',
    }
  },
  mounted() {
    // this.roundFunction()
    this.init()
    this.setStyle()
  },
  methods: {
    setStyle() {
      const { ace936, ace937 } = this.config
      this.ace936 = ace936
      this.ace937 = ace937
    },
    init() {
      const { ace929, ace931, ace932, ace938, ace944 } = this.config
      this.speed = ace938 || 1
      this.round = ace931
      this.ace944 = ace944

      //按时间
      if (ace929 === '2') {
        this.scrollFunction()
        this.timer2 = setTimeout(() => {
          this.nextFn()
        }, ace932 * 1000)
      }
      //按轮次
      if (ace929 === '1') {
        this.roundFunction()
      }
    },
    scrollFunction() {
      clearInterval(this.timer1)
      clearTimeout(this.timerPause)
      const bottomRef = this.$refs.bottom
      const introduceRef = this.$refs.introduce
      const h1 = bottomRef?.offsetHeight || 0
      const h2 = introduceRef?.offsetHeight || 0
      const totalDistance = h2 - h1 + 40
      const intervalMs = 16
      const secondsPerLine = this.speed > 0 ? this.speed : 1
      const measuredLineHeight = bottomRef ? parseFloat(window.getComputedStyle(bottomRef).lineHeight) : 30
      const lineHeight = Number.isFinite(measuredLineHeight) && measuredLineHeight > 0 ? measuredLineHeight : 30
      const pixelsPerSecond = lineHeight / secondsPerLine
      const step = pixelsPerSecond * (intervalMs / 1000)

      this.bH = 0
      this.style = 'transform: translate(0px, 0px)'

      if (totalDistance <= 0 || step <= 0) {
        this.roundFunction()
        return
      }

      this.timer1 = setInterval(() => {
        if (Math.abs(this.bH) >= totalDistance) {
          clearInterval(this.timer1)
          this.style = `transform: translate(0px, ${-totalDistance}px)`
          const pauseMs = (Number(this.ace944) > 0 ? Number(this.ace944) : 0) * 1000
          if (pauseMs > 0) {
            this.timerPause = setTimeout(() => {
              this.roundFunction()
            }, pauseMs)
          } else {
            this.roundFunction()
          }
          return
        }

        this.bH -= step

        if (Math.abs(this.bH) > totalDistance) {
          this.bH = -totalDistance
        }

        this.style = `transform: translate(0px, ${this.bH}px)`
      }, intervalMs)
    },
    roundFunction() {
      if (this.currentRound >= this.round) {
        this.nextFn()
        return
      }

      this.currentRound += 1
      this.scrollFunction()
    },
    nextFn() {
      this.timer = setTimeout(() => {
        this.$emit('finish', {
          ace928: '6',
        })
      }, 500)
    },
  },
}
</script>

<style lang="less" scoped>
.introduceInfoOuter {
  background: linear-gradient(0deg, hsla(0, 0%, 100%, 0.15), hsla(0, 0%, 100%, 0.76), hsla(0, 0%, 100%, 0.76));
  border-radius: 50px;
  width: 80%;
  height: 67%;
  position: absolute;
  padding: 0 30px 10px 30px;
  // left: 7%;
  left: 50%;
  transform: translate(-50%, 0%);
  top: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title {
    display: inline-block;
    text-align: center;
    padding: 10px 20px;
    color: white;
    font-weight: 400;
    font-size: 20px;
    // background: linear-gradient(0deg, #264f8d, #00c0fa);
    border-radius: 50px;
    margin: 10px auto;
    letter-spacing: 5px;
  }

  .bottom {
    flex: 1;
    overflow: hidden;
    padding: 0 50px;
    font-size: 20px;

    .box-title {
      font-size: 24px;
      color: #156d92;
      margin: 20px 0;
    }

    p {
      line-height: 30px;
    }
  }
}
</style>
