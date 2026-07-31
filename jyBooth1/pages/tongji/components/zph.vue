<template>
  <view class="contentBox">
    <view class="partOne">
      <xu-common-title zh="最近招聘会" en="RECENT JOB FAIR"> </xu-common-title>
      <view>
        <view>
          <image src="../../../static/images/zongshu.png" mode=""></image>
          <view
            >招聘岗位总数：<span>{{ totalJob }}</span
            >个</view
          >
        </view>
      </view>
    </view>
    <view class="worldTree">
      <view>
        <view style="width: 100px">序号</view>
        <view style="width: 500px">招聘会名称</view>
        <view style="width: 350px">招聘会时间</view>
        <view style="width: 500px">地点</view>
        <view style="width: 200px">岗位数量</view>
      </view>
      <view v-for="(item, index) in list" :key="index" class="list-item">
        <view style="width: 100px">{{ item.acb340 }}</view>
        <view style="width: 500px">{{ item.acb331 }}</view>
        <view style="width: 350px">{{ item.acb333Str }}</view>
        <view style="width: 500px">{{ item.acb303 }}</view>
        <view style="width: 200px">{{ item.cb36Count }}</view>
      </view>
    </view>
    <xu-common-title zh="招聘情况趋势图" en="RECRUITMENT TRENDS"> </xu-common-title>
    <view id="zphBox"> </view>
  </view>
</template>

<script>
import * as echarts from 'echarts' // 引入ECharts库
export default {
  name: 'zph',
  data() {
    return {
      totalJob: 3,
      userInfo: {},
      list: [],
      option: {
        tooltip: {
          trigger: 'axis', // 触发方式为 'axis' 轴触发
          axisPointer: {
            type: 'line', // 指示器类型为线
          },
        },
        grid: [
          {
            show: true,
            z: 0,
            left: 10,
            top: 10,
            right: 10,
            bottom: 10,
            containLabel: true,
            backgroundColor: 'rgba(0,0,0,0)',
            borderWidth: 1,
            borderColor: '#ccc',
          },
        ],
        xAxis: {
          type: 'category',
          axisLabel: {
            rotate: 0,
            formatter: function (params) {
              return params.length > 15 ? params.slice(0, 15) : params
            },
          },
          axisLine: {
            show: true,
          },
          splitLine: {
            show: true,
          },
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            type: 'line',
            smooth: true,
          },
        ],
      },
    }
  },
  created() {
    this.loginInfo = this.$loginConfig.getLoginInfo()
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    initChart(id, option) {
      let self = this
      echarts.env.touchEventsSupported = false
      echarts.env.wxa = false
      const chartContainer = document.getElementById(id)
      self.chart = echarts.init(chartContainer)
      this.chart.setOption(option)
    },
    getDataList() {
      let param = {
        apiCode: 'jy201_hrm252',
        method: 'jy201_hrm252',
        aab001: this.userInfo.aab001,
        yae100: 25,
      }
      this.$http
        .post(this.$requestConstant.businessRequestType, 'jy201_hrm252', null, param, true)
        .then((responseData) => {
          let res = responseData ? responseData.data : {}
          if (res.errors && res.errors.length > 0) {
            this.$message.error(res.errors[0].msg)
          } else {
            if (res.cc31VoList) {
              this.list = res.cc31VoList
            }
            if (res.statics) {
              this.option.xAxis.data = res.statics.map((item) => {
                return item.acb331
              })
              this.option.series[0].data = res.statics.map((item) => {
                return item.cb36Count
              })
              this.initChart('zphBox', this.option)
            }
          }
        })
    },
  },
}
</script>
<style lang="scss" scoped>
.contentBox {
  .partOne {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > view:last-child {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 20px;
      font-weight: 400;
      color: #999999;
      width: 500px;
      margin-right: 20px;

      position: absolute;
      top: 0;
      right: 0;

      > view {
        display: flex;
        align-items: center;

        > image {
          width: 20px;
          height: 20px;
        }

        > view > span {
          font-weight: bold;
          color: #0682fe;
          margin-right: 10px;
        }
      }

      > view:last-child {
        > view > span {
          color: #11a825;
        }
      }
    }
  }
}

.worldTree {
  margin-top: 5px;
  height: 255px;
  border: 1px solid #e6e6e6;
  margin-bottom: 12px;
  overflow: auto;

  > view:first-child {
    width: 100%;
    height: 50px;
    background: #f1f6fe;
    border-radius: 2px;
    display: flex;
    align-items: center;

    > view {
      font-size: 16px;
      font-weight: bolder;
      color: #333333;
      text-align: center;
    }

    > view:nth-child(2),
    > view:nth-child(3) {
      text-align: center;
    }
  }
}

.list-item {
  display: flex;
  align-items: center;
  height: 40px;
  border-left: 1px solid #e6e6e6;
  border-right: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;

  > view {
    font-size: 14px;
    font-weight: 400;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }

  > view:first-child {
    color: #666666;
    text-align: center;
  }

  > view:nth-child(5) {
    color: #11a825;
  }

  > view:last-child {
    color: coral;
  }
}

#zphBox {
  width: 99.9%;
  height: 400px;
}
</style>
