<template>
  <view class="ez-swiper-wrapper">
    <swiper class="swiper" :current="current" @change="handleChange" circular :autoplay="false">
      <block v-for="(item, index) in renderData" :key="index">
        <swiper-item class="swiper-item" :class="['item-' + item.id]" @click="handleJumpRoute(index)">
          <div class="swiper-item-bg">
            <ComponentImg :path="item.img" width="690rpx" height="206rpx"></ComponentImg>
          </div>
          <div class="swiper-item-content">
            <h2>
              {{ item.name_zh }}<span v-if="item.spanText" :style="item.spanTextStyle">{{ item.spanText }}</span>
            </h2>
            <div class="subTitle" v-if="item.subTitle">{{ item.subTitle }}</div>
            <button class="btn">{{ item.btnText }}</button>
          </div>
        </swiper-item>
      </block>
    </swiper>
    <div class="dots">
      <block v-for="(item, index) in renderData" :key="index">
        <div class="dot" :class="current === index ? 'active' : ''"></div>
      </block>
    </div>
  </view>
</template>

<script>
  import config from '@/config'

  import ComponentImg from '@/components/common/ez-img/ez-img.vue'
  import { navigateTo, switchTab } from '@/utils/uni-api' // 封装过后的api，推荐使用。方便以后统一修改，便于维护。

  import { USER_INFO } from '@/store/constants' // 常量
  import { mapGetters } from 'vuex'

  const imageStrPerfix = config.requestUrl + '/static/images/tabbar/home/'
  const image01 = imageStrPerfix + 'swiper-01.png'
  const image02 = imageStrPerfix + 'swiper-02.png'
  const image03 = imageStrPerfix + 'swiper-03.png'
  const image04 = imageStrPerfix + 'nav-16.png'
  /**
   * 轮播组件 仅限本项目使用
   * @description 轮播组件 仅限本项目使用
   */
  export default {
    name: 'ezSwiper',
    props: {
      companyData: {
        type: [Array],
        require: true
      }
    },
    data() {
      return {
        // 本地图片
        images: {
          swiper01: {
            src: image01, // 本地图片
            httpSrc: '' // 网络图片
          },
          swiper02: {
            src: image02, // 本地图片
            httpSrc: '' // 网络图片
          },
          swiper03: {
            src: image03, // 本地图片
            httpSrc: '' // 网络图片
          }
        },
        current: 0, // 轮播当前滚动位置
        areaName_zh: '四川'
      }
    },
    components: {
      ComponentImg
    },
    created() {
      const { areaName_zh } = config
      this.areaName_zh = areaName_zh
    },
    mounted() {},
    methods: {
      initRenderData() {
        const { areaCode } = config
        const areaName_zh = this.areaName_zh
        // 泸州
        if (areaCode === '510500') {
          const renderData = [
            {
              id: '01',
              name_zh: '残疾人“圆梦助学工程”（市级）',
              name_en: 'notice',
              packageName: 'packageDeclare',
              params: {
                chi031: '20582',
                chi031_desc: '残疾人“圆梦助学工程”（市级）',
                chi04z: '1'
              },
              tabbar: false,
              img: {
                src: image01, // 本地图片
                httpSrc: '' // 网络图片
              },
              btnText: '立即申报'
            },
            {
              id: '02',
              name_zh: ' 困难残疾人紧急救助金（县级）',
              name_en: 'notice',
              packageName: 'packageDeclare',
              params: {
                chi031: '20140',
                chi031_desc: ' 困难残疾人紧急救助金（县级）',
                chi04z: '1'
              },
              tabbar: false,
              img: {
                src: image02, // 本地图片
                httpSrc: '' // 网络图片
              },
              btnText: '立即申报'
            },
            {
              id: '03',
              name_zh: '雨露计划',
              name_en: 'notice',
              packageName: 'packageDeclare',
              params: {
                chi031: '20008',
                chi031_desc: '雨露计划',
                chi04z: '0'
              },
              tabbar: false,
              img: {
                src: image03, // 本地图片
                httpSrc: '' // 网络图片
              },
              btnText: '申报须知'
            }
          ]
          return renderData
        } else if (areaCode === '511100') {
          const renderData = [
            {
              id: '03',
              name_zh: areaName_zh + '惠民惠农阳光申报',
              name_en: 'sunshine-declare',
              packageName: 'tabbar',
              params: {},
              tabbar: true,
              img: {
                src: image01, // 本地图片
                httpSrc: '' // 网络图片
              },
              btnText: '我要查看'
            }
          ]
          return renderData
        } else if (areaCode === '513400') {
          const renderData = [
            {
              id: '01',
              name_zh: areaName_zh + '惠民惠农阳光申报公示',
              name_en: 'publicity',
              packageName: 'packageQuery',
              params: {},
              tabbar: false,
              img: {
                src: image01, // 本地图片
                httpSrc: '' // 网络图片
              },
              btnText: '我要查看'
            },
            {
              id: '02',
              name_zh: '回村看看',
              spanText: '见证家乡新变化',
              name_en: 'sunshine',
              packageName: 'tabbar',
              params: {},
              tabbar: true,
              img: {
                src: image02, // 本地图片
                httpSrc: '' // 网络图片
              },
              btnText: '立即前往'
            },
            {
              id: '03',
              name_zh: areaName_zh + '惠民惠农阳光审批',
              name_en: 'sunshine-declare',
              packageName: 'tabbar',
              params: {},
              tabbar: true,
              img: {
                src: image03, // 本地图片
                httpSrc: '' // 网络图片
              },
              btnText: '我要查看'
            }
          ]
          // 宣传公司数据
          for (let i = 0; i < this.companyData.length; i++) {
            const item = this.companyData[i]
            if (item.chp215 == '1') {
              // 是否配置轮播图
              renderData.push({
                id: item.chp216,
                name_zh: item.chp216, // 轮播主标题
                subTitle: item.chp217, // 轮播副标题
                name_en: 'company-detail',
                packageName: 'packageScan',
                params: {
                  title: item.chp216,
                  chp210: item.chp210,
                  chp21c: item.chp21c,
                  chp219: item.chp219
                },
                tabbar: false,
                img: {
                  src: image04, // 本地图片
                  httpSrc: '' // 网络图片
                },
                btnText: '立即前往'
              })
            }
          }
          return renderData
        } else {
          const renderData = [
            {
              id: '01',
              name_zh: areaName_zh + '惠民惠农阳光申报公示',
              name_en: 'publicity',
              packageName: 'packageQuery',
              params: {},
              tabbar: false,
              img: {
                src: image01, // 本地图片
                httpSrc: '' // 网络图片
              },
              btnText: '我要查看'
            },
            {
              id: '02',
              name_zh: '回村看看',
              spanText: '见证家乡新变化',
              name_en: 'sunshine',
              packageName: 'tabbar',
              params: {},
              tabbar: true,
              img: {
                src: image02, // 本地图片
                httpSrc: '' // 网络图片
              },
              btnText: '立即前往'
            },
            {
              id: '03',
              name_zh: areaName_zh + '惠民惠农阳光审批',
              name_en: 'sunshine-declare',
              packageName: 'tabbar',
              params: {},
              tabbar: true,
              img: {
                src: image03, // 本地图片
                httpSrc: '' // 网络图片
              },
              btnText: '我要查看'
            }
          ]
          return renderData
        }
      },
      // swiper change
      handleChange(e) {
        const { current } = e.detail
        this.current = current
      },
      // 跳转路由
      async handleJumpRoute(type) {
        const { closePages } = config
        let { name_en: name, packageName, params, tabbar, name_zh } = this.renderData[type]

        const jumpRoute = (name, packageName, params, tabbar) => {
          // 跳转 tababr 页面
          if (tabbar) {
            switchTab(name)
          } else {
            // 跳转 非tababr 页面
            navigateTo(name, packageName, params)
          }
        }

        const { chp210 } = params
        // 存在后端渲染的页面
        if (chp210) {
          navigateTo(name, packageName, params)
          return
        }
        // 存在 关闭页面筛选
        if (closePages && closePages.length > 0) {
          // 跳转路径为关闭的页面
          if (closePages.includes(`${packageName}/${name}`)) {
            navigateTo('not-found', 'packageCommon')
          } else {
            jumpRoute(name, packageName, params, tabbar)
          }
        } else {
          // 不存在 关闭页面筛选
          jumpRoute(name, packageName, params, tabbar)
        }
      }
    },
    computed: {
      ...mapGetters([USER_INFO]),
      renderData() {
        const resultData = this.initRenderData()
        return resultData
      }
    },
    watch: {}
  }
</script>

<style lang="scss" scoped>
  .ez-swiper-wrapper {
    padding-bottom: 40rpx;
    position: relative;
    .swiper {
      width: 100%;
      height: 206rpx;
    }
    .swiper-item {
      width: 100%;
      position: relative;
      padding: 0 30rpx;
      &.item-03 {
        .swiper-item-content {
          left: 50%;
          transform: translateX(-50%);
        }
        .btn {
          box-shadow: 1rpx 4rpx 1rpx 1rpx rgba(255, 142, 41, 0.68);
          margin: 0 auto;
        }
      }
    }
    .swiper-item-bg {
      width: 100%;
      img {
        width: 690rpx;
        width: 100%;
        height: 206rpx;
      }
    }
    .swiper-item-content {
      position: absolute;
      top: 0;
      left: 88rpx;
      white-space: nowrap;
      h2 {
        font-size: 36rpx;
        line-height: 48rpx;
        font-weight: 700;
        color: #ffffff;
        padding-top: 40rpx;
        padding-bottom: 14rpx;
        span {
          font-size: 24rpx;
          font-weight: 400;
          color: #ff6868;
          padding-left: 10px;
        }
      }
      .subTitle{
        color: #fff;
        font-size: 24rpx;
        padding: 10rpx;
        padding-top: 0;
      }
      .btn {
        width: 174rpx;
        height: 54rpx;
        line-height: 54rpx;
        background-color: #fcc93f;
        box-shadow: 0rpx 2rpx 6rpx 0rpx #001eb9;
        border-radius: 30px;
        color: #fff;
        font-size: 24rpx;
        font-weight: 700;
      }
    }
    .item-02 {
      .swiper-item-content {
        .btn {
          background-color: #813cff;
        }
      }
    }
    .dots {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      left: 50%;
      bottom: 20rpx;
      transform: translateX(-50%);
      .dot {
        width: 10rpx;
        height: 10rpx;
        background-color: #c4c7cc;
        border-radius: 2rpx;
        margin-right: 10rpx;
        transition: width 0.3s ease-in-out;
        &.active {
          width: 20rpx;
          background-image: linear-gradient(135deg, #6ba5fc 0%, #3a86fb 100%);
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
</style>
