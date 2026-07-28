<template>
  <div class="sunshine h5-page page-wrapper">
    <div class="sunshine-header">
      <div class="header-bg">
        <ComponentImg :path="images.header" width="346rpx" height="224rpx"></ComponentImg>
      </div>
      <div class="header-con">
        <div class="weather-wrapper">
          <ComponentWeather></ComponentWeather>
        </div>
        <!-- #ifdef MP-WEIXIN -->
        <div class="share">
          <button openType="share">
            <ComponentImg :path="images.share" width="64rpx" height="60rpx"></ComponentImg>
          </button>
          <div class="text">
            <ComponentImg :path="images.shareText" width="300rpx" height="56rpx"></ComponentImg>
            <p>一卡通分享，把补贴晒出来</p>
          </div>
        </div>
        <!-- #endif -->
      </div>
    </div>

    <div class="overview-wrapper card-wrapper">
      <ComponentPanel
        :title="userInfo.aac021 || '-- -- --'"
        :buttonText="buttonText"
        :level="2"
        @click="handleUpdateAddress">
        <div class="panel-content">
          <div class="picker-wrapper d-f ai-c">
            <ComponentPicker
              v-model="issueNumber"
              :range="issueNumberRangeNew"
              rangeKey="name"
              valueKey="key"
              width="372rpx"></ComponentPicker>
            <div class="unit">期</div>
            <div class="label f-1">阳光发放公示</div>
          </div>
          <div class="people d-f ai-c">
            <div class="left d-f ai-c">
              <div class="iconimg iconimg-people-total"></div>
              <div class="cell">
                <div class="value PangMenZhengDao">
                  {{ (villageInfo.aac002Count || 0) + '人' }}
                </div>
                <div class="desc">补贴申报总人数</div>
              </div>
            </div>
            <div class="right d-f ai-c">
              <div class="iconimg iconimg-people-declare"></div>
              <div class="cell">
                <div class="value PangMenZhengDao">
                  {{ (villageInfo.subsidyNumber || 0) + '人' }}
                </div>
                <div class="desc">本期申报人数</div>
              </div>
            </div>
          </div>
          <div class="issue d-f ai-c jc-sb">
            <block v-for="item in issueInfo" :key="item.id">
              <div
                class="item"
                :class="[item.id]"
                @click="
                  handleJumpRoute('subsidy', 'packageDetails', {
                    chb018: userInfo.chb018,
                    aae209: issueNumber,
                    YBType: item
                  })
                ">
                <i class="iconimg" :class="['iconimg-issue-' + item.id]"></i>
                <div class="value PangMenZhengDao">
                  {{ item.num + '笔' }}
                </div>
                <div class="desc">{{ item.name }}</div>
              </div>
            </block>
          </div>
          <div class="follow">
            <ComponentImg :path="images.follow" width="166rpx" height="40rpx"></ComponentImg>
            <p>关注本村{{ userInfo.aac002_count || 0 }}人</p>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <div class="pos-height"></div>

    <div class="SSC-wrapper">
      <ComponentPanel
        title="社保卡情况"
        @click="
          handleJumpRoute('SSC', 'packageDetails', {
            chb018: userInfo.chb018
          })
        ">
        <div class="panel-content d-f ai-c jc-sb">
          <div class="left">
            <div class="item">
              <div class="cell d-f ai-c jc-sb">
                <div class="key">未办卡数</div>
                <div class="value">
                  {{ villageInfo.notHandleCardNumber || '--' }}
                </div>
              </div>
              <div class="bar-bg">
                <div
                  class="bar"
                  :style="{
                    width: (100 - villageInfo.RateCard || 0) + '%'
                  }"></div>
              </div>
            </div>
            <div class="item">
              <div class="cell d-f ai-c jc-sb">
                <div class="key">已办卡数</div>
                <div class="value">
                  {{ villageInfo.handleCardNumber || '--' }}
                </div>
              </div>
              <div class="bar-bg">
                <div class="bar" :style="{ width: (villageInfo.RateCard || 0) + '%' }"></div>
              </div>
            </div>
          </div>
          <div class="right">
            <ComponentImg :path="images.rate" width="212rpx" height="176rpx"></ComponentImg>
            <div class="content">
              <div class="value PangMenZhengDao">
                {{ (villageInfo.RateCard || 0) + '%' }}
              </div>
              <div class="key">办卡率</div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- 补贴项目概况 -->
    <div class="project-wrapper">
      <ComponentPanel title="补贴项目概况">
        <div class="panel-content">
          <scroll-view scroll-x class="scroll-view">
            <div class="progress-bar-items d-f" :style="{ width: 196 * subsidyRank.length - 16 + 'rpx' }">
              <block v-for="(item, index) in subsidyRank" :key="item.id">
                <div class="progress-bar-item">
                  <ComponentImg :path="images.process" width="126rpx" height="126rpx"></ComponentImg>
                  <div class="value PangMenZhengDao">
                    {{ (item.aac002_count || '--') + '人' }}
                  </div>
                  <div class="name d-f">
                    <div class="index">{{ index + 1 }}</div>
                    <div class="label">{{ item.chi031_desc || '暂无' }}</div>
                  </div>
                </div>
              </block>
            </div>
          </scroll-view>
          <div class="picker-wrapper d-f ai-c jc-sb">
            <div class="label f-1">项目补贴</div>
            <ComponentPicker
              rangeKey="name"
              valueKey="code"
              width="460rpx"
              v-model="chi031"
              placeholder="请选择补贴项目"
              :range="chi031Range"></ComponentPicker>
          </div>
          <div class="items">
            <block v-for="(item, index) in subsidyList" :key="index">
              <div class="item">
                <div class="name d-f ai-c jc-sb">
                  <div class="left d-f ai-c">
                    <div class="iconimg iconimg-subsidy"></div>
                    <div class="f-1">{{ item.chi031_desc }}</div>
                  </div>
                </div>

                <div class="basic-info">
                  <div class="cell d-f ai-c">
                    <div class="key">姓名：</div>
                    <div class="value f-1">{{ item.aac003 }}</div>
                  </div>
                  <div class="cell d-f ai-c">
                    <div class="key">身份证：</div>
                    <div class="value f-1">{{ item.aac002 | TMIdcard }}</div>
                  </div>
                </div>

                <div class="issue-info">
                  <div class="cell d-f ai-c">
                    <div class="key">发放期号：</div>
                    <div class="value f-1">{{ item.aae209 }}</div>
                  </div>
                  <div class="cell d-f ai-c">
                    <div class="key">发放金额：</div>
                    <div class="value f-1">{{ item.aae019 }}元</div>
                  </div>
                  <div class="cell d-f ai-c" v-if="item.chb01e == '7'">
                    <div class="key">发放时间：</div>
                    <div class="value f-1">{{ item.aae036 }}</div>
                  </div>
                  <div class="cell d-f ai-c green">
                    <div class="key">发放状态：</div>
                    <div class="value f-1">{{ item.chb01e_desc }}</div>
                  </div>
                </div>
                <div class="button-wrapper">
                  <ComponentButton
                    name="查询发放进度"
                    type="primary"
                    width="220rpx"
                    height="60rpx"
                    @click="handleQueryGrantProcess(item)"></ComponentButton>
                  <ComponentButton
                    v-if="areaCode === '511100'"
                    name="投诉"
                    type="secondary"
                    width="220rpx"
                    height="60rpx"
                    @click="handleJumpRouteComplaint(item)"></ComponentButton>
                </div>
              </div>
            </block>
          </div>
          <div class="button-wrapper" v-if="isExceedLimit">
            <ComponentLoadMore
              :isOver="isLoadOver"
              height="76rpx"
              name="加载更多"
              type="primary"
              @click="handleClickLoadMore"></ComponentLoadMore>
          </div>
          <div v-if="subsidyList.length < 1">
            <ComponentNoData tip="未查询到相关补贴数据"></ComponentNoData>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- 户籍地址选择 -->
    <ComponentSelectAddress
      v-model="showAddressPopup"
      @change="handleChangeAddress"
      :address="address"
      requestSystemType="FFDS"
      :DValue="2"
      :level="3"
      idKey="orgid"
      :filter="addressFilter"
      renderKey="orgname"></ComponentSelectAddress>
    <ComponentPopupNotice></ComponentPopupNotice>
  </div>
</template>
<script>
  import ComponentImg from '@/components/common/ez-img/ez-img.vue'
  import ComponentButton from '@/components/common/ez-button/ez-button.vue'
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
  import ComponentWeather from '@/components/common/ez-weather/ez-weather.vue'
  import ComponentAvatar from '@/components/common/ez-avatar/ez-avatar.vue'
  import ComponentLoadMore from '@/components/common/ez-load-more/ez-load-more.vue'
  import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
  import ComponentPopupNotice from '@/components/common/ez-popup-notice/ez-popup-notice.vue'

  import ComponentNews from '@/components/project/ez-news/ez-news.vue'
  import ComponentPicker from '@/components/project/ez-picker/ez-picker.vue'
  import ComponentSelectAddress from '@/components/project/ez-select-address/ez-select-address.vue'

  import config from '@/config'
  import { IMAGE_TABBAR_SUNSHINE, IMAGE_COMMON } from '@/config/constants'
  import { getShareConfig } from '@/utils/get'
  import { navigateTo, showModal, showLoading, hideLoading } from '@/utils/uni-api'
  import {
    requestB116,
    requestB118,
    requestDSGetVillageCountInfo,
    requestDSGetSubsidyRanking,
    requestDSGetVillageDetailInfo
  } from '@/service/api'
  import { M_UPDATE_USER_INFO, USER_INFO, M_UPDATE_USER_LIST } from '@/store/constants' // 常量
  import { mapGetters } from 'vuex'
  import { useJumpToLogin } from '@/hooks'

  const imageFollow = IMAGE_TABBAR_SUNSHINE + 'follow.png'
  const imageHeader = IMAGE_COMMON + 'bg-01.png'
  const imageProcess = IMAGE_TABBAR_SUNSHINE + 'process.png'
  const imageRate = IMAGE_TABBAR_SUNSHINE + 'rate.png'
  const imageShareText = IMAGE_TABBAR_SUNSHINE + 'share-text.png'
  const imageShare = IMAGE_TABBAR_SUNSHINE + 'share.png'
  export default {
    name: 'pageTabbarSunshine',
    data() {
      return {
        // 本地图片
        images: {
          share: {
            src: imageShare, // 本地图片
            httpSrc: '' // 网络图片
          },
          header: {
            src: imageHeader // 本地图片
          },
          shareText: {
            src: imageShareText // 本地图片
          },
          follow: {
            src: imageFollow // 本地图片
          },
          rate: {
            src: imageRate // 本地图片
          },
          process: {
            src: imageProcess // 本地图片
          }
        },

        // 发放数据 发放成功 发放中 发放失败
        issueInfo: [
          {
            id: 'success',
            type: 1,
            num: 0,
            name: '发放成功'
          },
          {
            id: 'ing',
            type: 0,
            num: 0,
            name: '发放中'
          },
          {
            id: 'fail',
            type: 2,
            num: 0,
            name: '发放失败'
          }
        ],
        issueNumber: '', // 期号
        issueNumberRangeNew: [], // 期号 range
        villageInfo: {}, // 村庄信息
        subsidyList: [], // 补贴信息
        subsidyRank: [], // 补贴排名
        pageNo: 1, // 页数
        pageLmit: 10, // 每页条数限制
        chi031: '', // 项目编号
        chi031Range: [], // 项目编号 picker 数据
        isExceedLimit: false, // 数据是否超出 pageLmit 大小
        isLoadOver: true, // 数据是否加载完成

        showAddressPopup: false, // 是否显示地址选择弹窗 没有地址的时候才弹

        address: [], // 默认地址
        // 页面分享配置
        shareConfig: {
          title: '村村响', // 转发标题
          path: '/pages/tabbar/sunshine/sunshine?type=share', // 转发路径
          query: 'type=share', // 自定义页面路径中携带的参数，如 path?a=1&b=2 的 “?” 后面部分
          imageUrl: '' // 自定义图片路径
        },
        addressFilter: '',
        areaCode: ''
      }
    },
    components: {
      ComponentImg,
      ComponentButton,
      ComponentNews,
      ComponentPanel,
      ComponentWeather,
      ComponentAvatar,
      ComponentPicker,
      ComponentLoadMore,
      ComponentNoData,
      ComponentSelectAddress,
      ComponentPopupNotice
    },
    onLoad(e) {
      const { areaCode } = config
      // 宜宾
      if (areaCode == '511500') {
        this.addressFilter = [
          '511502',
          '511503',
          '511504',
          '511523',
          '511524',
          '511525',
          '511526',
          '511527',
          '511528',
          '511529',
          '511541'
        ]
      }
      this.getIssueNumberList()
      this.areaCode = areaCode
    },
    onReady() {
      const shareConfig = getShareConfig(this)

      if (shareConfig) {
        this.shareConfig = { ...shareConfig }
      }
    },

    methods: {
      // 获取从202101到现在的所有期号
      getIssueNumberList() {
        let res = []
        let startDate = new Date('2021/01/01')
        let endDate = new Date()

        const startDate_year = startDate.getFullYear()

        const endDate_year = endDate.getFullYear()
        const endDate_month = endDate.getMonth() + 1 // 月份从0开始，需要加1

        for (let i = startDate_year; i <= endDate_year; i++) {
          if (i === endDate_year) {
            // 当年
            for (let j = 1; j <= endDate_month; j++) {
              let m = j < 10 ? '0' + j : j + ''
              const key = i + m
              res.push({
                key,
                name: key
              })
            }
          } else {
            // 往年
            for (let j = 1; j <= 12; j++) {
              let month = j < 10 ? '0' + j : j + ''
              const key = i + month
              res.push({
                key,
                name: key
              })
            }
          }
        }
        res = res.reverse()

        this.issueNumberRangeNew = [...res]
        this.issueNumber = res[0].key
      },
      // 初始化数据 第一次进入 用户有村庄数据
      async initData() {
        const { chb018, user_id, openid } = this.userInfo
        if (chb018) {
          requestB118('', chb018, false, false)
            .then((res) => {
              if (res) {
                const { aac002_count } = res
                this.$store.commit(M_UPDATE_USER_INFO, {
                  aac002_count
                })
              } else {
                this.$store.commit(M_UPDATE_USER_INFO, {
                  aac002_count: 0
                })
              }
            })
            .catch((err) => {
              this.$store.commit(M_UPDATE_USER_INFO, {
                aac002_count: 0
              })
            })
        } else {
          if (!user_id) {
            useJumpToLogin()
            return
          }
          // 开启停机提示时关闭提示
          if (!config.isShowShutDownTips) {
            showModal('未获取到个人相关村社信息,请先去完善！').then((res) => {
              this.showAddressPopup = true
            })
          }
        }

        uni.stopPullDownRefresh()
      },

      // 补贴明细查询
      getSubsidyList(chi031, isLoading = true) {
        const pageNo = this.pageNo
        const pageLmit = this.pageLmit
        const issueNumber = this.issueNumber
        let { chb018 } = this.userInfo

        // 非加载更多 清空
        if (pageNo < 2) {
          this.subsidyList = []
        }
        requestDSGetVillageDetailInfo(
          '',
          issueNumber,
          '',
          '',
          chb018,
          chi031,
          '',
          '',
          pageNo,
          pageLmit,
          isLoading,
          false
        )
          .then((res) => {
            const { list } = res
            if (list && list.length > 0) {
              // 第一次 加载
              if (pageNo < 2) {
                if (list.length < pageLmit) {
                  this.isExceedLimit = false
                  this.isLoadOver = true
                } else {
                  this.isExceedLimit = true
                  this.isLoadOver = false
                }
                this.subsidyList = [...list]
              } else {
                // 第 n 次 加载
                if (list.length < pageLmit) {
                  this.isLoadOver = true
                } else {
                  this.isLoadOver = false
                }
                this.subsidyList = [...this.subsidyList, ...list]
              }
            } else {
              // 返回 [] 或者没有 list
              this.isLoadOver = true
            }
          })
          .catch((err) => {
            showModal(err.message || '查询补贴信息出错', '提示', false)
          })
      },

      // 地址选择改变
      handleChangeAddress(address, addressInfo) {
        const { userName, idCard, tel } = this.userInfo
        const aac021 = address.join('-')
        let chb015 = '',
          chb017 = '',
          chb018 = ''
        if (addressInfo[0]) {
          chb015 = addressInfo[0].orgid // 区县编码
        }
        if (addressInfo[1]) {
          chb017 = addressInfo[1].orgid // 乡镇编码
        }
        if (addressInfo[2]) {
          chb018 = addressInfo[2].orgid // 村编码
        }

        var data = {
          aac003: userName,
          aac002: idCard,
          aae005: tel,
          chb015,
          chb017,
          chb018,
          aac021
        }
        if (aac021 && chb015) {
          requestB116(data, false).then(() => {
            this.$store.commit(M_UPDATE_USER_INFO, {
              aac021,
              chb015,
              chb017,
              chb018
            })
            this.$store.commit(M_UPDATE_USER_LIST, {
              chb015,
              chb017,
              chb018
            })
            this.initData()
          })
        }
      },

      // 选择地址
      handleUpdateAddress() {
        const { user_id } = this.userInfo
        if (user_id) {
          this.showAddressPopup = true
        } else {
          showModal('请登录后再访问').then(() => {
            navigateTo('login', 'packageCommon')
          })
        }
      },

      // 加载更多
      handleClickLoadMore() {
        this.pageNo++
        this.getSubsidyList(this.chi031)
      },

      // 跳转路由
      handleJumpRoute(name, packageName, params) {
        const { user_id, aac021 } = this.userInfo
        if (user_id) {
          if (!aac021) {
            showModal('未获取到个人相关村庄信息,请先去完善').then((res) => {
              this.showAddressPopup = true
            })
            return
          }
          navigateTo(name, packageName, params)
        } else {
          showModal('请登录后再访问').then(() => {
            navigateTo('login', 'packageCommon')
          })
        }
      },

      // 查询发放进度
      handleQueryGrantProcess(item) {
        const { chb010, chi031_desc } = item
        navigateTo('process', 'packageDeclare', { chb010, chi031_desc })
      },
      // 投诉
      handleJumpRouteComplaint(item) {
        item.isYgff = '1'
        item = {
          ...item,
          chi032: item.chi032 || item.chi031_desc,
          type: 'ygff'
        }
        navigateTo('complaints', 'packageMasses', item)
      },

      // 通过期号获取的数据
      getDataByIssueNumber(issueNumber) {
        showLoading()
        this.chi031Range = []
        this.subsidyRank = []
        this.chi031 = '' // 解决不同期号相同chi031不请求数据
        let { chb018 } = this.userInfo

        Promise.allSettled([
          requestDSGetVillageCountInfo(issueNumber, '', chb018, false, false),
          requestDSGetSubsidyRanking(issueNumber, '', chb018, false, false)
        ]).then((res) => {
          const res0 = res[0]
          const res1 = res[1]

          const { status: statusRes0, value: valueRes0 } = res0
          const { status: statusRes1, value: valueRes1 } = res1
          // console.log(res, 99)
          //
          if (statusRes0 === 'fulfilled' && valueRes0) {
            const { fieldData } = valueRes0
            this.villageInfo = {
              ...fieldData,
              RateCard: Math.floor(fieldData.RateCard)
            }
            this.issueInfo[0].num = fieldData.successNumber
            this.issueInfo[1].num = fieldData.processNumber
            this.issueInfo[2].num = fieldData.failNumber
          }
          //
          if (statusRes1 === 'fulfilled' && valueRes1) {
            const { list } = valueRes1
            if (list && list.length > 0) {
              this.subsidyRank = [...list]
              const arr = []
              list.forEach((item) => {
                arr.push({
                  id: item.chi031,
                  code: item.chi031,
                  name: item.chi031_desc
                })
              })
              this.chi031Range = [...arr]
              // 改变补贴类型，重新查询补贴详情，默认第一个
              this.chi031 = list[0].chi031
            }
          }
          hideLoading()
        })
      }
    },
    // 下拉刷新
    onPullDownRefresh() {
      this.initData()
    },
    computed: {
      ...mapGetters([USER_INFO]),
      buttonText() {
        let str = ''
        const { areaCode } = config
        const { aac021 } = this.userInfo

        if (areaCode === '511100') {
          str = ''
          if (aac021) {
            str = ''
          } else {
            str = '选择地址'
          }
        } else {
          if (aac021) {
            str = '切换地址'
          } else {
            str = '选择地址'
          }
        }
        return str
      }
    },
    watch: {
      // 监听 补贴编号 改变
      chi031: {
        handler(val) {
          if (val) {
            this.pageNo = 1
            this.isLoadOver = true
            this.isExceedLimit = false
            this.getSubsidyList(val)
          }
        },
        immediate: true
      },
      // 监听 期号 改变
      issueNumber: {
        handler(val) {
          const { user_id } = this.userInfo
          if (val && user_id) {
            this.subsidyList = []
            this.getDataByIssueNumber(val)
          }
        },
        immediate: true
      },
      // 监听 用户信息中村编码 改变
      'userInfo.chb018': {
        handler() {
          this.initData()
        },
        immediate: true
      }
    },
    onHide() {},
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
  $header-height: 286rpx;
  .sunshine {
    position: relative;
    padding-bottom: $spacing;
    /*  #ifdef  H5  */
    padding-bottom: $spacing + 100rpx;
    /*  #endif  */
  }
  .sunshine-header {
    height: $header-height;
    background-color: $primary;
    position: relative;
    color: #fff;
    button {
      background-color: transparent;
      outline: 0;
    }
    .header-bg {
      z-index: 1;
      position: absolute;
      bottom: 32rpx;
      left: 56rpx;
    }
    .header-con {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 2;
      padding: 26rpx 56rpx;
      .share {
        position: absolute;
        top: 32rpx;
        right: 42rpx;
        text-align: right;
        button {
          display: inline-block;
        }
        .text {
          font-size: 22rpx;
          color: #ffffff;
          position: relative;
          p {
            position: absolute;
            width: 100%;
            text-align: center;
            line-height: 40rpx;
            left: 0;
            top: 16rpx;
          }
        }
      }
    }
  }
  .overview-wrapper {
    position: absolute;
    width: 100%;
    top: $header-height - 60rpx;
    z-index: 2;
    .panel-content {
      position: relative;
      padding-top: 30rpx;
    }
    .picker-wrapper {
      font-size: 28rpx;
      font-weight: 700;
      line-height: 32rpx;
      color: $color;
      .unit {
        color: $color-placeholder;
        padding: 0 32rpx 0 16rpx;
      }
    }
    .people {
      width: 100%;
      height: 112rpx;
      background-color: #edf4ff;
      border-radius: 16rpx;
      margin-top: 16rpx;

      .left {
        width: 50%;
        padding-left: 48rpx;
        position: relative;
        &::after {
          content: '';
          position: absolute;
          width: 1px;
          height: 80rpx;
          border-left: dashed 3rpx rgba($primary, 0.3);
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .right {
        width: 50%;
        padding-left: 56rpx;
      }
      .iconimg {
        margin-right: 30rpx;
      }
      .cell {
        font-size: 36rpx;
        font-weight: 700;
        line-height: 1;
        color: #082155;
        .desc {
          font-size: 22rpx;
          font-weight: 400;
          line-height: 30rpx;
          color: rgba(61, 66, 77, 0.7);
        }
      }
    }
    .issue {
      margin-top: 24rpx;
      width: 100%;
      .item {
        width: 184rpx;
        height: 184rpx;
        background-color: #ffffff;
        box-shadow: 1rpx 3rpx 10rpx 0rpx rgba(56, 130, 255, 0.2);
        border-radius: 16rpx;
        padding-top: 20rpx;
        text-align: center;
        font-size: 36rpx;
        font-weight: 700;
        color: #00c290;
        line-height: 1;
        .iconimg {
          margin: 0 auto;
        }
        .value {
          margin-top: 8rpx;
        }
        .desc {
          font-size: 22rpx;
          font-weight: 400;
          line-height: 32rpx;
          color: $color-placeholder;
          margin-top: 12rpx;
        }
        &.ing {
          color: #436efe;
        }
        &.fail {
          color: #ff6853;
        }
      }
    }
    .follow {
      position: absolute;
      top: -10rpx;
      left: 20rpx;
      width: 166rpx;
      text-align: center;
      p {
        width: 100%;
        position: absolute;
        line-height: 32rpx;
        color: #fff;
        top: 0;
        left: 0;
        font-size: 22rpx;
      }
    }
  }
  .pos-height {
    height: 506rpx;
  }

  .SSC-wrapper {
    padding-top: $spacing;
    .panel-content {
      padding: 30rpx;
    }
    .left {
      width: 320rpx;
      .item {
        width: 100%;
        color: #ff6851;
        font-size: 24rpx;
        font-weight: 700;
        line-height: 1;
        margin-bottom: 52rpx;
        &:last-child {
          color: $primary;
          margin-bottom: 0;
          .bar {
            background-color: $primary;
          }
        }
      }
      .cell {
        margin-bottom: 12rpx;
      }
      .key {
        color: $color;
      }
      .bar-bg {
        width: 100%;
        position: relative;
        height: 14rpx;
        background-color: #f3f5f8;
        border-radius: 16rpx;
      }
      .bar {
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;
        border-radius: 16rpx;
        background-color: #ff6851;
      }
    }
    .right {
      position: relative;
      .content {
        position: absolute;
        top: 66rpx;
        right: 0;
        width: 100%;
        text-align: center;
      }
      .value {
        font-size: 36rpx;
        font-weight: 700;
        line-height: 1;
        color: $primary;
      }
      .key {
        font-size: 20rpx;
        font-weight: 700;
        line-height: 30rpx;
        color: $color-placeholder;
      }
    }
  }
  .project-wrapper {
    margin-top: $spacing;
    .panel-content {
      width: 100%;
    }
    .picker-wrapper {
      margin-top: 60rpx;
      .label {
        flex: 1;
        text-align: right;
        font-size: 28rpx;
        color: $color;
        padding-right: 20rpx;
      }
    }
    .items {
      .item {
        width: 100%;
        background-color: #ffffff;
        box-shadow: 0rpx 2rpx 24rpx 0rpx rgba(8, 76, 192, 0.15);
        border-radius: 32rpx;
        padding: 38rpx 32rpx 32rpx;
        margin-top: 30rpx;
        font-size: 24rpx;
        font-weight: 700;
        line-height: 44rpx;
        color: rgba(78, 87, 103, 0.7);
        position: relative;
        .name {
          font-size: 28rpx;
          color: $color;
          line-height: 1;
          height: 36rpx;
          line-height: 36rpx;
          margin-bottom: 36rpx;
          .iconimg {
            margin-right: 10rpx;
          }
          .right {
            font-size: 24rpx;
            color: #51d574;
            background-color: rgba(#4fd57b, 0.1);
            border-radius: 4rpx;
            font-weight: 400;
            padding: 0 12rpx;
            &.fail {
              color: #f00;
              background-color: rgba(#f00, 0.1);
            }
          }
        }
        .basic-info {
          font-size: 26rpx;
          padding-bottom: 18rpx;
          .value {
            color: #3d424d;
          }
        }
        .issue-info {
          padding-top: 18rpx;
          padding-bottom: 8rpx;
          border-top: 1px dashed #f0f0f0;
          .green {
            color: #51d574;
          }
        }
        .button-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
    }

    .progress-bar-items {
      width: 100%;
    }
    .progress-bar-item {
      width: 180rpx;
      min-height: 200rpx;
      background-color: #f5f6fa;
      border-radius: 16rpx;
      text-align: center;
      position: relative;
      padding-top: 24rpx - 8rpx;
      margin-right: 16rpx;
      &:last-child {
        margin-right: 0;
      }
      .value {
        position: absolute;
        width: 100%;
        top: 68rpx;
        left: 0;
        font-size: 26rpx;
        line-height: 1;
        color: #4a5e71;
      }
      .name {
        font-size: 22rpx;
        font-weight: 700;
        line-height: 24rpx;
        color: #505d6f;
        padding: 24rpx - 8rpx 20rpx;

        .index {
          font-size: 20rpx;
          color: #fff;
          margin-right: 8rpx;
          width: 22rpx;
          height: 24rpx;
          background-color: $primary;
        }
        .label {
          overflow: hidden;
          text-align: left;
        }
      }
      .label {
        flex: 1;
        overflow: hidden;
      }
    }
    .button-wrapper {
      padding: $spacing 0;
    }
  }
</style>
