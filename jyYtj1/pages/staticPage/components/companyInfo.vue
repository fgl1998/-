<template>
  <div class="companyInfoOuter">
    <div class="title" :style="{ backgroundColor: ace936, color: ace937 }">{{ companyInfo.name }}</div>
    <div class="bottom">
      <div class="job">
        <span class="text-justify">岗位名称：</span>
        <span class="text-value">{{ companyInfo.jobname }}&nbsp;{{ companyInfo.pNumber }}人</span>
      </div>
      <div class="job">
        <span class="text-justify"> <span style="margin-right: 8px">学</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;历：</span>
        <span class="text-value">{{ companyInfo.xl || '暂无' }}</span>
      </div>
      <div class="job">
        <span class="text-justify">工资待遇：</span>
        <span class="text-value">{{ companyInfo.money || '暂无' }}</span>
      </div>
      <div class="job">
        <span class="text-justify">联系方式：</span>
        <span class="text-value">{{ companyInfo.phone || '暂无' }}</span>
      </div>
      <div class="job">
        <span class="text-justify">工作地址：</span>
        <div class="text-value" ref="box2" style="height: 40px">
          <div :style="style2" ref="job2">{{ companyInfo.address || '暂无' }}</div>
        </div>
      </div>
      <div class="job">
        <span class="text-justify">岗位职责：</span>
        <div class="text-value" ref="box1" style="height: 80px">
          <div :style="style" ref="job1" v-dompurify-html="companyInfo.require"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'companyInfo',
  props: {
    companyInfo: {
      type: Object,
    },
    speed: {
      type: Number,
      default: 10,
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
      timer1: null,
      timer2: null,
      bH: 0,
      bH2: 0,
      style: 'transform: translate(0px, 0px)',
      style2: 'transform: translate(0px, 0px)',
      flagList: [],
      ace936: '',
      ace937: '',
    }
  },
  mounted() {
    this.$nextTick(() => {
      //解决获取不到高度的问题
      this.scrollFunction()
      this.setStyle()
    })
  },
  watch: {
    flagList: {
      handler(val) {
        if (val.length == 2) {
          setTimeout(() => {
            this.$emit('end', {
              ace928: '4',
            })
          }, 5000)
        }
      },
    },
  },
  methods: {
    setStyle() {
      const { ace936, ace937 } = this.config
      this.ace936 = ace936
      this.ace937 = ace937
    },
    scrollFunction() {
      let h1 = this.$refs.box1.offsetHeight
      let h2 = this.$refs.job1.offsetHeight
      let h3 = this.$refs.box2.offsetHeight
      let h4 = this.$refs.job2.offsetHeight
      if (h2 > h1) {
        setTimeout(() => {
          this.timer1 = setInterval(() => {
            if (Math.abs(this.bH) >= h2 - h1) {
              clearInterval(this.timer1)
              this.flagList.push(1)
            } else {
              this.bH -= 0.5
            }
            this.style = `transform: translate(0px, ${this.bH}px)`
          }, 100 / this.speed)
        }, 3000)
      } else {
        this.flagList.push(1)
      }
      if (h4 > h3) {
        setTimeout(() => {
          this.timer2 = setInterval(() => {
            if (Math.abs(this.bH2) >= h4 - h3) {
              clearInterval(this.timer2)
              this.flagList.push(1)
            } else {
              this.bH2 -= 0.5
            }
            this.style2 = `transform: translate(0px, ${this.bH2}px)`
          }, 100 / this.speed)
        }, 3000)
      } else {
        this.flagList.push(1)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.companyInfoOuter {
  background: linear-gradient(0deg, hsla(0, 0%, 100%, 0.15), hsla(0, 0%, 100%, 0.76), hsla(0, 0%, 100%, 0.76));
  border-radius: 50px;
  width: 70vw;
  height: 67vh;
  position: absolute;
  padding: 0 30px 20px 30px;
  // left: 7%;
  top: 20%;
  margin-left: calc(50% - 35vw);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title {
    display: inline-block;
    text-align: center;
    padding: 10px 20px;
    // color: white;
    font-weight: 400;
    font-size: 20px;
    // background: linear-gradient(0deg, #264f8d, #00c0fa);
    border-radius: 50px;
    margin: 10px auto;
    letter-spacing: 5px;
  }

  .bottom {
    flex: 1;
    width: 100%;
    overflow: hidden;

    .job {
      display: flex;
      font-size: 16px;
      margin-bottom: 20px;
      padding: 0 50px;
      box-sizing: border-box;
      width: 100%;

      .text-justify {
        width: 80px;
        line-height: 20px;
        color: #156d92;
      }

      .text-value {
        flex: 1;
        line-height: 20px;
        overflow: hidden;
      }
    }
  }
}
</style>
