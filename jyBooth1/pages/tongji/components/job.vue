<template>
  <view class="contentBox">
    <xu-common-title zh="岗位供需统计" en="DAILY APPLICATION TREND"> </xu-common-title>
    <view id="gxtj" style="height: 200px">
      <view>
        <view>招聘岗位数量</view>
        <view>{{ jobs }}</view>
      </view>
      <view>
        <view>投递简历人数</view>
        <view>{{ persons }}</view>
      </view>
    </view>
    <xu-common-title zh="工种统计" en="RECRUITMENT POSITION"> </xu-common-title>
    <view id="workType" style="height: 400px"> </view>

    <xu-common-title zh="薪资范围统计" en="DAILY APPLICATION TREND"> </xu-common-title>
    <view id="salaryBox"> </view>
    <xu-common-title zh="工作经验统计" en="DAILY APPLICATION TREND"> </xu-common-title>
    <view id="expireBox" style="height: 400px"> </view>
    <xu-common-title zh="期望薪资统计" en="DAILY APPLICATION TREND"> </xu-common-title>
    <view id="expectSalary" style="height: 400px"> </view>

    <!-- <view class="bottomBox">
      <view>
        <xu-common-title zh="应聘人员学历情况" en="DAILY APPLICATION TREND">

        </xu-common-title>
        <view id="person">

        </view>
      </view>

      <view>
        <xu-common-title zh="应聘人员年龄及性别情况" en="DAILY APPLICATION TREND">

        </xu-common-title>
        <view id="ageBox">

        </view>
      </view>
    </view> -->
  </view>
</template>

<script>
import * as echarts from 'echarts' // 引入ECharts库

export default {
  name: 'tongji',
  components: {},
  data() {
    return {
      jobs: 0,
      persons: 0,
      rowData: {},
      activeName: 'first',
      resumeListVisible: false,
      param: {
        apiCode: 'jy204_hrm264',
        method: 'jy204_hrm264',
        aab001: '',
      },
      param1: {
        apiCode: 'jy201_hrm216',
        method: 'jy201_hrm216',
        aab001: '',
      },
      loginInfo: {},
      isFlag: false,
      totalJob: 0,
      totalRecruit: 0,
      workList: [],
      opt2: {
        radar: {
          name: {
            color: '#333333',
            fontSize: 13,
          },
          axisLine: {
            lineStyle: {
              color: '#E4EEFF',
              width: 1,
            },
          },
        },
        series: [],
      },
      workLabels: this.$codeConfig.getDictText('ACA111'),
      opt3: {
        legend: {
          data: ['男性', '女性'], //图例名称
          right: 10, //调整图例位置
          top: 0, //调整图例位置
          itemHeight: 7, //修改icon图形大小
          icon: 'circle', //图例前面的图标形状
          textStyle: {
            //图例文字的样式
            color: '#a1a1a1', //图例文字颜色
            fontSize: 12, //图例文字大小
          },
        },
        xAxis: {
          type: 'value',
          scale: true,
          name: '年龄',
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          name: '人数(人)',
        },
        series: [],
      },
      opt1: {
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
          data: [],
          axisLabel: {
            rotate: 30,
          },
          axisLine: {
            show: true,
          },
          splitLine: {
            show: true,
          },
        },
        yAxis: {
          name: '人数(人)',
          type: 'value',
          max: 20,
          tooltip: {
            show: true,
          },
        },
        series: [],
      },
      opt4: {
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
          data: [],
          axisLabel: {
            rotate: 30,
          },
          axisLine: {
            show: true,
          },
          splitLine: {
            show: true,
          },
        },
        yAxis: {
          name: '人数(人)',
          type: 'value',
          max: 20,
          tooltip: {
            show: true,
          },
        },
        series: [],
      },
      opt5: {
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
          data: [],
          axisLabel: {
            rotate: 30,
          },
          axisLine: {
            show: true,
          },
          splitLine: {
            show: true,
          },
        },
        yAxis: {
          name: '人数(人)',
          type: 'value',
          max: 20,
          tooltip: {
            show: true,
          },
        },
        series: [],
      },
      opt6: {
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
          data: [],
          axisLabel: {
            rotate: 30,
          },
          axisLine: {
            show: true,
          },
          splitLine: {
            show: true,
          },
        },
        yAxis: {
          name: '人数(人)',
          type: 'value',
          max: 20,
          tooltip: {
            show: true,
          },
        },
        series: [],
      },
    }
  },
  created() {
    this.loginInfo = this.$loginConfig.getLoginInfo()
    // 获取岗位总数和投递数
  },
  mounted() {
    this.statistics()
  },
  onLoad() {},
  methods: {
    initChart(id, option) {
      let self = this
      echarts.env.touchEventsSupported = false
      echarts.env.wxa = false
      const chartContainer = document.getElementById(id)
      self.chart = echarts.init(chartContainer)
      this.chart.setOption(option)
    },
    statistics() {
      this.param.aab001 = this.loginInfo.aab001
      this.param.acb330 = this.loginInfo.acb330
      this.$http
        .post(this.$requestConstant.businessRequestType, 'jy204_hrm264', null, this.param, true)
        .then((responseData) => {
          console.log(responseData, '岗位供需统计')

          let res = responseData ? responseData?.data?.resultMap : {}
          this.jobs = res.supplyAndDemand.jobs
          this.persons = res.supplyAndDemand.persons
          // 工种
          const workType = res.workType
          this.opt1.xAxis.data = workType.map((item) => {
            return item.aca112
          })
          this.opt1.series.push({
            data: workType.map((item) => {
              return item.counts
            }),
            type: 'bar',
            barWidth: '20px',
            seriesBar: {
              roundCap: true,
            },
          })
          this.initChart('workType', this.opt1)
          const salary = res.salary
          this.opt4.xAxis.data = []
          Object.keys(salary).forEach((key) => {
            this.opt4.xAxis.data.push(key)
          })
          const seriesData = []
          Object.keys(salary).forEach((key) => {
            seriesData.push(salary[key])
          })
          this.opt4.series.push({
            data: seriesData,
            type: 'bar',
            barWidth: '20px',
            seriesBar: {
              roundCap: true,
            },
          })
          this.initChart('salaryBox', this.opt4)

          const exprie = res.workExperience
          this.opt5.xAxis.data = exprie.map((item) => {
            return item.acc217_dsc
          })
          this.opt5.series.push({
            data: exprie.map((item) => {
              return item['count']
            }),
            type: 'bar',
            barWidth: '20px',
            seriesBar: {
              roundCap: true,
            },
          })
          this.initChart('expireBox', this.opt5)

          const expectSalary = res.expectSalary
          this.opt6.xAxis.data = []
          Object.keys(expectSalary).forEach((key) => {
            this.opt6.xAxis.data.push(key)
          })
          const seriesData1 = []
          Object.keys(expectSalary).forEach((key) => {
            seriesData1.push(expectSalary[key])
          })
          this.opt6.series.push({
            data: seriesData1,
            type: 'bar',
            barWidth: '20px',
            seriesBar: {
              roundCap: true,
            },
          })
          this.initChart('expectSalary', this.opt6)
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

#salaryBox {
  width: 100%;
  height: 460px;
}

.content {
  width: 1366px;
  height: 875px;
  background: #ffffff;
  border-radius: 12px;
  margin: 0 auto;
  padding: 24px 32px 0px 0px;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  overflow-x: hidden;
  overflow-y: auto;

  > view:nth-child(5) {
    margin-top: 5px;
  }

  > view:last-child {
    margin-top: 10px;
  }
}

.content::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.navTop {
  display: flex;
  align-items: center;

  > view {
    width: 169px;
    height: 40px;
    border-radius: 4px;
    font-size: 14px;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
  }

  > view:first-child {
    background-color: #1f8cff;
    font-weight: 500;
    color: #ffffff;
    margin-right: 24px;
  }

  > view:last-child {
    background-color: #eaeff8;
    font-weight: 400;
    color: #333333;
  }
}

.worldTree {
  margin-top: 5px;
  margin-bottom: 12px;
  height: 255px;
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

  > view:nth-child(2) {
    color: #666666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  > view:nth-child(3) {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > view {
      width: 100px;
    }

    > view.text1 {
      color: #11a824;
    }

    > view.text2 {
      color: #4592fe;
    }

    > view.text3 {
      color: #fb3333;
    }

    > view.text4 {
      color: #666666;
    }

    > view:last-child {
      width: 259px;
      height: 12px;
      background: #edeff6;
      border-radius: 6px;

      > view {
        height: 12px;
        border-radius: 6px;
      }

      > view.state1 {
        background-color: #11a825;
      }

      > view.state2 {
        background-color: #4592fe;
      }

      > view.state3 {
        background-color: #fb3333;
      }

      > view.state4 {
        background-color: #666666;
      }
    }
  }

  > view:nth-child(4) {
    color: #333333;
    text-align: center;
  }

  > view:nth-child(5) {
    text-align: center;
    color: #044fff;
  }

  > view:nth-child(6) {
    text-align: center;
    color: #19cbb9;
  }

  > view:nth-child(7) {
    text-align: center;
    color: #f77a2c;
  }

  > view:nth-child(8) {
    text-align: center;
    color: #1f8cff;
    cursor: pointer;
  }
}

.bottomBox {
  display: flex;
  align-items: center;

  > view {
    width: 50%;
  }
}

#box {
  margin-bottom: 12px;
  width: 98%;
  height: 300px;
}

#person,
#ageBox {
  width: 600px;
  height: 400px;
}
#gxtj {
  display: flex;
  > view:first-child {
    width: 50%;
    text-align: center;
    margin: auto 0;
    font-size: 32px;
    > view:last-child {
      font-size: 36px;
      color: #044fff;
    }
  }
  > view:last-child {
    width: 50%;
    text-align: center;
    margin: auto 0;
    font-size: 32px;
    > view:last-child {
      font-size: 36px;
      color: #044fff;
    }
  }
}
</style>
