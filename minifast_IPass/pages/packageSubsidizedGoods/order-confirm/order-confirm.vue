<template>
  <view class="order-confirm h5-page">
    <div class="main" v-if="orderInfo.cht190">
      <div class="img-wrapper">
        <img :src="imageBg" alt="" />
      </div>
      <div class="cells">
        <div class="cell d-f ai-c jc-sb">
          <div class="key">购买人：</div>
          <div class="value">{{ orderInfo.aac003 }}</div>
        </div>
        <div class="cell d-f ai-c jc-sb">
          <div class="key">补贴项目：</div>
          <div class="value">{{ orderInfo.chi032 }}</div>
        </div>
        <div class="cell d-f ai-c jc-sb">
          <div class="key">商品名称</div>
          <div class="value">{{ orderInfo.chi621 }}</div>
        </div>
        <div class="cell d-f ai-c jc-sb">
          <div class="key">商品总金额：</div>
          <div class="value">{{ orderInfo.cht141 }}元</div>
        </div>
        <div class="cell d-f ai-c jc-sb">
          <div class="key">虚拟账户抵扣金额：</div>
          <div class="value">{{ orderInfo.cht195 }}元</div>
        </div>
        <div class="cell d-f ai-c jc-sb">
          <div class="key">线下支付金额：</div>
          <div class="value">{{ orderInfo.cht194 }}</div>
        </div>
        <div class="cell d-f ai-c jc-sb">
          <div class="key">下单时间：</div>
          <div class="value">{{ orderInfo.aae036.substr(0, 19) }}</div>
        </div>
        <div class="cell d-f ai-c jc-sb">
          <div class="key">订单号：</div>
          <div class="value">{{ orderInfo.cht190 }}</div>
        </div>
      </div>

      <div class="button-wrapper d-f ai-c jc-sb">
        <ComponentButton
          type="secondary"
          name="取消订单"
          width="264rpx"
          height="72rpx"
          fontSize="26rpx"
          @click="handleCancel"
        ></ComponentButton>
        <ComponentButton
          type="primary"
          name="确认订单"
          width="264rpx"
          height="72rpx"
          fontSize="26rpx"
          @click="handleConfirm"
        ></ComponentButton>
      </div>
    </div>
    <block v-else>
      <ComponentNoData
        v-if="isRequestOver"
        tip="未查询该订单信息，请确定扫描的二维码是否正确！"
      ></ComponentNoData>
    </block>
  </view>
</template>

<script>
// 图片导入 转为base64 由于打包体积超过2M
import imageBg from './images/bg.png'

import ComponentButton from '@/components/common/ez-button/ez-button.vue'
import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'

import { mapGetters } from 'vuex'

import { showModal, switchTab, navigateTo, redirectTo } from '@/utils/uni-api'
import { requestB052, requestB053 } from '@/service/api'
import { UPDATE_IS_MERCHANT, USER_INFO, USER_LIST } from '@/store/constants'

export default {
  name: 'pagePrderConfirm',
  data() {
    return {
      imageBg,
      orderInfo: {},
      chi031: '',
      aac002: '',
      cht190: '',
      isRequestOver: false,
    }
  },
  components: { ComponentButton, ComponentNoData },
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {
    // 网厅 https://www.scnjhrss.com/orderPay?cht190=10000000160&chi031=04001&aac002=510902199507236534

    const param = {}
    const url = decodeURIComponent(e.q)
    const queryString = url.substring(url.indexOf('?') + 1)
    const queryStringArray = queryString.split('&')

    for (var i = 0, len = queryStringArray.length; i < len; i++) {
      const item = queryStringArray[i]
      const item_arr = item.split('=')
      const item_key = item_arr[0]
      const item_val = item_arr[1]
      param[item_key] = item_val
    }

    const { cht190, chi031, aac002 } = param

    if (chi031 && cht190 && aac002) {
      this.chi031 = chi031
      this.aac002 = aac002
      this.cht190 = cht190
    }
  },
  // 监听页面初次渲染完成
  onReady() {},
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    // 用户订单列表查询
    _requestB052() {
      const cht190 = this.cht190
      const chi031 = this.chi031
      const aac002_g = this.aac002
      const orderInfo = this.orderInfo
      const { user_id } = this.userInfo

      if (orderInfo.cht190 || !user_id || !chi031) {
        return
      }

      requestB052(chi031, '', cht190, '', '', aac002_g)
        .then((res) => {
          const { list } = res.lists.ht19List
          let newList = []
          if (list && list.length > 0) {
            list.map((item) => {
              if (item.cht192 === '0') {
                item.cht192Desc = '未支付'
              }
              if (item.cht192 === '1') {
                item.cht192Desc = '已支付'
              }
              newList.push(item)
            })
            this.orderInfo = newList[0]
          }
        })
        .finally(() => {
          this.isRequestOver = true
        })
    },
    // 确定 订单支付确认
    handleConfirm() {
      const chi031 = this.chi031
      const aac002 = this.aac002
      const cht190 = this.cht190
      const { cht192 } = this.orderInfo
      const { aac002: aac002_f, user_id } = this.userInfo
      if (!user_id) {
        showModal('请先进行登录验证').then((res) => {
          navigateTo('login', 'packageCommon')
        })
        return
      }
      if (cht192 === '1') {
        showModal('该订单已被商家确认')
        return
      }

      requestB053(cht190, chi031, aac002, aac002_f).then((res) => {
        this.$store.commit(UPDATE_IS_MERCHANT, true)
        const { cht130 } = res
        redirectTo('order', 'packageSubsidizedGoods', { cht130 })
      })
    },
    // 取消
    handleCancel() {
      switchTab('home')
    },
  },
  computed: {
    ...mapGetters([USER_INFO, USER_LIST]),
  },
  watch: {
    'userInfo.user_id': {
      handler(val) {
        if (val) {
          this._requestB052()
        }
      },
      immediate: true,
    },
    chi031: {
      handler(val) {
        if (val) {
          this._requestB052()
        }
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.order-confirm {
  padding: $spacing;
  height: 100%;
  height: 100vh;
  .main {
    width: 100%;
    height: 100%;
    background-color: #fff;
    position: relative;
  }
  .img-wrapper {
    width: 100%;
    height: 360rpx;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .cells {
    padding: 20rpx 50rpx;
    font-size: 28rpx;
    line-height: 40rpx;
    color: $color;
    .cell {
      margin-bottom: $spacing;
    }
    .value {
      color: #333;
      font-weight: 700;
      font-size: 30rpx;
    }
  }

  .button-wrapper {
    padding: 0 50rpx;
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 100rpx;
  }
}
</style>
