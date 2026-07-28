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
          <block v-for="(item, index) in renderData" :key="item.id">
            <div class="item" :id="item.id">
              <div class="item-title" @click="checkFoldIndex(index)">{{ item.name }}({{ item.num || 0 }}项)</div>
              <div
                class="item-content"
                :class="{
                  fold: areaCode == '510900',
                  'fold-active': areaCode == '510900' && isCheckFold(index)
                }">
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
    <block v-if="allProjectNum > 10">
      <ComponentAffix
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAAH608TDAAAABGdBTUEAALGPC/xhBQAAAsRJREFUSA2tlr9rFUEQx/NeElMIakBBbdIoisZCSxGiCDYqRLAxWNgIIohW/gM2FpEgptJgQJJGC8Uq+KNUNEUsBAtBAyoYtAgiKsTE8/O92903e7eXPDQD38zMd74zu/fe7r10dCxnWZadjuoQz3OC4BR4ATJPbPLBUNQTJUEvluQKCPJQJFgXtbnECoplW4WFSgPqNSkydCKYBp25KMw2LXBLSpuGs2GxyZrO8aBEMBwSAvI5m4v4rilYL5gEx8qCHaom7FUk9AnC3U5cPJ4vGE/9mjSGyvcWE1G1ldB3BvzIGYJu0G5jX6QleQ2mW7PTkZqw+GBA5Cvjl4C2tBb0gdtANle4bCI9dgWW5virsHqKTbDecrUxwqcgZYeTTU45i29YAfkhV7tneR2jX2AqIkuJaxzMaZI9IkqaShrpSHRrRiqqBIFO1q2tyfYnNBWqkGYDunW/wcaKop6Y10q3wEy9plXRSiFTgnUFIhFQHwffQonkBpAl7xn82byqD8Ea5Jgr3MdvAz3gBPgJrMWDqejEPzaKReLzGo7v9Hx0ZOzKqZgmfdrpc2gbEPaDYTAD7FZ1/3SRb4IB21MXJ3dI8yUaroIe1/ge/xA8A5+BzsQWsA8cB3uBTF/ldXC50WhIU29aBHibIthQr44raLvAqG/Gj8UKk1F84oSz+LYXMSPykF59sf798Yk4/mmDGAGydyD50ZaHrpQz54EGYo+ClkSPvyAWOxkK/xkwa3s+sfizS+N0JHuBvzkfRK6S2VmbNbPJqfmKf+MWOOr8ajg/a5FhL8NAnvSAeeSDofCPAbO2An8nL1bGuAX/uEVHK4I2Cfr9S02jLtS2UdSxvSuVMx3h/toGV0CjJxkHZZuAiF+IqWGIBsHHcvcy+Ty1c0Av18mSTnmz7TuFWDvcCXTh9Rr7At5ywKr/pFJw+juEQ0B25C9V7VLnquq/mQAAAABJRU5ErkJggg=="
        label="搜索补贴项目"
        bottom="162rpx"
        @click="handleJumpRouteToSearch"></ComponentAffix>
    </block>
    <ComponentPopupNotice></ComponentPopupNotice>
    <uni-popup ref="popup" type="center" :mask-click="false">
      <ComponentPanel title="“失地农民失业保险金申请”事项办理一次性告知书">
        <div class="panel-content">
          <div class="introduce-title">1、申报条件</div>
          <div class="title-answer">
            男年满16-60周岁、女年满16-50周岁以内且无用人单位缴纳社会保险、未注册工商营业执照的被征地农民。
          </div>
          <div class="introduce-title top-distance">2、申报材料</div>
          <div class="title-answer">
            <span>▪ 申请人身份证原件</span><br />
            <span>▪ 常住人口登记表（农转非原因是征地）</span><br />
            <span>▪ 《就业创业证》</span><br />
            <span>▪ 失业保险发放机构规定的其他材料</span><br />
          </div>
          <div class="introduce-title top-distance">3、一次性告知情形</div>
          <div class="title-answer">
            <span>▪ 暂停失地农民失业保险待遇的情形：</span><br />
            <span>（1）重新就业的；</span><br />
            <span>（2）应征服兵役的；</span><br />
            <span>（3）同时领取其他失业保险待遇的； </span><br />
            <span>（4）享受基本养老保险待遇的；</span><br />
            <span>（5）移居境外的； </span><br />
            <span>（6）被判刑收监执行或者被劳动教养的。 </span><br />
            <span>▪ 终止失地农民失业保险待遇的情形：死亡。</span>
          </div>
          <div class="read top-distance introduce-title">
            <checkbox-group @change="checkBox">
              <label>
                <checkbox value="cb" :checked="isRead" />
                <span class="required">*</span>
                本人已阅读并清楚知晓以上内容
              </label>
            </checkbox-group>
          </div>
          <div class="btns top-distance">
            <button
              :class="['btn', times === 0 ? 'immediately-declara' : 'gray-btn']"
              :disabled="times !== 0"
              @click="handleJumpRoute(itemData, 2, true)">
              立即申报{{ times === 0 ? '' : '(' + times + ')' }}
            </button>
            <button class="btn close-page" @click="closePopup">关闭页面</button>
          </div>
        </div>
      </ComponentPanel>
    </uni-popup>
  </div>
</template>
<script>
  import ComponentPopupNotice from '@/components/common/ez-popup-notice/ez-popup-notice.vue'
  import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
  import ComponentAffix from '@/components/project/ez-affix/ez-affix.vue'
  import uniPopup from '@/components/common/ez-popup/ez-popup.vue'
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'

  import config from '@/config'
  import { IMAGE_TABBAR_SUNSHINE_DECLARE } from '@/config/constants'
  import { getShareConfig, getDeclareConfig } from '@/utils/get'
  import { navigateTo, showModal } from '@/utils/uni-api'
  import { useGetUserInfoH5 } from '@/mixins'
  import { requestB016 } from '@/service/api'
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

  const {
    areaCode,
    isOpenYGFF,
    isForceBindingAddress,
    isShowShutDownTips,
    declarePackageName,
    onlineTerminalName,
    isCompileToTianfuCitizenCloud
  } = config
  export default {
    name: 'pageTabbarSunshineDeclare',
    mixins: [useGetUserInfoH5],
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
        checkedArr: [], //选中数组
        isRead: false, // 是否已阅读
        timer: null,
        times: 10,
        itemData: {}
      }
    },
    components: {
      ComponentNoData,
      ComponentAffix,
      ComponentPopupNotice,
      uniPopup,
      ComponentPanel
    },
    onLoad(e) {},
    onReady() {
      const shareConfig = getShareConfig(this)
      if (shareConfig) {
        this.shareConfig = { ...shareConfig }
      }
      this.getRenderData()

      if (this.userInfo && this.userInfo.user_id) {
        if (isOpenYGFF && !this.userInfo.aac021 && isForceBindingAddress && !isShowShutDownTips) {
          showModal('系统检测到您还未绑定户籍地址，立即前往绑定？').then(() => {
            // 乐山特殊处理
            if (areaCode === '511100') {
              navigateTo('user-info-ls', 'packageCommon')
            } else {
              navigateTo('user-info', 'packageCommon')
            }
          })
        }
      }
    },
    methods: {
      // 判断是否选中折叠
      isCheckFold(index) {
        let res = this.checkedArr.find((item) => index == item + '')
        if (res) {
          return true
        }
        return false
      },
      // 处理选中
      checkFoldIndex(index) {
        let res = this.checkedArr.find((item) => index == item + '')
        if (res) {
          this.checkedArr = this.checkedArr.filter((item) => item !== index + '')
        } else {
          this.checkedArr.push(index + '')
        }
      },
      // 请求获得全部的补贴项目
      _requestB016() {
        return new Promise((resove, reject) => {
          requestB016('', '1', areaCode == '511100' ? '1' : '')
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
                  let {
                    chi037,
                    chi031,
                    chi032,
                    aab301,
                    chi04y, // 是否微信端申报 0 否 1 是
                    chi04z, // 是否上线 0 否 1 是
                    chi037_desc,
                    chi121, // 微信需审报入口 1 群众小程序 2经办人小程序)
                    chi122
                  } = list[i]
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
                  if (chi04y === '1' && chi04z === '1' && chi121 === '1') {
                    canApply = true
                  }
                  const id = 'chi037_' + chi037
                  if (renderDataObj[id]) {
                    renderDataObj[id].list.push({
                      id: 'chi031_' + chi031,
                      chi031: chi031,
                      aab301: aab301,
                      chi122,
                      name: chi032,
                      chi04y: chi04y,
                      chi04z: chi04z,
                      canApply,
                      chi037
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
                          chi122,
                          aab301: aab301,
                          name: chi032,
                          chi04y: chi04y,
                          chi04z: chi04z,
                          canApply,
                          chi037
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
      // 获得全部的补贴项目
      getRenderData() {
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
        var arr = [...data]

        if (areaCode == '510900') {
          let order = ['27', '7', '5', '12', '23', '26', '1', '6', '20', '4']
          let drop = []
          let notDrop = []
          order.forEach((item) => {
            let have = arr.find((one) => one.id == 'chi037_' + item)
            if (have) {
              drop.push(have)
            }
          })
          arr.forEach((item) => {
            let notHave = order.find((one) => item.id == 'chi037_' + one)
            if (!notHave) {
              notDrop.push(item)
            }
          })
          arr = [...drop, ...notDrop]
        }
        // 内江教育局提前
        if (areaCode == '511000') {
          let index = arr.findIndex((item) => item.id == 'chi037_7')
          if (index >= 0) {
            let Obj = arr[index]
            arr[index] = arr[0]
            let listIndex = Obj.list.findIndex((item) => item.chi031 === '20014')
            if (listIndex >= 0) {
              let inObj = Obj.list[listIndex]
              Obj.list[listIndex] = Obj.list[1]
              Obj.list[1] = inObj
            }
            arr[0] = Obj
          }
        }
        // 巴中人设局提前
        if (areaCode == '511300') {
          let index = arr.findIndex((item) => item.id == 'chi037_12')
          if (index >= 0) {
            let Obj = arr[index]
            arr[index] = arr[0]
            arr[0] = Obj
          }
        }
        // 自贡 残联、民政局提前及特定补贴提前
        if (areaCode == '510300') {
          let i = arr.findIndex((item) => item.id == 'chi037_8')
          if (i >= 0) {
            let Obj = arr[i]
            arr[i] = arr[0]
            let listIndex = Obj.list.findIndex((item) => item.chi031 == '200099')
            if (listIndex >= 0) {
              let inObj = Obj.list[listIndex]
              Obj.list[listIndex] = Obj.list[0]
              Obj.list[0] = inObj
            }
            arr[0] = Obj
          }
          let index = arr.findIndex((item) => item.id == 'chi037_5')
          if (index >= 0) {
            let Obj = arr[index]
            arr[index] = arr[1]
            let listIndex = Obj.list.findIndex((item) => item.chi031 == '20957')
            if (listIndex >= 0) {
              let inObj = Obj.list[listIndex]
              Obj.list[listIndex] = Obj.list[0]
              Obj.list[0] = inObj
            }
            let twoIndex = Obj.list.findIndex((item) => item.chi031 == '20451')
            if (twoIndex >= 0) {
              let inObj = Obj.list[twoIndex]
              Obj.list[twoIndex] = Obj.list[1]
              Obj.list[1] = inObj
            }
            arr[1] = Obj
          }
        }
        this.renderData = [...arr]
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
      handleJumpRoute(item, index, isReadNotification = false) {
        let { name: chi031_desc, chi04y, chi031, chi037, chi122 } = item

        const { user_id } = this.userInfo
        const declareConfig = getDeclareConfig(chi031)

        this.$store.commit(M_UPDATE_SUBSIDY_PROJECT_AUDIT_CHANNEL, chi122)
        // 申报需知
        if (index === 0) {
          navigateTo('notice', 'packageDeclare', {
            chi031,
            chi04z: chi04y,
            chi031_desc
          })
        }
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
            showModal(
              unableDeclareTip ||
                `该补贴项目暂未在${
                  isCompileToTianfuCitizenCloud ? onlineTerminalName || '微信小程序' : '微信小程序'
                }平台开放，请联系乡镇或街道工作人员进行办理！`
            )
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

          // 达州失地农民失业保险金弹窗提示
          if (areaCode === '511700' && chi031 === '20666') {
            if (isReadNotification) {
              if (this.isRead) {
                jumpDeclare()
                this.closePopup()
              } else {
                showModal('请勾选本人已阅读并清楚知晓以上内容')
              }
            } else {
              this.itemData = item
              this.$refs.popup.open('center')
              this.timer = setInterval(() => {
                this.times--
                if (this.times === 0) {
                  clearInterval(this.timer)
                }
              }, 1000)
            }
          } else {
            jumpDeclare()
          }
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
      },
      // 选中已阅读
      checkBox(e) {
        const { value } = e.detail
        value.length > 0 ? (this.isRead = true) : (this.isRead = false)
      },
      // 关闭popup
      closePopup() {
        this.$refs.popup.close()
        this.times = 10
        this.isRead = false
        clearInterval(this.timer)
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
