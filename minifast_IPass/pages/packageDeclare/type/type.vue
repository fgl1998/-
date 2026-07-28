<template>
  <view class="declare-type h5-page">
    <div class="tip d-f">
      <div class="key">服务事项：</div>
      <div class="value">{{ chi031_desc }}</div>
    </div>
    <div class="items">
      <div class="item" v-if="showDeclareType01">
        <img :src="image01" alt="" />
        <div class="title">为自己申报</div>
        <div class="desc">
          自动带上申报人身份信息、填写申报信息上传业务所需材料等
        </div>

        <button
          @click="handleJumpRoute('01')"
          :disabled="!isOpen"
          :class="[isOpen ? '' : 'disabled']"
        >
          {{ isOpen ? '立即申请' : '暂未开放' }}
        </button>
      </div>
      <div class="item" v-if="showDeclareType02">
        <img :src="image02" alt="" />
        <!-- 泸州雨露计划 -->
        <div class="title">
          {{
            chi031 == '20008' && areaCode == '510500'
              ? '村、社区工作人员录入'
              : '为他人申报'
          }}
        </div>
        <div class="desc">
          自动带上经办人身份信息、填写申报信息上传业务所需材料等
        </div>
        <button
          @click="handleJumpRoute('02')"
          :disabled="!isOpen"
          :class="[isOpen ? '' : 'disabled']"
        >
          {{ isOpen ? '立即申请' : '暂未开放' }}
        </button>
      </div>
    </div>
  </view>
</template>

<script>
import image01 from './images/01.png'
import image02 from './images/02.png'
import config from '@/config'
import { navigateTo, showModal } from '@/utils/uni-api'
import { requestB060 } from '@/service/api'
import { USER_INFO, USER_LIST } from '@/store/constants' // 常量
import { mapGetters } from 'vuex'
export default {
  name: 'pageType',
  components: {},
  data() {
    return {
      image01,
      image02,
      chi031: '',
      chi031_desc: '',
      fixedDeclareType: '00', // 固定申报模式
      isOpen: false, // 目前服务端是否开放
      areaCode: config.areaCode
    }
  },
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {
    const { chi031, chi031_desc, chi037, fixedDeclareType } = e
    this.chi037 = chi037
    this.handleCheckPhoneNumber()
    if (chi031_desc) {
      this.chi031_desc = chi031_desc
    }
    if (fixedDeclareType) {
      this.fixedDeclareType = fixedDeclareType
    }
    if (chi031) {
      this.chi031 = chi031
      this._requestB060(chi031)
    } else {
      showModal('路由跳转时传递的补贴项目编号chi031为空，请检查！')
    }
  },
  // 监听页面初次渲染完成
  onReady() {},
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    // 检测补贴的开放情况
    _requestB060(chi031) {
      requestB060(chi031)
        .then((res) => {
          const { open, lists } = res
          if (open === '1') {
            this.isOpen = true
          } else {
            this.isOpen = false
            const { list } = lists.openTimeList
            let arr = []
            list.map((item) => {
              if (item.openTime) {
                arr.push(item.openTime)
              }
            })
            if (arr.length > 0) {
              showModal(arr.join('；'))
            }
          }
        })
        .catch((err) => {})
    },
    // 跳转路由
    handleJumpRoute(declareType) {
      const chi031 = this.chi031
      const chi031_desc = this.chi031_desc
      const fixedDeclareType = this.fixedDeclareType
      const { declarePackageName } = config
      const name = 'declare-' + chi031

      navigateTo(name, declarePackageName, {
        chi031,
        declareType,
        fixedDeclareType,
        chi031_desc,
        chi037: this.chi037
      })
    },
    // 检测是否存在手机号
    handleCheckPhoneNumber() {
      const { tel } = this.userInfo
      if (tel) {
        return
      } else {
        showModal(
          '检测到没有您的手机号信息，是否前往完善？',
          '提示',
          true
        ).then(() => {
          if (this.areaCode === '511100') {
            navigateTo('user-info-ls', 'packageCommon')
          } else {
            navigateTo('user-info', 'packageCommon')
          }
        })
      }
    }
  },
  computed: {
    ...mapGetters([USER_INFO, USER_LIST]),
    showDeclareType01() {
      let result = false
      const fixedDeclareType = this.fixedDeclareType
      if (fixedDeclareType === '01' || fixedDeclareType === '00') {
        result = true
      }
      return result
    },
    showDeclareType02() {
      let result = false
      const fixedDeclareType = this.fixedDeclareType
      if (fixedDeclareType === '02' || fixedDeclareType === '00') {
        result = true
      }
      return result
    }
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
.declare-type {
  padding: 30rpx 32rpx;
  background-color: #f5f5f5;
  .tip {
    font-size: 28rpx;
    line-height: 1.4;
    padding-bottom: $spacing;
    font-weight: 500;
    .key {
      color: $color-placeholder;
    }
    .value {
      flex: 1;
      overflow: hidden;
      color: $color;
    }
  }
  .items {
    .item {
      width: 100%;
      margin-bottom: 32rpx;
      padding: 28rpx 40rpx;
      border-radius: 8rpx;
      height: 320rpx;
      color: #fff;
      background-color: #619cff;
      position: relative;
      &:last-child {
        margin-bottom: 0;
        background-color: #19c6ff;
      }
      .title {
        width: 100%;
        font-size: 32rpx;
        font-weight: 700;
        line-height: 1.4;
        position: relative;
        z-index: 9;
      }
      .desc {
        font-size: 24rpx;
        position: relative;
        z-index: 9;
      }
      button {
        position: absolute;
        bottom: 50rpx;
        right: 54rpx;
        width: 138rpx;
        height: 52rpx;
        border-radius: 8rpx;
        background-color: #fff;
        font-size: 26rpx;
        line-height: 2;
        font-weight: 700;
        color: #005cff;
        transition: all 0.3s;
        &.disabled {
          opacity: 0.5;
        }
      }
      img {
        width: 389rpx;
        height: 261rpx;
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 2;
      }
    }
  }
}
</style>
