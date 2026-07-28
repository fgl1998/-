<template>
  <div class="home h5-page page-wrapper" :class="[themeName]">
    <div class="header">
      <div class="header-bg">
        <img class="d" :src="imageBg" alt="" />
      </div>
      <div class="header-con">
        <div class="user-info d-f fd-c ai-c jc-c">
          <div class="avatar-wrapper" @click="handleJumpRoute('login', 'packageCommon')">
            <ComponentAvatar :src="userInfo.avatarUrl"></ComponentAvatar>
            <div class="name">
              {{ getUserName }}
            </div>
          </div>
        </div>
        <div class="weather-wrapper">
          <ComponentWeather></ComponentWeather>
        </div>
        <div class="search d-f ai-c" v-if="!closePageModule.policyDocument" @click="handlePolicyRoute({ focus: '1' })">
          <div class="iconimg iconimg-search"></div>
          <div class="placeholder">搜索政策文件</div>
        </div>
      </div>
    </div>
    <!-- 消息订阅 -->
    <div class="subscribe-message-wrapper" v-if="false">
      <ComponentProjectCardSubscribeMessage></ComponentProjectCardSubscribeMessage>
    </div>

    <div class="service-wrapper" v-if="!closePageModule.subsidizedGoods">
      <ComponentPanel title="补贴商品专区" titleIconName="hot">
        <ComponentSubsidizedGoods></ComponentSubsidizedGoods>
      </ComponentPanel>
    </div>
    <div class="service-wrapper" v-if="!closePageModule.hotService">
      <ComponentPanel title="热门服务">
        <ComponentHotService :companyData="companyData"></ComponentHotService>
      </ComponentPanel>
    </div>

    <div class="service-wrapper" v-if="!closePageModule.convenientService">
      <ComponentPanel title="便捷服务">
        <ComponentConvenientService></ComponentConvenientService>
      </ComponentPanel>
    </div>

    <!-- 惠民快讯 -->
    <div class="news-wrapper" v-if="!closePageModule.news">
      <ComponentNews
        type="home"
        :renderData="newsList"
        :buttonName="getNewsButtonName"
        @click="handleJumpRoute('my-message', 'packageDetails', null, true)"></ComponentNews>
    </div>

    <div class="swiper-wrapper" v-if="!closePageModule.swiper">
      <ComponentSwiper :companyData="companyData"></ComponentSwiper>
    </div>

    <!-- 宜宾专有 热门申报项目 惠民快讯 -->
    <block v-if="areaCode === '511100'">
      <div class="service-content-wrapper">
        <ComponentPanel title="热门申报项目">
          <ComponentServiceContent></ComponentServiceContent>
        </ComponentPanel>
      </div>
      <div class="news-wrapper">
        <ComponentNewsLS></ComponentNewsLS>
      </div>
    </block>

    <!-- 内江首页帮助视频 -->
    <block v-if="!closePageModule.helpVideo">
      <div class="videos-wrapper">
        <ComponentVides></ComponentVides>
      </div>
    </block>

    <div class="policy-document-wrapper" v-if="!closePageModule.policyDocument">
      <ComponentPanel title="政策文件库" :buttonText="showPolicyDocument ? '查询全部' : ''" @click="handlePolicyRoute">
        <block v-if="showPolicyDocument">
          <block v-for="(item, index) in policyDocumentList" :key="index">
            <ComponentPolicyDoc :renderData="item"></ComponentPolicyDoc>
          </block>
        </block>
        <ComponentNoData tip="未查询到相关数据" v-else></ComponentNoData>
        <div class="button-wrppaer" v-if="showPolicyDocument">
          <ComponentButton circle type="primary" name="发现政策" height="68rpx" @click="handlePolicyRoute">
          </ComponentButton>
        </div>
      </ComponentPanel>
    </div>

    <block v-if="!closePageModule.leaveMessage">
      <ComponentAffix
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAABQVJREFUeF7lm1mIHVUQhr8ffdAH0QgKIoobgoL7vqHGBwWNYkTF9UEicUeJKFkUYzS4i8SNuLxoIEaiQgIuEJOgEXdcQBFExe1BQX1TESmpa9+hp3PvdPfp6pm+MwWXmcs9p07V1+ec7lNVLWa4aIb7z6QAMLPdgUOAXYFdch//7vIL8Gvu498/lfRT2xeoFQBmNgs4ATgJOAM4ONGRz4DXgLeALZJ+T9QztFsoADM7F7gCOA3YPtjYP4ENwLOSXo7SHQLAzC7JHJ8dZViJnjczEKuajtcIgJldmTl+bFNDEvu/m4F4KrF/2iZoZvsBdwMXpA4c3G8NsFjS13X11p4B2XRfDuxZd7CW238PLJJUa1nUAmBmK4DrWnakqfpHJV1fVUllAGb2HHBpVcVT3O55SZdVsaESADN7AriqisIOtXlS0tVl9pQCMLMHgAVlijr6+4OSbp7ItgkBmNmdwG0dda6qWcsk3T6s8VAAZnYWsK7qKB1vN0fS+kE2DgRgZtsBm4GjO+5YVfPeB06W9FexwzAA/pCzqKr2EWm3XNLiUgBmdirgz9rTUWZL2ph3bKsZYGYvdOgRN/oirJF04VAAZrYH8C2wTfTIHdH3L7C3pB/69oybAWZ2C3BvR4xty4xbJd03DMBHwOFBI28ClgbpeqRBVKlowseSjtgKgJkdAHwRZPAnkg4L0tVTY2ZbgOODdB4o6UvXNbYEzGwusDZogKWS7gjS1QdwCjBuB2+g/zxJLxUBXAM81kBpvusmSX47DRMzc+cdQoRcK+nxIoBlwJII7ZkO308GPn4mjHEOcGhCv2Fd7pLUO+Pkl4DH1eYFDtJlVU9L8njmOAB+8PED0EyQ9ZLmFAH4puBx/Zkg6ySdXQRwPzBh8CCBjD8LpEjUZjds7JWS5hcBePiotzMGyB8+myQlATCzYwCP+bclY7fp/CZ4ZuCu/YqkRsvJzDwM5+G4NmS+pJXFGXAQ4MnICFklqVEE2cz8TOJnkzZkLEKUnwE7Aj51I+Q3wJ+2UpfA/sBXEYYM0TFLUs/X4mnQsyoXBw6cBCDwiW+QKy9KGkvpFQFE7gOBHENVzc2n1wdFhLwY4cTQIbuj7EdgH0n/9E0aBCDydtgd1/+3ZIWkG/JGDQLgm6HfDbqW/W0K06++h8a/mRCA/2hmTsmjMNNJxu79pQAyCF50cP40ITBu568EIIPwM7DbiEPwyjKf+p8P8qMsOXok8MGIA5gn6ZlhPlRJj98IPDyiEAamwyovgX5DM/O9wPeEUZLVki4qM7h0BuQgHAV4lnUU5A1Jp1cxtDKAbFPcF/BaoeOqKJ+iNkskeXa7ktQCkEHY2YsTAY/Udkk80XG5pA/rGFUbQG5JeFjZS0+2rTNgS209krVgUAFE2XjJALLZ4BUkXkdUab2VGZPwu0eyPb6XnH9oBCA3G7ww0dfdDglOpHRp7Hh/0BAA2Wzwlx/8Svjdog35DvAAy9omV7xoWBiADIIFe+7vB3i5zgZJ7wXr7qkLA2Bm/mbIqwlGeg1B/pWZ3v+S/BWa1iUSQEpuMTyNXpdYJAA/de1Uw4Apdz5sCZhZnZzC31ld/0M1YLXWNGQGmNlCwF+iKJO3gYWS/G8nJArAOxXOB37F/Y0OnwGdkSgAE93+VgP+FocXOXVOogB4ceVeBe9eB+5JTY9NFqkoAF5scFOW0urVB3bd8T7gEACTdbXaGGfGA/gPRP19UK0pCEUAAAAASUVORK5CYII="
        label="我要留言"
        bottom="162rpx"
        @click="handleJumpRoute('question', 'packageMasses', null, true)"></ComponentAffix>
    </block>

    <!-- #ifdef MP-WEIXIN -->
    <block v-if="!closePageModule.publicityVideo">
      <ComponentAffix
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAABQ9JREFUeF7lm0moHUUUhv9/pYImjgFFBTUoomiCEDcKimIMChqHPIwJYkiIRkR0ZVAcQNGVgmBUUCM4RGOcQImKYkA3CsEgigPqJuLGeQBfVkf+x+lH3/tu367ururuyy14q1dd59R3q06fOvU30UEzs8MAHA3gGDf/C4BfSf7TtjtMadDMDgKwCsB1AE71SWviBxfYnRUI//sOwA4Au0keSOVndABmthjASgCX+sSLJhs6J0ERiHcBvEfyr9AHQ/pFA2BmZwHYAuAaAEeFGK/R5zcAuwBsI/lFjecXPNIYgJkt9Ylr8lrybTRtiW0O4vsmBmsDMLPjchM/ookTDZ79Iwfi5zrj1AJgZhe5YQW2PjQFzC0kP6zqTGUAZnY9gKfHRPKqPsTqr2C5keSLVQasBMDMtM8fr2Kgg763kFR8CGrBAMzsTgAPBY3afaetJB8OcSMIgJndBOCJkAF71Odmkk+W+VMKwMwuUQJSNlBP/7+S5PvjfBsLwMzOA/BxTycX6tb5JD8p6lwIwMzOAbAHwKGhlnra718AF5DcO8q/kQA8yfkAwOk9nVRVt74GcDHJBclSEYAHANxV1UrP+z9I8u5hHxcA8Nz+MwBdpbepOCptXkFy4OwwCsAjAG6P7MVXAJbkCiCRhw8e7lGSd+R7DwDwI61+/ZinujUkX5VRM7sNwL0dri6dIrUK5o/SwwCUOGwO5lne8WWSqgbNNzM7G8A9AK4qfzxJj6dIKrGba/MAzOxIANofMff+/STvGzUNM7vVQahE1mZTLFhK8vdhADcCeDayJ4UAfEuc6VtCVaQ22waS24cBqNR0dWQvxgLIbPkpU7FBgbKN9hrJOehzW8DMVLj8M3Lw09BBANwHJV2CMNMCAQXDw0nOZgAUqF5KYDgYQG41KAgLxLEJ/MkPuZbkjgyAXlMp9mFlAL4aVGoThLUJIewieW0G4HMAyxIYqwUgtxo2+Zvi+AS+7SO5PAOwH0AKI40A+GpQ2V2rYV1kCD+RPCED8F+iImdjALnVsMFBnBgJxCzJQ+gXlX9HGnR4mGgAfDWc5BBuiOTvIgHQoD9GGjApgNxqUBb5WASfTxaAFQA+jTDYqCGiroC8ATP7BsBpDf0+d5IBfAngjBgAJnELKCA+03DyenxuC0itMb1B0KPr9L4GHcDUJ0JTnwq/AmBNhKASJQ8wszYOQztJzmSp8JUA3ugDADNr6zi8muSbGQBVgVUQaaroqr0CzKzNgojEFCqIHMgXRVUPVF0wZgvKBDsoiW0nqVxioCqsGKBYELP1tSg6Q3LnMAAJHH+IrPHrY1lcWsNTMsFl6ouR50gObKveXox4QiS15/RejTmEFJej3/rFqG6fumzjL0cdgGpw03s97hCmVyDhAKQD/sg1/l0u2Vi2JaW9MFgi4xCkB347QXYYa1Kh4yjru7xIR1wmk5Mu+IVQSz3tt26cfjhEKDkJ+uAi9qW64VIAvh0mSSecwQjSCwcBcAiTpBcO0gkPnAVC9u+E6IZL9cH5uQavgOwh1w/v7qGEVpLYVeN0waN+5MoAfDtIR/x8j6S0ksKuL9IDj1vdtQDkkiW9IfQXU1kWshuzPt18NJX3cGo/mxv+mXIfTqqylGpF6BdXJac/H06OAKEj7xUALlMKGkF5JkWXUvJ3ALyVCRyr7JMkMSDEAZffrXZZrI7ZUoWGfjwt1errKtdLzhZir06f2kGwjrHcq7Q3n8//D+Cm9wZxAvDZAAAAAElFTkSuQmCC"
        label="宣传视频"
        bottom="80rpx"
        backgroundColor="#ffa500"
        @click="handlePlayVideo"></ComponentAffix>
    </block>
    <!-- #endif -->
    <!-- #ifdef H5 -->
    <block v-if="areaCode == '510100'">
      <div class="footer-text">本服务由四川省成都市人力资源和社会保障局提供</div>
    </block>
    <!-- #endif -->

    <!-- 预计停机通知弹窗 -->
    <ComponentPopupNotice></ComponentPopupNotice>

    <!-- 年度账单 -->
    <div
      class="year-total"
      @click="onClickOpenAnnualAccount"
      v-if="closePageModule.annualAccount === '1' || closePageModule.annualAccount === '2'">
      <img :src="imageAnnualAccountEntry" class="img" alt="" />
    </div>
  </div>
</template>
<script>
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
  import ComponentButton from '@/components/common/ez-button/ez-button.vue'
  import ComponentWeather from '@/components/common/ez-weather/ez-weather.vue'
  import ComponentAvatar from '@/components/common/ez-avatar/ez-avatar.vue'
  import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
  import ComponentPopupNotice from '@/components/common/ez-popup-notice/ez-popup-notice.vue'
  import ComponentHotService from '@/components/project/ez-hot-service/ez-hot-service.vue'
  import ComponentConvenientService from '@/components/project/ez-convenient-service/ez-convenient-service.vue'
  import ComponentServiceContent from '@/components/project/ez-service-content/ez-service-content.vue'
  import ComponentSubsidizedGoods from '@/components/project/ez-subsidized-goods/ez-subsidized-goods.vue'
  import ComponentNews from '@/components/project/ez-news/ez-news.vue'
  import ComponentNewsLS from '@/components/project/ez-news-ls/ez-news-ls.vue'
  import ComponentSwiper from '@/components/project/ez-swiper/ez-swiper.vue'
  import ComponentPolicyDoc from '@/components/project/ez-policy-doc/ez-policy-doc.vue'
  import ComponentAffix from '@/components/project/ez-affix/ez-affix.vue'
  import ComponentProjectCardSubscribeMessage from '@/components/project/card-subscribe-message/card-subscribe-message.vue'
  import ComponentVides from '@/components/common/ez-videos/ez-videos.vue'

  import { IMAGE_COMMON, IMAGE_ANNUAL_ACCOUNT } from '@/config/constants'
  import { getClosePageModule, getShareConfig } from '@/utils/get'
  import { navigateTo, setNavigationBarColor } from '@/utils/uni-api' // 封装过后的api，推荐使用。方便以后统一修改，便于维护。
  import { useTMUserName } from '@/hooks'

  import {
    requestB210,
    requestB258,
    requestFFGetDynamicByAac002,
    requestFFGetPolicyFileList,
    requestSPGetHi05List
  } from '@/service/api'
  import { USER_INFO, USER_LIST } from '@/store/constants' // 常量
  import { mapGetters } from 'vuex'
  import { useJumpToLogin } from '@/hooks'
  import { useGetUserInfoH5 } from '@/mixins'
  import config from '@/config'

  const imageBg = IMAGE_COMMON + 'bg-01.png'
  const imageAnnualAccountEntry = IMAGE_ANNUAL_ACCOUNT + '/logo.png'
  const { areaCode, isOpenYGFF, isRequestYGFF, themeName } = config

  export default {
    name: 'pageTabbarHome',
    mixins: [useGetUserInfoH5],
    data() {
      return {
        imageBg,
        imageAnnualAccountEntry,
        showid: [],
        // 最新消息列表 渲染数据
        newsList: [
          {
            name: '请登录后查看',
            aae036: ''
          }
        ],
        // 政策文件列表
        policyDocumentList: [],
        // 关闭页面某些模块配置
        closePageModule: {
          subsidizedGoods: false, // 补贴商品专区
          hotService: false, // 热门服务
          convenientService: false, // 便捷服务
          news: false, // 惠民快讯
          swiper: false, // 轮播图
          policyDocument: false, // 政策文件
          leaveMessage: false, // 我要留言
          publicityVideo: false, // 宣传视频
          helpVideo: true, // 帮助视频
          annualAccount: '0' // 年度盘点 0 关闭 1 简洁版 2 叙事版
        },
        // 页面分享配置
        shareConfig: {
          title: '一卡通', // 转发标题
          path: '/pages/tabbar/home/home?type=share', // 转发路径
          query: 'type=share', // 自定义页面路径中携带的参数，如 path?a=1&b=2 的 “?” 后面部分
          imageUrl: '' // 自定义图片路径
        },
        areaCode, // 区域编码
        themeName,
        companyData: []
      }
    },

    components: {
      ComponentPolicyDoc,
      ComponentProjectCardSubscribeMessage,
      ComponentSwiper,
      ComponentPanel,
      ComponentAvatar,
      ComponentWeather,
      ComponentHotService,
      ComponentConvenientService,
      ComponentServiceContent,
      ComponentNews,
      ComponentNewsLS,
      ComponentButton,
      ComponentNoData,
      ComponentSubsidizedGoods,
      ComponentAffix,
      ComponentPopupNotice,
      ComponentVides
    },
    onLoad(e) {
      this.closePageModule = {
        ...this.closePageModule,
        ...getClosePageModule(this)
      }
      if (themeName === 'gray') {
        setNavigationBarColor('#808080')
        // setTabBarStyle('#000', '#FFF', '#808080',)
      }
      this.getPolicyDocumentData()

      // 凉山获取宣传公司数据
      if (areaCode == '513400') {
        this.getCompanyData()
      }
    },
    onShow() {},
    onReady() {
      const shareConfig = getShareConfig(this)
      if (shareConfig) {
        this.shareConfig = { ...shareConfig }
      }
    },
    methods: {
      //获取凉山宣传公司列表
      async getCompanyData() {
        try {
          const res = await requestB258()
          this.companyData = res.lists.hp21DomainList.list
        } catch (err) {
          console.log(err)
        }
      },
      // 跳转路由到政策文件查询
      handlePolicyRoute(value = null) {
        let pathName = 'policy'

        // 特殊处理遂宁地市
        if (areaCode == '510900') {
          pathName = 'policy-sn'
        } else if (areaCode == '513400') {
          // 特殊处理凉山州地市
          pathName = 'policy-513400'
        }

        this.handleJumpRoute(pathName, 'packageQuery', value)
      },

      // 获取时间间隔
      getTimeSpace(startTime) {
        let timeStr = ''
        let dateBegin = new Date(startTime.replace(/-/g, '/'))
        let dateEnd = new Date()
        let dateDiff = dateEnd.getTime() - dateBegin.getTime()
        let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)) // 计算出相差天数
        let leave1 = dateDiff % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
        let hours = Math.floor(leave1 / (3600 * 1000)) // 计算出小时数
        var leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000)) // 计算相差分钟数
        if (dayDiff > 1) {
          timeStr = dayDiff + '天之前'
        } else if (hours > 1) {
          timeStr = hours + '小时之前'
        } else {
          timeStr = minutes + '分钟之前'
        }
        return timeStr
      },

      // 获取最新动态消息
      getNewsData(aac002) {
        const { news } = this.closePageModule
        // 设置默认值
        const setDefaultValue = () => {
          this.newsList = [
            {
              name: '您暂时没有新的消息',
              aae036: ''
            }
          ]
        }
        if (news || !isOpenYGFF) {
          setDefaultValue()
          return
        }

        requestFFGetDynamicByAac002(aac002, 1, 10, false, false)
          .then((res) => {
            const { list } = res
            if (list && list.length > 0 && list != undefined) {
              const newsList = [] // 零时存放数据
              list.map((item) => {
                const obj = {
                  name: item.chi031_desc,
                  aae017: item.aae017,
                  chb014: item.chb014,
                  time: this.getTimeSpace(item.aae036)
                }
                newsList.push(obj)
              })
              this.newsList = [...newsList]
            } else {
              setDefaultValue()
            }
          })
          .catch((err) => {
            setDefaultValue()
          })
      },

      // 获取政策文件列表
      getPolicyDocumentData() {
        if (areaCode === '513400') {
          requestB210('', '', '', 1, 3).then((res) => {
            const { list } = res.lists.hi70List
            this.policyDocumentList = [...list]
          })
        } else {
          if (isRequestYGFF) {
            requestFFGetPolicyFileList('', '', '', '', 1, 3, false).then((res) => {
              let { list } = res
              this.policyDocumentList = [...list]
            })
          } else {
            requestSPGetHi05List('', '', '', '', 1, 3, false).then((res) => {
              let { list } = res.lists.hi05List
              this.policyDocumentList = [...list]
            })
          }
        }
      },

      // 跳转路由
      handleJumpRoute(name, packageName, params = null, isAuth = false) {
        const { user_id } = this.userInfo

        // 用户已登录
        if (user_id) {
          // 处理 login 路由 已登录跳转个人中心
          if (name === 'login') {
            // 乐山特殊处理
            if (areaCode === '511100') {
              navigateTo('user-info-ls', 'packageCommon')
            } else {
              navigateTo('user-info', 'packageCommon')
            }
          } else {
            navigateTo(name, packageName, params)
          }
        } else {
          // 用户未登录
          // 该路由必须登录
          if (isAuth) {
            useJumpToLogin()
          } else {
            // 该路由无须登录
            navigateTo(name, packageName, params)
          }
        }
      },

      // 播放视频
      handlePlayVideo() {
        navigateTo('video', 'packageCommon')
      },

      /**
       * 进入年度账单
       */
      onClickOpenAnnualAccount() {
        const { user_id } = this.userInfo
        // 用户已登录
        if (user_id) {
          if (this.closePageModule.annualAccount === '1') {
            navigateTo('annual-account-simplify', 'packageScan')
          }
          if (this.closePageModule.annualAccount === '2') {
            navigateTo('annual-account', 'packageScan')
          }
        } else {
          useJumpToLogin()
        }
      }
    },
    computed: {
      ...mapGetters([USER_INFO, USER_LIST]),
      getUserName() {
        let str = '立即登录'
        const { userName } = this.userInfo
        if (userName) {
          str = useTMUserName(userName)
        }
        return str
      },
      getNewsButtonName() {
        let str = ''
        const newsList = this.newsList
        if (newsList.length > 1) {
          str = '去查看'
        }
        return str
      },
      // 根据是否有政策文件数据 展示可操作按钮
      showPolicyDocument() {
        let str = false
        const policyDocumentList = this.policyDocumentList
        if (policyDocumentList.length > 0) {
          str = true
        }
        return str
      }
    },
    watch: {
      'userInfo.user_id': {
        handler(val) {
          if (val) {
            const { idCard } = this.userInfo
            this.getNewsData(idCard)
          }
        },
        immediate: true
      }
    },
    // 分享给朋友
    onShareAppMessage(e) {
      return this.shareConfig
    },
    // 分享到朋友圈
    onShareTimeline(e) {
      return this.shareConfig
    }
  }
</script>

<style lang="scss" scoped>
  .home {
    position: relative;
    padding-bottom: $spacing;

    &.gray {
      -webkit-filter: grayscale(100%);
      -moz-filter: grayscale(100%);
      -ms-filter: grayscale(100%);
      -o-filter: grayscale(100%);
      filter: grayscale(100%);
      filter: gray;
    }

    /*  #ifdef  H5  */
    padding-bottom: $spacing + 100rpx;

    /*  #endif  */
    .header {
      .weather-wrapper {
        padding-top: 80rpx;
        padding-left: 32rpx;
        height: 42rpx + 80rpx;
      }

      .user-info {
        position: absolute;
        right: 56rpx;
        top: 28rpx;
      }

      .search {
        width: 690rpx;
        height: 84rpx;
        background-color: rgba(#ffffff, 0.53);
        border-radius: 42px;
        margin: auto;
        font-size: $font-size-base;
        margin-top: 30rpx;
        padding: 0 30rpx;
      }
    }

    .service-wrapper {
      padding-top: $spacing;
    }

    .news-wrapper {
      padding: $spacing $spacing 0;
    }

    .swiper-wrapper {
      margin-top: $spacing;
    }

    .service-content-wrapper {
      margin-top: $spacing;
    }

    .videos-wrapper {
      margin-bottom: $spacing;
    }

    .policy-document-wrapper {
      .button-wrppaer {
        padding: $spacing 0;
      }
    }
  }

  .faiding {
    .out-faiding {
      height: 80rpx;
      line-height: 80rpx;
      width: 100%;
      box-shadow: 1px 1px 4px;
      margin-bottom: 10rpx;
      position: relative;
      background: #6cb0f5;
      border-radius: 5rpx;
      padding-left: 20rpx;
      color: #fff;

      &::after {
        position: absolute;
        content: '';
        border-bottom: 1px solid #fff;
        border-left: 1px solid #fff;
        transform: rotate(45deg);
        width: 20rpx;
        height: 20rpx;
        top: 30rpx;
        right: 30rpx;
        transition: all 0.5s;
      }
    }

    .inner-faiding {
      max-height: 0;
      overflow: hidden;
      width: 100%;
      transition: max-height 0.5s;
    }

    .out-faiding-active {
      &::after {
        transform: rotate(-45deg);
      }
    }

    .inner-faiding-active {
      max-height: 100000rpx;
    }
  }

  .footer-text {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    font-size: 10px;
    color: #a1a7b3;
  }

  .year-total {
    position: fixed;
    right: 0;
    top: 200rpx;
    z-index: 999;
    .img {
      width: 162rpx;
      height: 162rpx;
    }
  }
</style>
