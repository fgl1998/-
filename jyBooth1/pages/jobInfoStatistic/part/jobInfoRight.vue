<template>
  <div class="job-info-right">
    <div class="right-item">
      <div class="statistic-title">
        <span>近五年人力资源市场总体情况</span>
      </div>
      <div ref="cylinderEcharts" class="cylinder-echarts" />
      <svg>
        <linearGradient id="textGradient1" x1="1" y1="0" x2="0" y2="0">
          <stop offset="60%" stop-color="#398BF1" />
          <stop offset="100%" stop-color="#FFFFFF" />
        </linearGradient>
      </svg>
      <svg>
        <linearGradient id="textGradient2" x1="1" y1="0" x2="0" y2="0">
          <stop offset="60%" stop-color="#EC4A69" />
          <stop offset="100%" stop-color="#FFFFFF" />
        </linearGradient>
      </svg>
    </div>
    <div class="right-item">
      <div class="statistic-title">
        <span>招聘 | 留用率情况</span>
      </div>
      <div ref="prismEcharts" class="prism-echarts" />
    </div>
    <div class="right-item">
      <div class="statistic-title">
        <span>近五年人才引进情况</span>
      </div>
      <div ref="curvedEcharts" class="curved-echarts" />
      <svg>
        <linearGradient id="textGradient3" x1="1" y1="0" x2="0" y2="0">
          <stop offset="60%" stop-color="#137FFF" />
          <stop offset="100%" stop-color="#FFFFFF" />
        </linearGradient>
      </svg>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
// import * as echarts1 from '../../assets/js/echarts.min@5'
import iconSelect from '../../../static/images/img/jobInfoStatistic/icon-select.png'

export default {
  name: 'jobInfoRight',
  props: {
    acb330: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      cylinderEcharts: {},
      prismEcharts: {},
      position: {},
      curvedEcharts: {},
    }
  },
  mounted() {
    this.getAllData()
  },
  methods: {
    getAllData() {
      this.$http
        .post(
          this.$requestConstant.businessRequestType,
          'queryHRTop5',
          null,
          {
            acb330: this.acb330,
          },
          true,
        )
        .then((res) => {
          if (res?.data?.resultData) {
            const xData = res.data.resultData.map((item) => item.year)
            const yData1 = res.data.resultData.map((item) => item.needNum)
            const yData2 = res.data.resultData.map((item) => item.seekerNum)
            this.initCylinderEcharts(xData, yData1, yData2)
          }
        })

      this.$http
        .post(
          this.$requestConstant.businessRequestType,
          'queryInvite',
          null,
          {
            acb330: this.acb330,
          },
          true,
        )
        .then((res) => {
          if (res?.data?.resultData) {
            const xData = res.data.resultData.map((item) => item.year)
            const yData = res.data.resultData.map((item) => item.num)
            this.initPrismEcharts(xData, yData)
          }
        })

      this.$http
        .post(
          this.$requestConstant.businessRequestType,
          'queryIntro',
          null,
          {
            acb330: this.acb330,
          },
          true,
        )
        .then((res) => {
          if (res?.data?.resultData) {
            const xData = res.data.resultData.map((item) => item.year)
            const yData = res.data.resultData.map((item) => item.num)
            this.initCurvedEcharts(xData, yData)
          }
        })
    },
    initCylinderEcharts(xData, yData1, yData2) {
      this.cylinderEcharts = echarts.init(this.$refs.cylinderEcharts, null, { renderer: 'svg' })
      const option = {
        grid: {
          left: '5%',
          right: '5%',
          top: '12%',
          bottom: '0%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: xData,
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: true,
              color: '#AED8F7',
              fontSize: 10,
              margin: 15,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: true,
              color: '#AED8F7',
              fontSize: 10,
            },
          },
        ],
        series: [
          {
            type: 'pictorialBar',
            symbolSize: [21, 10],
            symbolOffset: [-15, -5],
            symbolPosition: 'end',
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.3,
              r: 0.7,
              colorStops: [
                {
                  offset: 0.5,
                  color: '#2350d2', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#F3FEFF', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
            z: 10,
            label: {
              offset: [-15, 5],
              color: 'url(#textGradient1)', // 渐变色
              position: 'top',
            },
            emphasis: {
              label: {
                show: true,
              },
            },
            data: yData1,
          },
          {
            type: 'pictorialBar',
            symbolSize: [20, 10],
            symbolOffset: [-15, 5],
            itemStyle: {
              color: '#1f4bc9',
              borderWidth: 1,
              borderColor: '#398BF1',
            },
            z: 5,
            data: yData1,
          },
          {
            type: 'bar',
            itemStyle: {
              color: '#1f4bc9',
              borderWidth: 1,
              borderColor: '#398BF1',
            },
            label: {
              color: 'url(#textGradient1)', // 渐变色
              position: 'top',
            },
            emphasis: {
              label: {
                show: true,
              },
            },
            z: 1,
            barWidth: '20',
            barGap: '50%',
            data: yData1,
          },
          {
            type: 'pictorialBar',
            symbolSize: [21, 10],
            symbolOffset: [15, -5],
            symbolPosition: 'end',
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.3,
              r: 0.7,
              colorStops: [
                {
                  offset: 0.5,
                  color: '#d33682', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#F3FEFF', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
            z: 10,
            label: {
              offset: [15, 5],
              color: 'url(#textGradient2)', // 渐变色
              position: 'top',
            },
            emphasis: {
              label: {
                show: true,
              },
            },
            data: yData2,
          },
          {
            type: 'pictorialBar',
            symbolSize: [20, 10],
            symbolOffset: [15, 5],
            itemStyle: {
              color: '#c62d79',
              borderWidth: 1,
              borderColor: '#eb14aa',
            },
            z: 5,
            data: yData2,
          },
          {
            type: 'bar',
            itemStyle: {
              color: '#c62d79',
              borderWidth: 1,
              borderColor: '#eb14aa',
            },
            label: {
              color: 'url(#textGradient2)', // 渐变色
              position: 'top',
            },
            emphasis: {
              label: {
                show: true,
              },
            },
            barWidth: '20',
            barGap: '50%',
            z: 1,
            data: yData2,
          },
        ],
      }
      this.cylinderEcharts.setOption(option, true)
    },
    initPrismEcharts(xData, yData) {
      this.initExtend()
      this.prismEcharts = echarts.init(this.$refs.prismEcharts)
      // const xData = ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06', '2023-07', '2023-08', '2023-09']
      // const yData = [300, 200, 250, 330, 50, 253, 110, 225, 340]
      const option = {
        grid: {
          left: '5%',
          right: '5%',
          top: '12%',
          bottom: '0%',
          containLabel: true,
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        },
        xAxis: {
          type: 'category',
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: true,
            color: '#AED8F7',
            fontSize: 10,
            interval: 0,
          },
          data: xData,
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#AED8F7',
            fontSize: 10,
          },
        },
        series: [
          {
            type: 'custom',
            renderItem: (params, api) => this.customChart(params, api),
            tooltip: {
              show: true,
              trigger: 'item',
              position: 'top',
              confine: false,
              formatter: (params) => {
                return params.value
              },
            },
            data: yData,
          },
        ],
      }
      this.prismEcharts.setOption(option, true)
    },
    formatInt(num, prec = 1, ceil = true) {
      const len = String(num).length
      if (len <= prec) {
        return num
      }
      const mult = Math.pow(10, prec)
      return ceil ? Math.ceil(num / mult) * mult : Math.floor(num / mult) * mult
    },
    customChart(params, api) {
      const cubeFrontStyle = new echarts.graphic.LinearGradient(0, 1, 0, 0, [
        {
          offset: 0,
          color: 'rgba(0, 246, 255, 0.2)',
        },
        {
          offset: 1,
          color: 'rgba(0,246,255,0.8)',
        },
      ])
      const cubeRearStyle = new echarts.graphic.LinearGradient(0, 1, 0, 0, [
        {
          offset: 0,
          color: 'rgba(0, 246, 255, 0.1)',
        },
        {
          offset: 1,
          color: 'rgba(0,246,255,0.5)',
        },
      ])

      const emphasisFrontStyle = new echarts.graphic.LinearGradient(0, 1, 0, 0, [
        {
          offset: 0,
          color: 'rgba(0,110,203,0.2)',
        },
        {
          offset: 1,
          color: 'rgba(0,110,203,0.8)',
        },
      ])
      const emphasisRearStyle = new echarts.graphic.LinearGradient(0, 1, 0, 0, [
        {
          offset: 0,
          color: 'rgba(0,110,203,0.2)',
        },
        {
          offset: 1,
          color: 'rgba(0,110,203,0.8)',
        },
      ])
      const location = api.coord([api.value(0), api.value(1)])
      return {
        type: 'group',
        children: [
          {
            type: 'CubeLeft',
            shape: {
              api,
              xValue: api.value(0),
              yValue: api.value(1),
              x: location[0],
              y: location[1],
              xAxisPoint: api.coord([api.value(0), 0]),
            },
            style: {
              fill: cubeFrontStyle,
            },
            styleEmphasis: {
              fill: emphasisFrontStyle,
            },
          },
          {
            type: 'CubeLeft1',
            shape: {
              api,
              xValue: api.value(0),
              yValue: api.value(1),
              x: location[0],
              y: location[1],
              xAxisPoint: api.coord([api.value(0), 0]),
            },
            style: {
              fill: cubeRearStyle,
            },
            styleEmphasis: {
              fill: emphasisRearStyle,
            },
          },
          {
            type: 'CubeRight',
            shape: {
              api,
              xValue: api.value(0),
              yValue: api.value(1),
              x: location[0],
              y: location[1],
              xAxisPoint: api.coord([api.value(0), 0]),
            },
            style: {
              fill: cubeFrontStyle,
            },
            styleEmphasis: {
              fill: emphasisFrontStyle,
            },
          },
          {
            type: 'CubeRight1',
            shape: {
              api,
              xValue: api.value(0),
              yValue: api.value(1),
              x: location[0],
              y: location[1],
              xAxisPoint: api.coord([api.value(0), 0]),
            },
            style: {
              fill: cubeRearStyle,
            },
            styleEmphasis: {
              fill: emphasisRearStyle,
            },
          },
          {
            type: 'CubeTop',
            shape: {
              api,
              xValue: api.value(0),
              yValue: api.value(1),
              x: location[0],
              y: location[1],
              xAxisPoint: api.coord([api.value(0), 0]),
            },
            style: {
              fill: '#00EAFF',
            },
            styleEmphasis: {
              fill: '#006ECB',
            },
          },
          {
            type: 'CubeBottom',
            shape: {
              api,
              xValue: api.value(0),
              yValue: api.value(1),
              x: location[0],
              y: location[1],
              xAxisPoint: api.coord([api.value(0), 0]),
            },
            style: {
              fill: '#00EAFF33',
            },
            styleEmphasis: {
              fill: '#006ECB66',
            },
          },
        ],
      }
    },
    initExtend() {
      // 绘制左前面
      const CubeLeft = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
        },
        buildPath: function (ctx, shape) {
          // 会canvas的应该都能看得懂，shape是从custom传入的
          const xAxisPoint = shape.xAxisPoint
          const c0 = [shape.x - 1.5, shape.y]
          const c1 = [shape.x - 11.5, shape.y - 3]
          const c2 = [xAxisPoint[0] - 11.5, xAxisPoint[1] - 5.5]
          const c3 = [xAxisPoint[0] - 1.5, xAxisPoint[1]]
          ctx.moveTo(c0[0], c0[1]).lineTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).closePath()
        },
      })
      // 绘制左后面
      const CubeLeft1 = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
        },
        buildPath: function (ctx, shape) {
          // 会canvas的应该都能看得懂，shape是从custom传入的
          const xAxisPoint = shape.xAxisPoint
          const c0 = [shape.x + 7.1, shape.y - 6]
          const c1 = [shape.x - 11.5, shape.y - 3]
          const c2 = [xAxisPoint[0] - 11.5, xAxisPoint[1] - 5.5]
          const c3 = [xAxisPoint[0] + 6.1, xAxisPoint[1] - 9]
          ctx.moveTo(c0[0], c0[1]).lineTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).closePath()
        },
      })
      // 绘制右前面
      const CubeRight = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
        },
        buildPath: function (ctx, shape) {
          const xAxisPoint = shape.xAxisPoint
          const c1 = [shape.x - 2, shape.y]
          const c2 = [xAxisPoint[0] - 2, xAxisPoint[1]]
          const c3 = [xAxisPoint[0] + 15, xAxisPoint[1] - 3]
          const c4 = [shape.x + 15, shape.y - 3]

          ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
        },
      })
      // 绘制右后面
      const CubeRight1 = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
        },
        buildPath: function (ctx, shape) {
          // 会canvas的应该都能看得懂，shape是从custom传入的
          const xAxisPoint = shape.xAxisPoint
          const c0 = [shape.x + 7, shape.y - 6]
          const c1 = [xAxisPoint[0] + 6, xAxisPoint[1] - 9]
          const c2 = [xAxisPoint[0] + 15, xAxisPoint[1] - 3]
          const c3 = [shape.x + 15, shape.y - 3]
          ctx.moveTo(c0[0], c0[1]).lineTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).closePath()
        },
      })
      // 绘制顶面
      const CubeTop = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
        },
        buildPath: function (ctx, shape) {
          const c1 = [shape.x - 2, shape.y]
          const c2 = [shape.x + 15, shape.y - 3] // 右点
          const c3 = [shape.x + 7, shape.y - 6]
          const c4 = [shape.x - 11.5, shape.y - 3]
          ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
        },
      })
      // 绘制底面
      const CubeBottom = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
        },
        buildPath: function (ctx, shape) {
          const xAxisPoint = shape.xAxisPoint
          const c1 = [xAxisPoint[0] - 11.5, xAxisPoint[1] - 5.5]
          const c2 = [xAxisPoint[0] - 1.5, xAxisPoint[1]]
          const c3 = [xAxisPoint[0] + 15, xAxisPoint[1] - 3]
          const c4 = [xAxisPoint[0] + 6, xAxisPoint[1] - 9]
          ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
        },
      })
      // 注册三个面图形
      echarts.graphic.registerShape('CubeLeft', CubeLeft)
      echarts.graphic.registerShape('CubeLeft1', CubeLeft1)
      echarts.graphic.registerShape('CubeRight', CubeRight)
      echarts.graphic.registerShape('CubeRight1', CubeRight1)
      echarts.graphic.registerShape('CubeTop', CubeTop)
      echarts.graphic.registerShape('CubeBottom', CubeBottom)
    },
    initCurvedEcharts(xData, yData) {
      this.curvedEcharts = echarts.init(this.$refs.curvedEcharts, null, { renderer: 'svg' })
      // const xData = ['2019', '2020', '2021', '2022', '2023']
      // const yData = [250, 375, 310, 142, 238]
      const option = {
        grid: {
          left: '5%',
          right: '5%',
          top: '15%',
          bottom: '0%',
          containLabel: true,
        },
        xAxis: {
          data: xData,
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: '#AED8F7',
            fontSize: 10,
          },
        },
        yAxis: [
          {
            splitNumber: 8,
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              color: '#AED8F7',
              fontSize: 10,
            },
          },
        ],
        series: [
          {
            type: 'pictorialBar',
            symbol: 'path://M0,10 L10,10 C9.5,10 5.5,5 5,0 C4.5,5 0.5,10 0,10 z',
            label: {
              show: false,
              position: 'top',
              color: 'url(#textGradient3)', // 渐变色
              fontSize: 15,
              rich: {
                a1: {
                  backgroundColor: {
                    image: iconSelect,
                  },
                  width: 11,
                  height: 6,
                  color: 'transparent',
                  align: 'center',
                  padding: 0,
                },
              },
              formatter: (params) => {
                return `${params.value}\n{a1|${params.value}}`
              },
            },
            itemStyle: {
              color: 'rgba(25,95,255,0.5)',
            },
            emphasis: {
              label: {
                show: true,
              },
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#ffffff',
                    },
                    {
                      offset: 0.5,
                      color: '#137FFF',
                    },
                  ],
                  global: false, //  缺省为  false
                },
              },
            },
            data: yData,
          },
        ],
      }
      this.curvedEcharts.setOption(option, true)
    },
  },
}
</script>

<style scoped lang="scss">
@import '../../../static/scss/gsCommon.scss';

.job-info-right {
  width: 500px;
  .right-item {
    height: 280px;
    overflow: hidden;
    svg {
      height: 0;
    }
  }
}
.statistic-title {
  width: 500px;
}
.cylinder-echarts,
.prism-echarts,
.curved-echarts {
  height: 240px;
}
</style>
