<template>
  <view class="tip">
    <div class="contnet">
      <div class="img-wrapper">
        <ComponentImg
          :path="images.image01"
          width="490rpx"
          height="304rpx"
        ></ComponentImg>
      </div>
      <div class="key">温馨提示</div>
      <div class="desc">
        若无法完成生存状态认证，请点击“放行申请”按钮进行申请，申请通过后即可进行申报。
      </div>
      <div class="button-wrapper">
        <ComponentButton
          name="放行申请"
          type="primary"
          width="278rpx"
          height="72rpx"
          @click="handleJumpRoute('file', 'packageDeclare')"
        ></ComponentButton>
        <ComponentButton
          name="直接认证"
          type="secondary"
          width="278rpx"
          height="72rpx"
          @click="handleJumpRoute('survival-certification', 'packageDeclare')"
        ></ComponentButton>
      </div>
    </div>
  </view>
</template>

<script>
import image01 from './images/01.png'

import ComponentImg from '@/components/common/ez-img/ez-img.vue'
import ComponentButton from '@/components/common/ez-button/ez-button.vue'

import { navigateBack, navigateTo } from '@/utils/uni-api'
import { DECLARE_INFO } from '@/store/constants' // 常量
import { mapGetters } from 'vuex'
export default {
  name: 'pageTip',
  components: {
    ComponentImg,
    ComponentButton,
  },
  data() {
    return {
      // 本地图片
      images: {
        image01: {
          src: '', // 本地图片
          httpSrc: image01, // 网络图片
        },
      },
    }
  },
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {},
  // 监听页面初次渲染完成
  onReady() {},
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    // 跳转路由
    handleJumpRoute(name, packageName) {
      if (name === 'survival-certification') {
        navigateBack(1)
      } else {
        navigateTo(name, packageName)
      }
    },
  },
  computed: {
    ...mapGetters([DECLARE_INFO]),
  },
  watch: {},
}
</script>

<style lang="scss" scoped>
.tip {
  padding: $spacing;
  height: 100%;
  height: 100vh;
  .contnet {
    width: 100%;
    height: 100%;
    background-color: #fff;
    text-align: center;
    border-radius: 12rpx;
    padding-top: 70rpx;
    position: relative;
  }
  .key {
    font-size: 34rpx;
    line-height: 48rpx;
    color: #333;
    font-weight: 700;
    padding-top: 46rpx;
  }
  .desc {
    width: 100%;
    font-size: 30rpx;
    line-height: 42rpx;
    padding: 0 120rpx;
    color: #666;
    padding-top: 14rpx;
  }
  .button-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 42rpx;
    position: absolute;
    bottom: 54rpx;
    left: 0;
  }
}
</style>
