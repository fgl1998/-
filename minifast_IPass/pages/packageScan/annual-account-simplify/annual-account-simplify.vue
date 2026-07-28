<template>
  <div class="annual-account-simplify">
    <AnnualAccountPageStart v-if="currentStep === 1" @clickOpen="onClickOpen"></AnnualAccountPageStart>
    <div
      class="pages"
      :style="{
        width: screenWidth + 'px',
        height: canvasHeight + 'px'
      }"
      v-else>
      <canvas
        v-if="isShowCanvasSave"
        :style="{
          width: screenWidth + 'px',
          height: canvasHeight + 'px'
        }"
        canvas-id="page_save"
        class="canvas-save"
        id="page_save"></canvas>
      <canvas
        :style="{
          width: screenWidth + 'px',
          height: canvasHeight + 'px'
        }"
        canvas-id="page"
        class="canvas"
        id="page"></canvas>
      <cover-view class="btns" :class="getDeviceClass" v-if="isRequestover">
        <cover-view class="btn default" @click="onclickDetail">
          <cover-image :src="imageDetail" alt="" class="icon icon-detail" />
          <cover-view class="text">补贴明细账单</cover-view>
        </cover-view>
        <cover-view class="btn default" @click="onClickSave">
          <cover-image :src="imageSave" alt="" class="icon icon-save" />
          <cover-view class="text">保存图片</cover-view>
        </cover-view>
        <cover-view class="btn active" @click="onClickShare">
          <cover-image :src="imageShare" alt="" class="icon icon-share" />
          <cover-view class="text">去分享</cover-view>
        </cover-view>
      </cover-view>
    </div>
    <AnnualAccountNavbar></AnnualAccountNavbar>
    <AnnualAccountToolbar :step="currentStep" :isPlay="isPlayMusic" @changeMusic="onChangeMusic"></AnnualAccountToolbar>
  </div>
</template>
<script>
  import AnnualAccountPageStart from '@/components/project/annual-account-page-start/annual-account-page-start.vue'
  import AnnualAccountNavbar from '@/components/project/annual-account-navbar/annual-account-navbar.vue'
  import AnnualAccountToolbar from '@/components/project/annual-account-toolbar/annual-account-toolbar.vue'
  import Big from '@/utils/big.min.js'
  import {
    navigateTo,
    getSystemInfoSync,
    showLoading,
    hideLoading,
    showToast,
    getImageInfo,
    canvasToTempFilePath,
    saveImageToPhotosAlbum,
    env,
    openSetting,
    showModal
  } from '@/utils/uni-api'
  import { useJumpToLogin } from '@/hooks'
  import { requestWXGetReport, requestB253 } from '@/service/api'
  import { USER_INFO } from '@/store/constants' // 常量
  import { mapGetters } from 'vuex'
  import config from '@/config'
  import { IMAGE_ANNUAL_ACCOUNT_SIMPLIFY, IMAGE_ANNUAL_ACCOUNT, IMAGE_QR } from '@/config/constants'
  import { imageSponsor } from '@/components/project/annual-account-toolbar/sponsor'

  const { pixelRatio, screenHeight, screenWidth, statusBarHeight } = getSystemInfoSync()
  const { areaCode, areaName_zh } = config

  const imageShare2 = IMAGE_ANNUAL_ACCOUNT + '/share.png'

  const imageTitleText = IMAGE_ANNUAL_ACCOUNT + '/title-text.png'

  const imagePageBg = IMAGE_ANNUAL_ACCOUNT_SIMPLIFY + '/bg.png'
  const imageDefaultAvatar = IMAGE_ANNUAL_ACCOUNT_SIMPLIFY + '/defaultAvatar.png'
  const imageMoney = IMAGE_ANNUAL_ACCOUNT_SIMPLIFY + '/money.png'
  const imageBigTitle = IMAGE_ANNUAL_ACCOUNT_SIMPLIFY + '/bigTitle.png'
  const imageDetail = IMAGE_ANNUAL_ACCOUNT_SIMPLIFY + '/detail.png'
  const imageLine = IMAGE_ANNUAL_ACCOUNT_SIMPLIFY + '/line.png'
  const imageNew = IMAGE_ANNUAL_ACCOUNT_SIMPLIFY + '/new.png'
  const imageSave = IMAGE_ANNUAL_ACCOUNT_SIMPLIFY + '/save.png'
  const imageShare = IMAGE_ANNUAL_ACCOUNT_SIMPLIFY + '/share.png'
  const imageSmallTitle = IMAGE_ANNUAL_ACCOUNT_SIMPLIFY + '/smallTitle.png'
  const imageSocialCard = IMAGE_ANNUAL_ACCOUNT_SIMPLIFY + '/socialCard.png'
  const imageVillage = IMAGE_ANNUAL_ACCOUNT_SIMPLIFY + '/village.png'

  export default {
    name: 'annualAccountSimplify',
    data() {
      return {
        // 是否播放背景音乐
        isPlayMusic: false,
        // 用户是否主动暂停
        isPlayMusicChange: false,
        isShowCanvasSave: false,
        isRequestover: false,
        imageShare2,
        imageDetail,
        imageSave,
        imageShare,
        // 当前年
        currentYear: 2023,
        // 当前步骤
        currentStep: 1,
        // 屏幕高度
        screenHeight,
        // 屏幕宽度
        screenWidth,
        ctx: null,
        canvas: null,
        imageSponsor,
        yearData: null,
        // 绘制内容距离顶部的距离
        spaceScreenTop: statusBarHeight + this.rpx2px(88 + 30),
        // 绘制内容距离左边的距离
        spaceScreenLeft: this.rpx2px(40),
        // 背景图片本地临时地址
        imageInfoPageBgPath: '',
        // 分享截图
        shareScreenshots: [],
        //2023图文信息
        wordBg: {
          y: 0,
          height: 0
        },
        //总结盒子信息
        rect0: {
          y: 0,
          height: 0
        },
        // 我的补贴盒子信息
        rect1: {
          y: 0,
          height: 0
        },
        // 我的关注盒子信息
        rect2: {
          y: 0,
          height: 0
        },
        // 我的社保卡盒子信息
        rect3: {
          y: 0,
          height: 0
        },
        reactMarginTop: 35,
        canvasHeight: 0,
        boxX: 32,
        newsHeight: 0,
        personalFastPayHeight: 215, //个人年度最快领取记录高度
        isopenFastPay: true,
        currentNewsItemY: 0,
        atentionBoxHeight: 192 //包括盒子高度与下边距margin
      }
    },
    components: {
      AnnualAccountPageStart,
      AnnualAccountNavbar,
      AnnualAccountToolbar
    },
    onLoad(e) {
      this.screenHeight = screenHeight
      this.screenWidth = screenWidth
    },
    onReady(e) {
      // console.log(getSystemInfoSync(), 'getSystemInfoSync')
    },
    methods: {
      /**
       * 开启账单
       */
      async onClickOpen() {
        const { user_id } = this.userInfo
        if (user_id) {
          try {
            this.init()
          } catch (err) {
            // console.log(err)
          }
        } else {
          useJumpToLogin()
        }
      },
      openFastPayHeight(flag) {
        //资阳，南充，乐山不显示最快领取记录
        if (areaCode === '512000' || areaCode === '511300' || areaCode === '511100') {
          this.isopenFastPay = false
        } else {
          this.isopenFastPay = flag
        }
      },
      // 计算新闻长度
      calcNewsHeight(newsArr) {
        let newsHeight = 0
        for (let i = 0; i < newsArr.length; i++) {
          const item = newsArr[i]
          if (item.chi031 && item.chi037) {
            if (item.chi031.length + item.chi037.length > 18) {
              newsHeight += 26 * 3 + 10
            } else {
              newsHeight += 26 * 2
            }
          } else if (item.chi031 || item.chi037) {
            newsHeight += 26 * 2
          }
        }
        this.newsHeight = newsHeight
      },
      async init() {
        await this.getYearData()
        this.isRequestover = true
        this.calcNewsHeight(this.yearData.pageData_4.chi031ListAddPersonalShare)
        //巴中不显示关注发放进度次数
        const baseHight =
          3003 -
          this.personalFastPayHeight +
          this.newsHeight +
          statusBarHeight -
          (areaCode === '511100' ? this.atentionBoxHeight : 0)
        const addNewProjectHeight =
          this.yearData.pageData_4.chi031ListAddPersonalShare.length === 0 ? baseHight + 100 : baseHight + 60

        // 超过5天不显示 南充资阳不显示
        const flag = this.yearData.pageData_3.fastPayDate && this.yearData.pageData_3.fastPayDay <= 5
        this.openFastPayHeight(flag)
        const isopenFastPayHeight = this.isopenFastPay
          ? addNewProjectHeight + this.personalFastPayHeight
          : addNewProjectHeight
        this.canvasHeight = this.rpx2px(isopenFastPayHeight)
        this.currentStep = 2
        this.isShowCanvasSave = true
        this.initCanvas()
      },
      onclickDetail() {
        navigateTo('subsidy-amount', 'packageDetails', {
          name: '个人补贴查询',
          type: '01',
          currentYear: this.currentYear
        })
      },
      /**
       * rpx 转 px
       */
      rpx2px(rpx) {
        const standardWidth = 750
        const currentWidth = screenWidth * pixelRatio
        return (currentWidth * rpx) / standardWidth / pixelRatio
      },
      /**
       * px 转 rpx
       */
      px2rpx(px) {
        const standardWidth = 750
        const currentWidth = screenWidth * pixelRatio
        return (standardWidth * pixelRatio * px) / currentWidth
      },
      /**
       * 获取所有数据
       */
      getYearData() {
        const { idCard, userName } = this.userInfo

        return new Promise(async (resolve, reject) => {
          showLoading('正在生成数据...')

          const requestList = [
            requestWXGetReport(idCard, this.currentYear, false, false),
            requestB253(idCard, this.currentYear, false, false)
            //requestB253('513430200506153426', this.currentYear, false, false)
          ]

          const data = await Promise.allSettled(requestList)

          const res0 = data[0]
          const res1 = data[1]

          const { status: status0, value: value0 } = res0
          const { status: status1, value: value1 } = res1
          console.log('value0===', value0)
          console.log('value1===', value1)

          const pageData_1 = {
            openRanking: 0, // 打开排名
            strartTime: '', // 开始使用时间
            useDay: 0, // 使用天数
            totlaProjectNum: 0, // 领取资金总笔数
            totlaProjectMoney: 0, // 领取资金总金额
            currentProjectNum: 0 //今年享受补贴数
          }
          const pageData_2 = {
            grantAmountList: [],
            grantAmountTypeList: [],
            firstGrantDate: '',
            firstGrantTime: '',
            maxGrantAmountTypeName: '农业类'
          }
          const pageData_3 = {
            totlaApplyNum: 0, // 累计享受补贴项目个数
            totlaApplyNumBySelf: 0, // 自主享受补贴项目个数
            queryBtffNum: 0, // 补贴发放进度查询次数
            fastPayDate: '', //个人最快领取补贴日期
            fastPayDay: 5, //个人最快领取补贴天数
            fastPayChi037: '其他类' //个人最快领取补贴类型
          }
          const pageData_4 = {
            projectNum: 0,
            projectNumUpdate: 0,
            cityName:
              areaCode === '513200' || areaCode === '513300' || areaCode === '513400'
                ? areaName_zh + '州'
                : areaName_zh + '市',
            chi031ListAddPersonalShare: [] //个人新增享受补贴数
          }
          const pageData_5 = {
            villageInfo: {
              name: '',
              rank: 0,
              number: 0
            },
            date: ''
          }
          const pageData_6 = {
            commonFunc: [], // 常用功能
            // 一天中最早或最晚访问的功能
            latestView: {
              ymd: '', // 年月日
              hm: '', // 时分
              name: '' // 功能名称
            }
          }

          //小程序相关数据
          if (status0 === 'fulfilled' && value0) {
            let resData = null
            const { report, ranking } = value0.data

            if (report) {
              resData = JSON.parse(report)
            }

            const { firstLoginTime, dayNum, moduleList, latest } = resData

            pageData_1.openRanking = Number(ranking || 0)
            pageData_1.strartTime = firstLoginTime
            pageData_1.useDay = Number(dayNum || 0)

            if (moduleList && moduleList.length) {
              moduleList.forEach((item) => {
                pageData_6.commonFunc.push({
                  name: item.name,
                  value: item.num
                })
              })
            }

            if (latest) {
              const { name, time } = latest
              pageData_6.latestView.ymd = time.substring(0, 11)
              pageData_6.latestView.hm = time.substring(12, 18)
              pageData_6.latestView.name = name
            }
          }

          // 审批发放相关数据
          if (status1 === 'fulfilled' && value1) {
            const {
              cht482,
              cht483,
              cht484,
              cht485,
              cht487,
              cht488,
              cht48b,
              cht48c,
              cht489,
              cht503,
              cht505,
              cht508,
              cht492_01,
              cht492_02,
              cht492_03,
              cht492_04,
              cht492_05,
              cht492_06
            } = value1.lists.resultList.list[0]

            pageData_1.totlaProjectNum = Number(cht482 || 0)
            pageData_1.totlaProjectMoney = Number(cht483 || 0)
            pageData_1.currentProjectNum = Number(cht489 || 0)

            if (pageData_1.totlaProjectMoney) {
              this.isDrawPage2 = true
            } else {
              this.isDrawPage2 = false
            }

            if (cht487) {
              pageData_2.firstGrantDate =
                cht487.substring(0, 4) + '年' + cht487.substring(5, 7) + '月' + cht487.substring(8, 10) + '日'
              pageData_2.firstGrantTime = cht487.substring(11, 13) + '时' + cht487.substring(14, 16) + '分'
            }

            if (cht492_01) {
              const data = JSON.parse(cht492_01)
              data.forEach(({ month, money }) => {
                pageData_2.grantAmountList.push({
                  name: month,
                  value: Number(money || 0)
                })
              })
            }
            if (cht492_04) {
              let num = 0
              let maxValueName = ''

              const data = JSON.parse(cht492_04)
              data.forEach(({ chi037, money }) => {
                const value = Number(money || 0)
                const name = chi037
                if (value > num) {
                  num = value
                  maxValueName = name
                }

                if (name === '教育类') {
                  pageData_2.grantAmountTypeList[0] = {
                    name,
                    value
                  }
                } else if (name === '农业类') {
                  pageData_2.grantAmountTypeList[1] = {
                    name,
                    value
                  }
                } else if (name === '其他类') {
                  pageData_2.grantAmountTypeList[2] = {
                    name,
                    value
                  }
                }
              })
              pageData_2.maxGrantAmountTypeName = maxValueName
            }

            pageData_3.totlaApplyNum = Number(cht484 || 0)
            pageData_3.totlaApplyNumBySelf = Number(cht485 || 0)
            pageData_3.queryBtffNum = Number(cht48b || 0)

            if (cht492_02) {
              const data = JSON.parse(cht492_02)
              const { aae036, aae209, days, chi037 } = data[0]
              pageData_3.fastPayDate = aae209
              pageData_3.fastPayDay = Number(days || 0)
              pageData_3.fastPayChi037 = chi037
            }
            // 关注补贴项目个数
            pageData_4.projectNum = Number(cht48c || 0)

            if (cht492_06) {
              const data = JSON.parse(cht492_06)
              pageData_4.chi031ListAddPersonalShare = data
            }

            pageData_5.villageInfo = {
              name: cht503,
              rank: Number(cht508 || 0),
              number: Number(cht505 || 0)
            }
          }

          const yearData = {
            pageData_1,
            pageData_2,
            pageData_3,
            pageData_4,
            pageData_5,
            pageData_6
          }

          hideLoading()
          this.yearData = JSON.parse(JSON.stringify(yearData))
          // console.log('yearData====', yearData)
          resolve(true)
        })
      },
      /**
       * 绘制页面背景
       */
      async drawPageBg() {
        const ctx = this.ctx
        ctx.draw()
        const imgW = 750
        const imgH = 1200

        if (!this.imageInfoPageBgPath) {
          const res = await getImageInfo(imagePageBg)
          if (res && res.path) {
            this.imageInfoPageBgPath = res.path
          }
        }
        // 将背景图片绘制到 canvas 上
        ctx.drawImage(this.imageInfoPageBgPath, 0, 0, imgW, imgH, 0, 0, this.rpx2px(imgW), this.rpx2px(imgH))
        ctx.draw(true)
        return Promise.resolve(true)
      },
      /**
       * 绘制图片
       */
      async drawImage(src, x, y, w, h) {
        const ctx = this.ctx

        const res = await getImageInfo(src)
        if (res && res.path) {
          const { width, height, path } = res
          // 将背景图片绘制到 canvas 上
          ctx.drawImage(path, 0, 0, width, height, x, y, w, h)
        }

        ctx.draw(true)

        return Promise.resolve(true)
      },
      /**
       * 绘制支撑部门
       */
      async drawImageSponsor() {
        const ctx = this.ctx
        const data = this.imageSponsor[areaCode]
        const len = data.length

        let imgW = 44
        let imgH = 44

        if (areaCode === '511600') {
          imgW = 40
          imgH = 40
        }

        // 绘画内容已经占有的高度 默认上边距
        let drawH = this.spaceScreenTop + this.rpx2px(5)

        if (len > 3) {
          drawH = drawH - this.rpx2px(26)
        }

        // 绘画内容已经占有的宽度 默认左边距
        let drawW = this.spaceScreenLeft

        let isAdd = false

        for (let i = 0; i < len; i++) {
          const { imageSrc, text } = data[i]

          if (!isAdd && i > 1 && len !== 3) {
            drawW = this.spaceScreenLeft
            drawH = drawH + this.rpx2px(44 + 12)
            isAdd = true
          }

          if (imageSrc) {
            await this.drawImage(imageSrc, drawW, drawH, this.rpx2px(imgW), this.rpx2px(imgH))
            if (len === 3) {
              drawW = drawW + this.rpx2px(8 + imgW)
            } else {
              drawW = drawW + this.rpx2px(16 + imgW)
            }
          }

          if (text) {
            let fs = 30
            if (len === 3) {
              fs = 28
              if (areaCode === '511600') {
                fs = 26
              }
            }
            ctx.font = `normal ${parseInt(this.rpx2px(fs))}px sans-serif`
            ctx.fillStyle = '#fff'
            ctx.setTextBaseline('middle')
            ctx.fillText(text, drawW, drawH + this.rpx2px(44 / 2))
            const metrics = ctx.measureText(text + '')
            if (len === 3) {
              drawW += metrics.width + this.rpx2px(8)
            } else {
              drawW += metrics.width + this.rpx2px(68)
            }
          }
        }
        ctx.draw(true)
        return Promise.resolve(true)
      },
      /**
       * 绘制圆角矩形
       */
      async drawRoundedRect(ctx, x, y, w, h, radius, bgColor = '#fff', shadow = null) {
        const _x = parseInt(x)
        const _y = parseInt(y)
        const _w = parseInt(w)
        const _h = parseInt(h)
        const _radius = parseInt(radius)
        ctx.setStrokeStyle('transparent')
        ctx.setFillStyle(bgColor)
        ctx.beginPath()
        ctx.moveTo(_x + _radius, _y)
        ctx.arcTo(_x + _w, _y, _x + _w, _y + _h, _radius)
        ctx.arcTo(_x + _w, _y + _h, _x, _y + _h, _radius)
        ctx.arcTo(_x, _y + _h, _x, _y, _radius)
        ctx.arcTo(_x, _y, _x + _w, _y, _radius)
        ctx.closePath()
        if (shadow) {
          ctx.setShadow(shadow.offsetX, shadow.offsetY, shadow.blur, shadow.color)
        }
        ctx.fill()
        ctx.stroke()
        ctx.draw(true)
        return Promise.resolve(true)
      },
      /**
       *绘制 echart 饼图
       */
      async drawEchartPie(data, draw_start_y) {
        const ctx = this.ctx

        // 绘制扇形图
        let radius = this.rpx2px(60) // 扇形的半径
        let centerX = this.rpx2px(180) // 饼状图中心点的X坐标
        let centerY = draw_start_y // 饼状图中心点的Y坐标

        const color = ['#e03637', '#fd6534', '#ffc066']
        // if (screenHeight < 736) {
        //   centerY = centerY - this.rpx2px(160);
        // }

        let totalValue = 0 // 总值
        data.forEach(({ value }) => {
          totalValue += value
        })

        const totalAngle = Math.PI * 2 // 总角度
        // 清除中心区域
        const clearRadius = radius * 0.68 // 中心区域的半径

        let currentAngle = 0 // 扇形的起始角度，留出中心区域的空白
        // 各项占比百分比
        let percent = []
        for (let i = 0; i < data.length; i++) {
          const { value } = data[i]
          const startAngle = currentAngle

          if (i + 1 === data.length) {
            let all = 0
            percent.forEach((item) => {
              all = new Big(all).plus(item)
            })

            percent[i] = Number(new Big(1).minus(all))
          } else {
            percent[i] = Number((value / totalValue).toFixed(4))
          }

          const endAngle = currentAngle + Math.PI * percent[i] * 2
          const angle = endAngle - startAngle
          ctx.beginPath()
          ctx.moveTo(centerX, centerY)
          ctx.arc(centerX, centerY, radius, currentAngle, endAngle, false) // 绘制扇形
          ctx.closePath()
          ctx.setFillStyle(color[i])
          ctx.fill()
          currentAngle += angle
        }

        for (let i = 0; i < data.length; i++) {
          const { name, value } = data[i]

          ctx.font = `normal ${parseInt(this.rpx2px(24))}px sans-serif`
          ctx.fillStyle = '#340001'
          ctx.setTextAlign('left')
          ctx.setTextBaseline('middle')
          let text = `${name}：${value}元   ${new Big(100).times(percent[i])}%`
          ctx.fillText(text, centerX + radius + this.rpx2px(96), centerY - radius * 1.5 + this.rpx2px(38 * i + 36 + 12))

          ctx.beginPath()
          ctx.rect(
            centerX + radius + this.rpx2px(60),
            centerY - radius * 1.5 + this.rpx2px(38 * i + 36 + 4),
            this.rpx2px(16),
            this.rpx2px(16)
          )
          ctx.setFillStyle(color[i])
          ctx.closePath()
          ctx.fill()
        }

        ctx.beginPath()
        ctx.setFillStyle('#fff')
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, clearRadius, 0, totalAngle, false) // 绘制扇形
        ctx.closePath()

        ctx.fill()
        ctx.draw(true)

        return Promise.resolve(true)
      },
      /**
       * 保存页面为图片
       */
      savePage() {
        canvasToTempFilePath(
          0,
          0,
          screenWidth,
          this.canvasHeight,
          screenWidth * pixelRatio,
          this.canvasHeight * pixelRatio,
          'page',
          null
        ).then((res) => {
          const currentStep = this.currentStep
          this.shareScreenshots[currentStep - 2] = res.tempFilePath
        })
      },
      /**
       * 画容纳框
       */
      async renderContainer(ctx, tangleY, tangleH, word) {
        const tangleWidth = 686
        const borderRadius = 10
        const imageWidth = 354
        const imageHeight = 86
        const fontSize = 32
        const tangleX = (screenWidth - this.rpx2px(tangleWidth)) / 2

        await this.drawRoundedRect(
          ctx,
          tangleX,
          this.rpx2px(tangleY),
          this.rpx2px(tangleWidth),
          this.rpx2px(tangleH),
          this.rpx2px(borderRadius),
          '#fff'
        )
        const imageX = (screenWidth - this.rpx2px(imageWidth)) / 2
        const imageY = this.rpx2px(tangleY - 12)
        await this.drawImage(imageBigTitle, imageX, imageY, this.rpx2px(imageWidth), this.rpx2px(imageHeight))
        if (word) {
          ctx.font = `normal ${parseInt(this.rpx2px(fontSize))}px sans-serif`

          const wordX = imageX + this.rpx2px(imageWidth / 2)
          const wordY = imageY + this.rpx2px((imageHeight - 18) / 2)
          ctx.setTextAlign('center')
          ctx.setTextBaseline('middle')
          ctx.fillStyle = '#fff'
          ctx.fillText(word, wordX, wordY)
        }
        ctx.setTextAlign('left')
        ctx.draw(true)

        return Promise.resolve(true)
      },
      /**
       * 画小标题
       */
      async renderSmallTitle(ctx, imageY, word) {
        const fontSize = 29
        const imageWidth = 574
        const imageHeight = 56
        const imageX = (screenWidth - this.rpx2px(imageWidth)) / 2
        await this.drawImage(
          imageSmallTitle,
          imageX,
          this.rpx2px(imageY),
          this.rpx2px(imageWidth),
          this.rpx2px(imageHeight)
        )
        if (word) {
          ctx.font = `normal bold ${parseInt(this.rpx2px(fontSize))}px sans-serif`
          const wordX = imageX + this.rpx2px(imageWidth / 2)
          ctx.setTextAlign('center')
          ctx.setTextBaseline('middle')
          ctx.fillStyle = '#340001'
          ctx.fillText(word, wordX, this.rpx2px(imageY + imageHeight / 2))
        }
        ctx.setTextAlign('left')
        ctx.draw(true)
        return Promise.resolve(true)
      },
      /**
       * 画新增享受补贴项
       */
      async renderNewsItem(ctx, imageX, word1, word2) {
        const marginTop = 26
        const fontSize1 = 26
        const fontSize2 = 22
        const imageWidth = 62
        const imageHeight = 24

        const imageY = this.currentNewsItemY

        // 可以写入新增情况的最大宽度, 32*2是距离左边边距，10是距离右边边距
        const maxWidth = screenWidth - this.rpx2px(this.boxX * 2 + 32 * 2 + 10)
        // 当前宽度
        let currentWidth = 0

        await this.drawImage(
          imageNew,
          this.rpx2px(imageX),
          this.rpx2px(imageY),
          this.rpx2px(imageWidth),
          this.rpx2px(imageHeight)
        )

        currentWidth += this.rpx2px(imageWidth + 10)

        const word1X = imageX + imageWidth + 10
        const wordY = imageY + imageHeight / 2
        const rectHeight = 32
        let tangleY = this.rpx2px(imageY + imageHeight / 2 - rectHeight / 2)
        if (word1) {
          ctx.font = `normal ${parseInt(this.rpx2px(fontSize1))}px sans-serif`
          ctx.setTextBaseline('middle')
          ctx.fillStyle = '#340001'
          const metrics1 = ctx.measureText(word1).width

          const drawWord2 = async (tangleX, tangleY) => {
            // 局子
            if (word2) {
              ctx.font = `normal ${parseInt(this.rpx2px(fontSize2))}px sans-serif`
              ctx.setTextBaseline('middle')
              const metrics2 = ctx.measureText(word2).width
              const tangleWidth = metrics2 + this.rpx2px(16)
              const tangleHight = this.rpx2px(32)

              await this.drawRoundedRect(ctx, tangleX, tangleY, tangleWidth, tangleHight, 4, 'rgba(255, 238, 231, 0.6)')
              ctx.fillStyle = '#fd6534'
              const word2X = tangleX + this.rpx2px(8)
              const word2Y = tangleY + tangleHight / 2
              ctx.fillText(word2, word2X, word2Y)
            }
          }

          //情况1，当word1就超出当前最大宽度
          let index = 0 //截取字符长度
          if (currentWidth + metrics1 > maxWidth) {
            let metrics = 0
            //找到第一个大于最大长度的字
            for (let i = 0; i < word1.length; i++) {
              metrics += ctx.measureText(word1[i]).width
              if (currentWidth + metrics > maxWidth) {
                index = i - 1
                break
              }
            }
            const word11 = word1.substring(0, index)
            const word12 = word1.substring(index)
            ctx.fillText(word11, this.rpx2px(word1X), this.rpx2px(wordY))
            const metrics12 = ctx.measureText(word12).width

            //第二行项目名
            ctx.fillText(word12, this.rpx2px(word1X), this.rpx2px(wordY + marginTop + 10))
            //第二行业务局
            const tangleX = this.rpx2px(word1X + 10) + metrics12
            drawWord2(tangleX, tangleY + this.rpx2px(marginTop + 10))
            this.currentNewsItemY += marginTop * 3 + 10 //10为第二行距离第一行距离
          } else {
            // 情况2，当word1 + word2就超出当前最大宽度

            ctx.font = `normal ${parseInt(this.rpx2px(fontSize2))}px sans-serif`
            const metrics2 = ctx.measureText(word2).width
            const tangleWidth = metrics2 + this.rpx2px(16)
            currentWidth += metrics1 + tangleWidth + this.rpx2px(10)

            ctx.font = `normal ${parseInt(this.rpx2px(fontSize1))}px sans-serif`
            ctx.setTextBaseline('middle')
            ctx.fillStyle = '#340001'
            if (currentWidth > maxWidth) {
              ctx.fillText(word1, this.rpx2px(word1X), this.rpx2px(wordY))
              //第二行业务局
              const tangleX = this.rpx2px(word1X)
              drawWord2(tangleX, tangleY + this.rpx2px(marginTop + 10))
              this.currentNewsItemY += marginTop * 3 + 10
            } else {
              ctx.fillText(word1, this.rpx2px(word1X), this.rpx2px(wordY))
              const tangleX = this.rpx2px(word1X + 10) + metrics1
              drawWord2(tangleX, tangleY)
              this.currentNewsItemY += marginTop * 2
            }
          }
        }
        ctx.draw(true)
        return Promise.resolve(true)
      },
      /**
       * 2023文字图片和背景色
       */
      async drawPageWordMain() {
        const ctx = this.ctx
        const imgW = 672
        const imgH = 328
        const x = (screenWidth - this.rpx2px(imgW)) / 2
        const y = this.rpx2px(300 - 40) + statusBarHeight

        this.wordBg.y = this.px2rpx(y)
        this.wordBg.height = imgH
        await this.drawImage(imageTitleText, x, y, this.rpx2px(imgW), this.rpx2px(imgH))

        // 将背景图片绘制到 canvas 上

        // 创建线性渐变对象
        const gradient = ctx.createLinearGradient(0, 0, 0, this.rpx2px(750))
        gradient.addColorStop(0, '#fa7349')
        gradient.addColorStop(0.2, '#fea57d')
        gradient.addColorStop(1, '#ffefe0')

        // 设置背景色为渐变
        ctx.fillStyle = gradient

        // 绘制填充整个 Canvas 的矩形
        ctx.fillRect(0, this.rpx2px(1200), this.rpx2px(750), this.rpx2px(5000))
        ctx.draw(true)
        return Promise.resolve(true)
      },
      /**
       * 今年总结
       */
      async drawSummary() {
        const { idCard, userName, avatarUrl } = this.userInfo
        const newUsername = userName || 'xx'
        // 添加文字
        const word1 = `Hi  ${newUsername}！你是第${this.yearData.pageData_1.openRanking}个打开年度盘点的人哦`
        const word2 = '祝愿您新年快乐！'
        const word3 = `${this.currentYear}年领取补贴总金额`
        const word4 = `${this.yearData.pageData_1.totlaProjectMoney}`
        const word5 = '总共领取补贴'
        const word6 = `${this.yearData.pageData_1.totlaProjectNum}`
        const unit1 = '元'
        const unit2 = '笔'

        this.rect0.y = this.wordBg.y + this.wordBg.height + 54
        this.rect0.height = 303
        const boxWidth = 686

        const boxBorder = 10
        const fontSize1 = 26
        const fontSize2 = 28
        const fontSize3 = 42

        const ctx = this.ctx
        await this.drawRoundedRect(
          ctx,
          this.rpx2px(this.boxX),
          this.rpx2px(this.rect0.y),
          this.rpx2px(boxWidth),
          this.rpx2px(this.rect0.height),
          this.rpx2px(boxBorder),
          'rgba(255, 255, 255, 0.3)'
        )

        const box2Heihgt = 170
        const box2Y = this.rect0.y + 133
        // 下方领取金额框
        await this.drawRoundedRect(
          ctx,
          this.rpx2px(this.boxX),
          this.rpx2px(box2Y),
          this.rpx2px(boxWidth),
          this.rpx2px(box2Heihgt),
          this.rpx2px(boxBorder),
          '#fff'
        )
        const fs = wx.getFileSystemManager()
        const wxPhoto = `${env().USER_DATA_PATH}/avatar.jpeg`
        const newAvatarUrl = avatarUrl ? avatarUrl.replace(/data:image\/\w+;base64,/, '') : ''
        if (newAvatarUrl) {
          // 同步接口
          try {
            const res = fs.writeFileSync(wxPhoto, newAvatarUrl, 'base64')
            console.log(res)
          } catch (e) {
            console.error(e)
          }
        }
        const imageSize = 68
        if (avatarUrl) {
          const res = await getImageInfo(wxPhoto)
          const avatarR = 34

          if (res && res.path) {
            const { width, height, path } = res
            // 将背景图片绘制到 canvas 上
            // ctx.drawImage(path, 0, 0, width, height, x, y, w, h)
            // 剪切圆形区域
            ctx.save()
            ctx.beginPath()
            ctx.arc(
              this.rpx2px(this.boxX + 24 + avatarR),
              this.rpx2px(this.rect0.y + 32 + avatarR),
              this.rpx2px(avatarR),
              0,
              Math.PI * 2
            ) // 创建一个半径为34的圆形区域，圆心位于(56 + 34,693 + 34)
            ctx.clip() // 使用剪切路径作为剪切区域

            // 再次绘制头像图片，只绘制剪切后的圆形区域
            ctx.drawImage(
              path,
              0,
              0,
              width,
              height,
              this.rpx2px(this.boxX + 24),
              this.rpx2px(this.rect0.y + 32),
              this.rpx2px(imageSize),
              this.rpx2px(imageSize)
            )
            ctx.restore()
            ctx.draw(true)
          }
        } else {
          await this.drawImage(
            imageDefaultAvatar,
            this.rpx2px(this.boxX + 24),
            this.rpx2px(this.rect0.y + 32),
            this.rpx2px(imageSize),
            this.rpx2px(imageSize)
          )
        }

        ctx.font = `normal ${parseInt(this.rpx2px(fontSize1))}px sans-serif`
        ctx.fillStyle = 'rgba(255, 255, 255, 1)'
        ctx.setTextBaseline('top')
        ctx.fillText(word1, this.rpx2px(this.boxX + 109), this.rpx2px(this.rect0.y + 40))
        ctx.fillText(word2, this.rpx2px(this.boxX + 109), this.rpx2px(this.rect0.y + 40 + fontSize1 + 10))
        // money
        await this.drawImage(
          imageMoney,
          this.rpx2px(this.boxX + 31),
          this.rpx2px(box2Y + 38),
          this.rpx2px(69),
          this.rpx2px(69)
        )

        ctx.font = `normal ${parseInt(this.rpx2px(fontSize2))}px sans-serif`
        ctx.setTextBaseline('top')
        ctx.fillStyle = '#6e5757'
        ctx.fillText(word3, this.rpx2px(this.boxX + 116), this.rpx2px(box2Y + 39))
        ctx.fillText(word5, this.rpx2px(this.boxX + 458), this.rpx2px(box2Y + 39))
        ctx.setTextBaseline('alphabetic')

        // 绘制领取金额
        const drawGetMoney = (x, y) => {
          ctx.font = `normal bold ${parseInt(this.rpx2px(fontSize3))}px sans-serif`
          ctx.fillStyle = 'rgba(207, 18, 20, 1)'
          ctx.setTextAlign('left')
          ctx.setTextBaseline('middle')
          ctx.fillText(word4, x, y)
          const metrics1 = ctx.measureText(word4).width

          // 元单位
          ctx.font = `normal ${parseInt(this.rpx2px(fontSize2))}px sans-serif`
          ctx.fillText(unit1, metrics1 + x + this.rpx2px(10), y + this.rpx2px((fontSize3 - fontSize2) / 4))
        }
        //  资阳当领取金额为0，显示文案暂无领取记录
        if (areaCode === '512000') {
          const x = this.rpx2px(this.boxX + 116)
          const y = this.rpx2px(box2Y + fontSize3 / 2 + 95)
          if (this.yearData.pageData_1.totlaProjectMoney && this.yearData.pageData_1.totlaProjectMoney > 0) {
            //钱
            if (word4) {
              drawGetMoney(x, y)
            }
          } else {
            ctx.font = `normal ${parseInt(this.rpx2px(fontSize2))}px sans-serif`
            ctx.fillStyle = '#340001'
            ctx.fillText('暂无领取记录', x, y)
          }
        } else {
          //钱
          if (word4) {
            const x = this.rpx2px(this.boxX + 116)
            const y = this.rpx2px(box2Y + fontSize3 / 2 + 95)
            drawGetMoney(x, y)
          }
        }

        // 补贴数
        if (word6) {
          const x = this.rpx2px(this.boxX + 458)
          const y = this.rpx2px(box2Y + fontSize3 / 2 + 95)
          ctx.font = `normal bold ${parseInt(this.rpx2px(fontSize3))}px sans-serif`
          ctx.fillStyle = 'rgba(52, 0, 1, 1)'
          ctx.setTextAlign('left')
          ctx.setTextBaseline('middle')
          ctx.fillText(word6, x, y)
          const metrics2 = ctx.measureText(word6).width

          // 笔单位
          ctx.font = `normal ${parseInt(this.rpx2px(fontSize2))}px sans-serif`
          ctx.fillStyle = 'rgba(52, 0, 1, 1)'
          ctx.fillText(unit2, metrics2 + x + this.rpx2px(10), y + this.rpx2px((fontSize3 - fontSize2) / 4))
        }

        // 线
        await this.drawImage(
          imageLine,
          this.rpx2px(this.boxX + 422),
          this.rpx2px(box2Y + 15),
          this.rpx2px(1),
          this.rpx2px(140)
        )
        ctx.draw(true)
        return Promise.resolve(true)
      },
      /**
       * 我的补贴
       */
      async drawMySubsidy() {
        const word11 = '今年享受补贴数'
        const word12 = '今年新增享受补贴数'
        const count1 = `${this.yearData.pageData_1.currentProjectNum}`
        const count2 = `${this.yearData.pageData_4.chi031ListAddPersonalShare.length}`
        const unit1 = '个'
        const unit2 = '个'
        const period = `${this.yearData.pageData_3.fastPayDate}期${this.yearData.pageData_3.fastPayChi037}补贴`
        const days = '从申请发放到补贴到账全流程仅用时'
        const dayNum = `${this.yearData.pageData_3.fastPayDay}`
        const unit3 = '天'
        const pieList = this.yearData.pageData_2.grantAmountTypeList
        const NewsItem = this.yearData.pageData_4.chi031ListAddPersonalShare
        const ctx = this.ctx
        const fontSize1 = 26
        const fontSize2 = 28
        const fontSize3 = 40
        const fontSize4 = 42

        let newsHight = this.newsHeight

        if (NewsItem.length === 0) {
          newsHight = newsHight + 100
        } else {
          newsHight = newsHight + 60
        }

        this.rect1.y = this.rect0.y + this.reactMarginTop + this.rect0.height
        this.rect1.height = 875 - this.personalFastPayHeight + newsHight

        if (this.isopenFastPay) {
          this.rect1.height = this.rect1.height + this.personalFastPayHeight
        }

        await this.renderContainer(ctx, this.rect1.y, this.rect1.height, '我的补贴')

        const box1Y = this.rect1.y + 80
        // 创建线性渐变对象
        const gradient = ctx.createLinearGradient(this.boxX + 32, this.rpx2px(this.rect1.y + 80), 44, 1076 + 160)
        gradient.addColorStop(0, 'rgba(255, 239, 233, 0.51)')
        gradient.addColorStop(1, 'rgba(255, 239, 233, 0.1)')

        // 新增补贴框
        await this.drawRoundedRect(
          ctx,
          this.rpx2px(this.boxX + 32),
          this.rpx2px(box1Y),
          this.rpx2px(622),
          this.rpx2px(160),
          this.rpx2px(10),
          gradient
        )

        //正在享受补贴数
        ctx.font = `normal ${parseInt(this.rpx2px(fontSize2))}px sans-serif`
        ctx.fillStyle = '#6e5757'
        ctx.setTextBaseline('top')
        ctx.fillText(word11, this.rpx2px(this.boxX + 32 + 32), this.rpx2px(box1Y + 40))
        ctx.fillText(word12, this.rpx2px(this.boxX + 32 + 346), this.rpx2px(box1Y + 40))

        const box1Line2Y = this.rpx2px(box1Y + 88)
        if (count1) {
          ctx.font = `normal bold ${parseInt(this.rpx2px(fontSize3))}px sans-serif`
          ctx.fillStyle = 'rgba(52, 0, 1, 1)'
          ctx.fillText(count1, this.rpx2px(this.boxX + 32 + 32), box1Line2Y)
          const metrics1 = ctx.measureText(count1).width

          ctx.font = `normal ${parseInt(this.rpx2px(fontSize2))}px sans-serif`
          ctx.fillStyle = 'rgba(52, 0, 1, 1)'
          ctx.fillText(unit1, metrics1 + this.rpx2px(this.boxX + 32 + 32 + 10), box1Line2Y + this.rpx2px(8))
        }
        if (count2) {
          ctx.font = `normal bold ${parseInt(this.rpx2px(fontSize3))}px sans-serif`
          ctx.fillStyle = 'rgba(52, 0, 1, 1)'
          ctx.fillText(count2, this.rpx2px(this.boxX + 32 + 346), box1Line2Y)
          const metrics2 = ctx.measureText(count2).width

          ctx.font = `normal ${parseInt(this.rpx2px(fontSize2))}px sans-serif`
          ctx.fillStyle = 'rgba(52, 0, 1, 1)'
          ctx.fillText(unit2, metrics2 + this.rpx2px(this.boxX + 32 + 346 + 10), box1Line2Y + this.rpx2px(8))
        }
        ctx.setTextBaseline('alphabetic')

        // 线
        await this.drawImage(
          imageLine,
          this.rpx2px(this.boxX + 32 + 311),
          this.rpx2px(box1Y + 15),
          this.rpx2px(1),
          this.rpx2px(140)
        )

        // 各类标题
        await this.renderSmallTitle(ctx, this.rect1.y + 272, '各类补贴领取情况')

        if (pieList.length > 0) {
          const y_pie = this.rpx2px(this.rect1.y + 272 + 160)
          ctx.setTextBaseline('alphabetic')
          await this.drawEchartPie(pieList, y_pie)
        } else {
          ctx.font = `normal ${parseInt(this.rpx2px(fontSize2))}px sans-serif`
          ctx.fillStyle = '#340001'
          ctx.fillText('暂无补贴领取情况！', this.rpx2px(120), this.rpx2px(this.rect1.y + 272 + 170))
        }

        //新增标题
        await this.renderSmallTitle(ctx, this.rect1.y + 531, '今年新增享受补贴情况')

        //---------------------------------------------------------------从这开始算
        if (NewsItem.length > 0) {
          this.currentNewsItemY = this.rect1.y + 531 + 56 + 36 //初始y
          //新闻
          for (let i = 0; i < NewsItem.length; i++) {
            const item = NewsItem[i]
            await this.renderNewsItem(ctx, this.boxX + 32 + 32, item.chi031, item.chi037)
          }
        } else {
          ctx.font = `normal ${parseInt(this.rpx2px(28))}px sans-serif`
          ctx.fillStyle = '#340001'
          ctx.fillText('暂无新增补贴享受情况！', this.rpx2px(120), this.rpx2px(this.rect1.y + 531 + 56 + 60))
        }

        // 资阳, 南充不开启显示 个人年度最快领取补贴记录，超过五天不显示
        if (this.isopenFastPay) {
          const personTitleY = this.rect1.y + newsHight + 531 + 60 // 60为新增项目空隙
          const titleHeight = 56
          // 个人标题
          await this.renderSmallTitle(ctx, personTitleY, '个人年度最快领取补贴记录')
          // xxx期补贴
          ctx.font = `normal bold ${parseInt(this.rpx2px(fontSize2))}px sans-serif`
          ctx.fillStyle = '#340001'
          ctx.fillText(
            period,
            this.rpx2px(this.boxX + 32 + 32),
            this.rpx2px(personTitleY + titleHeight + 32 + fontSize2)
          ) //小标题高度56

          // 天描述
          ctx.font = `normal ${parseInt(this.rpx2px(fontSize1))}px sans-serif`
          ctx.fillStyle = '#6e5757'
          ctx.fillText(
            days,
            this.rpx2px(this.boxX + 32 + 32),
            this.rpx2px(personTitleY + titleHeight + 32 + fontSize2 + 30 + fontSize1)
          )
          const metrics20 = ctx.measureText(days).width

          //天数
          ctx.font = `normal ${parseInt(this.rpx2px(fontSize3))}px sans-serif`
          ctx.fillStyle = '#cf1214'
          ctx.fillText(
            dayNum,
            metrics20 + this.rpx2px(this.boxX + 32 + 32),
            this.rpx2px(personTitleY + titleHeight + 32 + fontSize2 + 30 + fontSize1)
          )
          const metrics21 = ctx.measureText(dayNum).width

          //单位天
          ctx.font = `normal ${parseInt(this.rpx2px(fontSize1))}px sans-serif`
          ctx.fillStyle = '#cf1214'
          ctx.fillText(
            unit3,
            metrics20 + this.rpx2px(this.boxX + 32 + 32) + metrics21,
            this.rpx2px(personTitleY + titleHeight + 32 + fontSize2 + 30 + fontSize1)
          )
        }
        // else {
        //   ctx.font = `normal ${parseInt(this.rpx2px(fontSize2))}px sans-serif`
        //   ctx.fillStyle = '#340001'
        //   // 攀枝花特有抱歉词
        //   const wordDefault = areaCode === '510400' ? '抱歉，暂无记录，我们会继续改进哟！' : '抱歉，暂无记录！'
        //   ctx.fillText(wordDefault, this.rpx2px(120), this.rpx2px(personTitleY + titleHeight + 32 + fontSize2 + 60))
        // }

        ctx.draw(true)
        return Promise.resolve(true)
      },
      /**
       * 我的关注
       */
      async drawMyAttention() {
        const word11 = '关注发放进度次数'
        const word12 = '关注补贴项目个数'
        const count1 = `${this.yearData.pageData_3.queryBtffNum}`
        const count2 = `${this.yearData.pageData_4.projectNum}`
        const unit1 = '次'
        const unit2 = '个'
        const village = `${this.yearData.pageData_5.villageInfo.name}`
        const atention = `有${this.yearData.pageData_5.villageInfo.number}人关注`
        const range = `在全市排名第${this.yearData.pageData_5.villageInfo.rank}`
        const ctx = this.ctx

        this.rect2.y = this.rect1.y + this.rect1.height + this.reactMarginTop //容器y
        this.rect2.height = 468 - (areaCode === '511100' ? this.atentionBoxHeight : 0) //容器高

        await this.renderContainer(ctx, this.rect2.y, this.rect2.height, '我的关注')

        //乐山不展示关注发放进度次数与关注补贴项目个数
        if (areaCode !== '511100') {
          // 创建线性渐变对象
          const gradient = ctx.createLinearGradient(44, this.rect2.y + 80, 44, this.rect2.y + 80 + 160)
          gradient.addColorStop(0, 'rgba(255, 239, 233, 0.51)')
          gradient.addColorStop(1, 'rgba(255, 239, 233, 0.1)')

          await this.drawRoundedRect(
            ctx,
            this.rpx2px(this.boxX + 32),
            this.rpx2px(this.rect2.y + 80),
            this.rpx2px(622),
            this.rpx2px(160),
            this.rpx2px(10),
            gradient
          )

          //关注发放进度次数
          const fontSize1 = 28
          ctx.font = `normal ${parseInt(this.rpx2px(fontSize1))}px sans-serif`
          ctx.fillStyle = '#6e5757'
          ctx.setTextBaseline('top')
          ctx.fillText(word11, this.rpx2px(this.boxX + 32 + 32), this.rpx2px(this.rect2.y + 80 + 40))
          ctx.fillText(word12, this.rpx2px(this.boxX + 32 + 346), this.rpx2px(this.rect2.y + 80 + 40))

          const fontSize2 = 40
          ctx.font = `normal bold ${parseInt(this.rpx2px(fontSize2))}px sans-serif`
          ctx.fillStyle = '#340001'
          ctx.setTextBaseline('top')
          ctx.fillText(count1, this.rpx2px(this.boxX + 32 + 32), this.rpx2px(this.rect2.y + 80 + 88))
          ctx.fillText(count2, this.rpx2px(this.boxX + 32 + 346), this.rpx2px(this.rect2.y + 80 + 88))
          const metrics1 = ctx.measureText(count1).width
          const metrics2 = ctx.measureText(count2).width

          ctx.font = `normal ${parseInt(this.rpx2px(28))}px sans-serif`
          ctx.fillStyle = '#340001'
          //单位
          ctx.fillText(
            unit1,
            metrics1 + this.rpx2px(this.boxX + 32 + 32 + 10),
            this.rpx2px(this.rect2.y + 80 + 88) + this.rpx2px(8)
          )
          ctx.fillText(
            unit2,
            metrics2 + this.rpx2px(this.boxX + 32 + 346 + 10),
            this.rpx2px(this.rect2.y + 80 + 88) + this.rpx2px(8)
          )
          ctx.setTextBaseline('alphabetic')

          // 线
          await this.drawImage(
            imageLine,
            this.rpx2px(this.boxX + 33 + 311),
            this.rpx2px(this.rect2.y + 80 + 10),
            this.rpx2px(1),
            this.rpx2px(140)
          )
        }

        await this.renderSmallTitle(
          ctx,
          this.rect2.y + 272 - (areaCode === '511100' ? this.atentionBoxHeight : 0),
          '关注村社'
        )

        const imageWidth = 68
        const imageHeight = 68
        const imageY = this.rect2.y + 360 - (areaCode === '511100' ? this.atentionBoxHeight : 0)
        await this.drawImage(
          imageVillage,
          this.rpx2px(this.boxX + 32),
          this.rpx2px(imageY),
          this.rpx2px(imageWidth),
          this.rpx2px(imageHeight)
        )

        const rectHight = 32
        const wordY = this.rpx2px(imageY + imageHeight / 2)
        const rectY = this.rpx2px(imageY + imageHeight / 2 - rectHight / 2)
        if (village) {
          // 可以写入的最大X, 10为距离右边边距
          const maxX = 750 - this.boxX - 10

          //村名
          const fontSize3 = 32
          ctx.font = `normal bold ${parseInt(this.rpx2px(fontSize3))}px sans-serif`
          ctx.fillStyle = '#340001'
          ctx.fillText(village, this.rpx2px(148), wordY)
          const metrics10 = ctx.measureText(village).width

          const fontSize4 = 22
          ctx.font = `normal ${parseInt(this.rpx2px(fontSize4))}px sans-serif`
          const metrics11 = ctx.measureText(atention).width
          const metrics12 = ctx.measureText(range).width

          const caseX1 = 148 + this.px2rpx(metrics10) + this.px2rpx(metrics11) + 10 + 16
          const caseX2 = 148 + this.px2rpx(metrics10) + this.px2rpx(metrics11) + this.px2rpx(metrics12) + 20 + 32

          // 画关注与排名
          const drawTag = async (rect1X, rect1Y, rect2X, rect2Y, word1Y, word2Y) => {
            //关注框
            await this.drawRoundedRect(
              ctx,
              rect1X,
              rect1Y,
              metrics11 + this.rpx2px(16),
              this.rpx2px(rectHight),
              4,
              'rgba(255, 238, 231, 0.6)'
            )

            //排名框
            await this.drawRoundedRect(
              ctx,
              rect2X,
              rect2Y,
              metrics12 + this.rpx2px(16),
              this.rpx2px(rectHight),
              4,
              'rgba(255, 238, 231, 0.6)'
            )

            //框文字
            ctx.fillStyle = '#e33700'
            ctx.setTextBaseline('middle')
            ctx.fillText(atention, rect1X + this.rpx2px(8), word1Y)
            ctx.fillText(range, rect2X + this.rpx2px(8), word2Y)
          }

          // 情况一，村名+关注框大于最大X
          if (caseX1 > maxX) {
            const rect1X = this.rpx2px(148)
            const rect1Y = rectY + this.rpx2px(rectHight + 10)
            const rect2X = rect1X + metrics11 + this.rpx2px(16) + this.rpx2px(10)
            const word1Y = wordY + this.rpx2px(rectHight + 10)
            drawTag(rect1X, rect1Y, rect2X, rect1Y, word1Y, word1Y)
          } else if (caseX2 > maxX) {
            // 情况二，村名+关注框+排名框大于最大X
            const rect1X = this.rpx2px(148) + metrics10 + this.rpx2px(10)
            const rect1Y = rectY
            const rect2X = this.rpx2px(148)
            const rect2Y = rectY + this.rpx2px(rectHight + 10)
            const word1Y = wordY
            const word2Y = wordY + this.rpx2px(rectHight + 10)
            drawTag(rect1X, rect1Y, rect2X, rect2Y, word1Y, word2Y)
          } else {
            const rect1X = this.rpx2px(148) + metrics10 + this.rpx2px(10)
            const rect2X =
              this.rpx2px(148) + metrics10 + this.rpx2px(10) + metrics11 + this.rpx2px(16) + this.rpx2px(10)
            //情况三，未大于
            drawTag(rect1X, rectY, rect2X, rectY, wordY, wordY)
          }
        } else {
          const fontSize5 = 28
          ctx.font = `normal ${parseInt(this.rpx2px(fontSize5))}px sans-serif`
          ctx.setTextBaseline('middle')
          ctx.fillStyle = '#340001'
          ctx.fillText('未关注！', this.rpx2px(148), wordY)
        }
        ctx.draw(true)
        return Promise.resolve(true)
      },
      /**
       * 我的社保卡
       */
      async drawMySocialCard() {
        const { aaz502Desc, aaf002Desc } = this.userInfo
        const bank = `由${aaf002Desc}办理`
        const status = `状态${aaz502Desc}`

        const ctx = this.ctx

        this.rect3.y = this.rect2.y + this.rect2.height + this.reactMarginTop
        this.rect3.height = 220

        await this.renderContainer(ctx, this.rect3.y, this.rect3.height, '我的社保卡')

        //社保卡图像

        const imageHeight = 68
        const imageWidth = 68
        const imageY = this.rect3.y + 98
        await this.drawImage(
          imageSocialCard,
          this.rpx2px(this.boxX + 32),
          this.rpx2px(imageY),
          this.rpx2px(imageWidth),
          this.rpx2px(imageHeight)
        )

        const rectHight = 32
        const wordY = this.rpx2px(imageY + imageHeight / 2)
        const rectY = this.rpx2px(imageY + imageHeight / 2 - rectHight / 2)
        //如果办理银行存在，则社保卡存在
        if (aaf002Desc) {
          //aaf002Desc
          const fontSize1 = 28
          ctx.font = `normal ${parseInt(this.rpx2px(fontSize1))}px sans-serif`
          ctx.fillStyle = 'rgba(52, 0, 1, 0.8)'
          ctx.setTextBaseline('top')
          ctx.fillText('社保卡', this.rpx2px(this.boxX + 116), this.rpx2px(this.rect3.y + 96))

          const fontSize2 = 32
          ctx.font = `normal bold ${parseInt(this.rpx2px(fontSize2))}px sans-serif`
          ctx.setTextBaseline('top')
          ctx.fillStyle = '#340001'
          ctx.fillText(bank, this.rpx2px(this.boxX + 116), this.rpx2px(this.rect3.y + 96 + fontSize1 + 26 - 8))

          ctx.setTextBaseline('alphabetic')

          const boxColor = aaz502Desc === '正常' ? 'rgba(229, 248, 241, 0.6)' : 'rgba(255, 238, 231, 0.6)'
          const wordColor = aaz502Desc === '正常' ? '#00c191' : '#e33700'
          await this.drawRoundedRect(
            ctx,
            this.rpx2px(this.boxX + 552),
            rectY,
            this.rpx2px(118),
            this.rpx2px(32),
            4,
            boxColor
          )

          const fontSize3 = 22
          ctx.setTextBaseline('middle')
          ctx.font = `normal ${parseInt(this.rpx2px(fontSize3))}px sans-serif`
          ctx.fillStyle = wordColor
          ctx.fillText('状态正常', this.rpx2px(598), wordY)
        } else {
          const fontSize4 = 28
          ctx.font = `normal ${parseInt(this.rpx2px(fontSize4))}px sans-serif`
          ctx.fillStyle = '#340001'
          ctx.fillText('未办理！', this.rpx2px(this.boxX + 116), wordY)
        }
        ctx.draw(true)
        return Promise.resolve(true)
      },
      /**
       * 小程序二维码
       */
      async drawQrcode() {
        const ctx = this.ctx
        const qrcode = `${IMAGE_QR}/${areaCode}.png`

        //二维码
        await this.drawImage(
          qrcode,
          this.rpx2px(169),
          this.rpx2px(this.rect3.y + 32 + 220),
          this.rpx2px(120),
          this.rpx2px(120)
        )

        ctx.font = `normal ${parseInt(this.rpx2px(26))}px sans-serif`
        ctx.fillStyle = '#5e0d0e'
        ctx.setTextBaseline('top')
        ctx.fillText('微信扫码查看我的年度盘点', this.rpx2px(324), this.rpx2px(this.rect3.y + 80 + 220))
        ctx.setTextBaseline('alphabetic')
        ctx.draw(true)
        return Promise.resolve(true)
      },
      /**
       * 绘制主页面
       */
      async drawPage01() {
        await this.drawPageBg()
        await this.drawImageSponsor()
        await this.drawPageWordMain()
        await this.drawSummary()
        await this.drawMySubsidy()
        await this.drawMyAttention()
        await this.drawMySocialCard()
        await this.drawQrcode()
        const ctx = this.ctx
        ctx.draw(
          true,
          // 添加setTimeout防止某些机型由于绘制速度太快无法进入draw的回调函数
          setTimeout(() => {
            this.savePage()
          }, 300)
        )
      },
      /**
       * 初始化页面
       */
      async initPage() {
        this.ctx.draw(false)
        const currentStep = this.currentStep
        // 绘制第一页
        if (currentStep == 2) {
          this.drawPage01()
        }
      },
      /**
       * 初始化canvas
       */
      initCanvas() {
        if (this.ctx) {
          this.initPage()
        } else {
          this.$nextTick(() => {
            uni
              .createSelectorQuery()
              .select('#page')
              .fields({ node: true, size: true })
              .exec((res) => {
                // Canvas 对象
                const canvas = res[0].node
                // 渲染上下文
                const ctx = uni.createCanvasContext('page')
                this.ctx = ctx
                this.canvas = canvas
                this.initPage()
              })
          })
        }
      },
      /**
       * 保存图片
       */
      saveImage() {
        showLoading('图片生成中...')
        const canvasW = screenWidth
        const canvasH = this.canvasHeight

        return new Promise((resolve, reject) => {
          uni
            .createSelectorQuery()
            .select('#page_save')
            .fields({ node: true, size: true })
            .exec((res) => {
              // console.log(res, 99)
              const ctx = uni.createCanvasContext('page_save')

              const data = this.shareScreenshots

              for (let i = 0, len = data.length; i < len; i++) {
                const path = data[i]
                if (data[i]) {
                  ctx.drawImage(
                    path,
                    0,
                    0,
                    screenWidth * pixelRatio,
                    canvasH * pixelRatio,
                    0,
                    canvasH * i,
                    screenWidth,
                    canvasH
                  )
                }
              }

              ctx.draw(false, () => {
                canvasToTempFilePath(
                  0,
                  0,
                  canvasW,
                  canvasH,
                  canvasW * pixelRatio * 2,
                  canvasH * pixelRatio * 2,
                  'page_save',
                  null
                )
                  .then((res) => {
                    const path = res.tempFilePath
                    hideLoading()
                    resolve(path)
                  })
                  .catch(() => {
                    hideLoading()
                    reject(false)
                  })
              })
            })
        })
      },
      /**
       * 控制是否播放音频
       */
      onChangeMusic(val) {
        if (val) {
          this.isPlayMusicChange = false
        } else {
          this.isPlayMusicChange = true
        }
        this.isPlayMusic = val
      },
      /**
       * 保存图片至相册
       */
      saveToPhotoAlbum(data) {
        saveImageToPhotosAlbum(data)
          .then(() => {
            showToast('图片保存成功')
          })
          .catch(() => {
            showToast('图片保存失败')
          })
      },
      /**
       * 获取授权
       */
      onClickSave() {
        const that = this
        this.saveImage()
          .then((data) => {
            uni.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                that.saveToPhotoAlbum(data)
              },
              fail() {
                showModal('检测到图片添加到相册权限已关闭，是否进入设置页开启？', '提示', true).then(() => {
                  openSetting().then((res) => {
                    if (res.authSetting['scope.writePhotosAlbum']) {
                      //已经获得授权，直接存储
                      that.saveToPhotoAlbum(data)
                    } else {
                      // 用户拒绝授权
                      showToast('您已拒绝图片添加到相册授权')
                    }
                  })
                })
              }
            })
          })
          .catch(() => {})
      },
      /**
       * 分享
       */
      onClickShare() {
        this.saveImage().then((res) => {
          uni.showShareImageMenu({
            path: res // 将 canvas 生成的图片路径作为分享图片
          })
        })
      }
    },
    computed: {
      ...mapGetters([USER_INFO])
    },
    onShow() {
      if (!this.isPlayMusicChange) {
        this.isPlayMusic = true
      }
    },
    onHide() {
      if (!this.isPlayMusicChange) {
        this.isPlayMusic = false
      }
    },
    // 分享给朋友
    onShareAppMessage(e) {
      return {
        title: this.currentYear + '年惠民惠农“一卡通”年度盘点来啦，快去看看吧！', // 转发标题
        path: '/pages/packageScan/annual-account-simplify/annual-account-simplify', // 转发路径
        query: 'type=share', // 自定义页面路径中携带的参数，如 path?a=1&b=2 的 “?” 后面部分
        imageUrl: imageShare2 // 自定义图片路径
      }
    },
    // 分享到朋友圈
    onShareTimeline(e) {
      return {
        title: this.currentYear + '年惠民惠农“一卡通”年度盘点来啦，快去看看吧！', // 转发标题
        path: '/pages/packageScan/annual-account-simplify/annual-account-simplify', // 转发路径
        query: 'type=share', // 自定义页面路径中携带的参数，如 path?a=1&b=2 的 “?” 后面部分
        imageUrl: imageShare2 // 自定义图片路径
      }
    }
  }
</script>

<style lang="scss" scoped>
  .annual-account-simplify {
    width: 100%;
    height: 100%;
    display: block;
    position: relative;
    .canvas-save {
      position: fixed;
      width: 100%;
      visibility: hidden;
      z-index: -99;
    }
    .pages {
      position: absolute;
      top: 0;
    }
    .btns {
      width: 100%;
      box-sizing: border-box;
      padding: 0 32rpx;
      position: absolute;
      z-index: 99;
      bottom: 54rpx;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .active {
        .text {
          color: #fff !important;
        }
        background-color: #f34713;
      }
      .default {
        background-color: #ffe3c9;
      }
      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 88rpx;
        padding: 0 15rpx;
        border-radius: 16rpx;
        min-width: 200rpx;
        .icon {
          width: 28rpx;
          height: 28rpx;
          margin-right: 10rpx;
        }
        .icon-share {
          width: 28 * 2rpx;
          height: 30 * 2rpx;
        }
        .text {
          color: #fd6534;
          font-size: 28rpx;
        }
      }
    }
  }
</style>
