<template>
  <div class="sunshine-declare h5-page page-wrapper">
    <block v-if="renderData.length > 0">
      <view class="toolbar">
        <scroll-view
          scroll-x
          class="scroll-view"
          scroll-with-animation
          :scroll-animation-duration="300"
          :scrollIntoView="scrollIntoViewHeader">
          <block v-for="item in renderData" :key="item.id">
            <div
              :id="item.id"
              class="item"
              :class="[item.checked ? 'active' : '']"
              @click="handleClickToolbarItem(item.id)">
              {{ item.name }}
            </div>
          </block>
        </scroll-view>
      </view>
      <div class="scroll-wrapper-wrapper">
        <scroll-view
          scroll-y
          class="scroll-view"
          scroll-with-animation
          :scroll-animation-duration="300"
          :scrollIntoView="scrollIntoViewMain"
          @scroll="handleScroll">
          <block v-for="item in renderData" :key="item.id">
            <div class="item" :id="item.id">
              <div class="item-title">{{ item.name }}({{ item.num || 0 }}项)</div>
              <div class="item-content">
                <block v-for="(itemProject, indexProject) in item.list" :key="itemProject.id">
                  <div class="item-project" v-if="!item.click || itemProject.canApply">
                    <div class="item-project-name">
                      <div class="text" :class="[itemProject.canApply ? 'can-apply' : '']">
                        {{ itemProject.name }}
                        <div class="tag" v-if="itemProject.canApply">
                          <img class="img" :src="imageTag" alt="" />
                          <span class="text"> 可申报</span>
                        </div>
                      </div>
                    </div>
                    <div class="item-project-content">
                      <div class="item-project-notice" @click="handleJumpRoute(itemProject, 0)">
                        <img :src="images[indexProject % 4][0]" alt="" />
                        <p>申报须知</p>
                      </div>
                      <div class="item-project-process" @click="handleJumpRoute(itemProject, 1)">
                        <img :src="images[indexProject % 4][1]" alt="" />
                        <p>审批流程</p>
                      </div>
                      <div class="item-project-declare" @click="handleJumpRoute(itemProject, 2)">
                        <img :src="images[indexProject % 4][2]" alt="" />
                        <p>我要申报</p>
                      </div>
                    </div>
                  </div>
                </block>
              </div>
            </div>
          </block>
        </scroll-view>
      </div>
      <div class="publicity">
        <img class="line" :src="imageLine" alt="" />
        <img class="line line-02" :src="imageLine" alt="" />
        <div class="content" @click="handleJumpRouteToPublicity">
          <img class="bg" :src="imageBg" alt="" />
          <span>阳光申报公示</span>
        </div>
      </div>
    </block>
    <block v-else>
      <ComponentNoData tip="暂无可申报的补贴项目" v-if="isRequestOver"></ComponentNoData>
    </block>
    <block v-if="allProjectNum > 999">
      <ComponentAffix
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAAH608TDAAAABGdBTUEAALGPC/xhBQAAAsRJREFUSA2tlr9rFUEQx/NeElMIakBBbdIoisZCSxGiCDYqRLAxWNgIIohW/gM2FpEgptJgQJJGC8Uq+KNUNEUsBAtBAyoYtAgiKsTE8/O92903e7eXPDQD38zMd74zu/fe7r10dCxnWZadjuoQz3OC4BR4ATJPbPLBUNQTJUEvluQKCPJQJFgXtbnECoplW4WFSgPqNSkydCKYBp25KMw2LXBLSpuGs2GxyZrO8aBEMBwSAvI5m4v4rilYL5gEx8qCHaom7FUk9AnC3U5cPJ4vGE/9mjSGyvcWE1G1ldB3BvzIGYJu0G5jX6QleQ2mW7PTkZqw+GBA5Cvjl4C2tBb0gdtANle4bCI9dgWW5virsHqKTbDecrUxwqcgZYeTTU45i29YAfkhV7tneR2jX2AqIkuJaxzMaZI9IkqaShrpSHRrRiqqBIFO1q2tyfYnNBWqkGYDunW/wcaKop6Y10q3wEy9plXRSiFTgnUFIhFQHwffQonkBpAl7xn82byqD8Ea5Jgr3MdvAz3gBPgJrMWDqejEPzaKReLzGo7v9Hx0ZOzKqZgmfdrpc2gbEPaDYTAD7FZ1/3SRb4IB21MXJ3dI8yUaroIe1/ge/xA8A5+BzsQWsA8cB3uBTF/ldXC50WhIU29aBHibIthQr44raLvAqG/Gj8UKk1F84oSz+LYXMSPykF59sf798Yk4/mmDGAGydyD50ZaHrpQz54EGYo+ClkSPvyAWOxkK/xkwa3s+sfizS+N0JHuBvzkfRK6S2VmbNbPJqfmKf+MWOOr8ajg/a5FhL8NAnvSAeeSDofCPAbO2An8nL1bGuAX/uEVHK4I2Cfr9S02jLtS2UdSxvSuVMx3h/toGV0CjJxkHZZuAiF+IqWGIBsHHcvcy+Ty1c0Av18mSTnmz7TuFWDvcCXTh9Rr7At5ywKr/pFJw+juEQ0B25C9V7VLnquq/mQAAAABJRU5ErkJggg=="
        label="搜索补贴项目"
        bottom="162rpx"
        @click="handleJumpRouteToSearch">
      </ComponentAffix>
    </block>
    <ComponentPopupNotice></ComponentPopupNotice>
  </div>
</template>
<script>
  import ComponentPopupNotice from '@/components/common/ez-popup-notice/ez-popup-notice.vue'
  import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
  import ComponentAffix from '@/components/project/ez-affix/ez-affix.vue'
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'

  import config from '@/config'
  import { IMAGE_TABBAR_SUNSHINE_DECLARE } from '@/config/constants'

  import { getShareConfig, getDeclareConfig } from '@/utils/get'

  import { navigateTo, showModal, setNavigationBarTitle } from '@/utils/uni-api'
  import { requestB210 } from '@/service/api'

  import { USER_INFO, USER_LIST, M_UPDATE_SUBSIDY_PROJECT_AUDIT_CHANNEL } from '@/store/constants' // 常量
  import { mapGetters } from 'vuex'

  const image0101 = IMAGE_TABBAR_SUNSHINE_DECLARE + '0101.png'
  const image0102 = IMAGE_TABBAR_SUNSHINE_DECLARE + '0102.png'
  const image0103 = IMAGE_TABBAR_SUNSHINE_DECLARE + '0103.png'
  const image0201 = IMAGE_TABBAR_SUNSHINE_DECLARE + '0201.png'
  const image0202 = IMAGE_TABBAR_SUNSHINE_DECLARE + '0202.png'
  const image0203 = IMAGE_TABBAR_SUNSHINE_DECLARE + '0203.png'
  const image0301 = IMAGE_TABBAR_SUNSHINE_DECLARE + '0301.png'
  const image0302 = IMAGE_TABBAR_SUNSHINE_DECLARE + '0302.png'
  const image0303 = IMAGE_TABBAR_SUNSHINE_DECLARE + '0303.png'
  const image0401 = IMAGE_TABBAR_SUNSHINE_DECLARE + '0401.png'
  const image0402 = IMAGE_TABBAR_SUNSHINE_DECLARE + '0402.png'
  const image0403 = IMAGE_TABBAR_SUNSHINE_DECLARE + '0403.png'

  const imageTag = IMAGE_TABBAR_SUNSHINE_DECLARE + 'tag.png'
  const imageBg = IMAGE_TABBAR_SUNSHINE_DECLARE + 'bg.png'
  const imageLine = IMAGE_TABBAR_SUNSHINE_DECLARE + 'line.png'

  const { areaCode, isOpenYGFF, isForceBindingAddress, isShowShutDownTips, declarePackageName } = config
  export default {
    name: 'pageTabbarSunshineDeclare',
    data() {
      return {
        imageBg,
        imageLine,
        imageTag,
        images: [
          [image0101, image0102, image0103],
          [image0201, image0202, image0203],
          [image0301, image0302, image0303],
          [image0401, image0402, image0403]
        ],
        scrollIntoViewHeader: '', // header 滚动的位置
        scrollIntoViewMain: '', // main 主要内容 滚动的位置
        renderData: [], // 渲染数据
        renderDataObj: {}, // 渲染数据 对象拷贝

        scrollRange: [], // 滚动范围
        click: false, // 是否处于点击toolbar状态
        timerScroll: null, // 滚动定时器
        timerClick: null, // 点击事件定时器
        // 页面分享配置
        shareConfig: {
          title: '阳光申报', // 转发标题
          path: '/pages/tabbar/sunshine-declare/sunshine-declare?type=share', // 转发路径
          query: 'type=share', // 自定义页面路径中携带的参数，如 path?a=1&b=2 的 “?” 后面部分
          imageUrl: '' // 自定义图片路径
        },
        isRequestOver: false, // 是否请求完成
        areaCode,
        timer: null,
        times: 10
      }
    },
    components: {
      ComponentNoData,
      ComponentAffix,
      ComponentPopupNotice,
      ComponentPanel
    },
    onReady() {
      const shareConfig = getShareConfig(this)
      if (shareConfig) {
        this.shareConfig = { ...shareConfig }
      }

      if (this.userInfo && this.userInfo.user_id) {
        if (isOpenYGFF && !this.userInfo.aac021 && isForceBindingAddress && !isShowShutDownTips) {
          showModal('系统检测到您还未绑定户籍地址，立即前往绑定？').then(() => {
            navigateTo('user-info', 'packageCommon')
          })
        }
      }

      this.getData()
    },
    methods: {
      // 处理渲染数据
      updateRenderData(data, times) {
        // 构建新的数组顺序
        let newList = []

        // 排列顺序，第一位的数据排序在第一，依次类推。 数组里面的值为补贴项目排列顺序。
        const orderList = {
          // 农业农村局
          chi037_1: ['20055', '20177'],
          // 民政局
          chi037_5: []
        }

        const chi037OrderList = Object.keys(orderList)

        // 存在排序
        if (chi037OrderList.length > 0) {
          // 先查找排序数据，将其排列在前
          for (let i = 0, len = chi037OrderList.length; i < len; i++) {
            const item = chi037OrderList[i]
            for (let j = 0, jLen = data.length; j < jLen; j++) {
              const jItem = data[j]

              if (jItem.id === item) {
                const newChi031List = []
                const chi031Order1List = orderList[item]
                const chi031List = [...jItem.list]
                // 补贴项目存在排序
                if (chi031Order1List instanceof Array && chi031Order1List.length > 0) {
                  for (let a = 0, aLen = chi031Order1List.length; a < aLen; a++) {
                    const aItem = chi031Order1List[a]
                    for (let b = 0, bLen = chi031List.length; b < bLen; b++) {
                      const bItem = chi031List[b]
                      if (aItem === bItem.chi031) {
                        newChi031List.push(bItem)
                        break
                      }
                    }
                  }
                }

                // 插入剩余的项目
                for (let b = 0, bLen = chi031List.length; b < bLen; b++) {
                  const bItem = chi031List[b]
                  if (!chi031Order1List.includes(bItem.chi031)) {
                    newChi031List.push(bItem)
                  }
                }

                jItem.list = [...newChi031List]

                newList.push(jItem)
                break
              }
            }
          }
        }

        // 插入剩余项目
        for (let i = 0, len = data.length; i < len; i++) {
          const item = data[i]
          if (!chi037OrderList.includes(item.id)) {
            newList.push(item)
          }
        }

        this.renderData = [...newList]

        if (times === 0) {
          this.initScrollIntoView()
        }
      },

      // 获取数据
      getData() {
        const renderDataObj = {}
        const renderDataArr = []

        requestB210('', '', '', 1, 999)
          .then((res) => {
            const { list } = res.lists.hi70List

            if (!list || list.length <= 0) {
              return
            }

            setNavigationBarTitle(`阳光申报（${list.length}项）`)

            for (let i = 0, len = list.length; i < len; i++) {
              const item = list[i]
              const { chi037, chi037_desc, chi031, chi032, ygsp_hi03Map, chi70z } = item
              const id = 'chi037_' + chi037

              // 是否可申报
              let canApply = false
              let chi04y = ''
              let chi04z = ''
              let chi122 = ''

              if (ygsp_hi03Map) {
                chi04y = ygsp_hi03Map.chi04y
                chi04z = ygsp_hi03Map.chi04z
                chi122 = ygsp_hi03Map.chi122
                if (chi04z === '1' && chi04y === '1') {
                  canApply = true
                }
              }

              const chi031Obj = {
                id: 'chi031_' + chi031,
                chi031,
                aab301: areaCode,
                chi122,
                chi032,
                name: chi032,
                chi04y,
                chi04z,
                canApply,
                chi037,
                // 审批流程
                chi70z,
                // 是否为阳光审批项目
                isYGSP: !!ygsp_hi03Map
              }

              if (renderDataObj[id]) {
                renderDataObj[id].list.push(chi031Obj)
              } else {
                renderDataObj[id] = {
                  id,
                  name: chi037_desc,
                  checked: false,
                  click: false,
                  list: [chi031Obj]
                }
              }
            }

            // 转化数据

            for (let item in renderDataObj) {
              const value = renderDataObj[item]
              renderDataArr.push(value)
            }

            this.updateRenderData(renderDataArr, 0)
          })
          .finally(() => {
            this.isRequestOver = true
          })
      },

      // 初始化滚动位置
      initScrollIntoView() {
        const renderData = [...this.renderData]
        for (let i = 0, len = renderData.length; i < len; i++) {
          const item = renderData[i]
          item.checked = false
          item.num = item.list.length
          if (i === 0) {
            item.checked = true
            const id = item.id
            this.scrollIntoViewHeader = id
            this.scrollIntoViewMain = id
          }
        }
        this.updateRenderData(renderData, 1)
      },

      // 点击顶部 toolbar
      handleClickToolbarItem(id) {
        clearTimeout(this.timerClick)
        this.click = true

        const renderData = [...this.renderData]
        for (let i = 0, len = renderData.length; i < len; i++) {
          const item = renderData[i]
          item.checked = false
          if (item.id === id) {
            item.checked = true
          }
        }

        this.updateRenderData(renderData, 1)
        this.scrollIntoViewMain = id
        this.timerClick = setTimeout(() => {
          this.click = false
        }, 500)
      },

      // 监听滚动
      handleScroll(e) {
        if (this.click) {
          return
        }
        clearTimeout(this.timerScroll)

        const renderData = [...this.renderData]

        const scrollRange = [...this.scrollRange] // 滚动范围

        const scrollTop = e.target.scrollTop

        let num = 0 // item 占据的高度

        this.timerScroll = setTimeout(() => {
          if (scrollRange && scrollRange.length > 0) {
            let index = 0
            for (let i = 0, len = scrollRange.length; i < len; i++) {
              const item = scrollRange[i]
              if (scrollTop < item) {
                index = i
                break
              }
            }
            for (let i = 0, len = renderData.length; i < len; i++) {
              const item = renderData[i]
              item.checked = false
              if (i === index) {
                item.checked = true
                this.scrollIntoViewHeader = item.id
              }
            }
          } else {
            let index = 0 // 当前滚动位置记录
            // 首次滚动 计算可滚动范围
            for (let i = 0, len = renderData.length; i < len; i++) {
              const item = renderData[i]
              let listLen = 0
              if (item.click) {
                item.list.map((ele) => {
                  if (ele.canApply) {
                    listLen++
                  }
                })
              } else {
                listLen = item.list.length
              }
              if (listLen > 0) {
                num += (124 + (256 + 32) * listLen - 32) / 2
              } else {
                num += 124
              }
              scrollRange.push(num)
            }
            for (let i = 0, len = scrollRange.length; i < len; i++) {
              const item = scrollRange[i]
              if (scrollTop < item) {
                index = i
                break
              }
            }
            for (let i = 0, len = renderData.length; i < len; i++) {
              const item = renderData[i]
              item.checked = false
              if (i === index) {
                item.checked = true
                this.scrollIntoViewHeader = item.id
              }
            }
          }
          this.renderData = [...renderData]
          this.scrollRange = [...scrollRange]
        }, 500)
      },

      // 跳转路由
      handleJumpRoute(item, index) {
        let { name: chi031_desc, chi04y, chi031, chi037, chi122, chi70z, isYGSP } = item

        const { user_id } = this.userInfo
        const declareConfig = getDeclareConfig(chi031)

        this.$store.commit(M_UPDATE_SUBSIDY_PROJECT_AUDIT_CHANNEL, chi122)
        // 申报需知
        if (index === 0) {
          navigateTo('notice-513400', 'packageDeclare', {
            chi031,
            chi04z: chi04y,
            chi031_desc
          })
        }

        // 审批流程
        if (index === 1) {
          if (isYGSP) {
            // 审批流程
            navigateTo('process', 'packageDeclare', {
              chi031,
              chi031_desc
            })
          } else {
            if (chi70z) {
              // 审批流程
              navigateTo('process-513400', 'packageDeclare', {
                chi031,
                chi031_desc,
                chi70z: encodeURIComponent(chi70z)
              })
            } else {
              showModal(`该补贴项目暂未配置审批流程！`)
            }
          }

          return
        }

        // 我要申报
        if (index === 2) {
          // 未登录 需登录后查看
          if (!user_id) {
            showModal('请登录后再访问').then(() => {
              navigateTo('login', 'packageCommon')
            })
            return
          }

          // 获取自定义不能申报的补贴项目提示
          const { unableDeclareTip } = declareConfig

          // 后台配置 微信端未开放
          if (chi04y != '1' || !isYGSP) {
            showModal(unableDeclareTip || `该补贴项目暂未在微信小程序平台开放，请联系乡镇或街道工作人员进行办理！`)
            return
          }

          // 默认跳转至申报类型选择
          const defaultJump = (fixedDeclareType) => {
            let params = {
              chi031,
              chi031_desc,
              chi037
            }
            if (fixedDeclareType) {
              params.fixedDeclareType = fixedDeclareType
            }
            navigateTo('type', 'packageDeclare', params)
          }

          const { isFixedDeclareType, fixedDeclareType, isJumpDeclareTypeSelect } = declareConfig

          const jumpDeclare = () => {
            // 固定申报模式
            if (isFixedDeclareType) {
              // 跳过申报类型选择
              if (isJumpDeclareTypeSelect) {
                navigateTo('declare-' + chi031, declarePackageName, {
                  chi031,
                  fixedDeclareType,
                  chi031_desc
                })
              } else {
                defaultJump(fixedDeclareType)
              }
            } else {
              defaultJump()
            }
          }

          jumpDeclare()
        }
      },

      // 跳转路由至阳光公示
      handleJumpRouteToPublicity() {
        const { user_id } = this.userInfo
        if (!user_id) {
          showModal('请登录后再访问').then(() => {
            navigateTo('login', 'packageCommon')
          })
          return
        }
        navigateTo('publicity', 'packageQuery', {})
      },

      // 跳转路由至补贴项目搜索
      handleJumpRouteToSearch() {
        // const { user_id } = this.userInfo
        // if (!user_id) {
        //   showModal('请登录后再访问').then(() => {
        //     navigateTo('login', 'packageCommon')
        //   })
        //   return
        // }
        navigateTo('search', 'packageDeclare')
      }
    },
    computed: {
      ...mapGetters([USER_INFO, USER_LIST]),
      allProjectNum() {
        let num = 0
        const renderData = this.renderData
        for (let i = 0, len = renderData.length; i < len; i++) {
          const item = renderData[i]
          num = num + item.list.length
        }
        return num
      }
    },
    watch: {},
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
  $header-height: 96rpx;
  $line-height: 1;
  $line-height-zh: 1.4;

  .sunshine-declare {
    height: 100%;
    height: 100vh;
    overflow: hidden;
    position: relative;

    .toolbar {
      width: 100%;
      height: $header-height;
      white-space: nowrap;
      overflow: hidden;
      border-bottom: 1px solid $border-color;

      .scroll-view {
        display: block;
        width: 100%;
        height: $header-height;
        background-color: #fff;
      }

      .item {
        width: auto;
        display: inline-block;
        padding: 0;
        margin-right: 48rpx - 24rpx;
        font-size: 32rpx;
        line-height: $header-height;
        padding: 0 12rpx;
        color: #333;
        position: relative;

        &::before {
          content: '';
          width: 0;
          position: absolute;
          left: 0;
          bottom: 0;
          height: 0;
          border-radius: 50px;
          transition: all 0.3s;
        }

        &.active {
          color: $primary;
          font-weight: 700;

          &::before {
            width: 100%;
            height: 6rpx;
            background-color: $primary;
          }
        }

        &:first-child {
          margin-left: 32rpx;
        }

        &:last-child {
          margin-right: 32rpx;
        }
      }
    }

    .scroll-wrapper-wrapper {
      flex: 1;
      overflow: hidden;
      /*  #ifdef  H5  */
      padding-bottom: 100rpx;

      /*  #endif  */
      .scroll-view {
        width: 100%;
        /*  #ifdef  H5  */
        height: calc(100vh - 96rpx - 100rpx);
        /*  #endif  */
        /*  #ifdef  MP-WEIXIN  */
        height: 100%;
        /*  #endif  */
        display: block;
      }

      .item {
        padding: 0 32rpx;
        font-size: 32rpx;
        color: #3d424d;

        &:last-child {
          padding-bottom: 32rpx;
        }

        .item-title {
          font-weight: 700;
          line-height: $line-height;
          padding: 46rpx 0;
          position: relative;
          padding-left: 24rpx;

          &::before {
            content: '';
            position: absolute;
            width: 8rpx;
            height: 32rpx;
            background-color: $primary;
            border-radius: 2rpx;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
          }
        }

        .item-content {
          width: 100%;
        }

        .fold {
          max-height: 0;
          transition: max-height 0.5s;
          overflow: hidden;
        }

        .fold-active {
          max-height: 10000rpx;
        }

        .item-project {
          width: 100%;
          height: 256rpx;
          background-color: #ffffff;
          border-radius: 8rpx;
          margin-bottom: 32rpx;
          padding: 0 44rpx;
          padding-top: 32rpx;

          &:last-child {
            margin-bottom: 0;
          }
        }

        .item-project-name {
          width: 100%;
          font-size: 30rpx;
          line-height: $line-height-zh;
          font-weight: 700;
          color: #555556;
          display: flex;
          align-items: center;

          .text {
            -ms-text-overflow: ellipsis;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            position: relative;

            &.can-apply {
              padding-right: 108rpx;
            }
          }

          .tag {
            position: absolute;
            top: 50%;
            right: 12rpx;
            transform: translateY(-50%);
            width: 96rpx;
            height: 42rpx;

            .img {
              width: 100%;
              height: 100%;
            }

            .text {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              left: 0;
              width: 100%;
              font-size: 22rpx;
              line-height: 42rpx;
              color: #ffffff;
              padding-left: 20rpx;
            }
          }
        }

        .item-project-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 26rpx;
          line-height: $line-height-zh;
          color: #555556;
          margin-top: 32rpx;
          text-align: center;

          img {
            width: 88rpx;
            height: 88rpx;
            margin: auto;
          }
        }
      }
    }

    .publicity {
      position: absolute;
      right: 0;
      top: 140rpx;

      .line {
        width: 12rpx;
        height: 150rpx;
        position: absolute;
        top: -144rpx;
        left: 34rpx;
      }

      .line-02 {
        left: 240rpx;
      }

      .bg {
        display: block;
        width: 280rpx;
        height: 112rpx;
      }

      .content {
        position: relative;
        top: -6rpx;

        span {
          position: absolute;
          top: 32rpx;
          right: 28rpx;
          font-size: 26rpx;
          color: #333333;
        }
      }
    }

    .panel-content {
      .introduce-title {
        font-size: 36rpx;
        color: #000000;
      }

      .top-distance {
        margin-top: 16rpx;
      }

      .title-answer {
        margin-top: 16rpx;
        font-size: 28rpx;
        color: #999999;
      }

      .required {
        color: red;
      }

      .btns {
        display: flex;
        justify-content: center;
        align-items: center;

        .btn {
          width: 242rpx;
          height: 68rpx;
          line-height: 68rpx;
          text-align: center;
          border-radius: 5px;
        }

        .gray-btn {
          color: #fff;
          background-color: #c6c6c6;
        }

        .immediately-declara {
          color: #fff;
          background-color: #ff9b00;
        }

        .close-page {
          background-color: #fff;
          margin-left: 16rpx;
          border: 1rpx solid #ff9b00;
          color: #ff9b00;
        }
      }
    }
  }
</style>
