<template>
  <div class="my h5-page page-wrapper" :class="'city-' + areaCode">
    <div class="header">
      <div class="header-bg">
        <div class="img-wrapper">
          <ComponentImg :path="images.header" height="172rpx" width="174rpx"></ComponentImg>
        </div>
      </div>
      <div class="header-con">
        <div class="avatar-wrapper">
          <ComponentAvatar
            size="118rpx"
            :src="userInfo.avatarUrl"
            @click="
              handleJumpRoute(areaCode === '511100' ? 'user-info-ls' : 'user-info', 'packageCommon')
            "></ComponentAvatar>
        </div>
        <div class="user-info" v-if="userInfo.user_id">
          <div class="name d-f ai-c">
            <span>{{ getUserName }}</span>
            <span class="auth">已认证</span>
          </div>
          <div class="details">
            <div>身份证号：{{ userInfo.idCard | TMIdcard }}</div>
            <div>银行卡卡号：{{ TMBankCard(userInfo.aac203) || '--' }}</div>
            <div>户籍所在地：{{ userInfo.aac021 || '--' }}</div>
          </div>
          <div class="toolbar">
            <div
              class="my-home"
              v-if="!closePageModule.myHome"
              @click="handleJumpRoute(isOpenYGFFByDS ? 'my-home-yb' : 'my-home', 'packageHome')">
              <span>我的家</span>
              <div class="iconimg iconimg-my-home"></div>
            </div>
          </div>
        </div>
        <!-- 未登录状态 -->
        <div v-else class="no-login" @click="handleJumpRoute('login', 'packageCommon')">请登录</div>
      </div>
    </div>

    <div class="pos-height"></div>

    <div class="service-wrapper panel-wrapper" v-if="!closePageModule.myService">
      <ComponentPanel title="我的服务">
        <div class="panel-content">
          <div class="items d-f ai-c jc-c jc-sb">
            <block v-for="item in getNavData" :key="item.id">
              <div class="item" @click="handleJumpRoute(item.name, item.packageName, item.params)">
                <img class="img" :class="'img-' + item.id" :src="item.imgSrc" alt="" />
                <div class="title">{{ item.title }}</div>
                <div class="desc">{{ item.desc }}</div>
              </div>
            </block>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <div class="declare-project-wrapper panel-wrapper" v-if="!closePageModule.myDeclarationProject">
      <ComponentPanel
        title="我的申报项目"
        :buttonText="declareProjectButtonText"
        @click="handleJumpRoute('my-declare', 'packageDetails')">
        <div class="panel-content">
          <div class="items" v-if="declareProjectData.length > 0">
            <block v-for="item in declareProjectData" :key="item.id">
              <ComponentSubsidyReview
                :renderData="item"
                declareType="01"
                :isShowApprovalProcess="areaCode !== '511100'"
                @change="handleSubsidyReviewChange('my')"></ComponentSubsidyReview>
            </block>
          </div>
          <ComponentNoData tip="未查询到相关数据" v-else></ComponentNoData>
        </div>
      </ComponentPanel>
    </div>

    <div class="agent-project-wrapper panel-wrapper" v-if="!closePageModule.myAgencyProject">
      <ComponentPanel
        title="我的代办项目"
        :buttonText="agentProjectButtonText"
        @click="handleJumpRoute('my-declare', 'packageDetails', { type: 'agent' })">
        <div class="panel-content">
          <div class="items" v-if="agentProjectData.length > 0">
            <block v-for="item in agentProjectData" :key="item.id">
              <ComponentSubsidyReview
                :renderData="item"
                :isShowApprovalProcess="areaCode !== '511100'"
                declareType="02"
                @change="handleSubsidyReviewChange('agent')"></ComponentSubsidyReview>
            </block>
          </div>
          <ComponentNoData tip="未查询到相关数据" v-else></ComponentNoData>
        </div>
      </ComponentPanel>
    </div>

    <div class="one-pass-wrapper panel-wrapper" v-if="!closePageModule.myOneCard">
      <ComponentPanel title="我的一卡通">
        <div class="panel-content">
          <div class="subsidy-ing" v-if="subsidyIngData && subsidyIngData.length > 0">
            <div class="name d-f ai-c">
              <div class="iconimg"></div>
              <span>正领取补贴</span>
            </div>
            <div class="tags d-f ai-c fw-w">
              <div class="tag" v-for="item in subsidyIngData" :key="item.id">
                {{ item.chi031_desc }}
              </div>
            </div>
          </div>
          <div class="items">
            <block v-for="item in onePassData" :key="item.id">
              <div class="item" @click="handleJumpRoute(item.name, item.packageName, item.params)">
                <div class="label YouSheBiaoTiHei">{{ item.label }}</div>
                <div class="cell-wrapper">
                  <div class="cell">
                    <div class="value">{{ item.amount }}元</div>
                    <div class="key">总金额</div>
                  </div>
                  <div class="cell">
                    <div class="value">{{ item.num }}</div>
                    <div class="key">补贴项目数</div>
                  </div>
                  <div class="cell">
                    <div class="value">{{ item.stage }}</div>
                    <div class="key">发放总期数</div>
                  </div>
                </div>
                <i class="iconimg"></i>
              </div>
            </block>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <div class="card-bag-wrapper panel-wrapper" v-if="!closePageModule.myCardBag">
      <ComponentPanel title="我的卡包">
        <div class="panel-content">
          <block v-for="item in cardBagList" :key="item.id">
            <div class="item" @click="handleJumpRouteWxSbk" :class="[item.id]">
              <div class="item-bg">
                <ComponentImg :path="images[item.id]" height="166rpx" width="100%"></ComponentImg>
              </div>
              <div class="item-con">
                <div class="card-number">{{ TMcardNumber(item.cardNumber) }}</div>
                <div class="iconimg-box d-f ai-c">
                  <div class="iconimg" :class="['iconimg-card-' + item.id]"></div>
                </div>
                <div class="card-info">
                  <div class="name d-f ai-c">
                    <span>{{ item.name }}</span>
                  </div>
                  <div class="desc d-f ai-c jc-sb">
                    <span class="flex-1">{{ item.unit }}</span>
                    <div class="tag" v-if="item.status">
                      {{ item.status }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </block>
        </div>
      </ComponentPanel>
    </div>

    <div class="button-wrapper" v-if="userInfo.sessionId && !config.isCompileToTianfuCitizenCloud">
      <ComponentButton
        name="退出登录"
        height="68rpx"
        backgroundColor="#fff"
        color="#777a82"
        fontSize="22rpx"
        border="none"
        fontWeight="500"
        boxShadow="0rpx 2rpx 14rpx 0rpx rgba(56, 130, 255, 0.11)"
        @click="handleLoginOut"></ComponentButton>
    </div>
    <ComponentPopupNotice></ComponentPopupNotice>
  </div>
</template>
<script>
  import ComponentImg from '@/components/common/ez-img/ez-img.vue'
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
  import ComponentButton from '@/components/common/ez-button/ez-button.vue'
  import ComponentAvatar from '@/components/common/ez-avatar/ez-avatar.vue'
  import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
  import ComponentPopupNotice from '@/components/common/ez-popup-notice/ez-popup-notice.vue'
  import ComponentSubsidyReview from '@/components/project/ez-subsidy-review/ez-subsidy-review.vue'

  import { IMAGE_COMMON, IMAGE_TABBAR_MY } from '@/config/constants'
  import { getClosePageModule, getShareConfig } from '@/utils/get'
  import { customLogin } from '@/utils/custom-api'
  import { useTMUserName, useTMSocialSecurityCard } from '@/hooks'
  import { navigateTo, showModal, showToast, navigateToMiniProgram } from '@/utils/uni-api' // 封装过后的api，推荐使用。方便以后统一修改，便于维护。
  import {
    requestB015,
    requestFFGetMyEcard,
    requestFFGetChi031ByAac002,
    requestWXLoginOut,
    requestDSGetEnjoymentSubsidyAllByAac002,
    requestDSGetMyEcard
  } from '@/service/api'
  import {
    USER_INFO,
    M_UPDATE_USER_INFO,
    M_UPDATE_USER_INFO_CLEAR,
    USER_LIST,
    M_UPDATE_USER_LIST
  } from '@/store/constants' // 常量
  import { mapGetters } from 'vuex'

  const imageBg = IMAGE_COMMON + 'bg-01.png'
  const imageSSC = IMAGE_TABBAR_MY + 'SSC.png'
  const imageNav01 = IMAGE_TABBAR_MY + 'nav-01.png'
  const imageNav02 = IMAGE_TABBAR_MY + 'nav-02.png'

  import config from '@/config'
  const { isOpenYGFF, isOpenYGFFByDS, isForceBindingAddress, isShowShutDownTips, areaCode, closePages } = config
  export default {
    name: 'pageTabbarMy',
    data() {
      return {
        config,
        // 本地图片
        images: {
          header: {
            src: imageBg
          },
          SSC: {
            src: imageSSC
          }
        },
        // 我的申报项目 渲染数据
        declareProjectData: [],
        // 我的代办项目 渲染数据
        agentProjectData: [],
        // 一卡通 渲染数据
        onePassData: [
          {
            id: 'yfje',
            label: '已发金额',
            amount: '0',
            stage: '0',
            num: '0',
            name: 'subsidy-amount',
            packageName: 'packageDetails',
            params: { type: '01', name: '已发金额' }
          },
          {
            id: 'shz',
            label: '审核中',
            amount: '0',
            stage: '0',
            num: '0',
            name: 'subsidy-amount',
            packageName: 'packageDetails',
            params: { type: '02', name: '审核中' }
          },
          {
            id: 'bydz',
            label: '本月到账',
            amount: '0',
            stage: '0',
            num: '0',
            name: 'subsidy-amount',
            packageName: 'packageDetails',
            params: { type: '03', name: '本月到账' }
          }
        ],
        // 正领取补贴 渲染数据
        subsidyIngData: [],
        // 卡包 渲染数据
        cardBagList: [
          {
            id: 'SSC',
            name: '电子社保卡',
            unit: '人力资源和社会保障部',
            status: '',
            cardNumber: '--'
          }
        ],
        // 关闭页面某些模块配置
        closePageModule: {
          myHome: false, // 我的家
          myService: false, // 我的服务
          myDeclarationProject: false, // 我的申报项目
          myAgencyProject: false, // 我的代办项目
          myOneCard: false, // 我的一卡通
          myCardBag: false // 我的卡包
        },
        // 页面分享配置
        shareConfig: {
          title: '一卡通', // 转发标题
          path: '/pages/tabbar/my/my?type=share', // 转发路径
          query: 'type=share', // 自定义页面路径中携带的参数，如 path?a=1&b=2 的 “?” 后面部分
          imageUrl: '' // 自定义图片路径
        },
        areaCode,
        isOpenYGFFByDS
      }
    },
    components: {
      ComponentImg,
      ComponentPanel,
      ComponentAvatar,
      ComponentButton,
      ComponentNoData,
      ComponentSubsidyReview,
      ComponentPopupNotice
    },
    onLoad(e) {
      // this.closePageModule = {
      //   ...this.closePageModule,
      //   ...getClosePageModule(this)
      // }
    },
    onShow() {
      const { idCard } = this.userInfo
      if (this.declareProjectData.length > 0) {
        this.getDeclareProjectData(idCard)
      }
      if (this.agentProjectData.length > 0) {
        this.getAgentProjectData(idCard)
      }
    },
    onReady() {
      const shareConfig = getShareConfig(this)
      if (shareConfig) {
        this.shareConfig = { ...shareConfig }
      }
    },
    onHide() {},
    methods: {
      // 脱敏社保卡号
      TMcardNumber(cardNumber) {
        // if(areaCode === '511300'){
        //   return useTMSocialSecurityCard(cardNumber)
        // }else{
        //   return cardNumber
        // }
        return useTMSocialSecurityCard(cardNumber)
      },
      // 获得 个人信息查询
      async handleCheckAddress() {
        const { aaz500, aaz502Desc, aac021 } = this.userInfo

        this.cardBagList = [
          {
            id: 'SSC',
            name: '电子社保卡',
            unit: '人力资源和社会保障部',
            status: aaz502Desc,
            cardNumber: aaz500 || '--'
          }
        ]

        if (!aac021) {
          // 开启强制绑定地址抱歉未开启停机提示
          if (isForceBindingAddress && !isShowShutDownTips) {
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
      // 获得 正在申报的补贴数据
      getDeclareProjectData(aac002) {
        requestB015('', '', '', '', '', '', aac002, '', 1, 1, 'aac002')
          .then((res) => {
            const { list } = res.lists.hb00List
            if (list) {
              this.declareProjectData = [...list]
            } else {
              this.declareProjectData = []
            }
          })
          .catch((err) => {
            this.declareProjectData = []
          })
      },
      // 获得 代办的补贴数据
      getAgentProjectData(aac002) {
        requestB015('', '', '', '', '02', aac002, '', '', 1, 1, '')
          .then((res) => {
            const { list } = res.lists.hb00List
            if (list) {
              this.agentProjectData = [...list]
            } else {
              this.agentProjectData = []
            }
          })
          .catch((err) => {
            this.agentProjectData = []
          })
      },
      // 获取一卡通 发放
      getOnePassDataByFF(aac002, aac003) {
        requestFFGetMyEcard(aac002, aac003).then((res) => {
          const { list } = res
          if (list) {
            const data = list[0]
            if (data) {
              const {
                aae209_cg,
                chi031_cg,
                aae019_cg,
                aae019_zt,
                aae209_zt,
                chi031_zt,
                aae209_dq,
                aae019_dq,
                chi031_dq
              } = data
              const onePassData = [...this.onePassData]
              const newOnePassData = []
              onePassData.forEach((item, index) => {
                if (index === 0) {
                  item = {
                    ...item,
                    amount: aae019_cg,
                    stage: aae209_cg,
                    num: chi031_cg
                  }
                }
                if (index === 1) {
                  item = {
                    ...item,
                    amount: aae019_zt,
                    stage: aae209_zt,
                    num: chi031_zt
                  }
                }
                if (index === 2) {
                  item = {
                    ...item,
                    amount: aae019_dq,
                    stage: aae209_dq,
                    num: chi031_dq
                  }
                }
                newOnePassData.push(item)
              })
              this.onePassData = [...newOnePassData]
            }
          }
        })
      },
      // 获取一卡通 德生
      getOnePassDataByDS(aac002, aac003) {
        requestDSGetMyEcard(aac002, aac003).then((res) => {
          const { list } = res
          if (list && list.length > 0) {
            const data = list[0]
            if (data) {
              const {
                aae209_cg,
                chi031_cg,
                aae019_cg,
                aae019_zt,
                aae209_zt,
                chi031_zt,
                aae209_dq,
                aae019_dq,
                chi031_dq
              } = data
              const onePassData = [...this.onePassData]
              const newOnePassData = []
              onePassData.forEach((item, index) => {
                if (index === 0) {
                  item = {
                    ...item,
                    amount: aae019_cg,
                    stage: aae209_cg,
                    num: chi031_cg
                  }
                }
                if (index === 1) {
                  item = {
                    ...item,
                    amount: aae019_zt,
                    stage: aae209_zt,
                    num: chi031_zt
                  }
                }
                if (index === 2) {
                  item = {
                    ...item,
                    amount: aae019_dq,
                    stage: aae209_dq,
                    num: chi031_dq
                  }
                }
                newOnePassData.push(item)
              })
              this.onePassData = [...newOnePassData]
            }
          }
        })
      },
      // 获取 一卡通 渲染数据
      getOnePassData(aac002, aac003) {
        const { myOneCard } = this.closePageModule
        if (isOpenYGFF && !myOneCard) {
          this.getOnePassDataByFF(aac002, aac003)
        } else if (this.isOpenYGFFByDS && !myOneCard) {
          this.getOnePassDataByDS(aac002, aac003)
        } else {
          return
        }
      },
      // 获得 当前正在享受的补贴 渲染数据
      getSubsidyIngData(aac002, aac003) {
        const { myOneCard } = this.closePageModule

        if (isOpenYGFF && !myOneCard) {
          requestFFGetChi031ByAac002(aac002, aac003).then((res) => {
            const { list } = res
            if (list) {
              this.subsidyIngData = [...list]
            }
          })
        } else if (this.isOpenYGFFByDS && !myOneCard) {
          requestDSGetEnjoymentSubsidyAllByAac002(aac002, aac003).then((res) => {
            const { list } = res
            const dataList = []
            if (list && list.length > 0) {
              list.forEach((item) => {
                dataList.push({
                  chi031_desc: item.subsidy_name
                })
              })
            }
            this.subsidyIngData = [...dataList]
          })
        } else {
          return
        }
      },
      // 补贴项目撤销 change
      handleSubsidyReviewChange(type) {
        const { idCard } = this.userInfo
        if (type == 'my') {
          this.getDeclareProjectData(idCard)
        } else {
          this.getAgentProjectData(idCard)
        }
      },
      // 跳转路由
      handleJumpRoute(name, packageName, params) {
        const { user_id } = this.userInfo

        // 跳转路由至登录逻辑判断
        if (name === 'login' && user_id) {
          return
        }
        if (name === 'login' && !user_id) {
          navigateTo(name, packageName, params)
          return
        }

        if (user_id) {
          // 开启关闭页面筛选
          if (closePages && closePages.length > 0) {
            // 存在
            if (closePages.includes(`${packageName}/${name}`)) {
              navigateTo('not-found', 'packageCommon')
            } else {
              // 不存在
              navigateTo(name, packageName, params)
            }
          } else {
            // 关闭关闭页面筛选
            navigateTo(name, packageName, params)
          }
        } else {
          showModal('请登录后再访问').then(() => {
            navigateTo('login', 'packageCommon')
          })
        }
      },
      // 跳转至微信小程序电子社保卡
      handleJumpRouteWxSbk() {
        // #ifdef MP-WEIXIN
        navigateToMiniProgram('wx6163d215ef686f78', '', null, 'release')
        // #endif
        // #ifdef H5
        // #endif
      },
      // 退出登录
      handleLoginOut() {
        const { user_id } = this.userInfo
        showModal('是否确定退出登录？', '提示', true).then(() => {
          if (!user_id) {
            showModal('退出登录错误：userId为空')
            return false
          }
          requestWXLoginOut(user_id).then(() => {
            showToast('退出成功', 'success')
            this.subsidyIngData = []
            this.declareProjectData = []
            this.agentProjectData = []
            this.onePassData = [
              {
                id: 'yfje',
                label: '已发金额',
                amount: '0',
                stage: '0',
                num: '0',
                name: 'subsidy-amount',
                packageName: 'packageDetails',
                params: { type: '01', name: '已发金额' }
              },
              {
                id: 'shz',
                label: '审核中',
                amount: '0',
                stage: '0',
                num: '0',
                name: 'subsidy-amount',
                packageName: 'packageDetails',
                params: { type: '02', name: '审核中' }
              },
              {
                id: 'bydz',
                label: '本月到账',
                amount: '0',
                stage: '0',
                num: '0',
                name: 'subsidy-amount',
                packageName: 'packageDetails',
                params: { type: '03', name: '本月到账' }
              }
            ]
            this.cardBagList = [
              {
                id: 'SSC',
                name: '电子社保卡',
                unit: '人力资源和社会保障部',
                status: '',
                cardNumber: '--'
              }
            ]
            this.$store.commit(M_UPDATE_USER_INFO_CLEAR)
            this.$store.commit(M_UPDATE_USER_LIST, {
              cpb10d: '未登录用户身份证号', // 经办用户身份证号码
              aae012: '未登录用户姓名', // 经办用户姓名
              che015: '5', // 经办层级 0 省 1 地市 2 区县 3 乡镇街道 4 村社区 5 个人
              chb015: '9999', // 区县编码
              chb017: '9999', // 乡镇编码
              chb018: '9999', // 村编码
              aae018: '未登录用户经办部门' // 经办部门名称
            })

            customLogin(false).then((res) => {
              this.$store.commit(M_UPDATE_USER_INFO, {
                ...res
              })
            })
          })
        })
      },
      TMBankCard(value) {
        if (!value) {
          return ''
        }
        let len = value.length
        let str = value.substr(0, 1) + '*'.repeat(len - 2) + value.substr(len - 1, len)
        return str
      }
    },
    computed: {
      ...mapGetters([USER_INFO, USER_LIST]),
      getUserName() {
        let str = '未登录'
        const { userName } = this.userInfo
        if (userName) {
          str = useTMUserName(userName)
        }
        return str
      },
      // 控制显示查看更多 我的申报项目
      declareProjectButtonText() {
        let str = ''
        const declareProjectData = this.declareProjectData
        const len = declareProjectData.length
        if (len > 0) {
          str = '查看更多'
        }
        return str
      },
      // 控制显示查看更多 我的代办项目
      agentProjectButtonText() {
        let str = ''
        const agentProjectData = this.agentProjectData
        const len = agentProjectData.length
        if (len > 0) {
          str = '查看更多'
        }
        return str
      },
      // 我的服务 渲染数据
      getNavData() {
        let arr = [
          {
            id: 'my_message',
            title: '我的消息',
            desc: '消息、通知、提示',
            disabled: false,
            name: 'my-message',
            packageName: 'packageDetails',
            params: {},
            imgSrc: imageNav01
          },
          {
            id: 'query',
            title: '投诉进度查询',
            desc: '一键掌握投诉进度',
            disabled: false,
            name: 'complaint-progress',
            packageName: 'packageDetails',
            params: {},
            imgSrc: imageNav02
          }
        ]
        if (areaCode === '511100') {
          arr[1].title = '投诉咨询进度查询'
          arr[1].desc = '一键掌握投诉咨询进度'
        }
        return arr
      }
    },
    watch: {
      'userInfo.user_id': {
        handler(val) {
          if (val) {
            // bug修复，解决设置了immediate为true时watch比onLoad先执行导致接口报错的问题
            this.closePageModule = {
              ...this.closePageModule,
              ...getClosePageModule(this)
            }
            const { idCard, userName } = this.userInfo
            this.getOnePassData(idCard, userName)
            this.getDeclareProjectData(idCard)
            this.getAgentProjectData(idCard)
            this.getSubsidyIngData(idCard, userName)
            this.handleCheckAddress()
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
  .my {
    position: relative;
    padding-bottom: $spacing;
    /*  #ifdef  H5  */
    padding-bottom: $spacing + 100rpx;
    /*  #endif  */
    display: flex;
    flex-direction: column;
    &.city-513400 {
      .header-con,
      .pos-height,
      .service-wrapper,
      .one-pass-wrapper {
        order: 1;
      }

      .declare-project-wrapper,
      .agent-project-wrapper,
      .card-bag-wrapper,
      .button-wrapper {
        order: 2;
      }
    }
    .header-con {
      .avatar-wrapper {
        position: absolute;
        top: 24rpx;
        left: $spacing;
      }
      .user-info {
        width: 100%;
        padding-left: $spacing + 20rpx + 118rpx;
        .name {
          font-size: 32rpx;
          font-weight: 500;
          padding-top: 24rpx;
          .auth {
            border: 1px solid #fff;
            border-radius: 8rpx;
            line-height: 24rpx;
            font-size: 20rpx;
            padding: 0 4rpx;
            font-weight: 400;
            margin-left: 8rpx;
          }
        }
        .details {
          font-size: 22rpx;
          line-height: 1.4;
          opacity: 0.7;
          padding-top: 12rpx;
          padding-right: $spacing;
        }
      }
      .no-login {
        font-size: 32rpx;
        font-weight: 500;
        line-height: 38rpx;
        padding-top: 24rpx + 40rpx;
        padding-left: $spacing + 20rpx + 118rpx;
      }
      .toolbar {
        .my-home {
          position: absolute;
          top: 90rpx;
          right: $spacing;
          font-size: 26rpx;
          display: flex;
          align-items: center;
          font-size: 30rpx;
          font-weight: 500;
          .iconimg-my-home {
            width: 32rpx;
            height: 32rpx;
            margin-left: 4rpx;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAC0UlEQVR4Xu2b7zUFMRDFZyqgBCpABagAFaADOqACOvBUgArowNOBEqhgnHkne87azb7cZPPvnZd88SVvNveXm0l2spi2vPGW66cGoDlgywkUWwIisktEl4b/GzN/l5iLIgCM+HciOjSif4jolJmXuSFkB2AR32kuAiErgDXii0HIBgAQXwRCFgAe4rNDSA4AEP9LRDuW5DeZE0Rkz+wgS2Z+m5M4kwIAxF8TkWb+DxSCiJwQke4gXXtl5otQCMkAIOKZeaEDFxHdDiEIIqL9jgeCj0K30CQAfMR3QlAIEwD0DKFgvFt0AD7iReRKZ5OZdSlATiCiR4sD6gAQIP7JTNnCA4ImR02C/VYewAzxnRAUgs3mZQFEED8XQjkAEcXPgVAGQALxoRDyA0goPgTCBTO/eu+BRGE1wQzifSEEv0p7nwMyis8CwQtAAfHJIcAACopPCgECUIH4ZBCcACoSnwTCWgAVio8OYRJAxeKjQrAC2ADx0SCMAGyQ+BAIWjn6dwNlA3BORC8Tx8rrXhlLixnd+3zIKTTmb9BX6Xtmvus/2AdAreJ9nAAB0EtLra8d9EjVLh6BoOX3Q+cSMLU5haAW179adl5dWpoaXi22n1pC/eWg47/pld1GN9DOg1D3lA0RP3KCK9FAAEzJ+nNNsGciWtX4HU3r/w+OPrFi3TKzVpDXNhTA8DZmGHSUXGxPtdzq2LrFigXFaQBcFjHJrzlgcCHZlsCAALTeWg4YX223JGghEMtNUJy2C7RdACAAJC89BaInQdfpDLIuMCYoTqwlAGCEu0ADbwDcOwoEsjkAMSZgNyQM2geaOWBMUJzmAGRaANpIGLQPNHPAmKA4zQHItAC0kTBoH2jmgDHFqwiZmoB+hWH7qBkVhvaLBWAf+TccaAkYAFrP00uFM1RJYL+5AL50nOg3QzCAQDHV/6wBqH6KEg+wOSAx4OrDb70D/gCRmKtf72aHpQAAAABJRU5ErkJggg==);
          }
        }
      }
    }

    .pos-height {
      height: 298rpx;
    }

    .service-wrapper {
      width: 100%;
      position: absolute;
      left: 0;
      top: 218rpx;
      .panel-content {
        padding-bottom: $spacing;
      }
      .item {
        width: 288rpx;
        height: 206rpx;
        background-color: $primary;
        box-shadow: 1rpx 4rpx 7rpx 0rpx rgba($primary, 0.44);
        border-radius: $border-radius * 2;
        font-size: $font-size;
        font-weight: 700;
        line-height: 1;
        color: #fff;
        text-align: center;
        .img {
          width: 94rpx;
          height: 80rpx;
          margin: 22rpx auto 8rpx;
        }
        .img-query {
          width: 76rpx;
          height: 86rpx;
          margin: 19rpx auto 5rpx;
        }
        .desc {
          font-size: $font-size-xs;
          font-weight: 400;
          line-height: 1;
          color: rgba(#fff, 0.7);
          padding-top: 12rpx;
        }
        &:last-child {
          background-color: #0bd8e4;
          box-shadow: 1rpx 4rpx 7rpx 0rpx rgba(#0bd8e4, 0.44);
        }
      }
    }

    .agent-project-wrapper,
    .declare-project-wrapper {
      margin-top: $spacing;
    }

    .one-pass-wrapper {
      margin-top: $spacing;
      .subsidy-ing {
        margin-bottom: $spacing;
        .name {
          line-height: 58rpx;
          color: #3d424d;
          font-size: 28rpx;
          height: 28rpx;
          line-height: 1;
          padding-left: 16rpx;
          .iconimg {
            background-image: url(data:image/png;base64,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);
            width: 60rpx;
            height: 58rpx;
          }
        }
        .tags {
          padding-top: 16rpx;
          padding-left: 16rpx;
          .tag {
            line-height: 48rpx;
            height: 48rpx;
            border-radius: $border-radius-semicircle;
            padding: 0 24rpx;
            font-size: 24rpx;
            background-color: #e1ecff;
            color: #3178f3;
            margin-right: 16rpx;
            margin-top: 16rpx;
            &:nth-of-type(3n + 2) {
              background-color: #ffe4ec;
              color: #e34275;
            }
            &:nth-of-type(3n) {
              background-color: #e5feff;
              color: #24c3cd;
            }
          }
        }
      }
      .items {
        .item {
          background-color: rgba($primary, 0.04);
          box-shadow: $box-shadow;
          border-radius: $border-radius;
          margin-bottom: 24rpx;
          position: relative;
          padding: 16rpx 60rpx 16rpx 140rpx;
          .label {
            position: absolute;
            top: 50%;
            left: 34rpx;
            transform: translateY(-50%);
            width: 72rpx;
            line-height: 36rpx;
            font-size: 36rpx;
            font-weight: 700;
            color: $primary;
          }
          .cell-wrapper {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .cell {
            width: 32%;
            height: 98rpx;
            background-color: #ffffff;
            border-radius: $border-radius;
            font-size: $font-size-md;
            line-height: 36rpx;
            color: $primary;
            padding: 12rpx 0;
            text-align: center;
            .key {
              font-size: $font-size-xs;
              color: $color-placeholder;
              line-height: 30rpx;
              padding-top: 8rpx;
            }
          }
          .iconimg {
            position: absolute;
            top: 50%;
            right: 20rpx;
            transform: translateY(-50%);
            width: 32rpx;
            height: 32rpx;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACk0lEQVRoQ+XZ3WoTQRQH8HMmz+KdzyFodjd6Yc7sJtlNeuGV76A+hle2giSIiCZRERHxAykiomiV4gdSpBRKKaVQiiRzJKm0pZkVsjs7yWCuE/L/7Zw5Ox8Ijn/Q8fzw/wKW2r1PzPwZAK41o2BlViOZaQRu3Lp/VQhx5W/oL6WSoHq1/HEWiEyAxU73DDI+PgyMsKqGA9mqXXhvG5EJMAp5s9O/yMy3jwX+OkSWCzJ4ZxORGaBDMMMPgYrisPLWFiIXQD8S/BMUUlLz39hA5AaklNNaCZnqMlguGmEEkIL4JQCpEXqvi0QYA6Qg1hUMZSs8/7IohFGAFoGwgYplHAXPi0AYB6SMxObBxPaemUYUAtAiGLYYgZqh/9QkojBAykhsCxbUiMpPTCEKBegRuIMCKCbvaCmSQ1M4IGVi7wKUKJHnHuXIPv6pFYB22QGwh0OmpB708yCsAVLmxD4DUjP0ulkRVgEpiN+KgVqRfy8LwjpAh0CAASBSLL270yJmAkgZCQUAlIT+nWkQMwOMQi62+5cQ+PpRYP6WhMEpZwCaXd1KEvqnnQBowrtTQifDH0xiRbGszP8k1jx5d9qoJvw+CqjG5Pemqfvj37XWhU6GZ4C9EmC1EXoPsoa3thaaePIIuwBMiQzmfzE3WTa4gwoorjmwnNbU/LZiRa2oMv8bmonwzFuMo5WnA1tKzYTdRKUoqVXmf1OvmbAbjIKaVH6Rp9uk/dZoG9XU/DowUxIFr4oIb7SNasK7c7SoCb+mkKnlwuHuZHiHjtc1L6nvCEPpxAWH9oppwHKh4cAV01KnexYYHx52FoZVIYAa0v9QVLcx2kadv2Ydnyq0e+O3qmK+7NxFt+0y+df/GX0TzwLmPOAP99agQCnEDhAAAAAASUVORK5CYII=);
          }
          &:nth-of-type(2) {
            .label {
              color: #e34275;
            }
          }
          &:nth-of-type(3) {
            .label {
              color: #61d5dc;
            }
          }
        }
      }
    }
    .card-bag-wrapper {
      margin-top: $spacing;
      .item {
        position: relative;
        color: #fff;
      }
      .item-con {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding-left: 120rpx;
        z-index: 1;
      }
      .iconimg-box {
        position: absolute;
        top: 0;
        left: 0;
        width: 120rpx;
        height: 100%;
        .iconimg {
          margin: auto;
        }
      }
      .card-number {
        position: absolute;
        top: 24rpx;
        right: 30rpx;
        font-size: 22rpx;
        z-index: 2;
      }
      .card-info {
        font-size: 26rpx;
        line-height: 36rpx;
        padding-top: 40rpx;
        .name {
          font-weight: 500;
        }
        .desc {
          font-size: 22rpx;
          line-height: 30rpx;
          padding-top: 10rpx;
          opacity: 0.7;
          padding-right: 30rpx;
        }
        .tag {
          width: 90rpx;
          height: 34rpx;
          font-size: 22rpx;
          line-height: 30rpx;
          border-radius: 6rpx;
          text-align: center;
          border: solid 1px rgba($color: #ffffff, $alpha: 0.6);
        }
      }
      // 社保卡 icon
      .iconimg-card-SSC {
        width: 84rpx;
        height: 76rpx;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL4AAACYCAMAAABtX6OEAAAAsVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+3mHKcAAAAOnRSTlMAIPtVUfcF9M2CLcS07ZlyuiQN6dPJ8Wvmi2BCEaiHTEc9G+A3GBUKBwK/rpTXoWVZKNuPfOOddzIDx/E0MwAAB3tJREFUeNrs2Nl2okAQBuBfFFQ0LigSFeO+Migat9T7P9icOZMZj9KFNILxgu9etNu/qrpBKpVKpVKpVCqVSqVSqdQLM/Rc9ZdTLhXc95aiNsZNs+asfxU7wxlem3a21maDWC2zV/S2eEWz/scqT2E0epaOl1KvlhSS0XCsDF7DudikKErWzxeDXXUpMqXszfGDJkeVHpM/bvEztE6B4uBM8HxLb0dxKfXxZNkmxanZxxMNChS38hZPMu1RApS2gWewWpSMRgeJ001KTm2EZFUVStJbDgmyyyRDbTrtanZYH9lzLOzR9jwceKdKzVWJdzSQlMmYwsqvPnJbDYxp9+QcSGw3AeNJwWk5G32Ju6b9T5cEVA8JWFYojEJxqMmctGuCJBURu4VD97n7LWTZln8GOnPEyy7d7xptHdHony26VpgiTqMm3WF25ojOOL3TFXeE+Mx2iR96F5vrBewyiItRoECOjhjM91dX/XEd8ZgH576sJ3MWfK8jDlqZAuwGCLawMzwbQD93sb569BQxqBAvv1+AUe9XK6vxm0JBLMAgVsHAwzrEK2WYUveOBwrjDEyIV9PwID1PHKWoQWRQppDyGmDRLZX+W+MxhkucQxcCXxuXQlsJs5l1rtL1iB4xmMG4NUnCBwD/B0ZflyUpQzwgx8fSgEBVpfCUtwGw9IWzAeDj0j5HiMxgC3CtQaBNAVSz1z5Zm46XzQ2G5/p0jj/q/o0BgNMlYEtE9UmMCkROxGruzxpEssJEAVX654SIzgo3aL8g4BGnNACnSLc8XP9+VUc0JRIz5xAwGmyFLsHyN9kt/trTt6aGKLokNp5BpMr3lwC+6sovfZW0RxQrEutCqMmtdgGe7Q+av2urGcjip/kvCM34Mg/QDXr84l96y5BXZjbTkIsaVSHAJ26Di9kh4A8PViexAcQ8YgQmdy06xV0Mle8RD1l7EuEflCU+bLwC3VA04SjJgSVViVk+xQwTPE29tz017iHBdBLaffEf4IxkvuWIa9PvaTKElA/ZOtTyxCjK3IUsABDEvwIpJgllwKoRIz8Fp00X3C5v6A8XMjRVnJ3AHsipLcMv2WCaiAoZE/kRZOdJOj4N3/5wr7YPkGGRUE72eB187BnRrR5EuqZ6gow1CdURwG4QyTX/Ad06QYJ0HRoIkiXeehHqfjNALAokoj7wRquQCfMiYIpYjElkjGBajXhvfdxy6cY74tHiDjzB5ivy4W9dc4VulBGP3+3b6XaqMBAA4CHKKniLCyKouIvWpWr11nn/B7un92g5liSAhNYffD9dMBxDZjIMBGlakCQ0kcPsJazOOojRRJoTJFrqyHEwYvH0ThXE2CCNAykEDrKpQ4isk3MSsUWGC6Rgt5BN9jk/4oAgJj9j4wvXyKZO2evDCgQ58pKGZEMXmazb/JfwuyMI8sbNvZLNTWTahKz6rweC2EhlCumAGLDqgwaIYiFN8wKpjSxkkOfw6TX2ugIsipiczYf07BM//5+k3tR7E1UCEQl/HTKwXUR27tRIe/Cwnz2gzQnSNJc5i7zRAjzibtMj4f+JMBUzewLI4ox0Xuz/ZQ5x+f8ScRTIZodUNRHVIvxL2xyQBVB0eaW67DvvkYDEG7u0UsyGc3PQEBV4X0SUGtcAFznNNl1y2P8531hmlZgzsJhV532aCl6oxa64vNfdZAGpSUi3o6UlPrPgocEDbMKauKl1kW5KK6L2mMEnENkKQ6aQku0gM3qYyXWAEUlc7R6pO7kziFRmwLJocW53xSLya+ziu/48MQT38tQUuNkTVe8B1VhDOlkCmCfeROpp0WQVfGO6fhec1aMEcVUXGY7U+mDAGP2pAY8yZG7KHm05Vl7vPtQPV8iihdRy+vg+57pNPOLD4zr8nHcxwRtS04PrCMaV4wmZXIlaA7boo8dBMf1IOm3DJLut1klFpqg/s8WN5rOvt9tKQd1gZwVsGbNazeCTQnjRxDjglSVBPnuVOZKeiRmpt8Tgg9YHc+PJuXvBIlWCDC5m4wzm7CV5D1fh+S65yM1DIaz3Bnw5MvtgJC02oXL6g7k1t9UFt9mmdgviViy65KZjHnJ7MFryEuloO2WsMLIFUbr4kKZmDt72F4j7fAiq+rbr/NW763P/9aVWAYDGkWCkH32v2PnTfK98Vw38j7ECmXjNb+uyQG8yspGtDXkF7UKfHvId5J7AFHJodA73h9uBaMYBubSHH76xjw7esYYgXqOPfFbdv0BWYWASvNeWoBA7GRM0174C6Y13ZvyQawUKYmwwkWp29pDCcjrQMM6qQHEWXYIpWKYezIBNqgxeLKTpz6FQRg1Tctrbd2/4MVPg6jLfjyqd7mtLRgY3gMLtLMyGqJbrWipJ/Ny6AT9gXidYgL4NP0QSfwKrKbA9+wm8DOGHSWsHxZDPBvyChVfD/Fx9Br/FOFqYh3X2l/CbwqDu4mPUflWBJ/Cha5gRaeujpxj7rTDYXamYjlpbVxvwdC6GV6+dCLKRialXbXhmiu3v9K25arcOrkOI05xstNpLv/unOh1foFQqlUqlUqlUKpVKpVLpaf0DqHC5K9vlEUsAAAAASUVORK5CYII=);
      }
      // 中国农业银行 icon
      .iconimg-card-ABC {
        width: 84rpx;
        height: 82rpx;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKgAAACkCAMAAAA0V5X9AAAAq1BMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Nr6iZAAAAOHRSTlMAgqCHt9xrcwT21fv5I3/x464NCO7pmGFSKsyoZzDHQ5GielceFbRxXEc/Gr6LThHCujVLOtnRnIRoCjYAAAelSURBVHja7ZzpdtowEEY/IBAb2xgwYPZ930NIMu//ZE33ItmWRwjac8r9D7pImtHIksGDBw8ePHjw4MGDv0Wf/uCIf5c3+oMi/i023coYP8jTH5Txi/W8O8VfpVVqfyplVKIrInrPtPCXCMLvc/K3aDFB9JN+WMX9aQ1rRClFX+kH/se9u7VXoU/Yop9UTrgfrU9Nruhvns64D17HoRSieVH0N5V75ABrbBMxRfckYJcC3JjzbxmOqER+j1tSbRDpicp83DBX9fJkTpTyNwuqgkt6ok2KxMlYuAHVDpG+aDRPVRjHeyPzovTmwTCnOt1ClGorGGVl021EyQlhkKVL14hOKImuwXCnaDpbjmj7w6FIFsb6M0azhSxH9AneKFp1DCPsI7+9fQK4okCvT1EUYICBGxWsXUBHFAhrURHVNJCXouK9v4GuKDZbkrHPuJJZmWR2FliizT9FYeWihqiFq7Aifr6/B3ii+wtRYB8x/MUqrmEYEUUe4kTzMaIrQRReOyKJGE5MHwFiRcsxogNRFEHWaOh7ciA1AL7oWhIF5BLcPUGXo9yfSBKtx4ieIkQh9+lbYGzlzCJR1I8RbUWJYkQiOVMDP0KyqB0j6kWKWh0p7/egw1aKS0sh6saIbiJFYVVI4N0yEfFHCwpRJ0b0EC0KS1r5n8EmKItrxxSmReH54mJyAJdnEthDW7QqiCaU1EMwOfhR38AJpppCNDqdut6Va2fbgoAqj7qpRIP361bSjSvMHQ8CyrXel+doFC0xCbbAISNtwNKIti9qVjmPRrKQFj8GQU2owawE0d8LyjhmI3RKErXyQg09Q3q6UsSnErWGNfcbjlNvWOKD3KeUCbvEPtlSH8Jl083/MFEUQnFaD5CWFV1yShYtQ0EuWXRAlyyRllHajJFNtfB5tWRRvNAF89Sh5As5WCVKxUamlMnlcplSt/WjlwqLQthcrderQtYlhWhPKKLShlMzdQrOkswOnwh1kUIUT/xNSUQra54o9YRZpxKVz3f6SEXVvqwRwRTtAjmmKIRSbaMz8gWuaAnIckXHOnE/FGY2V3SnIerJezM1l/XMC7iiOaDBEpWTfhkpmAkzji2aAXY8UXnsW/wputERHbNFW0L3sKdoETqiBZaoXHRTg/14ZHgv0Q4rk8o/rXkv0fCyKIWSAyf18kXTrvceVJxJ2EoaE60gCcsVRpJX3G8V9SBHNMtJ3wuo2KljiS/K/64ds2heGBTNcTa+I6iYM6YKT3THmXMvUNEXdkuJNMwFE14ZC410BENTJBIaHPqTUJbw8v0BiVjH9KLlDZB+ta9DxWU6C6AwfS39ZFyY7AeDScP+KmpXnrvdRSk3bIwqL9vttrPrVpHMlCl6uQ9BMkFUg11g0oKMYnRmTFH/orxXlYRg0OWs3TX1HOUMfXY08Cx8Ut14vfNqsly+zn40e252nxeLQrhsvg7Ovd56uZ0zhl4QVe8HZ+q13rFtm37j5vDJwiEJhWiLKZoX0hO/KBkAU4dYonJ6yjPzaAvQ2dyFxBcdCJUz7xhsrSE6AhYaohNhGVPxQX8Saoh2gLGG6Ji5aSqJw8jvUf4uVO6hEvNksaIh2gAWGqJH5n55LT8h4z/SKWiIlsXUwVpy3eBem7sZCQlcheUwwt6gaJNV5cmPq8b3Eh1GZQjGJ57utV1uR2Ubxhj4lr4o5+ywejnjJlCzofTh1zG2FZmQWGOoyadfIioc0UX6bypCRD2e9aSxf+GIFtIfcOyQhjD92G9N9ehSblPNzEn9zGLOEe0gnidlBKs/5c4Qy44jmk/9YLyid+Mpk9CAn17UWaR+4hKCeXSnPj9vDY/99vHlO0f3e8iGr98b9ivZUWW+7ff720ojTMg4h8sG/QAp6ej9QOQ0rzI8E6tojn3/qBwgHWO9VxaqNfEeQ1qsOl3wrNejC72Pvevfd6sdGC2yf9/G1r9CXBWieXdL0azQK1UIMJp0e7cTXUun6BxmdvTVPPOiQV7RocxLhCVdUX5DPKYuZ/D1RdeKm678a4Rv1VuIzsqKDuXPHZpriTLPAPIB2OxJoGRedEgCr+AjF5t706IhCVTMvDDgDsyKNh0xkjbQYsx5j4svunJ5rzNy9m61njnRtS2/kWDuPbba2ZToyieB+gbarB1p9JtmREOHRFa4ghKJOAUTomP2ma56mkoMg2tFq1kixQRlc3iPez1QX7RVJIn8DFeyyZOEP7lGNLRJou7harw6yXQ2uqLTOcnYJxjg5JOMX7B0RK2xTTLOCkYYuBRBe80XXRUpynMJQwx8imK75omu+hSFO4ExenWK5LhKLWrtozXJfr3Ln3/kS9M0ol6mTNH4Zxhl1qcYnKdwkyw67W4pjnoPhgkqFM97blCNFj0MdkWKpz2FeQouJZGvlOZCss1UypRII8At6L2RUewlTCEXEwZ56+F2LGtkCCcX4JYcGg6ZoN3Dren1DczOhYU7ENavHPWPKe5D9bl8hebIw/2wQt1U1WnhzjTbxKa+8/AX6O14M2A7sfC3WDdqafNRxsNfxVrljq5C0u+EM/wLBOvxS0zKstuNwtnCv0S113xuPLXf38r1mu3n+/OP3fOk9W85Pnjw4MGDBw8e/Dd8AUsppkGP1AygAAAAAElFTkSuQmCC);
      }
    }
    .button-wrapper {
      padding: $spacing * 2 68rpx $spacing;
    }
  }
</style>
