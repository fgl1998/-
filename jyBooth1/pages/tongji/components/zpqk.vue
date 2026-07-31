<template>
  <view class="contentBox">
    <view class="partOne">
      <xu-common-title zh="岗位招聘情况" en="RECRUITMENT POSITION"> </xu-common-title>
      <view>
        <view>
          <image src="../../../static/images/zongshu.png"></image>
          <view
            >招聘岗位总数：<span>{{ totalJob }}</span
            >个</view
          >
        </view>
        <view>
          <image src="../../../static/images/touren.png"></image>
          <view
            >已投递人数：<span>{{ totalRecruit }}</span
            >人</view
          >
        </view>
      </view>
    </view>
    <view class="worldTree">
      <view>
        <view style="width: 100px">序号</view>
        <view style="width: 400px">招聘职位</view>
        <view style="width: 350px">招聘状态</view>
        <view style="width: 200px">招聘人数</view>
        <view style="width: 200px">浏览次数</view>
        <view style="width: 200px">面试人员</view>
        <view style="width: 200px">面试成功</view>
        <view style="width: 100px">操作</view>
      </view>
      <view v-for="(item, index) in workList" :key="index" class="list-item">
        <view style="width: 100px">{{ item.acb210 }}</view>
        <view style="width: 400px">{{ item.aca112 }}</view>
        <view style="width: 350px">
          <view
            :class="
              item.status == '00' ? 'text1' : item.status == '02' ? 'text2' : item.status == '03' ? 'text3' : 'text4'
            "
          >
            {{
              item.status == '00'
                ? '招聘中'
                : item.status == '02'
                ? '已招满'
                : item.status == '03'
                ? '已截止'
                : item.status == '04'
                ? '已下线'
                : '未知'
            }}
          </view>
          <view>
            <view
              :style="'width:' + (item.mscg != 0 ? (item.mscg / item.acb21g) * 100 : 0) + '%;'"
              :class="
                item.status == '00'
                  ? 'state1'
                  : item.status == '02'
                  ? 'state2'
                  : item.status == '03'
                  ? 'state3'
                  : 'state4'
              "
            ></view>
          </view>
        </view>
        <view style="width: 200px">{{ item.acb21g }}</view>
        <view style="width: 200px">{{ item.acc657 }}</view>
        <view style="width: 200px">{{ item.msrs }}</view>
        <view style="width: 200px">{{ item.mscg }}</view>
        <view
          style="width: 100px"
          @click=";(resumeListVisible = true), (rowData = item)"
          @close="resumeListVisible = false"
        >
          查看简历
        </view>
      </view>
    </view>

    <xu-common-title zh="日应聘趋势" en="DAILY APPLICATION TREND"> </xu-common-title>
    <view id="box"> </view>

    <view class="bottomBox">
      <view>
        <xu-common-title zh="应聘人员学历情况" en="DAILY APPLICATION TREND"> </xu-common-title>
        <view id="person"> </view>
      </view>

      <view>
        <xu-common-title zh="应聘人员年龄及性别情况" en="DAILY APPLICATION TREND"> </xu-common-title>
        <view id="ageBox"> </view>
      </view>
    </view>
    <resume-list :visible="resumeListVisible" :row-data="rowData" @close="closeResume"></resume-list>
  </view>
</template>

<script>
import * as echarts from 'echarts' // 引入ECharts库
import resumeList from './resumeList.vue'

export default {
  name: 'tongji',
  components: {
    resumeList,
  },
  data() {
    return {
      rowData: {},
      activeName: 'first',
      resumeListVisible: false,
      param: {
        apiCode: 'jy201_hrm220',
        method: 'jy201_hrm220',
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
    // 获取岗位招聘情况数据
    this.statistics1()
  },
  onLoad() {},
  methods: {
    closeResume() {
      this.resumeListVisible = false
    },
    initChart(id, option) {
      let self = this
      echarts.env.touchEventsSupported = false
      echarts.env.wxa = false
      const chartContainer = document.getElementById(id)
      self.chart = echarts.init(chartContainer)
      this.chart.setOption(option)
    },
    checkRotate() {
      if (this.isFlag) {
        this.isFlag = false
      } else {
        this.isFlag = true
      }
    },
    statistics() {
      this.param.aab001 = this.loginInfo.aab001
      this.param.acb330 = this.loginInfo.acb330
      this.$http
        .post(this.$requestConstant.businessRequestType, 'jy201_hrm220', null, this.param, true)
        .then((responseData) => {
          let res = responseData ? responseData.data : {}
          if (res.errors && res.errors.length > 0) {
            uni.showToast({
              title: res.errors[0].msg,
              duration: 2000,
              icon: 'none',
            })
          } else {
            this.totalJob = res.resultMap.totalJob
            this.totalRecruit = res.resultMap.totalRecruit
          }
        })
    },
    statistics1() {
      this.param1.aab001 = this.loginInfo.aab001
      this.$http
        .post(this.$requestConstant.businessRequestType, 'jy201_hrm216', null, this.param1, true)
        .then((responseData) => {
          let res = responseData ? responseData.data : {}
          if (res.errors && res.errors.length > 0) {
            uni.showToast({
              title: res.errors[0].msg,
              duration: 2000,
              icon: 'none',
            })
          } else {
            // 岗位招聘情况
            this.workList = res.resultMap.jobList
            // 日趋势
            const dayTrendList = res.resultMap.dayTrendList
            this.opt1.xAxis.data = dayTrendList.map((item) => {
              return item.rq
            })
            this.opt1.series.push({
              data: dayTrendList.map((item) => {
                return item.sl
              }),
              type: 'bar',
              barWidth: '20px',
              seriesBar: {
                roundCap: true,
              },
            })
            this.initChart('box', this.opt1)

            // 学历分布
            const education = res.resultMap.education
            const educationName = education.map((item) => {
              return { name: item.dsc, max: 10 }
            })
            this.opt2.radar.indicator = educationName
            const educationNum = education.map((item) => {
              return item.sl
            })
            this.opt2.series.push({
              name: '学历分布',
              type: 'radar',
              data: educationNum,
            })
            this.initChart('person', this.opt2)
            let ageSex = res.resultMap.ageSex
            let ages = []
            let man = []
            let male = []
            ageSex.forEach((item) => {
              if (!ages.includes(item.age)) {
                ages.push(item.age)
              }
            })
            ages.forEach((item) => {
              let manCount = 0
              let maleCount = 0
              ageSex.forEach((subItem) => {
                if (subItem.age == item) {
                  if (subItem.aac004 == '1') {
                    manCount += 1
                  }
                  if (subItem.aac004 == '2') {
                    maleCount += 1
                  }
                }
              })
              let manTemp = []
              manTemp.push(item)
              manTemp.push(manCount)
              man.push(manTemp)
              let maleTemp = []
              maleTemp.push(item)
              maleTemp.push(maleCount)
              male.push(maleTemp)
            })
            this.opt3.series.push(
              {
                symbolSize: 20,
                name: '男性',
                data: man,
                type: 'scatter',
              },
              {
                symbolSize: 20,
                data: male,
                name: '女性',
                type: 'scatter',
              }
            )
            this.initChart('ageBox', this.opt3)
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

#box {
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
</style>
