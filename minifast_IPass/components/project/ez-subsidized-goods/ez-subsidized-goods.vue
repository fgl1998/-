<template>
  <view class="ez-subsidized-goods-wrapper">
    <div class="items">
      <block v-for="(item, index) in subsidizedGoodsRenderData" :key="item.id">
        <div
          class="item"
          :class="['item_' + index, item.disabled ? 'disabled' : '']"
          @click="handleJumpRoute(index)"
        >
          <div class="desc">
            {{ item.desc }}
          </div>
          <img
            :src="item.imageSrc"
            :style="{
              width: item.imageWidth,
              height: item.imageHeight,
            }"
          />
          <div class="btn">{{ item.buttonText }}</div>
        </div>
      </block>
    </div>
  </view>
</template>

<script>
import config from '@/config'
import { IMAGE_TABBAR_HOME } from '@/config/constants'
import { navigateTo, showModal, switchTab } from '@/utils/uni-api'
import { requestB049 } from '@/service/api'
import { UPDATE_IS_MERCHANT, USER_INFO, USER_LIST } from '@/store/constants' // 常量
import { mapGetters } from 'vuex'

const images01 = IMAGE_TABBAR_HOME + 'nav-14.png'
const images02 = IMAGE_TABBAR_HOME + 'nav-15.png'
/**
 * 一站式结算商品
 * @description 一站式结算商品
 */
export default {
  name: 'ezSubsidizedGoods',
  props: {},
  components: {},
  data() {
    return {
      // 便捷服务渲染数据
      subsidizedGoodsRenderData: [
        {
          id: '01',
          imageSrc: images01,
          imageWidth: '58rpx',
          imageHeight: '54rpx',
          desc: '商户入驻',
          buttonText: '我要入驻',
          disabled: false,
          name: 'shop-add',
          packageName: 'packageSubsidizedGoods',
        },
        {
          id: '02',
          imageSrc: images02,
          imageWidth: '65rpx',
          imageHeight: '62rpx',
          desc: '专款专用',
          buttonText: '我要买',
          disabled: false,
          name: 'shop-query',
          packageName: 'packageSubsidizedGoods',
        },
      ],
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 跳转路由
    handleJumpRoute(index) {
      const { closePages } = config
      const { user_id, idCard } = this.userInfo

      const item = this.subsidizedGoodsRenderData[index]

      if (!user_id) {
        showModal('请登录后再访问').then((res) => {
          navigateTo('login', 'packageCommon')
        })
        return
      }

      const jumpRoute = (name, packageName, params) => {
        // 跳转 tababr 页面
        if (packageName === 'tabbar') {
          switchTab(name)
        } else {
          // 跳转 非tababr 页面
          navigateTo(name, packageName, params)
        }
      }
      const { name, packageName, params } = item

      const hanldeRoute = () => {
        // 关闭 关闭页面筛选
        if (index === 0) {
          requestB049(idCard, 1, 1)
            .then((res) => {
              const { list } = res.lists.ht13List
              if (list && list.length > 0) {
                jumpRoute('shop-list', 'packageSubsidizedGoods')
              } else {
                jumpRoute(name, packageName, params)
              }
            })
            .catch(() => {
              jumpRoute(name, packageName, params)
            })
            .finally(() => {
              this.$store.commit(UPDATE_IS_MERCHANT, true)
            })
        } else {
          this.$store.commit(UPDATE_IS_MERCHANT, false)
          jumpRoute(name, packageName, params)
        }
      }

      // 开启关闭页面筛选
      if (closePages && closePages.length > 0) {
        // 存在
        if (closePages.includes(`${packageName}/${name}`)) {
          navigateTo('not-found', 'packageCommon')
        } else {
          // 不存在
          hanldeRoute()
        }
      } else {
        hanldeRoute()
      }
    },
  },
  computed: { ...mapGetters([USER_INFO, USER_LIST]) },
  watch: {},
}
</script>

<style lang="scss" scoped>
.ez-subsidized-goods-wrapper {
  width: 100%;
  .items {
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
    background-color: #fff2ec;
    border-radius: 8rpx;
    padding: 44rpx 80rpx 0 20rpx;
    .desc {
      font-size: 22rpx;
      line-height: 24rpx;
      color: #a05422;
    }
    img {
      position: absolute;
      top: 58rpx;
      right: 20rpx;
    }
    .btn {
      width: 150rpx;
      height: 42rpx;
      background-image: linear-gradient(180deg, #ffa142 0%, #ff4f1f 100%);
      border-radius: 20px;
      font-size: 26rpx;
      font-weight: 700;
      text-align: center;
      color: #ffffff;
      line-height: 42rpx;
      margin-top: 20rpx;
    }
    &:last-child {
      background-color: #def3ff;
      .desc {
        color: #1e7ae4;
      }
      .btn {
        background-image: linear-gradient(180deg, #40cdff 0%, #0070ff 100%);
      }
    }
    &.disabled {
      opacity: $opacity-disabled;
    }
  }
}
</style>
