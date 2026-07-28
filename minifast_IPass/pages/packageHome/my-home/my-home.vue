<template>
  <view class="home h5-page">
    <div class="myhome_header">
      <div class="bg">
        <image :src="bgHeader" mode=""></image>
      </div>
      <div class="home-qr" @click="handleAddFamilyMember('code')" v-if="!config.isCompileToTianfuCitizenCloud">
        <image :src="homeQr" mode=""></image>
        <div class="label">我的家庭码</div>
      </div>
    </div>

    <div class="members" :class="[members.length > 0 ? '' : 'no-member']">
      <div class="panel-content">
        <scroll-view scroll-x>
          <view class="members_scroll">
            <view class="member" v-for="(item, index) in members" :key="item.idCard">
              <view class="member_img">
                <view class="head_out" @click="handleJumpRoute('home-member', 'packageHome', index)">
                  <image v-if="item.idCard != idCard" :src="head" alt="" />
                  <ComponentAvatar size="90rpx" v-else></ComponentAvatar>
                </view>
                <div
                  class="iconimg"
                  v-if="isCanDeleteMember && item.idCard != idCard"
                  @click="handleDeleteFamilyMemberItem(item.idCard)"></div>
              </view>
              <view class="member_text">
                {{ useTMUserName(item.userName) }}
              </view>
            </view>
            <view class="member_add">
              <view class="member_img" @click="handleAddFamilyMember"> </view>
            </view>
            <view class="member_remove">
              <view class="member_img" @click="handleDeleteFamilyMember"> </view>
            </view>
          </view>
        </scroll-view>
      </div>
    </div>

    <div class="family-news-wrapper">
      <ComponentPanel
        title="我的家庭动态"
        :buttonText="familyNewsButtonText"
        @click="
          handleJumpRoute('news', 'packageHome', {
            idCardList: idCardList
          })
        ">
        <div class="panel-content">
          <div class="items" v-if="familyNews.length > 0">
            <div class="item" v-for="item in familyNews" :key="item.id">
              <div class="name cell d-f ai-c">
                <span>{{ item.aac003 }}</span>
                <span>（{{ item.aac002 | TMIdcard }}）</span>
              </div>
              <div class="desc cell d-f ai-c">
                <div class="left">
                  <span>{{ item.chi031_desc }}</span>
                  <span :class="[item.chb014 == '支付成功' ? 'success' : 'fail']">{{ item.chb014 }}</span>
                </div>
                <div class="time">{{ item.time }}</div>
              </div>
            </div>
          </div>
          <ComponentNoData tip="未查询到相关数据" v-else></ComponentNoData>
        </div>
      </ComponentPanel>
    </div>

    <div class="enjoy-project-wrapper">
      <ComponentPanel title="我家享受的补贴" :buttonText="enjoyProjectButtonText" @click="handleShowMoreEnjoyProject">
        <div class="panel-content">
          <div class="items" v-if="enjoyProjectData.length > 0">
            <block v-for="(item, index) in enjoyProjectData" :key="item.id">
              <div class="item d-f ai-c" v-if="index < showEnjoyProjectNum">
                <div class="avatar d-f">
                  <img :src="item.avatarUrl" />
                </div>
                <div class="right d-f ai-c">
                  <div class="iconimg"></div>
                  <div class="subsidies d-f ai-c">
                    <span class="desc">{{ item.chi031_desc }}</span>
                    <span v-if="item.userName" class="name">({{ item.userName }})</span>
                  </div>
                </div>
              </div>
            </block>
          </div>
          <ComponentNoData tip="未查询到相关数据" v-else></ComponentNoData>
        </div>
      </ComponentPanel>
    </div>

    <div class="one-pass-wrapper">
      <ComponentPanel title="我家的一卡通">
        <div class="panel-content">
          <div class="items">
            <block v-for="item in onePassData" :key="item.id">
              <div
                class="item"
                @click="
                  handleJumpRoute(item.name, item.packageName, {
                    type: item.params.type,
                    name: item.params.name,
                    idCardList: idCardList
                  })
                ">
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
  </view>
</template>

<script>
  import bgHeader from './images/bg-header.png'
  import head from './images/head.png'
  import homeQr from './images/home-qr.png'

  import ComponentAvatar from '@/components/common/ez-avatar/ez-avatar.vue'
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
  import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
  import ComponentImg from '@/components/common/ez-img/ez-img.vue'

  import { navigateTo, showModal } from '@/utils/uni-api' // 封装过后的api，推荐使用。方便以后统一修改，便于维护。
  import {
    requestWXGetMyFamilyInfo,
    requestWXInsertFamily,
    requestWXDeleteFamilyNumber,
    requestWXDeleteFamily,
    requestWXGetMyFamilyUser,
    requestFFGetDynamicByFamily,
    requestFFGetChi031ByFamily,
    requestFFGetMyFamilyEcard
  } from '@/service/api'
  import { USER_INFO, UPDATE_FAMILY_MEMBERS } from '@/store/constants'
  import { mapGetters } from 'vuex'
  import { useTMUserName } from '@/hooks'
  import config from '@/config'

  const { familyMemberLimit } = config

  export default {
    data() {
      return {
        bgHeader,
        head,
        homeQr,
        // 本地图片
        images: {
          test: {
            src: '', // 本地图片
            httpSrc: '' // 网络图片
          }
        },
        familyNews: [], // 家庭动态
        members: [], // 家庭成员列表
        familyId: '', // 家庭id
        createIdCard: '', // 创建家庭者id

        enjoyProjectData: [], // 享受补贴数据
        showEnjoyProjectNum: 3, //显示享受补贴数据的个数

        // 一卡通金额
        onePassData: [
          {
            id: 'yfje',
            label: '已发金额',
            amount: '0',
            stage: '0',
            num: '0',
            name: 'subsidy-amount',
            packageName: 'packageHome',
            params: {
              type: '01',
              name: '已发金额'
            }
          },
          {
            id: 'shz',
            label: '审核中',
            amount: '0',
            stage: '0',
            num: '0',
            name: 'subsidy-amount',
            packageName: 'packageHome',
            params: {
              type: '02',
              name: '审核中'
            }
          },
          {
            id: 'bydz',
            label: '本月到账',
            amount: '0',
            stage: '0',
            num: '0',
            name: 'subsidy-amount',
            packageName: 'packageHome',
            params: {
              type: '03',
              name: '本月到账'
            }
          }
        ],
        isCanDeleteMember: false, // 是否可删除家庭成员

        idCard: '', // 当前用户身份证号
        idCardList: '', // 家庭所有成员身份证号
        loadTime: 0, // 加载次数 解决多次加载bug
        config,
        useTMUserName
      }
    },
    components: {
      ComponentPanel,
      ComponentNoData,
      ComponentImg,
      ComponentAvatar
    },
    onShow() {
      this.initData()
    },
    onHide() {
      this.loadTime = 0
    },
    methods: {
      // 初始化数据
      initData() {
        const { idCard, user_id } = this.userInfo
        if (!user_id) {
          return
        }
        const loadTime = this.loadTime
        if (loadTime > 0) {
          return
        }
        this.loadTime++
        this.idCard = idCard
        this.requestGetMyFamilyInfo()
      },
      // 获取时间间隔
      getTimeSpace(time) {
        let str = ''
        time = time.replace(/-/g, '/')
        let startTime = new Date(time)
        let endeTime = new Date()
        let dateDiff = endeTime.getTime() - startTime.getTime()
        let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)) // 计算出相差天数
        let leave1 = dateDiff % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
        let hours = Math.floor(leave1 / (3600 * 1000)) // 计算出小时数
        var leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000)) // 计算相差分钟数
        if (dayDiff > 1) {
          str = dayDiff + '天之前'
        } else if (hours > 1) {
          str = hours + '小时之前'
        } else {
          str = minutes + '分钟之前'
        }
        return str
      },
      // 家庭信息查询
      requestGetMyFamilyInfo() {
        const { userName, idCard } = this.userInfo
        const setDefault = () => {
          this.idCardList = idCard
          this.members = [
            {
              id: idCard,
              idCard: idCard,
              userName: userName
            }
          ]
          this.$store.commit(UPDATE_FAMILY_MEMBERS, this.members)
        }
        requestWXGetMyFamilyInfo(idCard)
          .then((res) => {
            const data = res.data
            if (data && data.FAMILYID) {
              const { FAMILYID, IDCARD, FAMILYNAME, CREATETIME } = data
              this.familyId = FAMILYID
              this.createIdCard = IDCARD
              this.requestWXGetMyFamilyUser(FAMILYID)
            } else {
              setDefault()
              this.requestGetFamilyDynamic()
            }
          })
          .catch((err) => {
            // 请求失败 清空所有数据
            setDefault()
            this.familyNews = []
            this.enjoyProjectData = []
            const onePassData = [...this.onePassData]
            const newOnePassData = []
            onePassData.forEach((item) => {
              item = {
                ...item,
                amount: 0,
                stage: 0,
                num: 0
              }
              newOnePassData.push(item)
            })
            this.onePassData = [...newOnePassData]
          })
      },
      // 家庭动态
      requestGetFamilyDynamic() {
        const idCardList = this.idCardList
        requestFFGetDynamicByFamily(idCardList, 1, 3)
          .then((res) => {
            const { list } = res
            if (list) {
              const newList = []
              const len = list.length
              for (let i = 0; i < len; i++) {
                const item = list[i]
                item.time = this.getTimeSpace(item.aae036)
                newList.push(item)
              }
              this.familyNews = [...newList]
            } else {
              this.familyNews = []
            }
          })
          .catch(() => {
            this.familyNews = []
          })
          .finally(() => {
            this.requestGetChi031ByFamily()
            this.requestGetMyFamilyEcard()
          })
      },
      // 获取家庭成员
      requestWXGetMyFamilyUser(familyId) {
        const setDefault = () => {
          const { idCard, userName } = this.userInfo
          this.members = [
            {
              id: idCard,
              idCard: idCard,
              userName: userName
            }
          ]
          this.$store.commit(UPDATE_FAMILY_MEMBERS, this.members)
        }
        requestWXGetMyFamilyUser(familyId)
          .then((res) => {
            const data = res.data
            if (data) {
              let newList = []
              let idCardList = ''
              const len = data.length
              for (let i = 0; i < len; i++) {
                const item = data[i]
                newList.push({
                  id: item.id,
                  idCard: item.idCard,
                  createIdCard: this.createIdCard,
                  userName: item.userName,
                  familyId: item.familyId,
                  handleTime: item.handleTime,
                  joinTime: item.joinTime
                })
                idCardList = idCardList + item.idCard + ','
              }

              this.members = [...newList]
              this.idCardList = idCardList
              this.$store.commit(UPDATE_FAMILY_MEMBERS, newList)
              this.requestGetFamilyDynamic()
            } else {
              setDefault()
            }
          })
          .catch(() => {
            setDefault()
          })
      },
      // 请求 创建家庭
      requestInsertFamily(idCard, userName) {
        return new Promise((resolve, reject) => {
          requestWXInsertFamily(idCard, userName)
            .then((res) => {
              const { data } = res
              if (data) {
                resolve(data)
              } else {
                reject(res)
              }
            })
            .catch((err) => {
              reject(err)
            })
        })
      },
      // 家庭享受的补贴项目
      requestGetChi031ByFamily() {
        const idCardList = this.idCardList
        requestFFGetChi031ByFamily(idCardList)
          .then((res) => {
            const { list } = res
            if (list) {
              const newList = []
              const members = this.members
              let len = list.length
              const memberLen = members.length
              for (let i = 0; i < len; i++) {
                const item = list[i]
                // 从家庭人员中添加姓名
                for (let j = 0; j < memberLen; j++) {
                  const jItem = members[j]
                  if (jItem.idCard === item.aac002) {
                    item.userName = jItem.userName
                    break
                  }
                }
                if (item.chi031_desc.includes('补贴')) {
                  item.type = 'subsidy'
                }
                newList.push(item)
              }
              this.enjoyProjectData = [...newList]
            } else {
              this.enjoyProjectData = []
            }
          })
          .catch(() => {
            this.enjoyProjectData = []
          })
      },
      // 我的家一卡通概况查询
      requestGetMyFamilyEcard() {
        const idCardList = this.idCardList
        const setDefault = () => {
          const onePassData = [...this.onePassData]
          const newOnePassData = []
          onePassData.forEach((item) => {
            item = {
              ...item,
              amount: 0,
              stage: 0,
              num: 0
            }
            newOnePassData.push(item)
          })
          this.onePassData = [...newOnePassData]
        }
        requestFFGetMyFamilyEcard(idCardList)
          .then((res) => {
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
              } else {
                setDefault()
              }
            } else {
              setDefault()
            }
          })
          .catch(() => {
            setDefault()
          })
      },
      // 请求 删除家庭成员
      requestDeleteFamilyNumber(idCard) {
        const familyId = this.familyId
        requestWXDeleteFamilyNumber(idCard, familyId).then(() => {
          showModal('删除成功').then(() => {
            this.requestGetMyFamilyInfo()
          })
        })
      },
      // 请求 删除家庭
      requestDeleteFamily() {
        const familyId = this.familyId

        requestWXDeleteFamily(familyId).then((res) => {
          showModal('删除成功').then(() => {
            this.requestGetMyFamilyInfo()
          })
        })
      },
      // 家庭成员删除按钮 回调函数
      handleDeleteFamilyMember() {
        const members = this.members
        const createIdCard = this.createIdCard
        const { idCard } = this.userInfo
        if (!createIdCard) {
          showModal('暂无可删除的非本人家庭成员')
          return
        }
        // 创建者和当地用户同人 才可以删除
        if (createIdCard === idCard) {
          if (members.length < 2) {
            showModal('暂无可删除的非本人家庭成员')
            return
          } else {
            this.isCanDeleteMember = !this.isCanDeleteMember
          }
        } else {
          showModal('只有家庭创建人才能删除家庭成员！')
        }
      },
      // 删除家庭成员
      handleDeleteFamilyMemberItem(idCard) {
        const members = this.members
        const len = members.length
        const createIdCard = this.createIdCard
        if (idCard !== createIdCard) {
          showModal('是否确定删除该成员？').then((res) => {
            this.requestDeleteFamilyNumber(idCard)
          })
        } else {
          showModal('是否确定删除这个家庭？').then((res) => {
            this.requestDeleteFamily()
          })
        }
      },
      // 添加家庭成员
      handleAddFamilyMember(type) {
        const nowNum = this.members.length
        if (nowNum >= parseInt(familyMemberLimit || 20)) {
          showModal('家庭成员已添加至此最大数量，请删除其他成员后再添加！')
          return
        }
        const familyId = this.familyId
        const { userName, idCard } = this.userInfo
        let name = ''
        if (type === 'code') {
          name = 'home-code'
        } else {
          name = 'home-add'
        }
        if (familyId) {
          this.handleJumpRoute(name, 'packageHome', { familyId })
        } else {
          this.requestInsertFamily(idCard, userName).then((res) => {
            const { familyId } = res
            this.familyId = familyId
            this.createIdCard = idCard
            this.handleJumpRoute(name, 'packageHome', { familyId })
          })
        }
      },
      // 查看更多享受的补贴项目
      handleShowMoreEnjoyProject() {
        const enjoyProjectData = this.enjoyProjectData
        const showEnjoyProjectNum = this.showEnjoyProjectNum
        const len = enjoyProjectData.length
        if (showEnjoyProjectNum === 3) {
          this.showEnjoyProjectNum = len
        } else {
          this.showEnjoyProjectNum = 3
        }
      },
      // 跳转路由
      handleJumpRoute(name, packageName, params) {
        const { user_id } = this.userInfo
        if (user_id) {
          // console.log(params, 'params')
          if (name === 'home-member') {
            const members = this.members
            const member = members[params]
            console.log(member, 'member')
            navigateTo(name, packageName, member)
          } else {
            navigateTo(name, packageName, params)
          }
        } else {
          showModal('请登录后再访问').then(() => {
            navigateTo('login', 'packageCommon')
          })
        }
      }
    },
    computed: {
      ...mapGetters([USER_INFO]),
      familyNewsButtonText() {
        const familyNews = this.familyNews
        const len = familyNews.length
        let str = ''
        if (len > 0) {
          str = '查看更多'
        }
        return str
      },
      enjoyProjectButtonText() {
        const enjoyProjectData = this.enjoyProjectData
        const showEnjoyProjectNum = this.showEnjoyProjectNum
        const len = enjoyProjectData.length
        let str = ''
        if (len > 3) {
          if (showEnjoyProjectNum === 3) {
            str = '展开全部'
          } else {
            str = '收起'
          }
        }
        return str
      }
    },
    watch: {
      'userInfo.user_id': {
        handler(val) {
          if (val) {
            this.initData()
          }
        },
        immediate: true
      }
    },
    onPullDownRefresh() {
      this.loadTime = 0
      this.initData()
    }
  }
</script>

<style lang="scss" scoped>
  .home {
    width: 100%;
    padding-bottom: $spacing;
  }
  .myhome_header {
    width: 100%;
    height: 420rpx;
    position: relative;
    .bg {
      image {
        width: 100%;
        height: 420rpx;
      }
    }

    .home-qr {
      position: absolute;
      top: 66rpx;
      right: 64rpx;
      font-size: 24rpx;
      line-height: 32rpx;
      font-weight: 400;
      color: #303030;
      text-align: center;

      image {
        width: 96rpx;
        height: 93rpx;
      }

      .label {
        position: absolute;
        left: 50%;
        bottom: -32rpx;
        transform: translateX(-50%);
        white-space: nowrap;
      }
    }
  }

  .members {
    width: 690rpx;
    margin: 0 auto;
    min-height: 188rpx;
    background-color: #ffffff;
    box-shadow: 0rpx 2rpx 24rpx 0rpx rgba(8, 76, 192, 0.15);
    border-radius: 12rpx;

    .members_scroll {
      padding-top: 36rpx;
      display: flex;
      padding-left: 32rpx;

      .member {
        margin-right: 36rpx;
        &.no-member {
          padding-left: 48rpx - 14rpx;
        }
        .member_img {
          width: 90rpx;
          height: 90rpx;
          background-size: 100%;
          display: block;
          position: relative;

          .head_out {
            position: absolute;
            border-radius: 50%;
            width: 90rpx;
            height: 90rpx;
            overflow: hidden;
            top: 0;
            left: 0;
            image {
              width: 90rpx;
              height: 90rpx;
            }
          }
          .iconimg {
            z-index: 1;
            position: absolute;
            top: -15rpx;
            left: -17rpx;
            width: 44rpx;
            height: 44rpx;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAMAAABGS8AGAAAAS1BMVEUAAAD/qqr3Zmb2Zmb3aGj/a2v3Zmb2Z2f3Z2f2Z2f3Zmb3Z2f3Z2f2Zmb3Z2f3Zmb4Z2f4aGj6Zmb4aWn4Zmb2Zmb////96+v6r6+ZmU52AAAAFXRSTlMAA9vKfg/w7N/OxbqjjmNaTUc3JyN/1NwPAAABO0lEQVRYw+3YaW7DIBAF4IbF4N2x85rc/6T9bzXDLBG1VL4DPKExBma+mqZp/rG4hcnnBKTsp7DFz6Q+gseJDw9r6m0d8KthvVliF4e33KKO3nuQ+l233BlFs2LRcQTDKN4hhwOLO2S59w5M3V2UCwFB8tFBoGNXIzqIuMjcZyOERt6umyE2s/43KOyMQvRQ6MvFWKCyFBfsoOJKS16htBaCBygNhXsIavRtFaAWyGAPNU/lRhhEIniDwSYvsb3IEwwm+bezf70Mg0wEJxgkIhgnr2/CCyeC4CcV/BQEJ30wXYpsKUWuvd3sP0jtX9p+CFU+Nu0Hfe2ryX6ZVr7+7Q+Wyk8s+6Ow8jPW/vCu3CrYm5u67Zi9gfz7llfWpF9jrMAfhFxndMMaNl1tPFYY6F1zBPlmaNo0TfMZPxo49nWJ09vfAAAAAElFTkSuQmCC);
          }
        }

        .member_text {
          font-size: 24rpx;
          text-align: center;
        }
      }

      .member_add .member_img {
        margin-right: 26rpx;
        background-image: url(data:image/png;base64,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);
        border-radius: 50%;
        width: 110rpx;
        height: 106rpx;
        background-size: 100%;
        background-position: 50% 50%;
        display: block;
        overflow: hidden;
      }

      .member_remove .member_img {
        margin-right: 36rpx - 28rpx;
        width: 90rpx;
        height: 90rpx;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAADUCAMAAADA173eAAAAXVBMVEUAAABHR0e6urpOTk5HR0dKSkpHR0dRUVFJSUlJSUlISEhHR0dJSUlJSUlISEhLS0tHR0dHR0dLS0tJSUlJSUlJSUlKSkpHR0eKioq6urq7u7u7u7u7u7u+vr66urqWyx/jAAAAHnRSTlMAZc8KXhpRBT84VEkqHyYVQlkOMy4jEkwIueekdB/XkgQ0AAAEVUlEQVR42u3d2XbbIBAG4PnLIkD7Ytnp9v6PWcnOaVrnnCaOZYL+8t3nAkcaZgYEkmVZlmVZlmVZlmVZlmVZ9v9RpvKuK23oNdAKkcpqvHg9OCU7NgL/GlyL4OtCdqrG3+arfyxW1hvZowHQthub2rSDKuSaw7Pez5K8k1yZC/mHDi/slPYLaMpbw2FR+4DfynRfv9oCcHIzdXAaZ1YSdQg4K+QDikOJRSNJanpchEE+Rk1BJ/lUmoCL0sgtdjCjqw4Xbgfh/EaVxplP8Ye/U6Gx6gZh1AAIRh7gIJ+v1JU8QoPj5z/pqpBHGDSg95lRv63DahRKpxKLFB7Nhxix6jnjsBiNhaZqvLxQR4A4rHisDhJN1Uk8I1aVRFIBTuKpsKoligMWXuJp1gmhkBgMVkYiqnWk5kqrLw9JVG2csQ064V7HnVR/CV2UjsS57HgJlJQMFkehpDQATVqBHLEgzWGLDsAkrA66FF4qgWb+4ITWRJtDiEzEAVtOGkAnpCri+UgkAAhCyvDWXM9t9l5IKSxSWN16CM/81qlLF4dUt91+HDOeJC3zdnNdCe0SW0UqAZQbPeHJ7d41gPaygSnF2OSaQrZgievvGQvWGsMDoG0u9MQTpgGQ5jbIjZ5K2o6MJS6eCuZYWac4g2/F8y5ZiQTiVlPhLcA6ESwKvh3nO6ESqzO30x41b37Rpvxl0xYJhhZWmjh7Eks8CYvj3aklMjLnhg1zrVkzryAb5t4V9Sw+M1fS6q71Yxtsyv/2+/IvLCRdBRZRBvfj29efm/n67Ye8g1vclZkW8j5ffm7qizxaf0Pa/fRzU0/yaAHAIO9z+v70ZTNP30/yaDa9BePtlMwFU0e8NieOeIlHPO+HOyIVczVomGsKRd8ZpF3ksX3paQdHO7DkGUP821sgsGa+eRfJXlHvIrHEJUsB4gSjZs57HfErV2jiFsiB+TuzkvipVFjMsgHTJdclmjaKlW2fYJpjAUysn+LVR0Al9T3XpoZqsx4YaLeUWub2Zc182IME4hlTDljQbifukwyYG2noz+mgLQ0N8fmBIh1zI01pdLRTnTRJ5M6089FCacs7vBLQrGFtJD4XNZ8dulMlcQ7oiF84T/zCTVj0St5pVzdyNVjoQSKYdC1RmXhXhYzRz7qz0QJli+iHMKoQ7eesEL10VSHmJSG3LETsbBfaAStHupnAaCwsaaLXauarjoYe4D2oTh0B4uWfMcU1182Yxx1IotynVzfqUbPBpGkXc01I+orqe28TJp1FB6cBUPYnZ4ezJBcmvJE7tCUuQoqZjwH6SckHKVz0yW01OyuxKut7/jwkeqD9gGe6a9THNrzYdDMeU+K34E0hN3Ipvmsv1GRx9nZSfWqbBEPiG2bf46KSa4VSc2vqZnRW7/W+COMtFvPrzuqLPd/TV9Tevuor/Yms9381OG0dUR1faQ3dB1t2zldmf8Eky7Isy7Isy7Isy7Isy7Lsbr8A6lE4jjbeYkcAAAAASUVORK5CYII=);
        border-radius: 50%;
        width: 110rpx;
        height: 106rpx;
        background-position: 50% 50%;
        background-size: 100%;
        display: block;
        overflow: hidden;
      }
    }
  }

  .panel-wrapper.head_imgs {
    margin-top: unset;
  }
  .family-news-wrapper {
    padding-top: $spacing;
    .items {
      width: 100%;
    }
    .item {
      background-color: #ffffff;
      box-shadow: 0rpx 2rpx 24rpx 0rpx rgba(8, 76, 192, 0.15);
      border-radius: 8rpx;
      padding: 20rpx;
      color: $color;
      font-size: 26rpx;
      line-height: 1.4;
      margin-bottom: 20rpx;
      .name {
        font-weight: 500;
        font-size: 28rpx;
      }
      .desc {
        color: $color-placeholder;
        .left {
          flex: 1;
          margin-right: 20rpx;
        }
        .fail {
          color: #f00;
        }
        .success {
          color: $primary;
        }
      }
    }
  }
  .enjoy-project-wrapper {
    padding-top: $spacing;
    .item {
      background-color: #ffffff;
      box-shadow: 0rpx 2rpx 24rpx 0rpx rgba(8, 76, 192, 0.15);
      border-radius: 8rpx;
      padding: 20rpx;
      color: $color;
      font-size: 28rpx;
      line-height: 1.4;
      margin-bottom: 20rpx;
      .subsidies {
        .desc {
          flex: 1;
          @include textOverflow(1);
        }
      }
    }
  }
  .one-pass-wrapper {
    padding-top: $spacing;
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
</style>
