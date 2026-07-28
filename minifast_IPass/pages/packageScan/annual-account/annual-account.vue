<template>
  <div class="annual-account">
    <AnnualAccountPageStart v-if="currentStep === 1" @clickOpen="onClickOpen"></AnnualAccountPageStart>

    <div class="pages" v-else @touchstart="start" @touchend="end">
      <canvas
        v-if="isShowCanvasSave"
        :style="{
          width: screenWidth + 'px',
          height: screenHeight * (totalStep - 1) + 'px'
        }"
        canvas-id="page_save"
        class="canvas-save"
        id="page_save"></canvas>
      <canvas
        :style="{
          width: screenWidth + 'px',
          height: screenHeight + 'px'
        }"
        canvas-id="page"
        class="canvas"
        id="page"></canvas>
    </div>
    <AnnualAccountNavbar></AnnualAccountNavbar>
    <AnnualAccountToolbar :step="currentStep" :isPlay="isPlayMusic" @changeMusic="onChangeMusic"></AnnualAccountToolbar>
    <ScrollTip :step="currentStep" :totalStep="totalStep"></ScrollTip>
    <SaveShare v-if="currentStep == totalStep" @clickSave="onClickSave" @clickShare="onClickShare"></SaveShare>
  </div>
</template>
<script>
  import AnnualAccountPageStart from '@/components/project/annual-account-page-start/annual-account-page-start.vue'
  import AnnualAccountNavbar from '@/components/project/annual-account-navbar/annual-account-navbar.vue'
  import AnnualAccountToolbar from '@/components/project/annual-account-toolbar/annual-account-toolbar.vue'
  import ScrollTip from './ScrollTip.vue'
  import SaveShare from './SaveShare.vue'

  import Big from '@/utils/big.min.js'
  import {
    getSystemInfoSync,
    showLoading,
    hideLoading,
    showToast,
    getImageInfo,
    canvasToTempFilePath,
    saveImageToPhotosAlbum,
    openSetting,
    showModal
  } from '@/utils/uni-api'
  import { requestWXGetReport, requestB253 } from '@/service/api'
  import { USER_INFO } from '@/store/constants' // 常量
  import { mapGetters } from 'vuex'
  import { useJumpToLogin } from '@/hooks'
  import config from '@/config'
  import { IMAGE_ANNUAL_ACCOUNT, IMAGE_QR } from '@/config/constants'
  import { imageSponsor } from '@/components/project/annual-account-toolbar/sponsor'

  const { osName, pixelRatio, screenHeight, screenWidth, statusBarHeight } = getSystemInfoSync()
  const { areaCode, areaName_zh } = config

  const imagePageBg = IMAGE_ANNUAL_ACCOUNT + '/bg-page.png'
  const imageShare = IMAGE_ANNUAL_ACCOUNT + '/share.png'
  const imageImg01 = IMAGE_ANNUAL_ACCOUNT + '/img-01.png'
  const imageText02 = IMAGE_ANNUAL_ACCOUNT + '/text-02.png'
  const imageIconVillage = IMAGE_ANNUAL_ACCOUNT + '/icon-village.png'
  const imageIconTag = IMAGE_ANNUAL_ACCOUNT + '/icon-tag.png'
  const imageIconRank01 = IMAGE_ANNUAL_ACCOUNT + '/iocn-rank-01.png'
  const imageIconRank02 = IMAGE_ANNUAL_ACCOUNT + '/iocn-rank-02.png'
  const imageIconRank03 = IMAGE_ANNUAL_ACCOUNT + '/iocn-rank-03.png'
  const imageIconEmote01 = IMAGE_ANNUAL_ACCOUNT + '/icon-emote-01.png'
  const imageIconEmote02 = IMAGE_ANNUAL_ACCOUNT + '/icon-emote-02.png'
  const imageIconDialogBox = IMAGE_ANNUAL_ACCOUNT + '/icon-dialog-box.png'

  const imageBgFooter01 = IMAGE_ANNUAL_ACCOUNT + '/bg-footer-01.png'
  const imageBgFooter02 = IMAGE_ANNUAL_ACCOUNT + '/bg-footer-02.png'
  const imageBgFooter03 = IMAGE_ANNUAL_ACCOUNT + '/bg-footer-03.png'
  const imageBgFooter04 = IMAGE_ANNUAL_ACCOUNT + '/bg-footer-04.png'
  const imageBgFooter05 = IMAGE_ANNUAL_ACCOUNT + '/bg-footer-05.png'

  export default {
    name: 'annualAccount',
    data() {
      return {
        // 是否播放背景音乐
        isPlayMusic: false,
        // 用户是否主动暂停
        isPlayMusicChange: false,
        // 当前年
        currentYear: 2023,
        // 当前步骤
        currentStep: 1,
        // 屏幕高度
        screenHeight,
        // 屏幕宽度
        screenWidth,
        clientX: 0,
        clientY: 0,
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
        // 已经缓存的图片
        imageCaches: {},

        // 是否绘制第2页 领取补贴情况页
        isDrawPage2: false,
        // 是否绘制第3页 补贴申报、查询情况页
        isDrawPage3: false,
        // 是否绘制第4页 补贴申报、查询情况页
        isDrawPage4: false,
        // 是否绘制第5页 村社情况页
        isDrawPage5: false,
        // 是否绘制第6页 常用功能页
        isDrawPage6: false,
        // 是否显示保存的canvas
        isShowCanvasSave: false
      }
    },
    components: {
      AnnualAccountPageStart,
      AnnualAccountNavbar,
      AnnualAccountToolbar,
      ScrollTip,
      SaveShare
    },
    onLoad(e) {
      this.screenHeight = screenHeight
      this.screenWidth = screenWidth
    },
    onReady(e) {},
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
    methods: {
      start(e) {
        // console.log('开始下滑坐标', e.changedTouches[0])
        const { clientX, clientY } = e.changedTouches[0]
        this.clientX = clientX
        this.clientY = clientY
      },
      end(e) {
        // console.log('结束下滑坐标', e.changedTouches[0])
        const { clientX, clientY } = e.changedTouches[0]
        const subX = clientX - this.clientX
        const subY = clientY - this.clientY
        const space = 100
        if (subY < -space) {
          // showToast('下滑')
          if (this.currentStep < this.totalStep) {
            this.currentStep++
          }
        } else if (subY > space) {
          // showToast('上滑')
          if (this.currentStep > 2) {
            this.currentStep--
          }
        } else if (subX > space) {
          // console.log('左滑')
        } else if (subX < -space) {
          // console.log('右滑')
        } else {
          // console.log('无效')
        }
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
       * 从数值中获取最大值，并将最大值转化为整位数 77=> 80 775 => 800
       */
      getMaxValue(data) {
        let max = 0
        data.forEach(({ value }) => {
          if (value > max) {
            max = value
          }
        })

        // 将最大值转化为整位数 77=> 80 775 => 800
        const integer = Math.ceil(max)
        const length = String(integer).length
        max = Math.ceil(integer / Math.pow(10, length - 1)) * Math.pow(10, length - 1)
        return max
      },
      /**
       * 获取所有数据
       */
      getYearData() {
        const { idCard, userName } = this.userInfo

        const createTextObj = (text = '', type, fontSize, fontWeight, left, right) => {
          const obj = {
            fontSize,
            fontWeight,
            text,
            type,
            left,
            right
          }

          if (!type) {
            obj.type = 'text'
          }
          if (!fontWeight) {
            obj.fontWeight = 'normal'
          }
          if (!fontSize) {
            obj.fontSize = 30
          }
          if (!left) {
            obj.left = 0
          }
          if (!right) {
            obj.right = 0
          }

          if (type === 'value') {
            obj.left = 4
            obj.right = 4
            obj.fontWeight = 'bold'
          }

          if (left) {
            obj.left = left
          }
          if (right) {
            obj.right = right
          }
          if (fontWeight) {
            obj.fontWeight = fontWeight
          }
          return obj
        }

        return new Promise(async (resolve, reject) => {
          showLoading('正在生成数据...')

          const requestList = [
            requestWXGetReport(idCard, this.currentYear, false, false),
            requestB253(idCard, this.currentYear, false, false)
          ]
          const data = await Promise.allSettled(requestList)

          const res0 = data[0]
          const res1 = data[1]

          const { status: status0, value: value0 } = res0
          const { status: status1, value: value1 } = res1

          const pageData_1 = {
            openRanking: 0, // 打开排名
            strartTime: '', // 开始使用时间
            useDay: 0, // 使用天数
            totlaProjectNum: 0, // 领取资金总笔数
            totlaProjectMoney: 0 // 领取资金总金额
          }
          const pageData_2 = {
            grantAmountList: [],
            grantAmountTypeList: [],
            firstGrantDate: '',
            firstGrantTime: '',
            firstGrantMonth: '',
            firstGrantAmount: '',
            maxGrantAmountTypeName: ''
          }
          const pageData_3 = {
            totlaApplyNum: 0, // 累计享受补贴项目个数
            totlaApplyNumBySelf: 0, // 自主享受补贴项目个数
            queryBtffNum: 0, // 补贴发放进度查询次数
            fastPayDate: '',
            fastPayDay: 5
          }
          const pageData_4 = {
            projectNum: 0,
            projectNumUpdate: 0,
            cityName:
              areaCode === '513200' || areaCode === '513300' || areaCode === '513400'
                ? areaName_zh + '州'
                : areaName_zh + '市',
            chi031List: [],
            chi031ListAdd: []
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

          // 小程序相关数据
          if (status0 === 'fulfilled' && value0) {
            let resData = null
            const { report, ranking } = value0.data

            if (report) {
              resData = JSON.parse(report)
            }

            const { firstLoginTime, dayNum } = resData

            pageData_1.openRanking = Number(ranking || 0)
            pageData_1.strartTime = firstLoginTime
            pageData_1.useDay = Number(dayNum || 0)
          }

          // 审批发放相关数据
          if (status1 === 'fulfilled' && value1) {
            const {
              cht482,
              cht483,
              cht485,
              cht488,
              cht489,
              cht48b,
              cht503,
              cht504,
              cht508,
              cht492_01,
              cht492_02,
              cht492_03,
              cht492_04,
              cht492_05,
              cht492_07,
              cht492_08,
              cht492_09
            } = value1.lists.resultList.list[0]

            // 本年度补贴金额领取统计信息
            pageData_1.totlaProjectNum = Number(cht482 || 0)
            pageData_1.totlaProjectMoney = Number(cht483 || 0)

            if (pageData_1.totlaProjectMoney) {
              this.isDrawPage2 = true
            } else {
              this.isDrawPage2 = false
            }

            // 首笔金额发放信息
            if (cht492_09) {
              const data = JSON.parse(cht492_09)
              const { cht487, aae019 } = data
              pageData_2.firstGrantDate =
                cht487.substring(0, 4) + '年' + cht487.substring(5, 7) + '月' + cht487.substring(8, 10) + '日'
              pageData_2.firstGrantTime = cht487.substring(11, 13) + '时' + cht487.substring(14, 16) + '分'
              pageData_2.firstGrantMonth = Number(cht487.substring(5, 7)) + '月'
              pageData_2.firstGrantAmount = aae019 || 0
            }

            // 每月补贴领取金额信息
            if (cht492_01) {
              const data = JSON.parse(cht492_01)
              data.forEach(({ month, money }) => {
                pageData_2.grantAmountList.push({
                  name: month,
                  value: Number(money || 0)
                })
              })
            }

            // 本年度补贴金额领取分类信息
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

            // 本年度申报信息
            pageData_3.totlaApplyNum = Number(cht489 || 0)
            pageData_3.totlaApplyNumBySelf = Number(cht485 || 0)
            pageData_3.queryBtffNum = Number(cht48b || 0)

            // 发放开始最快到账信息
            if (cht492_02) {
              const data = JSON.parse(cht492_02)
              const { aae036, days } = data[0]
              pageData_3.fastPayDate =
                aae036.substring(0, 4) + '年' + aae036.substring(5, 7) + '月' + aae036.substring(8, 10) + '日'
              pageData_3.fastPayDay = Number(days || 0)
            }

            // 关注的补贴项目政策更新信息
            if (cht492_05) {
              let allnum = 0
              let newArr = []
              const data = JSON.parse(cht492_05)
              for (let i = 0, len = data.length; i < len; i++) {
                const { chi031, num, chi032 } = data[i]
                const val = Number(num || 0)
                if (val > 0) {
                  allnum++
                }
                newArr.push({
                  chi031Desc: chi032,
                  chi031,
                  time: val
                })
              }

              pageData_4.chi031List = [...newArr]
              pageData_4.projectNum = newArr.length
              pageData_4.projectNumUpdate = allnum
            }

            // 本年度新上项目信息
            if (cht492_03) {
              const data = JSON.parse(cht492_03)
              pageData_4.chi031ListAdd = data
            }

            if (pageData_4.chi031ListAdd.length || pageData_4.projectNum) {
              this.isDrawPage4 = true
            } else {
              this.isDrawPage4 = false
            }

            pageData_5.villageInfo = {
              name: cht503,
              rank: Number(cht508 || 0),
              number: Number(cht504 || 0)
            }

            if (cht488) {
              pageData_5.date =
                cht488.substring(0, 4) + '年' + cht488.substring(5, 7) + '月' + cht488.substring(8, 10) + '日'
            }

            if (cht503) {
              this.isDrawPage5 = true
            } else {
              this.isDrawPage5 = false
            }

            // 用户常用五大功能统计
            let commonFuncMaxValue = 0
            if (cht492_07) {
              const data = JSON.parse(cht492_07)
              if (data && data.length) {
                let tempArr = []
                data.forEach(({ name, times }) => {
                  const value = Number(times || 0)
                  if (value > commonFuncMaxValue) {
                    commonFuncMaxValue = value
                  }
                  tempArr.push({
                    name,
                    value
                  })
                })
                tempArr = tempArr.sort((a, b) => b.value - a.value)
                pageData_6.commonFunc = [...tempArr]
              }
            }
            if (commonFuncMaxValue) {
              this.isDrawPage6 = true
            } else {
              this.isDrawPage6 = false
            }

            // 用户最晚访问时间
            if (cht492_08) {
              const data = JSON.parse(cht492_08)
              if (data && data.length) {
                const { time, type } = data[0]
                pageData_6.latestView.ymd =
                  time.substring(0, 4) + '年' + time.substring(5, 7) + '月' + time.substring(8, 10) + '日'
                pageData_6.latestView.hm = time.substring(11, 13) + '时' + time.substring(14, 16) + '分'
                pageData_6.latestView.name = type
              }
            }
          }

          // 开始构造数据
          const page1 = {
            textList: [
              {
                bottom: 76,
                list: [createTextObj('Hi', 'text', 40, 'bold'), createTextObj(userName, 'text', 40, 'bold', 4)]
              },
              {
                bottom: 60,
                list: [
                  createTextObj('你是第'),
                  createTextObj(pageData_1.openRanking, 'value', 40),
                  createTextObj('个打开年度盘点的人')
                ]
              },
              {
                bottom: 20,
                list: [
                  createTextObj('从'),
                  createTextObj(pageData_1.strartTime, 'value', 36),
                  createTextObj('的第一次相遇算起')
                ]
              },
              {
                bottom: 140,
                list: [
                  createTextObj('惠民惠农“一卡通”小程序已经陪伴你'),
                  createTextObj(pageData_1.useDay, 'value', 40),
                  createTextObj('天')
                ]
              },
              {
                bottom: 20,
                list: [createTextObj('在过去的2023这一年')]
              }
            ]
          }

          let page1TextListArr = []
          if (pageData_1.totlaProjectNum) {
            page1TextListArr = [
              {
                bottom: 20,
                list: [
                  createTextObj('你领取了'),
                  createTextObj(pageData_1.totlaProjectNum, 'value', 40),
                  createTextObj('笔惠民惠农财政补贴资金')
                ]
              },
              {
                bottom: 20,
                list: [
                  createTextObj('补贴总金额为'),
                  createTextObj(pageData_1.totlaProjectMoney, 'value', 40),
                  createTextObj('元')
                ]
              }
            ]
          } else {
            let text01 = '你没有领取过惠民惠农财政补贴哦'
            if (areaCode === '510100') {
              text01 = '你没有在成都市领取过惠民惠农财政补贴哦'
            }
            page1TextListArr = [
              {
                bottom: 20,
                list: [createTextObj(text01)]
              },
              {
                bottom: 20,
                list: [createTextObj('快去惠民惠农“一卡通”小程序')]
              },
              {
                bottom: 20,
                list: [createTextObj('看看有没有符合条件的补贴项目吧~')]
              }
            ]
          }
          page1.textList = page1.textList.concat(page1TextListArr)

          const page2 = {
            textList: [
              {
                bottom: 20,
                list: [
                  createTextObj(pageData_2.firstGrantDate),
                  createTextObj(pageData_2.firstGrantTime, 'text', 30, '', 4)
                ]
              },
              {
                bottom: 20,
                list: [
                  createTextObj('党和政府为你发放了首笔'),
                  createTextObj('惠民惠农', 'value', 36),
                  createTextObj('补贴资金')
                ]
              },
              {
                bottom: screenHeight < 736 ? 474 : 554,
                list: [createTextObj('还记得是多少吗')]
              }
            ],
            lineList: pageData_2.grantAmountList,
            pieList: pageData_2.grantAmountTypeList,
            firstGrantMonth: pageData_2.firstGrantMonth,
            firstGrantAmount: pageData_2.firstGrantAmount
          }
          if (pageData_2.grantAmountTypeList.length) {
            const arr = []

            if (pageData_2.maxGrantAmountTypeName === '农业类') {
              arr.push({
                bottom: 20,
                list: [
                  createTextObj('悄悄告诉你，你今年享受最多的是'),
                  createTextObj(pageData_2.maxGrantAmountTypeName, 'value', 36),
                  createTextObj('补贴资金，'),
                  createTextObj('感谢你为国家粮食安全做出的贡献！')
                ]
              })
            } else if (pageData_2.maxGrantAmountTypeName === '教育类') {
              arr.push({
                bottom: 20,
                list: [
                  createTextObj('悄悄告诉你，你今年享受最多的是'),
                  createTextObj(pageData_2.maxGrantAmountTypeName, 'value', 36),
                  createTextObj('补贴资金，'),
                  createTextObj('又一位祖国的花朵，国家的未来靠你们啦！')
                ]
              })
            } else {
              arr.push({
                bottom: 20,
                list: [
                  createTextObj('悄悄告诉你，你今年享受最多的是'),
                  createTextObj(pageData_2.maxGrantAmountTypeName, 'value', 36),
                  createTextObj('补贴资金')
                ]
              })
            }
            page2.textList = page2.textList.concat(arr)
          }

          const page3 = {
            textList: []
          }
          const page3TextListArr = [
            {
              bottom: 24,
              list: [createTextObj('在2023这一年')]
            }
          ]
          if (pageData_3.totlaApplyNum) {
            this.isDrawPage3 = true

            if (pageData_3.totlaApplyNumBySelf) {
              page3TextListArr.push({
                bottom: 24,
                list: [
                  createTextObj('你累计享受了'),
                  createTextObj(pageData_3.totlaApplyNum + '个', 'value', 36),
                  createTextObj('补贴项目，'),
                  createTextObj('还记得哪'),
                  createTextObj(pageData_3.totlaApplyNumBySelf + '个', 'value', 36),
                  createTextObj('项目')
                ]
              })
              page3TextListArr.push({
                bottom: 180,
                list: [createTextObj('是你自己通过'), createTextObj('微信小程序', 'value'), createTextObj('申报的吗？')]
              })
            } else {
              page3TextListArr.push({
                bottom: 24,
                list: [
                  createTextObj('你累计享受了'),
                  createTextObj(pageData_3.totlaApplyNum + '个', 'value', 36),
                  createTextObj('补贴项目')
                ]
              })
              page3TextListArr.push({
                bottom: 180,
                list: [createTextObj('有没有项目是你自己通过微信小程序申报的呢')]
              })
            }

            page3TextListArr.push({
              bottom: 20,
              list: [
                createTextObj('你累计查看了'),
                createTextObj(pageData_3.queryBtffNum + '次', 'value', 36),
                createTextObj('补贴发放进度')
              ]
            })

            if (!pageData_3.queryBtffNum) {
              page3TextListArr.push({
                bottom: 20,
                list: [createTextObj('悄悄告诉你')]
              })
              page3TextListArr.push({
                bottom: 50,
                list: [createTextObj('小程序上可以随时查看补贴发放进度哦')]
              })
            }

            // 对比天数
            // let cDay = 5
            // if (areaCode === '510100') {
            //   cDay = 10
            // }

            // if (areaCode !== '511800') {
            //   if (pageData_3.fastPayDay !== 0 || pageData_3.fastPayDay <= cDay) {
            //     page3TextListArr.push({
            //       bottom: 24,
            //       list: [createTextObj('还记得那笔' + pageData_3.fastPayDate + '到账的补贴吗')]
            //     })

            //     page3TextListArr.push({
            //       bottom: 24,
            //       list: [
            //         createTextObj('从申请发放到补贴到账只用了'),
            //         createTextObj(pageData_3.fastPayDay, 'value', 40),
            //         createTextObj('天')
            //       ]
            //     })

            //     page3TextListArr.push({
            //       bottom: 20,
            //       list: [createTextObj('快来为“一卡通”'), createTextObj('点个赞', 'value', 40), createTextObj('吧')]
            //     })
            //   }
            // }

            // 现在大于5天不显示
            if (pageData_3.fastPayDay <= 5) {
              page3TextListArr.push({
                bottom: 24,
                list: [createTextObj('还记得那笔' + pageData_3.fastPayDate + '到账的补贴吗')]
              })

              page3TextListArr.push({
                bottom: 24,
                list: [
                  createTextObj('从申请发放到补贴到账只用了'),
                  createTextObj(pageData_3.fastPayDay, 'value', 40),
                  createTextObj('天')
                ]
              })

              page3TextListArr.push({
                bottom: 20,
                list: [createTextObj('快来为“一卡通”'), createTextObj('点个赞', 'value', 40), createTextObj('吧')]
              })
            }
          } else {
            this.isDrawPage3 = false
          }
          page3.textList = page3TextListArr

          const page4TextListArr1 = []
          const page4TextListArr2 = []
          const page4 = {
            textList: [],
            textList2: [],
            chi031List: pageData_4.chi031List
          }
          if (pageData_4.projectNum) {
            page4TextListArr1.push({
              bottom: 24,
              list: [createTextObj('在2023这一年')]
            })
            if (pageData_4.projectNumUpdate) {
              page4TextListArr1.push({
                bottom: 24,
                list: [
                  createTextObj('你经常关注'),
                  createTextObj(pageData_4.projectNum, 'value', 40),
                  createTextObj('个补贴项目，还记得哪'),
                  createTextObj(pageData_4.projectNumUpdate, 'value', 40),
                  createTextObj('个项目的')
                ]
              })

              page4TextListArr1.push({
                bottom: 414,
                list: [createTextObj('政策要求更新了吗')]
              })
            } else {
              page4TextListArr1.push({
                bottom: 24,
                list: [
                  createTextObj('你经常关注'),
                  createTextObj(pageData_4.projectNum, 'value', 40),
                  createTextObj('个补贴项目')
                ]
              })
            }
          } else {
            page4TextListArr1.push({
              bottom: 24,
              list: [createTextObj('你知道吗')]
            })

            page4TextListArr1.push({
              bottom: 20,
              list: [createTextObj('小程序上可以查看惠民惠农补贴项目清单哦')]
            })

            page4TextListArr1.push({
              bottom: 0,
              list: [createTextObj('快去试试吧')]
            })
          }

          const chi031ListAddLen = pageData_4.chi031ListAdd.length
          if (chi031ListAddLen) {
            let str1 = []
            const separateValue = 3
            for (let i = 0; i < chi031ListAddLen; i++) {
              const item = pageData_4.chi031ListAdd[i]
              if (i >= separateValue) {
                break
              } else {
                str1.push(item.chi031)
              }
            }

            const obj = {
              bottom: 20,
              list: [
                createTextObj('对了，' + pageData_4.cityName + '2023年新上了'),
                createTextObj(chi031ListAddLen, 'value', 40),
                createTextObj('个惠民惠农补贴项目。')
              ]
            }
            if (chi031ListAddLen > separateValue) {
              obj.list.push(createTextObj('其中'))
              obj.list.push(createTextObj(str1.join('、'), 'value', 36, 'normal'))
              obj.list.push(createTextObj('是最新上线的哦～'))
            } else {
              obj.list.push(createTextObj('分别是'))
              obj.list.push(createTextObj(str1.join('、'), 'value', 36, 'normal'))
            }

            page4TextListArr2.push(obj)
            page4TextListArr2.push({
              bottom: 20,
              list: [createTextObj('快去邀请亲朋好友来看看吧～')]
            })
          }
          page4.textList = page4TextListArr1
          page4.textList2 = page4TextListArr2

          const page5 = {
            villageInfo: pageData_5.villageInfo,
            textList: [
              {
                bottom: 265,
                list: [createTextObj('我的村社', 'text', 40, 'bold')]
              },
              {
                bottom: 20,
                list: [createTextObj(pageData_5.date)]
              },
              {
                bottom: 20,
                list: [createTextObj('你在村村响上面关注了'), createTextObj(pageData_5.villageInfo.name, 'value', 36)]
              },
              {
                bottom: 20,
                list: [
                  createTextObj('截至2023年12月31日，' + pageData_5.villageInfo.name + '已经有'),
                  createTextObj(pageData_5.villageInfo.number, 'value', 36),
                  createTextObj('个村民跟您一样，正在使用惠民惠农“一卡通”小程序。')
                ]
              }
            ]
          }

          const page6TextList = [
            {
              bottom: 24,
              list: [createTextObj('2023这一年')]
            },
            {
              bottom: 24,
              list: [
                createTextObj('你最常使用的'),
                createTextObj(pageData_6.commonFunc.length, 'value', 40),
                createTextObj('大功能')
              ]
            },
            {
              bottom: screenHeight < 736 ? 500 : 546,
              list: [createTextObj('你知道哪个功能使用次数最多吗')]
            }
          ]

          if (pageData_6.latestView.ymd) {
            page6TextList.push({
              bottom: 20,
              list: [
                createTextObj(pageData_6.latestView.ymd + '，你在'),
                createTextObj(pageData_6.latestView.hm, 'value', 36),
                createTextObj('访问了')
              ]
            })
            page6TextList.push({
              bottom: 60,
              list: [createTextObj('功能页'), createTextObj(pageData_6.latestView.name, 'value', 36)]
            })
          }

          page6TextList.push({
            bottom: 20,
            list: [createTextObj('是不是感觉惠民惠农“一卡通”微信小程序还不错呢')]
          })

          page6TextList.push({
            bottom: 20,
            list: [createTextObj('它会一直陪着你，从白天到黑夜，从黑夜到黎明')]
          })
          page6TextList.push({
            bottom: 20,
            list: [createTextObj('让你'), createTextObj('随时随地查补贴、查进度', 'value', 36)]
          })

          const page6 = {
            textList: page6TextList,
            lineList: pageData_6.commonFunc
          }

          const yearData = {
            page1,
            page2,
            page3,
            page4,
            page5,
            page6
          }

          hideLoading()
          this.yearData = JSON.parse(JSON.stringify(yearData))
          resolve(true)
        })
      },
      /**
       * 绘制图片
       */
      async drawImage(src, x, y, w, h) {
        const ctx = this.ctx
        const imageCaches = this.imageCaches

        let res = null
        let key = src.substring((IMAGE_ANNUAL_ACCOUNT + '/').length)
        key = key.replace(new RegExp('-', 'g'), '')
        key = key.split('.')[0]

        if (imageCaches[key]) {
          res = imageCaches[key]
        } else {
          try {
            res = await getImageInfo(src)
            imageCaches[key] = res
          } catch (err) {
            //
          }
        }

        if (res) {
          const { width, height, path } = res
          // 将背景图片绘制到 canvas 上
          ctx.drawImage(path, 0, 0, width, height, x, y, w, h)
          ctx.draw(true)
        }
        // console.log(this.imageCaches, '===this.imageCaches===')

        return Promise.resolve(true)
      },
      /**
       * 绘制页面背景
       */
      async drawPageBg(i) {
        const ctx = this.ctx
        // 清空画布
        ctx.draw()

        // 将背景图片绘制到 canvas 上
        await this.drawImage(imagePageBg, 0, 0, screenWidth, screenHeight)

        let imgPath = ''
        let imgHeight = 0
        if (i === 0) {
          imgPath = imageBgFooter01
          imgHeight = this.rpx2px(456)
        }

        if (i === 1 || i === 5) {
          imgPath = imageBgFooter02
          imgHeight = this.rpx2px(232)
        }
        if (i === 2) {
          imgPath = imageBgFooter03
          imgHeight = this.rpx2px(368)
        }
        if (i === 3) {
          imgPath = imageBgFooter04
          imgHeight = this.rpx2px(370)
        }
        if (i === 4) {
          imgPath = imageBgFooter05
          imgHeight = this.rpx2px(336)
        }

        if (imgPath) {
          await this.drawImage(imgPath, 0, screenHeight - imgHeight, screenWidth, imgHeight)
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

        const imgW = 44
        const imgH = 44

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
            }
            ctx.font = `normal ${Math.ceil(this.rpx2px(fs))}px sans-serif`
            ctx.fillStyle = '#6e4e45'
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
        ctx.setStrokeStyle('transparent')
        ctx.setFillStyle(bgColor)
        ctx.beginPath()
        ctx.moveTo(x + radius, y)
        ctx.arcTo(x + w, y, x + w, y + h, radius)
        ctx.arcTo(x + w, y + h, x, y + h, radius)
        ctx.arcTo(x, y + h, x, y, radius)
        ctx.arcTo(x, y, x + w, y, radius)
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
       * 绘制文本
       */
      async drawLineText(data, startY) {
        const ctx = this.ctx

        // 文字绘制的x轴坐标
        let x = this.spaceScreenLeft
        // 文字绘制的y轴坐标
        let y = startY
        // 每行文字绘制的最大宽度，大于则要换行
        let maxDrawWidth = screenWidth - this.spaceScreenLeft * 2

        for (let k = 0, kLen = data.length; k < kLen; k++) {
          const { list, bottom } = data[k]
          // 字体最大
          let maxFontSize = 0
          // 文字已绘制宽度
          let draw_width = 0
          for (let i = 0, len = list.length; i < len; i++) {
            const item = list[i]
            const { fontSize, fontWeight, text, type, left, right } = item
            const _fontSize = Math.ceil(this.rpx2px(fontSize))
            let font = `normal ${_fontSize}px sans-serif`
            if (fontWeight === 'bold') {
              font = `normal ${fontWeight || 'normal'} ${_fontSize}px sans-serif`
            }
            ctx.font = font
            if (type === 'value') {
              ctx.fillStyle = '#cf1214'
            } else {
              ctx.fillStyle = '#350001'
            }
            ctx.setTextBaseline('middle')
            const textWidth = ctx.measureText(text + '').width

            // 将要绘制的文字宽度超出屏幕 换行处理
            if (draw_width + textWidth + (left || 0) > maxDrawWidth) {
              let word = text + ''

              const hanlerText = (word, isFirst = true) => {
                let w = 0
                let len = word.length
                for (let i = 0; i < len; i++) {
                  w += ctx.measureText(word[i]).width
                  let currentW = draw_width + w
                  if (isFirst) {
                    currentW = currentW + (left || 0)
                  }
                  if (currentW > maxDrawWidth) {
                    let _x = draw_width + x
                    if (isFirst) {
                      _x = _x + (left || 0)
                    }
                    ctx.fillText(word.substring(0, i), _x, y) // 绘制截取部分
                    y += this.rpx2px(20) + _fontSize
                    w = 0
                    draw_width = 0
                    ctx.draw(true)

                    const sWord = word.substring(i, len)
                    const sWord_w = ctx.measureText(sWord).width
                    if (sWord_w > maxDrawWidth) {
                      hanlerText(sWord, false)
                    } else {
                      ctx.fillText(sWord, x, y)
                      draw_width += sWord_w + (right || 0)
                      ctx.draw(true)
                    }
                    break
                  }
                }
              }
              hanlerText(word)
            } else {
              ctx.fillText(text + '', draw_width + (left || 0) + x, y)
              //
              draw_width += textWidth + (left || 0) + (right || 0)
            }
            if (_fontSize > maxFontSize) {
              maxFontSize = _fontSize
            }
          }
          y += this.rpx2px(bottom) + maxFontSize
        }
        ctx.draw(true)

        return Promise.resolve(true)
      },
      /**
       * 绘制 echart 柱状图
       */
      async drawEchartLine(data, draw_start_y, space_x_left = 0, unit = '元', customData = null) {
        const ctx = this.ctx
        const dataLen = data.length // 柱子个数
        const bar_w = this.rpx2px(20) // 柱子的宽度
        let bar_max_h = this.rpx2px(260) // 柱状图最大的高度
        let yAxis_w = space_x_left || this.rpx2px(40) // y轴占用宽度

        let y = draw_start_y // y轴开始坐标
        if (screenHeight < 736) {
          y = y - this.rpx2px(80)
        }

        let maxValue = this.getMaxValue(data) // 数据中的最大值

        // 绘制y轴
        const renderYAxis = () => {
          ctx.setFontSize(this.rpx2px(20))
          ctx.fillStyle = 'rgba(52, 0, 1, 0.8)'
          ctx.setTextBaseline('left')
          ctx.fillText('0', this.spaceScreenLeft, y + bar_max_h)
          ctx.fillText(maxValue / 2 + '', this.spaceScreenLeft, y + bar_max_h / 2)
          ctx.fillText(maxValue + '', this.spaceScreenLeft, y)
          ctx.fillText('单位：' + unit, screenWidth - this.spaceScreenLeft - this.rpx2px(80), y - this.rpx2px(40))
          const metrics = ctx.measureText(maxValue + '')
          yAxis_w += metrics.width
        }
        renderYAxis()

        let x = this.rpx2px(10) + yAxis_w + this.spaceScreenLeft // 柱状图区域的左上角x坐标

        // 柱子之间的间距
        let spacing = Math.floor(
          (screenWidth - yAxis_w - this.spaceScreenLeft * 2 - bar_w * dataLen - this.rpx2px(20)) / (dataLen - 1)
        )

        // 绘制x轴
        const renderXAxis = async () => {
          ctx.lineWidth = 1
          ctx.beginPath() // 新建一条path
          ctx.setStrokeStyle('rgba(207, 18, 20, 0.1)')
          ctx.moveTo(x - this.rpx2px(10), y + bar_max_h) // 把画笔移动到指定的坐标
          ctx.lineTo(x + this.rpx2px(10 + 10 - 10) + bar_w * dataLen + spacing * (dataLen - 1), y + bar_max_h) // 绘制一条从当前位置到指定坐标的直线
          ctx.closePath() // 闭合路径。会拉一条从当前点到path起始点的直线。如果当前点与起始点重合，则什么都不做
          ctx.stroke() //绘制路径。
        }
        renderXAxis()

        let max_value_in_data = 0

        data.forEach(({ value }) => {
          if (value > max_value_in_data) {
            max_value_in_data = value
          }
        })

        let isDrewMax = false
        let drewMaxIndex = -1

        // 绘制柱状图
        for (let index = 0; index < data.length; index++) {
          const { value, name } = data[index]

          let bar_h = 0
          if (maxValue) {
            bar_h = Math.floor((value / maxValue) * bar_max_h)
          }

          let startX = x + (bar_w + spacing) * index // 计算柱子的起始x坐标
          let startY = y + (bar_max_h - bar_h) // 计算柱子的起始y坐标

          ctx.setFillStyle('rgba(255,174,102,0.1)') // 设置柱子的背景颜色
          ctx.fillRect(startX, y, bar_w, bar_max_h) // 绘制背景柱子

          if (osName === 'ios') {
            const grd = ctx.createLinearGradient(startX, startY, startX + bar_w, startY + bar_h)
            grd.addColorStop(0, '#ff3506')
            grd.addColorStop(1, '#ff9e14')
            ctx.setFillStyle(grd)
          } else {
            ctx.setFillStyle('#ff3506')
          }
          ctx.fillRect(startX, startY, bar_w, bar_h) // 绘制柱子

          ctx.setFontSize(this.rpx2px(20))
          ctx.fillStyle = 'rgba(52, 0, 1, 0.8)'
          ctx.setTextAlign('center')
          ctx.setTextBaseline('middle')
          ctx.fillText(name, startX + bar_w / 2, startY + bar_h + this.rpx2px(20))
          ctx.setTextAlign('left')

          if (customData) {
            if (customData.firstGrantMonth === name) {
              drewMaxIndex = index
            }
          } else {
            if (value === max_value_in_data) {
              drewMaxIndex = index
            }
          }
          // 绘制最大值
          if (!isDrewMax && drewMaxIndex == index) {
            isDrewMax = true
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.setLineDash([]) // 设置虚线样式
            ctx.setStrokeStyle('rgba(207, 18, 20, 0.8)')
            ctx.setFillStyle('rgba(207, 18, 20, 0.8)')
            ctx.moveTo(startX + bar_w / 2, y - this.rpx2px(20))
            ctx.lineTo(startX + bar_w / 2, y + bar_max_h - this.rpx2px(2))
            ctx.closePath()
            ctx.stroke()
            await this.drawImage(
              imageIconDialogBox,
              startX - this.rpx2px(172 / 2 - 8),
              y - this.rpx2px(14 + 93),
              this.rpx2px(172),
              this.rpx2px(93)
            )
            ctx.fillStyle = '#cf1214'
            ctx.setTextAlign('center')
            ctx.setTextBaseline('middle')
            let drawText = value + ''
            if (customData) {
              drawText = '首笔：' + customData.firstGrantAmount
              ctx.setFontSize(this.rpx2px(20))
            } else {
              ctx.setFontSize(this.rpx2px(30))
            }
            ctx.fillText(drawText, startX + bar_w / 2 - this.rpx2px(10), y - this.rpx2px(93 / 2 + 28))
            ctx.setTextAlign('left')

            const vW = ctx.measureText(drawText).width
            ctx.setFontSize(this.rpx2px(18))
            ctx.fillText(unit, startX + bar_w / 2 + vW / 2 - this.rpx2px(6), y - this.rpx2px(93 / 2 + 28))
          }
        }

        ctx.draw(true)

        return Promise.resolve(true)
      },
      /**
       *绘制 echart 饼图
       */
      async drawEchartPie(data, draw_start_y) {
        const ctx = this.ctx

        // 绘制扇形图
        let radius = this.rpx2px(218 / 2) // 扇形的半径
        let centerX = this.rpx2px(180) // 饼状图中心点的X坐标
        let centerY = draw_start_y // 饼状图中心点的Y坐标

        const color = ['#e03637', '#fd6534', '#ffc066']
        if (screenHeight < 736) {
          centerY = centerY - this.rpx2px(160)
        }

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

          ctx.setFontSize(this.rpx2px(24))
          ctx.fillStyle = '#340001'
          ctx.setTextAlign('left')
          ctx.setTextBaseline('middle')
          let text = `${name}：${value}元   ${new Big(100).times(percent[i])}%`
          ctx.fillText(text, centerX + radius + this.rpx2px(96), centerY - radius + this.rpx2px(38 * i + 36 + 12))

          ctx.beginPath()
          ctx.rect(
            centerX + radius + this.rpx2px(60),
            centerY - radius + this.rpx2px(38 * i + 36 + 4),
            this.rpx2px(16),
            this.rpx2px(16)
          )
          ctx.setFillStyle(color[i])
          ctx.closePath()
          ctx.fill()
        }

        if (data.length) {
          ctx.beginPath()
          ctx.setFillStyle('#fff')
          ctx.moveTo(centerX, centerY)
          ctx.arc(centerX, centerY, clearRadius, 0, totalAngle, false) // 绘制扇形
          ctx.closePath()
          ctx.fill()
        }

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
          screenHeight,
          screenWidth * pixelRatio,
          screenHeight * pixelRatio,
          'page',
          null
        ).then((res) => {
          const currentStep = this.currentStep
          this.shareScreenshots[currentStep - 2] = res.tempFilePath

          // showToast('图片生成成功')
          // saveImageToPhotosAlbum(res.tempFilePath)
          //   .then(() => {
          //     showToast('保存成功')
          //   })
          //   .catch((err) => {
          //     showModal(JSON.stringify(err))
          //     showToast('保存失败')
          //   })
        })
      },
      /**
       * 绘制第一个页面
       */
      async drawPage01() {
        showLoading('生成中')
        await this.drawPageBg(0)
        await this.drawImageSponsor()

        const ctx = this.ctx

        const { textList } = this.yearData.page1

        // 绘画内容已经占有的高度 默认上边距 15 为文字一半的高度
        let drawH = this.spaceScreenTop + this.rpx2px(54 + 15 + 90)

        await this.drawLineText(textList, drawH)

        hideLoading()
        ctx.draw(
          true,
          // 添加setTimeout防止某些机型由于绘制速度太快无法进入draw的回调函数
          setTimeout(() => {
            this.savePage()
          }, 300)
        )
      },
      /**
       * 绘制第二个页面
       */
      async drawPage02() {
        showLoading('生成中')
        await this.drawPageBg(1)

        const ctx = this.ctx

        const { textList, lineList, pieList, firstGrantMonth, firstGrantAmount } = this.yearData.page2

        // 绘画内容已经占有的高度 默认上边距 15 为文字一半的高度
        let drawH = this.spaceScreenTop + this.rpx2px(54 + 15 - 16)

        // 绘制文字
        await this.drawLineText(textList, drawH)

        // 绘制柱状图
        const y = this.rpx2px(496) + statusBarHeight
        await this.drawEchartLine(lineList, y, this.rpx2px(10), '元', { firstGrantMonth, firstGrantAmount })

        // 绘制饼图
        const y_pie = this.rpx2px(1166) + statusBarHeight
        await this.drawEchartPie(pieList, y_pie)

        hideLoading()
        ctx.draw(
          true,
          // 添加setTimeout防止某些机型由于绘制速度太快无法进入draw的回调函数
          setTimeout(() => {
            this.savePage()
          }, 300)
        )
      },
      /**
       * 绘制第3个页面
       */
      async drawPage03() {
        showLoading('生成中')
        await this.drawPageBg(2)

        const ctx = this.ctx

        const { textList } = this.yearData.page3

        // 绘画内容已经占有的高度 默认上边距 15 为文字一半的高度
        let drawH = this.spaceScreenTop + this.rpx2px(54 + 15 - 16)

        await this.drawLineText(textList, drawH)
        hideLoading()
        ctx.draw(
          true,
          // 添加setTimeout防止某些机型由于绘制速度太快无法进入draw的回调函数
          setTimeout(() => {
            this.savePage()
          }, 300)
        )
      },
      /**
       * 绘制第4个页面
       */
      async drawPage04() {
        showLoading('生成中')
        await this.drawPageBg(3)

        const ctx = this.ctx

        const { textList, textList2, chi031List } = this.yearData.page4

        const drawRoundedRectShadow = {
          offsetX: 0,
          offsetY: this.rpx2px(8),
          blur: this.rpx2px(12),
          color: 'rgba(207, 18, 20, 0.06)'
        }

        // 绘画内容已经占有的高度 默认上边距 15 为文字一半的高度
        let drawH = this.spaceScreenTop + this.rpx2px(54 + 15 - 16)

        // 绘制文本
        await this.drawLineText(textList, drawH)

        // 绘制补贴项目列表
        const items = []
        const renderChi031 = async () => {
          // tag 间距总和
          const space = parseInt(this.rpx2px(48))
          // tag 最大宽度
          const maxWidth = parseInt(screenWidth - this.spaceScreenLeft * 2)

          // 绘制白色背景色
          let x = parseInt(this.spaceScreenLeft),
            y = parseInt(drawH + this.rpx2px(148 + 30)),
            h = parseInt(this.rpx2px(66)),
            r = parseInt(this.rpx2px(33))

          if (textList.length < 3) {
            y = y - parseInt(this.rpx2px(50))
          }

          for (let i = 0; i < chi031List.length; i++) {
            const { chi031Desc } = chi031List[i]

            // 当前item宽度
            let currentItemWidth = 0
            // 下一个item宽度
            let nextItemWidth = 0

            ctx.setFontSize(this.rpx2px(28))
            ctx.setTextBaseline('middle')

            const metrics_current = ctx.measureText(chi031Desc)
            currentItemWidth = metrics_current.width + space

            const nextItem = chi031List[i + 1]
            if (nextItem && nextItem.chi031Desc) {
              const metrics_next = ctx.measureText(nextItem.chi031Desc)
              nextItemWidth = metrics_next.width + space
            }

            // 记录item高宽坐标
            items.push({
              w: currentItemWidth > maxWidth ? maxWidth : currentItemWidth,
              h,
              x,
              y
            })

            // 文字大于最大宽度 换行处理
            if (currentItemWidth > maxWidth) {
              currentItemWidth = maxWidth
              let w = 0
              let lastSubStrIndex = 0 //每次开始截取的字符串的索引
              // 查找文字截取节点

              // 绘制白色背景色
              await this.drawRoundedRect(
                ctx,
                x,
                y,
                currentItemWidth,
                h + this.rpx2px(32),
                r,
                '#fff',
                drawRoundedRectShadow
              )

              for (let i = 0; i < chi031Desc.length; i++) {
                w += ctx.measureText(chi031Desc[i]).width
                if (w > maxWidth - space) {
                  ctx.fillStyle = '#340001'
                  ctx.fillText(chi031Desc.substring(lastSubStrIndex, i), x + space / 2, y + h / 2) //绘制截取部分
                  y += this.rpx2px(32)
                  w = 0
                  lastSubStrIndex = i
                }
                if (i == chi031Desc.length - 1) {
                  // 绘制剩余部分
                  ctx.fillStyle = '#340001'
                  ctx.fillText(chi031Desc.substring(lastSubStrIndex, i + 1), x + space / 2, y + h / 2)
                }
              }
            } else {
              // 绘制白色背景色
              await this.drawRoundedRect(ctx, x, y, currentItemWidth, h, r, '#fff', drawRoundedRectShadow)

              // 绘制文字
              ctx.fillStyle = '#340001'
              ctx.fillText(chi031Desc, x + space / 2, y + h / 2)
            }

            // 宽度不能够再放一个 换行
            if (x + currentItemWidth + nextItemWidth + this.rpx2px(40) > maxWidth) {
              x = parseInt(this.spaceScreenLeft)
              y = parseInt(y + h + this.rpx2px(24))
            } else {
              x = parseInt(x + currentItemWidth + this.rpx2px(40))
            }

            if (i + 1 === chi031List.length) {
              y = parseInt(y + h)
            }
          }
          drawH = y + this.rpx2px(100)
          return Promise.resolve(true)
        }

        // 绘制补贴项目政策更新动态
        const renderChi031Status = async () => {
          const _space = this.rpx2px(18)
          let _h = parseInt(this.rpx2px(36)),
            r = parseInt(this.rpx2px(18))

          for (let i = 0; i < chi031List.length; i++) {
            const { time } = chi031List[i]

            let currentItemWidth = 0
            if (time) {
              let text = `更新${time}次`
              ctx.setFontSize(this.rpx2px(24))
              ctx.setTextBaseline('middle')
              const metrics = ctx.measureText(text)

              currentItemWidth = metrics.width + _space
              const { x, y, w, h } = items[i]

              let _x = x + w - this.rpx2px(40)
              let _y = y - _h / 2

              if (w >= screenWidth - this.spaceScreenLeft * 2 - this.rpx2px(10)) {
                _x = _x - currentItemWidth + this.rpx2px(70)
              }

              await this.drawImage(imageIconTag, _x, _y, this.rpx2px(112), _h)

              // 绘制文字
              ctx.fillStyle = '#ffffff'
              ctx.fillText(text, _x + _space / 2, _y + _h / 2)
            }
          }
          return Promise.resolve(true)
        }

        await renderChi031()
        await renderChi031Status()

        // 绘制文本
        await this.drawLineText(textList2, drawH)

        hideLoading()
        ctx.draw(
          true,
          // 添加setTimeout防止某些机型由于绘制速度太快无法进入draw的回调函数
          setTimeout(() => {
            this.savePage()
          }, 600)
        )
      },
      /**
       * 绘制第5个页面
       */
      async drawPage05() {
        showLoading('生成中')
        await this.drawPageBg(4)

        const ctx = this.ctx

        const { textList, villageInfo } = this.yearData.page5

        // 绘制虚线边框圆角矩形
        const drawRoundedRect2 = (ctx, x, y, w, h, r) => {
          let width = w // 矩形的宽度
          let height = h // 矩形的高度
          let radius = r // 左上角和右下角的圆角半径
          let borderWidth = 1 // 边框线的宽度
          let borderColor = 'rgba(207, 18, 20, 0.6)' // 边框颜色
          let lineDash = [3, 3] // 虚线的线段长度和间距

          ctx.setLineDash(lineDash) // 设置虚线样式
          ctx.setStrokeStyle(borderColor) // 设置边框颜色
          ctx.setLineWidth(borderWidth) // 设置边框宽度
          ctx.beginPath()
          ctx.moveTo(x + radius, y)
          ctx.lineTo(x + width - radius, y)
          ctx.arc(x + width - radius, y + radius, radius, -Math.PI / 2, 0)
          ctx.lineTo(x + width, y + height - radius)
          ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2)
          ctx.lineTo(x + radius, y + height)
          ctx.arc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI)
          ctx.lineTo(x, y + radius)
          ctx.arc(x + radius, y + radius, radius, Math.PI, (Math.PI * 3) / 2)
          ctx.closePath()
          ctx.stroke()
          ctx.draw(true)
        }

        // 绘画内容已经占有的高度 默认上边距 15 为文字一半的高度
        let drawH = this.spaceScreenTop + this.rpx2px(54 + 15 - 16)

        await this.drawLineText(textList, drawH)

        // 绘制白色背景圆角矩形
        let x = parseInt(this.spaceScreenLeft),
          y = parseInt(drawH + this.rpx2px(80)),
          w = parseInt(screenWidth - this.spaceScreenLeft * 2),
          h = parseInt(this.rpx2px(162)),
          r = parseInt(this.rpx2px(16))
        await this.drawRoundedRect(ctx, x, y, w, h, r)

        // 绘制村庄icon
        await this.drawImage(
          imageIconVillage,
          x + this.rpx2px(32),
          y + this.rpx2px(32),
          this.rpx2px(98),
          this.rpx2px(98)
        )

        // 绘制村社信息
        const { name, rank, number } = villageInfo
        let textX = x + this.rpx2px(154)

        // 绘制村庄名称
        ctx.setFontSize(this.rpx2px(36))
        ctx.fillStyle = 'rgba(52, 0, 1, 1)'
        ctx.setTextBaseline('middle')
        ctx.fillText(name, textX, y + this.rpx2px(42 + 18))

        // 绘制文字----关注人数在全市排名第
        let textW = 0
        let textY = y + this.rpx2px(96 + 14)
        let rankText_01 = '关注人数在全市排名第'
        ctx.setFontSize(this.rpx2px(28))
        ctx.fillStyle = 'rgba(52, 0, 1, 0.8)'
        ctx.fillText(rankText_01, textX + textW, textY)
        textW += ctx.measureText(rankText_01).width

        // 绘制文字
        let rankText_02 = ` ${rank} `
        ctx.setFontSize(this.rpx2px(34))
        ctx.fillText(rankText_02, textX + textW, textY)
        textW += ctx.measureText(rankText_02).width

        // 绘制文字----位
        let rankText_03 = '位'
        ctx.setFontSize(this.rpx2px(28))
        ctx.fillText(rankText_03, textX + textW, textY)

        // 绘制排名icon
        if (rank <= 3 && rank > 0) {
          let rankPath = ''
          if (rank === 1) {
            rankPath = imageIconRank01
          }
          if (rank === 2) {
            rankPath = imageIconRank02
          }
          if (rank === 3) {
            rankPath = imageIconRank03
          }
          await this.drawImage(rankPath, x + this.rpx2px(580), y + this.rpx2px(2), this.rpx2px(60), this.rpx2px(73))
        }

        // 绘制虚线边框圆角矩形
        let _x = parseInt(this.spaceScreenLeft),
          _y = parseInt(y + h + this.rpx2px(338)),
          _w = parseInt(screenWidth - this.spaceScreenLeft * 2),
          _h = parseInt(this.rpx2px(162)),
          _r = parseInt(this.rpx2px(16))
        drawRoundedRect2(ctx, _x, _y, _w, _h, _r)

        // 绘制表情
        let _text_01 = ''
        let emotePath = ''
        if (number >= 10) {
          _text_01 = `${name}使用小程序的人真多呀，`
          emotePath = imageIconEmote02
        } else {
          _text_01 = `${name}使用小程序的人还不多哦，`
          emotePath = imageIconEmote01
        }

        await this.drawImage(emotePath, _x + this.rpx2px(32), _y + this.rpx2px(32), this.rpx2px(102), this.rpx2px(102))

        ctx.setFontSize(this.rpx2px(28))
        ctx.fillStyle = 'rgba(52, 0, 1, 1)'
        ctx.fillText(_text_01, _x + this.rpx2px(136), _y + this.rpx2px(40 + 14))
        ctx.fillText('快去把小程序分享给更多好邻居吧～', _x + this.rpx2px(136), _y + this.rpx2px(40 + 14 + 52))

        hideLoading()
        ctx.draw(
          true,
          // 添加setTimeout防止某些机型由于绘制速度太快无法进入draw的回调函数
          setTimeout(() => {
            this.savePage()
          }, 600)
        )
      },
      /**
       * 绘制第6个页面
       */
      async drawPage06() {
        showLoading('生成中')
        await this.drawPageBg(5)

        const ctx = this.ctx

        const { textList, lineList } = this.yearData.page6

        // 绘画内容已经占有的高度 默认上边距 15 为文字一半的高度
        let drawH = this.spaceScreenTop + this.rpx2px(54 + 15 - 16)

        // 绘制文字
        await this.drawLineText(textList, drawH)

        // 绘制柱状图
        const y = this.rpx2px(496) + statusBarHeight
        await this.drawEchartLine(lineList, y, this.rpx2px(60), '次')
        hideLoading()
        ctx.draw(
          true,
          // 添加setTimeout防止某些机型由于绘制速度太快无法进入draw的回调函数
          setTimeout(() => {
            this.savePage()
          }, 300)
        )
      },
      /**
       * 绘制最后一个页面
       */
      async drawPageLast() {
        showLoading('生成中')
        await this.drawPageBg(6)
        await this.drawImageSponsor()

        const ctx = this.ctx

        // 绘画内容已经占有的高度 默认上边距 15 为文字一半的高度
        let drawH = this.spaceScreenTop + this.rpx2px(54 + 30 + 10)

        const data = {
          width: screenWidth - this.spaceScreenLeft * 2,
          height: this.rpx2px(1008)
        }

        if (screenHeight <= 736) {
          data.height = this.rpx2px(900)
        }

        // 绘制白色背景色
        let x = parseInt(this.spaceScreenLeft),
          y = parseInt(drawH),
          w = parseInt(data.width),
          h = parseInt(data.height),
          r = parseInt(this.rpx2px(16))
        await this.drawRoundedRect(ctx, x, y, w, h, r)

        // 绘制图片
        let imgTextW = this.rpx2px(524)
        let imgTextH = this.rpx2px(108)
        if (screenHeight <= 736) {
          imgTextW = this.rpx2px(460)
          imgTextH = this.rpx2px(94)
        }
        const imgTextX = (screenWidth - imgTextW) / 2
        drawH = drawH + this.rpx2px(40)
        await this.drawImage(imageText02, imgTextX, drawH, imgTextW, imgTextH)

        drawH = drawH + imgTextH + this.rpx2px(34)

        // 绘制图片
        let imgW = this.rpx2px(590)
        let imgH = this.rpx2px(648)
        if (screenHeight <= 736) {
          imgW = this.rpx2px(500)
          imgH = this.rpx2px(550)
        }
        const imgX = (screenWidth - imgW) / 2
        await this.drawImage(imageImg01, imgX, drawH, imgW, imgH)

        // 绘制图片 二维码
        drawH = drawH + imgH + this.rpx2px(26)
        let qrTipText = '微信扫码查看我的年度盘点'
        let imgQRW = this.rpx2px(120)
        let imgQRH = this.rpx2px(120)
        let imgQRX = (screenWidth - imgQRW - this.rpx2px(34 + 26 * qrTipText.length)) / 2
        // console.log(`${IMAGE_QR}/${areaCode}.jpg`, 999)
        await this.drawImage(`${IMAGE_QR}/${areaCode}.jpg`, imgQRX, drawH, imgQRW, imgQRH)

        // 绘制文字 微信扫一扫进入小程序
        drawH = drawH + imgQRH / 2
        ctx.setFontSize(this.rpx2px(26))
        ctx.fillStyle = '#5e0d0e'
        ctx.setTextBaseline('middle')
        ctx.fillText(qrTipText, imgQRX + imgQRW + this.rpx2px(34), drawH)

        hideLoading()
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
        const isDrawPage2 = this.isDrawPage2
        const isDrawPage3 = this.isDrawPage3
        const isDrawPage4 = this.isDrawPage4
        const isDrawPage5 = this.isDrawPage5
        const isDrawPage6 = this.isDrawPage6

        // console.log(currentStep, '===currentStep===')
        // 绘制第一页
        if (currentStep == 2) {
          this.drawPage01()
        }

        // 绘制第二页
        if (currentStep == 3) {
          if (isDrawPage2) {
            this.drawPage02()
          } else {
            if (isDrawPage3) {
              this.drawPage03()
            } else {
              if (isDrawPage4) {
                this.drawPage04()
              } else {
                if (isDrawPage5) {
                  this.drawPage05()
                } else {
                  if (isDrawPage6) {
                    this.drawPage06()
                  } else {
                    this.drawPageLast()
                  }
                }
              }
            }
          }
        }

        // 绘制第三页
        if (currentStep == 4) {
          if (isDrawPage2) {
            if (isDrawPage3) {
              this.drawPage03()
            } else {
              if (isDrawPage4) {
                this.drawPage04()
              } else {
                if (isDrawPage5) {
                  this.drawPage05()
                } else {
                  if (isDrawPage6) {
                    this.drawPage06()
                  } else {
                    this.drawPageLast()
                  }
                }
              }
            }
          } else {
            if (isDrawPage3) {
              if (isDrawPage4) {
                this.drawPage04()
              } else {
                if (isDrawPage5) {
                  this.drawPage05()
                } else {
                  if (isDrawPage6) {
                    this.drawPage06()
                  } else {
                    this.drawPageLast()
                  }
                }
              }
            } else {
              if (isDrawPage4) {
                if (isDrawPage5) {
                  this.drawPage05()
                } else {
                  if (isDrawPage6) {
                    this.drawPage06()
                  } else {
                    this.drawPageLast()
                  }
                }
              } else {
                if (isDrawPage5) {
                  if (isDrawPage6) {
                    this.drawPage06()
                  } else {
                    this.drawPageLast()
                  }
                } else {
                  if (isDrawPage6) {
                    this.drawPageLast()
                  }
                }
              }
            }
          }
        }

        // 绘制第四页
        if (currentStep == 5) {
          if (isDrawPage2) {
            if (isDrawPage3) {
              if (isDrawPage4) {
                this.drawPage04()
              } else {
                if (isDrawPage5) {
                  this.drawPage05()
                } else {
                  if (isDrawPage6) {
                    this.drawPage06()
                  } else {
                    this.drawPageLast()
                  }
                }
              }
            } else {
              if (isDrawPage4) {
                if (isDrawPage5) {
                  this.drawPage05()
                } else {
                  if (isDrawPage6) {
                    this.drawPage06()
                  } else {
                    this.drawPageLast()
                  }
                }
              } else {
                if (isDrawPage5) {
                  if (isDrawPage6) {
                    this.drawPage06()
                  } else {
                    this.drawPageLast()
                  }
                } else {
                  if (isDrawPage6) {
                    this.drawPageLast()
                  }
                }
              }
            }
          } else {
            if (isDrawPage3) {
              if (isDrawPage4) {
                if (isDrawPage5) {
                  this.drawPage05()
                } else {
                  if (isDrawPage6) {
                    this.drawPage06()
                  } else {
                    this.drawPageLast()
                  }
                }
              } else {
                if (isDrawPage5) {
                  if (isDrawPage6) {
                    this.drawPage06()
                  } else {
                    this.drawPageLast()
                  }
                } else {
                  if (isDrawPage6) {
                    this.drawPageLast()
                  }
                }
              }
            } else {
              if (isDrawPage4) {
                if (isDrawPage5) {
                  if (isDrawPage6) {
                    this.drawPage06()
                  } else {
                    this.drawPageLast()
                  }
                } else {
                  if (isDrawPage6) {
                    this.drawPageLast()
                  }
                }
              } else {
                if (isDrawPage5) {
                  if (isDrawPage6) {
                    this.drawPageLast()
                  }
                }
              }
            }
          }
        }

        // 绘制第五页
        if (currentStep == 6) {
          if (isDrawPage2) {
            if (isDrawPage3) {
              if (isDrawPage4) {
                if (isDrawPage5) {
                  this.drawPage05()
                } else {
                  if (isDrawPage6) {
                    this.drawPage06()
                  } else {
                    this.drawPageLast()
                  }
                }
              } else {
                if (isDrawPage5) {
                  if (isDrawPage6) {
                    this.drawPage06()
                  } else {
                    this.drawPageLast()
                  }
                } else {
                  if (isDrawPage6) {
                    this.drawPageLast()
                  }
                }
              }
            } else {
              if (isDrawPage4) {
                if (isDrawPage5) {
                  if (isDrawPage6) {
                    this.drawPage06()
                  } else {
                    this.drawPageLast()
                  }
                } else {
                  if (isDrawPage6) {
                    this.drawPageLast()
                  }
                }
              } else {
                if (isDrawPage5) {
                  if (isDrawPage6) {
                    this.drawPageLast()
                  }
                }
              }
            }
          } else {
            if (isDrawPage3) {
              if (isDrawPage4) {
                if (isDrawPage5) {
                  if (isDrawPage6) {
                    this.drawPage06()
                  } else {
                    this.drawPageLast()
                  }
                } else {
                  if (isDrawPage6) {
                    this.drawPageLast()
                  }
                }
              } else {
                if (isDrawPage5) {
                  if (isDrawPage6) {
                    this.drawPageLast()
                  }
                }
              }
            } else {
              if (isDrawPage4) {
                if (isDrawPage5) {
                  if (isDrawPage6) {
                    this.drawPageLast()
                  }
                }
              }
            }
          }
        }

        // 绘制第六页
        if (currentStep == 7) {
          if (isDrawPage2) {
            if (isDrawPage3) {
              if (isDrawPage4) {
                if (isDrawPage5) {
                  if (isDrawPage6) {
                    this.drawPage06()
                  } else {
                    this.drawPageLast()
                  }
                } else {
                  if (isDrawPage6) {
                    this.drawPageLast()
                  }
                }
              } else {
                if (isDrawPage5) {
                  if (isDrawPage6) {
                    this.drawPageLast()
                  }
                }
              }
            } else {
              if (isDrawPage4) {
                if (isDrawPage5) {
                  if (isDrawPage6) {
                    this.drawPageLast()
                  }
                }
              }
            }
          } else {
            if (isDrawPage3) {
              if (isDrawPage4) {
                if (isDrawPage5) {
                  if (isDrawPage6) {
                    this.drawPageLast()
                  }
                }
              }
            }
          }
        }

        // 绘制第七页
        if (currentStep == 8) {
          this.drawPageLast()
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
        const canvasH = screenHeight * (this.totalStep - 1)

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
                    screenHeight * pixelRatio,
                    0,
                    screenHeight * i,
                    screenWidth,
                    screenHeight
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
       * 开启账单
       */
      async onClickOpen() {
        const { user_id } = this.userInfo
        if (user_id) {
          try {
            await this.getYearData()
            this.isShowCanvasSave = true
            this.currentStep = 2
          } catch (err) {
            // console.log(err)
          }
        } else {
          useJumpToLogin()
        }
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
      ...mapGetters([USER_INFO]),
      canvasStyle() {
        let str = ''
        const w = this.screenWidth
        const h = this.screenHeight
        const currentStep = this.currentStep
        const totalStep = this.totalStep

        if (w) {
          str += `width: ${w}px; `
        }
        if (h) {
          str += `heigth: ${h * (totalStep - 1)}px; `
        }

        if (currentStep) {
          str += `top: ${h * (currentStep - 1)}px; `
        }
        return str
      },
      // 总步骤
      totalStep() {
        let num = 8
        const isDrawPage2 = this.isDrawPage2
        const isDrawPage3 = this.isDrawPage3
        const isDrawPage4 = this.isDrawPage4
        const isDrawPage5 = this.isDrawPage5
        const isDrawPage6 = this.isDrawPage6

        if (!isDrawPage2) {
          num--
        }
        if (!isDrawPage3) {
          num--
        }
        if (!isDrawPage4) {
          num--
        }
        if (!isDrawPage5) {
          num--
        }
        if (!isDrawPage6) {
          num--
        }
        // console.log('num======', num)
        // console.log('isDrawPage2======', isDrawPage2)
        // console.log('isDrawPage3======', isDrawPage3)
        // console.log('isDrawPage4======', isDrawPage4)
        // console.log('isDrawPage5======', isDrawPage5)
        // console.log('isDrawPage6======', isDrawPage6)
        return num
      }
    },
    watch: {
      currentStep: {
        handler(val) {
          if (val > 1) {
            this.$nextTick(() => {
              this.initCanvas()
            })
          }
        },
        immediate: true
      }
    },
    // 分享给朋友
    onShareAppMessage(e) {
      return {
        title: this.currentYear + '年惠民惠农“一卡通”年度盘点来啦，快去看看吧！', // 转发标题
        path: '/pages/packageScan/annual-account/annual-account', // 转发路径
        query: 'type=share', // 自定义页面路径中携带的参数，如 path?a=1&b=2 的 “?” 后面部分
        imageUrl: imageShare // 自定义图片路径
      }
    },
    // 分享到朋友圈
    onShareTimeline(e) {
      return {
        title: this.currentYear + '年惠民惠农“一卡通”年度盘点来啦，快去看看吧！', // 转发标题
        path: '/pages/packageScan/annual-account/annual-account', // 转发路径
        query: 'type=share', // 自定义页面路径中携带的参数，如 path?a=1&b=2 的 “?” 后面部分
        imageUrl: imageShare // 自定义图片路径
      }
    }
  }
</script>

<style lang="scss" scoped>
  .annual-account {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: block;
    .pages {
      width: 100%;
      height: 100%;
      position: fixed;
      overflow: hidden;
      left: 0;
      top: 0;
      z-index: 2;
    }
    .canvas {
      width: 100%;
      height: 100%;
      transform: all 0.3s;
    }
    .canvas-save {
      position: fixed;
      width: 100%;
      height: 100%;
      visibility: hidden;
      z-index: -99;
    }
  }
</style>
