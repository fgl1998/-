<template>
  <div class="sunshine-declare h5-page">
    <div class="toolbar d-f ai-c">
      <div class="input-container f-1 d-f ai-c">
        <input
          class="f-1"
          type="text"
          placeholder="请输入补贴项目名称"
          confirm-type="search"
          @confirm="handleSearch"
          :focus="true"
          placeholder-style="color: #fff;"
          v-model="keyword" />
      </div>
      <div class="search-btn d-f ai-c" @click="handleSearch">
        <img :src="imageSearch" alt="" />
        <div class="text">搜索</div>
      </div>
    </div>
    <block v-if="renderData.length > 0">
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
                        <div class="tag" v-if="itemProject.canApply">可申报</div>
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
    </block>
    <block v-else>
      <ComponentNoData tip="未查询到相关补贴项目" v-if="isRequestOver"></ComponentNoData>
    </block>
  </div>
</template>
<script>
  import imageSearch from './images/search.png'
  import image0101 from './images/0101.png'
  import image0102 from './images/0102.png'
  import image0103 from './images/0103.png'
  import image0201 from './images/0201.png'
  import image0202 from './images/0202.png'
  import image0203 from './images/0203.png'
  import image0301 from './images/0301.png'
  import image0302 from './images/0302.png'
  import image0303 from './images/0303.png'
  import image0401 from './images/0401.png'
  import image0402 from './images/0402.png'
  import image0403 from './images/0403.png'

  import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'

  import config from '@/config'
  import { getDeclareConfig } from '@/utils/get'
  import { navigateTo, showModal } from '@/utils/uni-api'
  import { requestB016 } from '@/service/api'
  import { USER_INFO, USER_LIST, M_UPDATE_SUBSIDY_PROJECT_AUDIT_CHANNEL } from '@/store/constants' // 常量
  import { mapGetters } from 'vuex'

  export default {
    name: 'pageDeclareSearch',
    data() {
      return {
        imageSearch,
        images: [
          [image0101, image0102, image0103],
          [image0201, image0202, image0203],
          [image0301, image0302, image0303],
          [image0401, image0402, image0403]
        ],
        keyword: '', // 搜索关键词
        scrollIntoViewMain: '', // main 主要内容 滚动的位置
        renderData: [], // 渲染数据
        renderDataObj: {}, // 渲染数据 对象拷贝

        scrollRange: [], // 滚动范围
        click: false, // 是否处于点击toolbar状态
        timerScroll: null, // 滚动定时器
        timerClick: null, // 点击事件定时器

        isRequestOver: false // 是否请求完成
      }
    },
    components: {
      ComponentNoData
    },
    onLoad(e) {},
    onReady() {
      this.handleSearch()
    },
    methods: {
      // 请求获得全部的补贴项目
      _requestB016() {
        const { areaCode } = config
        const keyword = this.keyword

        return new Promise((resove, reject) => {
          requestB016(keyword)
            .then((res) => {
              const { list } = res.lists.hi03List
              const len = list.length
              if (list && len > 0) {
                let renderDataObj = {}
                let tag_20011 = false
                let tag_20013 = false
                let tag_20015 = false
                let tag_20017 = false
                let tag_20019 = false
                let tag_20374 = false
                let tag_20379 = false
                let tag_20080 = false
                for (let i = 0; i < len; i++) {
                  let { chi037, chi122, chi031, chi032, aab301, chi04y, chi04z, chi037_desc } = list[i]
                  let canApply = false // 是否可申报
                  // 强制筛选
                  // if (chi031 !== '20044') {
                  //   continue
                  // }
                  // 内江项目
                  if (areaCode === '511000') {
                    if (chi031 === '20003') {
                      // chi032 = '教育扶贫救助基金'
                    }
                    if (chi031 === '20011' || chi031 === '20012') {
                      chi032 = '大学新生入学资助'
                      if (tag_20011) {
                        tag_20011 = false
                        continue
                      } else {
                        tag_20011 = true
                      }
                    }
                    if (chi031 === '20013' || chi031 === '20014') {
                      chi032 = '普通高中国家助学金'
                      if (tag_20013) {
                        tag_20013 = false
                        continue
                      } else {
                        tag_20013 = true
                      }
                    }
                    if (chi031 === '20015' || chi031 === '20016') {
                      chi032 = '免除普通高中家庭经济困难学生学费'
                      if (tag_20015) {
                        tag_20015 = false
                        continue
                      } else {
                        tag_20015 = true
                      }
                    }
                    if (chi031 === '20017' || chi031 === '20018') {
                      chi032 = '对义务教育家庭经济困难寄宿生补助生活费'
                      if (tag_20017) {
                        tag_20017 = false
                        continue
                      } else {
                        tag_20017 = true
                      }
                    }
                    if (chi031 === '20019' || chi031 === '20020') {
                      chi032 = '学前教育家庭经济困难儿童资助'
                      if (tag_20019) {
                        tag_20019 = false
                        continue
                      } else {
                        tag_20019 = true
                      }
                    }
                    if (chi031 === '20080' || chi031 === '20376') {
                      chi032 = '中等职业国家助学金'
                      if (tag_20080) {
                        tag_20080 = false
                        continue
                      } else {
                        tag_20080 = true
                      }
                    }
                    if (chi031 === '20374' || chi031 === '20375') {
                      chi032 = '义务教育家庭经济困难非寄宿生生活补助'
                      if (tag_20374) {
                        tag_20374 = false
                        continue
                      } else {
                        tag_20374 = true
                      }
                    }

                    if (chi031 === '20379' || chi031 === '20380') {
                      chi032 = '中等职业教育国家奖学金'
                      if (tag_20379) {
                        tag_20379 = false
                        continue
                      } else {
                        tag_20379 = true
                      }
                    }
                  }
                  if (chi04y === '1' && chi04z === '1') {
                    canApply = true
                  }
                  const id = 'chi037_' + chi037
                  if (renderDataObj[id]) {
                    renderDataObj[id].list.push({
                      id: 'chi031_' + chi031,
                      chi031: chi031,
                      aab301: aab301,
                      name: chi032,
                      chi04y: chi04y,
                      chi04z: chi04z,
                      canApply,
                      chi122
                    })
                  } else {
                    renderDataObj[id] = {
                      id,
                      name: chi037_desc,
                      checked: false,
                      click: false,
                      list: [
                        {
                          id: 'chi031_' + chi031,
                          chi031: chi031,
                          aab301: aab301,
                          name: chi032,
                          chi04y: chi04y,
                          chi04z: chi04z,
                          canApply,
                          chi122
                        }
                      ]
                    }
                  }
                }
                resove(renderDataObj)
              } else {
                reject(res)
              }
            })
            .catch((err) => {
              reject(err)
            })
        })
      },
      // 搜索
      handleSearch() {
        this.isRequestOver = false
        this.renderData = []
        this._requestB016()
          .then((res) => {
            this.renderDataObj = { ...res } // 储存数据至本地
            let renderDataArr = []
            for (let item in res) {
              const value = res[item]
              renderDataArr.push({
                ...value
              })
            }
            this.updateRenderData(renderDataArr, 0)
            this.initScrollIntoView()
          })
          .catch(() => {})
          .finally(() => {
            this.isRequestOver = true
          })
      },
      // 更新 renderData
      updateRenderData(data, times) {
        const { areaCode } = config
        let index = data.findIndex((item) => item.id == 'chi037_12')
        if (areaCode == '511300' && index !== -1) {
          let Obj = { ...data[index] }
          data[index] = { ...data[0] }
          data[0] = { ...Obj }
        }
        this.renderData = [...data]
        if (times === 0) {
          this.initScrollIntoView()
        }
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
        let { name: chi031_desc, chi04y, chi031, chi122 } = item
        const { user_id } = this.userInfo
        const declareConfig = getDeclareConfig(chi031)
        const { declarePackageName } = config

        // 申报需知
        if (index === 0) {
          navigateTo('notice', 'packageDeclare', {
            chi031,
            chi04z: chi04y,
            chi031_desc
          })
        }
        this.$store.commit(M_UPDATE_SUBSIDY_PROJECT_AUDIT_CHANNEL, chi122)
        // 申报需知
        if (index === 1) {
          // 审批流程
          navigateTo('process', 'packageDeclare', {
            chi031,
            chi031_desc
          })
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
          if (chi04y != '1') {
            showModal(unableDeclareTip || '该补贴项目暂未在微信小程序平台开放，请联系乡镇或街道工作人员进行办理！')
            return
          }

          // 默认跳转至申报类型选择
          const defaultJump = (fixedDeclareType) => {
            let params = {
              chi031,
              chi031_desc
            }
            if (fixedDeclareType) {
              params.fixedDeclareType = fixedDeclareType
            }
            navigateTo('type', 'packageDeclare', params)
          }

          const { isFixedDeclareType, fixedDeclareType, isJumpDeclareTypeSelect } = declareConfig

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
      }
    },
    computed: {
      ...mapGetters([USER_INFO, USER_LIST])
    },
    watch: {}
  }
</script>
<style lang="scss" scoped>
  $search-height: 128rpx;
  $line-height: 1;
  $line-height-zh: 1.4;
  .sunshine-declare {
    height: 100%;
    height: 100vh;
    overflow: hidden;
    position: relative;
    .toolbar {
      width: 100%;
      height: $search-height;
      background-color: $primary;
      padding-left: 30rpx;
      position: relative;
      color: #fff;
      font-size: 28rpx;
      .input-container {
        height: $search-height / 2;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 100px;
        padding: 0 $spacing;
        .range {
          font-weight: 500;
          position: relative;
          &::after {
            content: '';
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            width: 2rpx;
            height: 24rpx;
            background-color: rgba(255, 255, 255, 0.3);
          }
          .img-wrapper {
            margin: 0 14px 0 10px;
          }
        }
        input {
          height: 100%;
          color: inherit;
          font-size: 28rpx;
        }
      }
      .search-btn {
        padding-left: 32rpx;
        padding-right: 60rpx;
        font-weight: 500;
        line-height: $search-height;
        img {
          width: 28rpx;
          height: 28rpx;
        }
        .text {
          padding-left: 12rpx;
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
            transform: translateY(-50%);
            right: 0;
            width: 96rpx;
            height: 42rpx;
            font-size: 22rpx;
            line-height: 42rpx;
            margin-left: 12rpx;
            color: #ffffff;
            background: url(data:image/png;base64,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)
              no-repeat center center;
            background-size: 100% 100%;
            padding-left: 20rpx;
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
  }
</style>
