<template>
  <div class="herader">
    <div class="title">{{ month }}月分析清单</div>
    <div class="picker">
      <picker mode="date" :value="date" :start="startDate" :end="endDate" fields="month" @change="bindDateChange">
        <div class="con d-f ai-c">
          <div class="date">{{ date }}</div>
          <div class="triangle"></div>
        </div>
      </picker>
    </div>
    <div class="bg"></div>
  </div>
</template>

<script>
export default {
  name: 'pageHeader',

  data() {
    const currentDate = this.getDate({
      format: true,
    })
    return {
      date: currentDate,
      month: new Date().getMonth() + 1,
    }
  },

  mounted() {},
  computed: {
    startDate() {
      return this.getDate('start')
    },
    endDate() {
      return this.getDate('end')
    },
  },
  methods: {
    bindDateChange: function (e) {
      const date = e.detail.value
      const dateList = date.split('-')
      this.date = dateList[0] + '年' + dateList[1] + '月'
      this.month = Number(dateList[1])
      this.$emit('month', this.month)
      const newDate = dateList[0] + dateList[1]
      this.$emit('date', newDate)
    },
    getDate(type) {
      const date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1

      if (type === 'start') {
        year = year - 60
      } else if (type === 'end') {
        year = year + 2
      }
      month = month > 9 ? month : '0' + month
      return `${year}年${month}月`
    },
  },
}
</script>

<style lang="scss" scoped>
.herader {
  height: 310rpx;
  position: relative;
  .title {
    font-size: 64rpx;
    font-weight: 500;
    color: #fff;
    position: absolute;
    text-align: center;
    padding-top: 48rpx;
    padding-bottom: 28rpx;
    width: 100%;
  }
  .picker {
    position: absolute;
    top: 170rpx;
    left: 32rpx;
    .con {
      .triangle {
        width: 0;
        height: 0;
        border-left: 16rpx solid transparent;
        border-right: 16rpx solid transparent;
        border-top: 16rpx solid #fff;
        margin-left: 16rpx;
      }
      .date {
        font-weight: 500;
        font-size: 28rpx;
        color: #fff;
        line-height: 1;
      }
    }
  }
  .bg {
    height: 310rpx;
    width: 100%;
    background: url('./images/header.png') no-repeat center/cover;
  }
}
</style>
