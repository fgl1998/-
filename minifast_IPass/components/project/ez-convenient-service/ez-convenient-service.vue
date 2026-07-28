<template>
  <view class="ez-convenient-service-wrapper">
    <div class="service-items">
      <block v-for="(item, index) in convenientServiceRenderData" :key="item.id">
        <div
          class="item"
          v-if="item.isShow"
          :class="['item_' + index, item.disabled ? 'disabled' : '']"
          @click="onClick(index)">
          <h3>{{ item.title }}</h3>
          <div :class="['desc', item.id === 'e_got_it' ? 'long_desc' : '']">
            {{ item.desc }}
          </div>
          <img
            :src="item.imageSrc"
            :style="{
              width: item.imageWidth,
              height: item.imageHeight,
            }" />
        </div>
      </block>
    </div>
  </view>
</template>

<script>
import config from '@/config'
import { IMAGE_TABBAR_HOME } from '@/config/constants'
import { navigateTo, switchTab, navigateToMiniProgram } from '@/utils/uni-api'
import { USER_INFO } from '@/store/constants' // 常量
import { mapGetters } from 'vuex'
import { useJumpToLogin } from '@/hooks'
import image04 from './images/e_icon.png'

const image01 = IMAGE_TABBAR_HOME + 'nav-11.png'
const image02 = IMAGE_TABBAR_HOME + 'nav-12.png'
const image03 = IMAGE_TABBAR_HOME + 'sz.png'

const { closePages, homeConvenientServiceDisplayConfig } = config
const {
  showServiceNetwork,
  showCustomerService,
  showSurvivalCertification,
  showWorkForRelief,
  showThreeCapital,
  showEGotIt,
} = homeConvenientServiceDisplayConfig
/**
 * 热门服务
 * @description 热门服务
 */
export default {
  name: 'ezConvenientService',
  props: {
    renderData: {
      type: [Array],
      default: () => {
        return []
      },
    },
  },
  components: {},
  data() {
    return {
      // 便捷服务渲染数据
      convenientServiceRenderData: [
        {
          id: '01',
          title: '服务网点',
          imageSrc: image01,
          imageWidth: '60rpx',
          imageHeight: '60rpx',
          desc: '便捷办理',
          disabled: false,
          isShow: !!showServiceNetwork,
          name: 'service-network',
          packageName: 'packageCommon',
          isMustLogin: false,
        },
        {
          id: '02',
          title: '智能客服',
          imageSrc: image02,
          imageWidth: '60rpx',
          imageHeight: '60rpx',
          desc: '老年人关怀服务区',
          disabled: false,
          isShow: !!showCustomerService,
          name: 'customer-service',
          packageName: 'packageMasses',
          isMustLogin: true,
        },
        {
          id: '03',
          title: config.areaCode === '510400' ? '资格认证' : '生存认证',
          imageSrc:
            'data:image/png;base64,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',
          imageWidth: '60rpx',
          imageHeight: '60rpx',
          desc: '实名认证',
          disabled: false,
          isShow: !!showSurvivalCertification,
          name: 'survival-certification',
          packageName: 'packageCommon',
          isMustLogin: true,
        },
        {
          id: '04',
          title: '以工代赈咨询',
          imageSrc:
            'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjY0MzQ3NDY5MzgwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEwNDgwIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik0yNzQuMTI0OCA1Ni43NTUyYzAtMjguMDA2NC0yLjk2OTYtNTAuNjg4LTM1Ljg0LTUwLjY4OC0zLjUzMjggMC4xNzkyLTYuODA5NiAwLjY0LTEwLjEzNzYgMS4wNDk2YTE1Ny4zMTIgMTU3LjMxMiAwIDAgMSA0NS4yMzUyIDk2LjY5MTJoMC43NDI0VjU2Ljc1NTJ6IiBmaWxsPSIiIHAtaWQ9IjEwNDgxIj48L3BhdGg+PHBhdGggZD0iTTcxOC4wOCAwSDE4NC4yNjg4Yy0yMy40NDk2IDAtNDQuNjIwOCA0LjUwNTYtNjMuNTM5MiAxMi4zOTA0YTE1Ny44NzUyIDE1Ny44NzUyIDAgMCAxIDk2LjQ2MDggMTQ1LjQ1OTJWODY4Ljc2MTZhMTU1LjE4NzIgMTU1LjE4NzIgMCAwIDAgMTM2LjU3NiAxNTQuMDA5NmM4Ni4yMjA4LTUuMzI0OCAxNTYuMjg4LTgzLjUwNzIgMTY3LjczMTItMTcxLjI2NGgzNTQuNDMyVjE1Ny44NDk2QTE1Ny44MjQgMTU3LjgyNCAwIDAgMCA3MTguMDggMHoiIGZpbGw9IiNGQ0MwMTUiIHAtaWQ9IjEwNDgyIj48L3BhdGg+PHBhdGggZD0iTTc2NS41MTY4IDQ5OC45NDRhMjAuMTk4NCAyMC4xOTg0IDAgMCAxLTIwLjI3NTIgMjAuMTIxNmwtMC4wMjU2IDAuMDI1Ni0xMTYuMDQ0OCAwLjA1MTJ2NDcuOTIzMmwxMTYuMDQ0OC0xLjcxNTJhMTkuODY1NiAxOS44NjU2IDAgMCAxIDIwLjMwMDggMTkuOTE2OHYyNS4zMTg0YTIxLjA5NDQgMjEuMDk0NCAwIDAgMS0yMC4yNzUyIDIwLjgzODRsLTExNi4wNDQ4IDQuMDk2djUzLjczNDRjMCA1LjU4MDgtMi4zMDQgMTEuMDU5Mi02LjQgMTUuMjMyYTIzLjk2MTYgMjMuOTYxNiAwIDAgMS0xNS42NDE2IDcuMDY1NmwtMjguMTM0NCAxLjYxMjhjLTEyLjQ5MjggMC43MTY4LTIyLjc1ODQtOC4yOTQ0LTIyLjc1ODQtMjAuMTk4NHYtNTQuOTEybC0xMzEuNTU4NCA0LjYzMzZjLTEzLjcyMTYgMC40ODY0LTI0Ljg4MzItOS4xMzkyLTI0Ljg4MzItMjEuNTgwOHYtMjguMTZjMC0xMi40MTYgMTEuMTg3Mi0yMi42NTYgMjQuODgzMi0yMi44NjA4bDEzMS41NTg0LTEuOTQ1NlY1MTkuMTY4bC0xMzEuNTU4NCAwLjA1MTJjLTEzLjcyMTYgMC0yNC44ODMyLTEwLjAwOTYtMjQuODgzMi0yMi40di0yOC4yMzY4YTIwLjk5MiAyMC45OTIgMCAwIDEgNy4yOTYtMTUuNzY5NmM0LjY4NDgtNC4xMjE2IDEwLjk4MjQtNi4zNDg4IDE3LjU2MTYtNi4yMjA4bDEwNi4zOTM2IDIuMTI0OC04OC4wMTI4LTgzLjgxNDRhMjIuMjcyIDIyLjI3MiAwIDAgMS03LjE2OC0xNi4wMjU2YzAtNS44ODggMi41ODU2LTExLjQxNzYgNy4xNjgtMTUuMzM0NGwyMS41MDQtMTguNDgzMmEyMy44MzM2IDIzLjgzMzYgMCAwIDEgMTYuOTk4NC01LjQ3ODRjNi4zNDg4IDAuMzg0IDEyLjM5MDQgMy4wNDY0IDE2Ljg0NDggNy40MjRsODEuMTI2NCA3OS41NjQ4YTIzLjkzNiAyMy45MzYgMCAwIDAgMTUuODcyIDYuODA5NiAyMi4wNjcyIDIyLjA2NzIgMCAwIDAgMTUuNzE4NC01LjY1NzZsNzQuMjQtNjguMTcyOGEyMC4xNDcyIDIwLjE0NzIgMCAwIDEgMTQuOTI0OC01LjE5NjhjNS41ODA4IDAuMzMyOCAxMC45MDU2IDIuODE2IDE0Ljc5NjggNi44ODY0bDE4LjMyOTYgMTkuMTc0NGM3Ljk4NzIgOC4zNDU2IDcuOTg3MiAyMS4xNzEyIDAgMjguNzQ4OGwtNzYuMDgzMiA3Mi4wODk2IDg3Ljk2MTYgMS43NjY0YTIwLjgxMjggMjAuODEyOCAwIDAgMSAxNC4zODcyIDYuMjIwOCAyMC40NTQ0IDIwLjQ1NDQgMCAwIDEgNS44ODggMTQuMzg3MnYyNS4zMTg0eiIgZmlsbD0iI0ZGRkZGRiIgcC1pZD0iMTA0ODMiPjwvcGF0aD48cGF0aCBkPSJNMjE2LjA2NCAxNDMuMjA2NGgwLjM4NGMtMC4xMDI0LTEuMjAzMi0wLjUxMi0yLjMwNC0wLjY0LTMuNDgxNmExNTMuOTA3MiAxNTMuOTA3MiAwIDAgMC0zLjQzMDQtMTguOTE4NGMtMC41Mzc2LTIuMjUyOC0wLjkyMTYtNC41MzEyLTEuNTYxNi02Ljc1ODRhMTU4LjI1OTIgMTU4LjI1OTIgMCAwIDAtOC40NDgtMjIuNzU4NGMtMC4xNzkyLTAuMzg0LTAuMjgxNi0wLjc5MzYtMC40NjA4LTEuMTc3NmExNTkuMTgwOCAxNTkuMTgwOCAwIDAgMC0xMi44NzY4LTIyLjA2NzJjLTEuMjI4OC0xLjc0MDgtMi42NjI0LTMuMzAyNC0zLjk0MjQtNS4wMTc2YTE1OC40MTI4IDE1OC40MTI4IDAgMCAwLTExLjk1NTItMTQuMjMzNmMtMC42OTEyLTAuNzE2OC0xLjIyODgtMS41ODcyLTEuOTItMi4yNzg0bC0wLjM4NCAwLjA3NjhBMTU3LjU5MzYgMTU3LjU5MzYgMCAwIDAgMTIwLjcyOTYgMTIuMzkwNEM1Ni4zNzEyIDM5LjE2OCAxOS4zMDI0IDEwNi45ODI0IDE5LjMwMjQgMTg2LjY3NTJoMTk3Ljg4OFYxNTcuODQ5NmMwLTQuOTY2NC0wLjY2NTYtOS43NzkyLTEuMTI2NC0xNC42NDMyeiIgZmlsbD0iI0QzOUMxMSIgcC1pZD0iMTA0ODQiPjwvcGF0aD48cGF0aCBkPSJNODc1LjkyOTYgODUxLjUwNzJINTIxLjQ5NzZjLTExLjQxNzYgODcuNzMxMi04MS41MTA0IDE2NS45MzkyLTE2Ny43MzEyIDE3MS4yNjQgNi4xMTg0IDAuNzQyNCAxMi4yODggMS4yMjg4IDE4LjYxMTIgMS4yMjg4aDM1MS4xODA4YzQuOTY2NCAwIDkuODgxNi0wLjI1NiAxNC43NDU2LTAuNzE2OGg4OS4zOTUyYzkwLjQ3MDQgMCAxNjUuMTcxMi04MC44OTYgMTc2Ljk5ODQtMTcxLjc3NmgtMTI4Ljc2OHoiIGZpbGw9IiNGRkQ0NjkiIHAtaWQ9IjEwNDg1Ij48L3BhdGg+PC9zdmc+',
          imageWidth: '60rpx',
          imageHeight: '60rpx',
          desc: '快捷查看项目详情',
          disabled: false,
          isShow: !!showWorkForRelief,
          name: 'work-for-relief',
          packageName: 'packageQuery',
          isMustLogin: true,
        },
        {
          id: 'e_got_it',
          title: 'e明白了',
          imageSrc: image04,
          imageWidth: '60rpx',
          imageHeight: '60rpx',
          desc: '宜宾市"明白了"公开公示平台',
          disabled: false,
          isShow: !!showEGotIt,
          name: '',
          packageName: '',
          isMustLogin: true,
        },
        {
          id: '05',
          title: '"三资"公开',
          imageSrc: image03,
          imageWidth: '60rpx',
          imageHeight: '60rpx',
          desc: '农村集体"三资"公开',
          disabled: false,
          isShow: !!showThreeCapital,
          name: 'threeCapitalWx',
          packageName: 'packageThreeCapital',
          isMustLogin: true,
        },
      ],
    }
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 跳转路由之前 检测该路由是否为tabbar
     */
    jumpRoute(name, packageName, params) {
      // 跳转 tababr 页面
      if (packageName === 'tabbar') {
        switchTab(name)
      } else {
        // 跳转 非tababr 页面
        navigateTo(name, packageName, params)
      }
    },
    /**
     * 跳转路由之前 检测该路由是否关闭
     */
    jumpRouteBefore(name, packageName, params) {
      // 存在 关闭页面筛选
      if (closePages && closePages.length > 0) {
        // 跳转路径为关闭的页面
        if (closePages.includes(`${packageName}/${name}`)) {
          navigateTo('not-found', 'packageCommon')
        } else {
          this.jumpRoute(name, packageName, params)
        }
      } else {
        // 不存在 关闭页面筛选
        this.jumpRoute(name, packageName, params)
      }
    },
    /**
     * 跳转小程序
     */
    jumpMiniProgram() {
      navigateToMiniProgram('wx4068b6789d133248').then(() => {})
    },
    /**
     * 点击事件处理
     */
    onClick(index) {
      const { user_id } = this.userInfo

      const item = this.convenientServiceRenderData[index]
      const { name, packageName, params, isMustLogin, id } = item

      // 必须登录也能访问的页面
      if (isMustLogin) {
        if (user_id) {
          // 针对处理
          if (id === 'e_got_it') {
            this.jumpMiniProgram()
          } else {
            this.jumpRouteBefore(name, packageName, params)
          }
        } else {
          useJumpToLogin()
        }
      } else {
        // 无须登录也能访问的页面
        this.jumpRouteBefore(name, packageName, params)
      }
    },
  },
  computed: { ...mapGetters([USER_INFO]) },
  watch: {},
}
</script>

<style lang="scss" scoped>
.ez-convenient-service-wrapper {
  width: 100%;
  .service-items {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .item {
    width: 304rpx;
    height: 168rpx;
    background-color: #f5faff;
    border-radius: 8rpx;
    position: relative;
    transition: all 0.3s;
    margin-bottom: 20rpx;
    h3 {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 76rpx;
      font-size: $font-size-title;
      font-weight: 700;
      color: #003b8d;
      line-height: 42rpx;
      padding-left: 100rpx;
      padding-right: 20rpx;
      @include textOverflow(2);
      z-index: 3;
    }
    .desc {
      position: absolute;
      font-weight: 400;
      line-height: 24rpx;
      font-size: $font-size-desc;
      color: rgba(0, 59, 141, 0.4);
      position: absolute;
      left: 100rpx;
      bottom: 50rpx;
      z-index: 3;

      &.long_desc {
        bottom: 26rpx;
      }
    }
    img {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 28rpx;
      z-index: 1;
    }
    &:last-child {
      background-color: #effffd;
    }
    &.disabled {
      opacity: $opacity-disabled;
    }
  }
}
</style>
