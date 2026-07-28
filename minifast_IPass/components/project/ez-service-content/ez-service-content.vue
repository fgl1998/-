<template>
  <view class="ez-service-content">
    <div class="service-items" v-if="serviceRenderData.length > 0">
      <block v-for="(item, index) in serviceRenderData" :key="item.id">
        <div
          class="item"
          :class="['item_' + index, item.disabled ? 'disabled' : '']"
          @click="onClick(index)">
          <h3>{{ item.title }}</h3>
          <div class="desc">
            {{ item.desc }}
          </div>
          <!-- <img
            :src="item.imageSrc"
            :style="{
              width: item.imageWidth,
              height: item.imageHeight,
            }"
          /> -->
        </div>
      </block>
    </div>
    <CompopnentNoData v-else></CompopnentNoData>
  </view>
</template>

<script>
import CompopnentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
import config from '@/config'
import { navigateTo, switchTab } from '@/utils/uni-api'
import { USER_INFO } from '@/store/constants' // 常量
import { mapGetters } from 'vuex'
import { useJumpToLogin } from '@/hooks'
import { requestB202 } from '@/service/api'

const { closePages } = config

const imageStrPerfix = config.requestUrl + '/static/images/tabbar/home/'
const image02 = imageStrPerfix + 'nav-12.png'

/**
 * 热门服务
 * @description 热门服务
 */
export default {
  name: 'ezServiceContent',
  props: {
    renderData: {
      type: [Array],
      default: () => {
        return []
      },
    },
  },
  components: { CompopnentNoData },
  data() {
    return {
      // 热门补贴项目
      hotProjectList: [],
    }
  },
  created() {},
  mounted() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      let arr = []
      requestB202(false, false).then((res) => {
        const { list } = res.lists.hi96List
        if (list && list.length > 0) {
          const len = list.length
          for (let i = 0; i < len; i++) {
            arr.push(list[i])
          }
          this.hotProjectList = [...arr]
        }
      })
    },
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
    // 跳转路由
    onClick(index) {
      const { user_id } = this.userInfo

      const item = this.serviceRenderData[index]
      const { name, packageName, params, isMustLogin } = item

      // 必须登录也能访问的页面
      if (isMustLogin) {
        if (user_id) {
          this.jumpRouteBefore(name, packageName, params)
        } else {
          useJumpToLogin()
        }
      } else {
        // 无须登录也能访问的页面
        this.jumpRouteBefore(name, packageName, params)
      }
    },
  },
  computed: {
    ...mapGetters([USER_INFO]),
    serviceRenderData() {
      const hotProjectList = this.hotProjectList

      let arr = []

      if (hotProjectList && hotProjectList.length > 0) {
        for (let i = 0, len = hotProjectList.length; i < len; i++) {
          const item = hotProjectList[i]

          arr.push({
            id: 'chi031_' + item.chi031,
            title: item.chi032,
            imageSrc: image02,
            imageWidth: '60rpx',
            imageHeight: '60rpx',
            desc: '自主申报、方便快捷',
            disabled: false,
            name: 'notice',
            packageName: 'packageDeclare',
            params: {
              chi031: item.chi031,
              chi031_desc: item.chi032,
              chi04z: '1',
            },
            isMustLogin: false, // 是否必须登录才能访问
          })
        }
      }
      return arr
    },
  },
  watch: {},
}
</script>

<style lang="scss" scoped>
.ez-service-content {
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
      bottom: 66rpx;
      font-size: $font-size-title;
      font-weight: 700;
      color: #003b8d;
      line-height: 42rpx;
      padding-left: 20rpx;
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
      left: 20rpx;
      bottom: 28rpx;
      z-index: 3;
    }
    img {
      position: absolute;
      top: 20rpx;
      right: 20rpx;
      z-index: 0;
    }
    &:nth-of-type(2) {
      background-color: #effffd;
    }
    &:nth-of-type(3) {
      background-color: #effffd;
    }
    &.disabled {
      opacity: $opacity-disabled;
    }
  }
}
</style>
