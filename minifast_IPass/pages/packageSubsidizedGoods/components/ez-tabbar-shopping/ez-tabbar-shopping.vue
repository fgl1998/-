<template>
  <view class="ez-tabbar-shopping-wrapper">
    <div class="items">
      <block v-for="(item, index) in tabbarData" :key="item.id">
        <div
          class="item"
          :class="[item.id === currentId ? 'active' : '']"
          @click="handleClickItem(index)"
        >
          <img
            :src="item.id === currentId ? item.iconSrcActive : item.iconSrc"
            alt=""
          />
          <div>{{ item.name_zh }}</div>
        </div>
      </block>
    </div>
  </view>
</template>

<script>
import imageHome from './images/home.png'
import imageHomeActive from './images/home-active.png'
import imageOrder from './images/order.png'
import imageOrderActive from './images/order-active.png'
import imageSettlemente from './images/settlement.png'
import imageSettlementeActive from './images/settlement-active.png'
import { navigateTo } from '@/utils/uni-api'

import { IS_MERCHANT } from '@/store/constants'
import { mapGetters } from 'vuex'
/**
 * tabbar
 * @description tabbar 组件
 */
export default {
  name: 'ezTabbarShopping',
  props: {
    currentId: {
      type: [String],
      default: 'home',
    },
  },
  components: {},
  data() {
    return {
      tabbarData: [
        {
          id: 'home',
          iconSrc: imageHome,
          iconSrcActive: imageHomeActive,
          name_zh: '首页',
          name_en: '',
          packageName: '',
          params: {},
        },
        {
          id: 'order',
          iconSrc: imageOrder,
          iconSrcActive: imageOrderActive,
          name_zh: '我的订单',
          name_en: 'order',
          packageName: 'packageSubsidizedGoods',
          params: {},
        },
        {
          id: 'account',
          iconSrc: imageSettlemente,
          iconSrcActive: imageSettlementeActive,
          name_zh: '我的账户',
          name_en: 'account',
          packageName: 'packageSubsidizedGoods',
          params: {},
        },
      ],
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleClickItem(index) {
      const { name_en, packageName, params } = this.tabbarData[index]
      if (!name_en) {
        return
      }
      navigateTo(name_en, packageName, params)
    },
  },
  computed: {
    ...mapGetters([IS_MERCHANT]),
  },
  watch: {
    isMerchant: {
      handler(val) {
        return
        if (val) {
          let tabbarData = [...this.tabbarData]
          tabbarData[1] = {
            id: 'settlement',
            iconSrc: imageSettlemente,
            iconSrcActive: imageSettlementeActive,
            name_zh: '我的结算',
            name_en: 'settlement',
            packageName: 'packageSubsidizedGoods',
            params: {},
          }
          this.tabbarData = [...tabbarData]
        } else {
          let tabbarData = [...this.tabbarData]
          tabbarData[1] = {
            id: 'order',
            iconSrc: imageOrder,
            iconSrcActive: imageOrderActive,
            name_zh: '我的订单',
            name_en: 'order',
            packageName: 'packageSubsidizedGoods',
            params: {},
          }
          this.tabbarData = [...tabbarData]
        }
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.ez-tabbar-shopping-wrapper {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  height: 98rpx;
  background-color: #fff;
  border-top: 1px solid $border-color;
  .items {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: center;
    .item {
      width: 33.3333%;
      font-size: 20rpx;
      line-height: 1;
      color: #939599;
      transition: all 0.3s;
      padding-top: 10rpx;
      img {
        width: 48rpx;
        height: 48rpx;
        margin: auto;
      }
      &.active {
        color: $primary;
      }
    }
  }
}
</style>
