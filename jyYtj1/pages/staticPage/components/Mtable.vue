<template>
  <div class="tableOuter">
    <div class="titleBar" :style="headerStyle">
      <div class="titleBarItem" v-for="(item, index) in columns" :key="index">
        <p>{{ item.label }}</p>
      </div>
    </div>
    <div class="tBody" id="tBody">
      <div :style="style">
        <div v-if="!tableData.length">暂无数据</div>
        <div
          :class="{ tBodyItem: true, bgw: !(index1 % 2), bgg: index1 % 2 }"
          :style="{ backgroundColor: !(index1 % 2) ? ace941 || '#fff' : ace942 || '#92daf8' }"
          v-for="(item1, index1) in tableData"
          :key="index1 + 'item'"
          id="real"
        >
          <div class="dataItem" v-for="(item2, index2) in columns" :key="index2 + 'iitem'" :id="index2 + 'iitem'">
            {{ item1[item2.value] }}
          </div>
        </div>
        <div
          v-if="tableData.length > 0"
          :class="{ tBodyItem: true, bgw: !(index1 % 2), bgg: index1 % 2 }"
          v-for="(item1, index1) in tableData"
          :key="index1"
          :style="{
            display: isScroll ? 'flex' : 'none',
            backgroundColor: !(index1 % 2) ? ace941 || '#fff' : ace942 || '#92daf8',
          }"
        >
          <div class="dataItem" v-for="(item2, index2) in columns" :key="index2">
            {{ item1[item2.value] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Mtable',
  props: {
    columns: {
      type: Array,
    },
    tableData: {
      type: Array,
      default() {
        return []
      },
    },
    time: {
      type: Number,
      default: 3000,
    },
    round: {
      type: Number,
      default: 2,
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
      style: 'transform: translate(0px, 0px)',
      timer1: null,
      bH: 0,
      isScroll: true,
      timer: null,
      speed: '1',
      headerStyle: '',
      ace941: '',
      ace942: '',
    }
  },
  mounted() {
    if (this.tableData && this.tableData.length > 0) {
      this.init()
      this.setStyle()
    } else {
      this.$utils.showToast('未配置培训班列表')
      this.nextFn()
    }
  },
  watch: {},
  methods: {
    init() {
      const { ace929, ace931, ace932, ace938 } = this.config
      this.speed = ace938 || 1

      console.log(this.tableData, 'tableData')

      //按时间
      if (ace929 === '2') {
        this.scrollFunction(this.tableData)
        this.timer2 = setTimeout(() => {
          this.nextFn()
        }, ace932 * 1000)
      }
      //按轮次
      if (ace929 === '1') {
        this.roundFunction(this.tableData, ace931)
      }
    },
    scrollFunction(data) {
      clearInterval(this.timer1)
      this.bH = 0
      const bodyEl = document.getElementById('tBody')
      const firstCell = document.getElementById('0iitem')
      const rowEl = document.getElementById('real')
      if (!bodyEl || !firstCell || !rowEl) return

      const h = bodyEl.offsetHeight
      const h2 = firstCell.offsetHeight + 2 * Number(window.getComputedStyle(rowEl).paddingTop.split('px')[0])
      const totalDistance = data.length * h2 - h

      if (totalDistance > 0) {
        const intervalMs = 16 // 固定帧间隔，按行耗时计算位移
        const secPerRowRaw = this.speed > 0 ? this.speed : 1
        const secPerRow = secPerRowRaw > 100 ? secPerRowRaw / 1000 : secPerRowRaw // 兼容旧值（毫秒）
        const step = h2 / ((secPerRow * 1000) / intervalMs)

        this.timer1 = setInterval(() => {
          if (Math.abs(this.bH) >= totalDistance) {
            this.nextFn()
            clearInterval(this.timer1)
          } else {
            this.bH -= step
          }
          this.style = `transform: translate(0px, ${this.bH}px)`
        }, intervalMs)
        this.isScroll = true
      } else {
        this.nextFn()
        this.bH = 0
        this.style = 'transform: translate(0px, 0px)'
        this.isScroll = false
        clearInterval(this.timer1)
      }
    },
    roundFunction(data, round = 1) {
      clearInterval(this.timer1)
      this.bH = 0
      this.style = 'transform: translate(0px, 0px)'

      const bodyEl = document.getElementById('tBody')
      const firstCell = document.getElementById('0iitem')
      const rowEl = document.getElementById('real')
      if (!bodyEl || !firstCell || !rowEl) return

      const h = bodyEl.offsetHeight
      const h2 = firstCell.offsetHeight + 2 * Number(window.getComputedStyle(rowEl).paddingTop.split('px')[0])
      const totalDistance = data.length * h2 - h
      if (totalDistance <= 0) {
        this.isScroll = false
        this.nextFn()
        return
      }

      const intervalMs = 16 // 固定帧间隔
      const secPerRowRaw = this.speed > 0 ? this.speed : 1
      const secPerRow = secPerRowRaw > 100 ? secPerRowRaw / 1000 : secPerRowRaw // 兼容旧值（毫秒）
      const step = h2 / ((secPerRow * 1000) / intervalMs)
      const rounds = round > 0 ? Math.floor(round) : 1

      const runRound = (left) => {
        if (left <= 0) {
          this.nextFn()
          return
        }
        clearInterval(this.timer1)
        this.bH = 0
        this.style = 'transform: translate(0px, 0px)'
        this.isScroll = true
        this.timer1 = setInterval(() => {
          if (Math.abs(this.bH) >= totalDistance) {
            clearInterval(this.timer1)
            runRound(left - 1)
          } else {
            this.bH -= step
            this.style = `transform: translate(0px, ${this.bH}px)`
          }
        }, intervalMs)
      }

      runRound(Number(rounds))
    },
    setStyle() {
      const { ace936, ace937, ace939, ace941, ace942 } = this.config
      this.headerStyle = `background-color:${ace939 || 'rgb(146, 218, 248)'}`
      this.ace941 = ace941
      this.ace942 = ace942
    },
    nextFn() {
      this.timer = setTimeout(() => {
        this.$emit('finish', {
          ace928: '5',
        })
      }, 3000)
    },
  },
}
</script>

<style scoped lang="less">
p {
  margin: 0;
}

.tableOuter {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  .titleBar {
    display: flex;
    width: 100%;
    // background-color: rgb(146, 218, 248);
    display: flex;
    z-index: 10;
    font-size: 20px;
    color: #156d92;

    .titleBarItem {
      text-align: center;
      flex: 1;
      padding: 10px 0;

      p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .tBody {
    width: 100%;
    flex: 1;
    overflow: hidden;
    z-index: 1;
    transition: all 0ms linear 0s;

    .a {
      transform: translate(0px, -180px) !important;
    }

    .bgw {
      background-color: white;
    }

    .bgg {
      background-color: rgb(146, 218, 248);
    }

    .tBodyItem {
      width: 100%;
      display: flex;
      position: relative;
      font-size: 14px;
      padding: 12px 0;
      color: #333333;

      .dataItem {
        flex: 1;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
