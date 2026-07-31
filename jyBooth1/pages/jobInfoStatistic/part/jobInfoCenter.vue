<template>
  <div class="job-info-center">
    <div class="statistic-num">
      <img class="info-show" src="../../../static/images/img/jobInfoStatistic/info-show.png" />
      <div v-for="item in statisticNum" :key="item.field" class="statistic-item">
        <div class="title">
          {{ item.title }}
        </div>
        <div class="num">
          {{ statisticData[item.field] || 0 }}<span>{{ item.unit }}</span>
        </div>
      </div>
    </div>
    <div class="map-box">
      <img class="map-bg" src="../../../static/images/img/jobInfoStatistic/map-bg.png" />
      <!-- <div class="shadow-bg"></div> -->
      <img class="echarts-map-bg" src="../../../static/images/img/jobInfoStatistic/map-bg2_03.png" />
      <!-- <img class="echarts-map-shadow" src="../../../static/images/img/jobInfoStatistic/echarts-map-shadow.png" />  -->
      <div ref="mapEcharts" class="map-echarts" />
    </div>
    <div class="echarts-box">
      <div>
        <div class="statistic-title">
          <span>求职人员学历分布</span>
        </div>
        <div class="pie-box">
          <div class="battery-item">
            <div class="battery-bar-text">{{ educationData['31count'] }}人</div>
            <div class="battery-bar">
              <img
                class="battery-bar-count-top"
                :style="{ bottom: `${175 * (educationData.juniorMix / 100)}px` }"
                src="../../../static/images/img/jobInfoStatistic/img-9-top.png"
              />
              <img
                class="battery-bar-count"
                :style="{ transform: `scale(1,${educationData.juniorMix / 100})` }"
                src="../../../static/images/img/jobInfoStatistic/img-9.png"
              />
              <img class="battery-bar-progress" src="../../../static/images/img/jobInfoStatistic/img-6.png" />
            </div>
            <div class="battery-bar-text">专科</div>
          </div>
          <div class="battery-item">
            <div class="battery-bar-text">{{ educationData['21count'] }}人</div>
            <div class="battery-bar">
              <img
                class="battery-bar-count-top"
                :style="{ bottom: `${175 * (educationData.undergraduateMix / 100)}px` }"
                src="../../../static/images/img/jobInfoStatistic/img-10-top.png"
              />
              <img
                class="battery-bar-count"
                :style="{ transform: `scale(1,${educationData.undergraduateMix / 100})` }"
                src="../../../static/images/img/jobInfoStatistic/img-10.png"
              />
              <img class="battery-bar-progress" src="../../../static/images/img/jobInfoStatistic/img-7.png" />
            </div>
            <div class="battery-bar-text">本科</div>
          </div>
          <div class="battery-item">
            <div class="battery-bar-text">{{ educationData.other }}人</div>
            <div class="battery-bar">
              <img
                class="battery-bar-count-top"
                :style="{ bottom: `${175 * (educationData.otherMix / 100)}px` }"
                src="../../../static/images/img/jobInfoStatistic/img-11-top.png"
              />
              <img
                class="battery-bar-count"
                :style="{ transform: `scale(1,${educationData.otherMix / 100})` }"
                src="../../../static/images/img/jobInfoStatistic/img-11.png"
              />
              <img class="battery-bar-progress" src="../../../static/images/img/jobInfoStatistic/img-8.png" />
            </div>
            <div class="battery-bar-text">其它</div>
          </div>
        </div>
      </div>
      <div>
        <div class="statistic-title">
          <span>求职人员年龄分布</span>
        </div>
        <div class="bar-box">
          <div class="bar-legend">
            <span>男</span>
            <span>女</span>
          </div>
          <div ref="barEcharts" class="bar-echarts" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
// import 'echarts-gl'
import taiyuanMap from '../../../static/js/taiyuanMap.json'
import labelShort from '../../../static/images/img/jobInfoStatistic/label-short.png'
import labelShortHover from '../../../static/images/img/jobInfoStatistic/label-short-hover.png'
import labelLong from '../../../static/images/img/jobInfoStatistic/label-long.png'
import labelLongHover from '../../../static/images/img/jobInfoStatistic/label-long-hover.png'
import vertebral from '../../../static/images/img/jobInfoStatistic/vertebral.png'
import vertebralHover from '../../../static/images/img/jobInfoStatistic/vertebral-hover.png'

echarts.registerMap('taiyuan', taiyuanMap)
export default {
  name: 'jobInfoCenter',
  props: {
    acb330: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      statisticNum: [
        {
          field: 'jobNum',
          title: '在招岗位数',
          unit: '个',
        },
        {
          field: 'recruitNum',
          title: '在招人数',
          unit: '人',
        },
        {
          field: 'applyNum',
          title: '求职人数',
          unit: '人',
        },
      ],
      statisticData: {},
      mapEcharts: {},
      mapData: [],
      educationData: {
        juniorMix: 0,
        undergraduateMix: 0,
        otherMix: 0,
      },
      mapCycleNames: [],
      mapCycleTimer: null,
      mapCycleIndex: 0,
      womenPercent: 0,
      barEcharts: {},
      barData: [],
    }
  },
  mounted() {
    this.getAllData()
  },
  methods: {
    // 获取所有数据
    getAllData() {
      // 获取头部数据
      this.$http
        .post(
          this.$requestConstant.businessRequestType,
          'queryAmount',
          null,
          {
            acb330: this.acb330,
          },
          true,
        )
        .then((res) => {
          this.statisticData = res?.data?.resultData || {}
        })

      // 查询地图数据
      this.$http
        .post(
          this.$requestConstant.businessRequestType,
          'queryMapData',
          null,
          {
            acb330: this.acb330,
          },
          true,
        )
        .then((res) => {
          this.mapData = res?.data?.resultData || []
          this.initEchartsMap()
        })
      // 求职人员学历分布
      this.$http
        .post(
          this.$requestConstant.businessRequestType,
          'queryEduDis',
          null,
          {
            acb330: this.acb330,
          },
          true,
        )
        .then((res) => {
          this.educationData = res?.data?.resultData || {}
          this.educationData.total =
            Number(this.educationData['31count']) +
            Number(this.educationData['21count']) +
            Number(this.educationData.other)
          this.educationData.juniorMix = ((this.educationData['31count'] / this.educationData.total) * 100).toFixed(2)
          this.educationData.undergraduateMix = (
            (this.educationData['21count'] / this.educationData.total) *
            100
          ).toFixed(2)
          this.educationData.otherMix = ((this.educationData.other / this.educationData.total) * 100).toFixed(2)
        })
      // 求职人员年龄分布
      this.$http
        .post(
          this.$requestConstant.businessRequestType,
          'jobQuerySexAndAgeDis',
          null,
          {
            acb330: this.acb330,
          },
          true,
        )
        .then((res) => {
          this.barData = res?.data?.resultData || []
          this.initBarEcharts()
        })
    },
    // 注册地图
    initEchartsMap() {
      this.mapEcharts = echarts.init(this.$refs.mapEcharts)
      const mapStyle = {
        borderColor: 'rgba(147, 235, 248, 1)',
        borderWidth: 1,
        areaColor: {
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 0.8,
          colorStops: [
            {
              offset: 0.4,
              color: 'rgba(147, 235, 248, 0)', // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'rgba(147, 235, 248, .21)', // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
        shadowColor: 'rgba(255, 255, 255, .8)',
        shadowOffsetX: -2,
        shadowOffsetY: 2,
        shadowBlur: 10,
      }
      const mapData = this.mapData.map((item) => {
        const data = {
          ...item,
          name: item.areaName,
        }
        return data
      })
      const option = {
        tooltip: {
          show: true,
          triggerOn: 'none',
          trigger: 'item',
          alwaysShowContent: true,
          position: (pos, params, dom, rect, size) => {
            // 跟随鼠标/区域位置，同时避免溢出
            const viewWidth = size?.viewSize?.[0] || 0
            const viewHeight = size?.viewSize?.[1] || 0
            const boxWidth = size?.contentSize?.[0] || 0
            const boxHeight = size?.contentSize?.[1] || 0
            let [left, top] = pos || [0, 0]
            left += 20
            top -= boxHeight / 2
            if (left + boxWidth > viewWidth) left = viewWidth - boxWidth - 10
            if (left < 0) left = 0
            if (top + boxHeight > viewHeight) top = viewHeight - boxHeight - 10
            if (top < 0) top = 0
            return [left, top]
          },
          backgroundColor: 'rgba(34, 84, 148, 0.95)',
          borderColor: '#79c8ff',
          borderWidth: 1,
          padding: [10, 14],
          borderRadius: 6,
          shadowBlur: 8,
          shadowColor: 'rgba(0, 0, 0, 0.4)',
          textStyle: {
            color: '#e8f3ff',
            lineHeight: 22,
            fontSize: 13,
            rich: {
              dot: {
                width: 6,
                height: 6,
                backgroundColor: '#7dd0ff',
                borderRadius: 3,
                borderColor: '#d4ecff',
                borderWidth: 1,
                align: 'center',
                verticalAlign: 'middle',
                padding: [0, 8, 0, 0],
              },
              label: {
                color: '#e8f3ff',
              },
              value: {
                color: '#ffffff',
                fontWeight: 600,
                padding: [0, 0, 0, 6],
              },
            },
          },
          formatter: (params) => {
            const data = params?.data || {}
            const needNum = data.needNum || 0
            const seekerNum = data.seekerNum || 0
            return [
              `{dot|}{label|需求人数：}{value|${needNum}} 人`,
              `{dot|}{label|求职人数：}{value|${seekerNum}} 人`,
            ].join('\n')
          },
        },
        geo: [
          {
            map: 'taiyuan',
            itemStyle: mapStyle,
            label: {
              show: true,
              rich: {
                a1: {
                  backgroundColor: {
                    image: vertebral,
                  },
                  width: 20,
                  height: 25,
                },
                a2: {
                  backgroundColor: {
                    image: labelShort,
                  },
                  width: 63,
                  height: 27,
                  color: '#ffffff',
                  fontWeight: 500,
                  fontStyle: 'oblique',
                },
                a3: {
                  backgroundColor: {
                    image: labelShort,
                  },
                  width: 71,
                  height: 27,
                  color: '#ffffff',
                  fontWeight: 500,
                  fontStyle: 'oblique',
                },
                a4: {
                  backgroundColor: {
                    image: labelLong,
                  },
                  width: 109,
                  height: 27,
                  color: '#ffffff',
                  fontWeight: 500,
                  fontStyle: 'oblique',
                },
              },
              formatter: (params) => {
                if (!params) {
                  return
                }
                if (params.name.length < 4) {
                  return `{a2|${params.name}}\n{a1|} \n\n\n`
                } else if (params.name.length === 4) {
                  return `{a3|${params.name}}\n{a1|} \n\n\n`
                } else {
                  return `{a4|${params.name}}\n{a1|} \n\n\n`
                }
              },
            },
            emphasis: {
              itemStyle: mapStyle,
              label: {
                show: true,
                rich: {
                  a1: {
                    backgroundColor: {
                      image: vertebralHover,
                    },
                    width: 26,
                    height: 40,
                  },
                  a2: {
                    backgroundColor: {
                      image: labelShortHover,
                    },
                    width: 63,
                    height: 27,
                    color: '#ffffff',
                    fontWeight: 500,
                    fontStyle: 'oblique',
                  },
                  a3: {
                    backgroundColor: {
                      image: labelShortHover,
                    },
                    width: 73,
                    height: 27,
                    color: '#ffffff',
                    fontWeight: 500,
                    fontStyle: 'oblique',
                  },
                  a4: {
                    backgroundColor: {
                      image: labelLongHover,
                    },
                    width: 109,
                    height: 27,
                    color: '#ffffff',
                    fontWeight: 500,
                    fontStyle: 'oblique',
                  },
                },
                formatter: (params) => {
                  if (!params) {
                    return
                  }
                  if (params.name.length < 4) {
                    return `{a2|${params.name}}\n{a1|}\n\n\n\n`
                  } else if (params.name.length === 4) {
                    return `{a3|${params.name}}\n{a1|}\n\n\n\n`
                  } else {
                    return `{a4|${params.name}}\n{a1|}\n\n\n\n`
                  }
                },
              },
            },
            zoom: 1.2,
          },
        ],
        series: [
          {
            name: 'taiyuan',
            type: 'map',
            geoIndex: 0,
            zlevel: 10,
            selectedMode: false,
            hoverAnimation: false,
            itemStyle: {
              areaColor: mapStyle.areaColor,
              borderColor: mapStyle.borderColor,
              borderWidth: mapStyle.borderWidth,
              shadowColor: mapStyle.shadowColor,
              shadowOffsetX: mapStyle.shadowOffsetX,
              shadowOffsetY: mapStyle.shadowOffsetY,
              shadowBlur: mapStyle.shadowBlur,
            },
            emphasis: {
              itemStyle: {
                areaColor: mapStyle.areaColor,
                borderColor: mapStyle.borderColor,
                borderWidth: mapStyle.borderWidth,
                shadowColor: mapStyle.shadowColor,
                shadowOffsetX: mapStyle.shadowOffsetX,
                shadowOffsetY: mapStyle.shadowOffsetY,
                shadowBlur: mapStyle.shadowBlur,
              },
              label: {
                show: true,
                color: '#fff',
              },
            },
            select: {
              itemStyle: {
                areaColor: mapStyle.areaColor,
                borderColor: mapStyle.borderColor,
                borderWidth: mapStyle.borderWidth,
                shadowColor: mapStyle.shadowColor,
                shadowOffsetX: mapStyle.shadowOffsetX,
                shadowOffsetY: mapStyle.shadowOffsetY,
                shadowBlur: mapStyle.shadowBlur,
              },
              label: {
                show: true,
                color: '#fff',
              },
            },
            data: mapData,
          },
        ],
      }
      this.mapEcharts.setOption(option, true)
      this.stopMapCycle()
      this.mapCycleNames = (this.mapData || []).map((item) => item.areaName).filter(Boolean)
      this.mapEcharts.on('click', (params) => {
        this.stopMapCycle()
        this.mapEcharts.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
        })
        this.mapEcharts.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          name: params.name,
        })
        // 选中地图区域出现提示框
        this.mapEcharts.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          name: params.name,
        })
        const idx = this.mapCycleNames.indexOf(params.name)
        if (idx >= 0) this.mapCycleIndex = idx
        this.startMapCycle(this.mapCycleNames)
      })
      this.startMapCycle(this.mapCycleNames)
    },

    // 注册柱状图
    initBarEcharts() {
      this.barEcharts = echarts.init(this.$refs.barEcharts)
      const yData = ['50-59岁', '40-49岁', '30-39岁', '18-29岁']
      const barManData = this.barData[0]
      const barWomanData = this.barData[1]
      const manData = [barManData['50-59'], barManData['40-49'], barManData['30-39'], barManData['18-29']]
      const womanData = [barWomanData['50-59'], barWomanData['40-49'], barWomanData['30-39'], barWomanData['18-29']]
      const option = {
        tooltip: {
          show: true,
          formatter: '{a}{b}：{c}人',
          trigger: 'axis',
          axisPointer: {
            type: 'none',
          },
        },
        grid: [
          {
            show: false,
            left: '15%',
            containLabel: false,
            width: '40%',
          },
          {
            show: false,
            left: '57%',
            containLabel: false,
            width: '40%',
          },
        ],
        xAxis: [
          {
            name: '万（人）',
            nameTextStyle: {
              color: '#B5E0FF',
              align: 'center',
              verticalAlign: 'top',
              padding: [8, 20, 0, 0],
            },
            type: 'value',
            gridIndex: 0,
            inverse: true,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              align: 'left',
              textStyle: {
                color: '#B5E0FF',
              },
              formatter: (value, index) => {
                if (index === 0) {
                  return ''
                }
                return value
              },
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: 'value',
            gridIndex: 1,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              align: 'right',
              textStyle: {
                color: '#B5E0FF',
              },
            },
            splitLine: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            gridIndex: 0,
            type: 'category',
            position: 'left',
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#B5E0FF',
              },
            },
            splitLine: {
              show: false,
            },
            data: yData,
          },
          {
            type: 'category',
            gridIndex: 1,
            show: false,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            data: yData,
          },
        ],
        series: [
          {
            name: '男',
            type: 'bar',
            xAxisIndex: 0,
            yAxisIndex: 0,
            barWidth: 10,
            itemStyle: {
              barBorderRadius: 6,
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                {
                  offset: 0.6,
                  color: '#137FFF',
                },
                {
                  offset: 1,
                  color: '#ffffff',
                },
              ]),
            },
            data: manData,
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(0,143,255,0.29)',
              barBorderRadius: 6,
              borderWidth: 1,
              borderColor: '#008FFF',
            },
          },
          {
            name: '女',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            barWidth: 10,
            itemStyle: {
              barBorderRadius: 6,
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0.6,
                  color: '#EC4A69',
                },
                {
                  offset: 1,
                  color: '#ffffff',
                },
              ]),
            },
            data: womanData,
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(0,143,255,0.29)',
              barBorderRadius: 6,
              borderWidth: 1,
              borderColor: '#008FFF',
            },
          },
        ],
      }
      this.barEcharts.setOption(option, true)
    },
    startMapCycle(names = []) {
      const list = names.length ? names : (this.mapData || []).map((item) => item.areaName).filter(Boolean)
      if (!list.length || !this.mapEcharts) return
      this.mapCycleIndex = this.mapCycleIndex % list.length
      const highlight = (name) => {
        this.mapEcharts.dispatchAction({ type: 'downplay', seriesIndex: 0 })
        this.mapEcharts.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          name,
        })
        this.mapEcharts.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          name,
        })
      }
      highlight(list[this.mapCycleIndex])
      this.mapCycleTimer = setInterval(() => {
        this.mapCycleIndex = (this.mapCycleIndex + 1) % list.length
        highlight(list[this.mapCycleIndex])
      }, 4000)
    },
    stopMapCycle() {
      if (this.mapCycleTimer) {
        clearInterval(this.mapCycleTimer)
        this.mapCycleTimer = null
      }
    },
  },
  beforeDestroy() {
    this.stopMapCycle()
    if (this.mapEcharts && this.mapEcharts.dispose) {
      this.mapEcharts.dispose()
    }
  },
}
</script>

<style scoped lang="scss">
@import '../../../static/scss/gsCommon.scss';

.job-info-center {
  flex: 1;
}

.statistic-title {
  width: 100%;
}

.statistic-num {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 0 70px;
  height: 83px;

  .info-show {
    position: absolute;
    top: 0;
    width: 827px;
    height: 83px;
    left: 50%;
    transform: translateX(-50%);
  }

  .statistic-item {
    font-family: Alibaba PuHuiTi;
    font-size: 16px;
    color: #8ccaff;
    text-align: center;
    flex: 1;

    .title {
      font-style: italic;
      background: -webkit-gradient(linear, left bottom, left top, from(#6a8aab), to(rgba(250, 254, 255, 0.9)));
      background: linear-gradient(0deg, #8ccaff 0%, rgba(250, 254, 255, 1) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .num {
      font-family: YouSheBiaoTiHei;
      font-size: 24px;
      color: #e4edf7;
      background: linear-gradient(179deg, rgba(156, 235, 255, 0.8) 0%, rgba(255, 255, 255, 0.9) 50%);
      opacity: 0.8;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: bold;

      span {
        font-size: 14px;
        color: #8bc6e4;
      }
    }
  }
}

.map-box {
  position: relative;
  width: 100%;
  height: 470px;
  box-sizing: border-box;
  .shadow-bg {
    // background: url('../../../static/images/img/jobInfoStatistic/map-bg2.png');
    position: absolute;
    width: 670px;
    height: 445px;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
  }

  .map-bg {
    position: absolute;
    width: 670px;
    height: 445px;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
  }

  .echarts-map-bg {
    top: -6px;
    position: absolute;
    width: 548px;
    height: 477px;
    left: 50%;
    transform: translateX(-50%) scale(0.92);
    z-index: 1;
    // transform-origin: top left; /* 从左上角开始放大 */
  }

  .echarts-map-shadow {
    position: absolute;
    width: 522px;
    height: 451px;
    left: 50%;
    transform: translateX(-50%) scale(0.95);
    z-index: 1;
  }

  .map-echarts {
    width: 520px;
    height: 424px;
    position: relative;
    margin: 0 auto;
    z-index: 2;
  }
}

.echarts-box {
  width: 100%;
  display: flex;

  > div {
    flex: 1;
  }
}

.bar-box {
  position: relative;

  .bar-legend {
    position: absolute;
    top: 10px;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    color: #b5e0ff;
    line-height: 24px;
    padding: 0 10px 10px 60px;

    &:before {
      position: absolute;
      content: '';
      left: 60px;
      bottom: 0;
      width: 165px;
      height: 2px;
      background: linear-gradient(-90deg, #137fff, #ffffff);
      box-shadow: 0px 1px 1px 0px rgba(208, 240, 254, 0.34);
      border-radius: 1px;
    }

    &:after {
      position: absolute;
      content: '';
      right: 10px;
      bottom: 0;
      width: 165px;
      height: 2px;
      background: linear-gradient(90deg, #ec4a69, #ffffff);
      box-shadow: 0px 1px 1px 0px rgba(208, 240, 254, 0.34);
      border-radius: 1px;
    }
  }

  .bar-echarts {
    width: 100%;
    height: 300px;
  }
}

.pie-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .battery-item {
    .battery-bar {
      position: relative;
      width: 65px;
      height: 170px;

      .battery-bar-progress {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 190px;
        transform: translate(-50%, -50%);
      }
      .battery-bar-count-top {
        position: absolute;
        width: 100%;
        height: 30px;
      }
      .battery-bar-count {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 175px;
        transform-origin: bottom center;
      }
    }

    .battery-bar-text {
      width: 100%;
      text-align: center;
      font-size: 16px;
      color: #b5e0ff;
    }

    .battery-bar-text:first-child {
      padding: 16px 0;
    }

    .battery-bar-text:last-child {
      padding-top: 16px;
    }

    .battery-bar-count-1 {
      background-image: url('../../../static/images/img/jobInfoStatistic/img-9.png');
    }

    .battery-bar-count-2 {
      background-image: url('../../../static/images/img/jobInfoStatistic/img-10.png');
    }

    .battery-bar-count-3 {
      background-image: url('../../../static/images/img/jobInfoStatistic/img-11.png');
    }
  }
}
</style>
