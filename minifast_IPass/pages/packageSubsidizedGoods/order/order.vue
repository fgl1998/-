<template>
  <view class="order h5-page">
    <div class="items">
      <block v-if="queryResultList.length > 0">
        <div
          class="item"
          v-for="(item, index) in queryResultList"
          :key="item.id"
        >
          <div class="name-wrapper d-f ai-c">
            <div class="iconimg"></div>
            <div class="name">{{ item.chi621 }}</div>
          </div>
          <div class="cells" :class="[item.cht192 === '0' ? '' : 'no-btn']">
            <div class="cell d-f ai-c jc-sb">
              <div class="key">商户名称：</div>
              <div class="value">{{ shopInfo.cht131 }}</div>
            </div>
            <div class="cell d-f ai-c jc-sb">
              <div class="key">补贴项目：</div>
              <div class="value">{{ item.chi032 }}</div>
            </div>
            <div class="cell d-f ai-c jc-sb">
              <div class="key">商品编码：</div>
              <div class="value">{{ item.cht140 }}</div>
            </div>
            <div class="cell d-f ai-c jc-sb">
              <div class="key">商品售卖总价：</div>
              <div class="value">{{ item.cht141 }}元</div>
            </div>
            <div class="cell d-f ai-c jc-sb">
              <div class="key">虚拟账户抵扣：</div>
              <div class="value">{{ item.cht195 }}元</div>
            </div>
            <div class="cell d-f ai-c jc-sb">
              <div class="key">线下支付金额：</div>
              <div class="value">{{ item.cht194 }}元</div>
            </div>
            <div class="cell d-f ai-c jc-sb">
              <div class="key">交易时间：</div>
              <div class="value">{{ item.aae036.substr(0, 19) }}</div>
            </div>
            <div class="cell d-f ai-c jc-sb tag">
              <div class="key">交易状态：</div>
              <div class="value">{{ item.cht192Desc }}</div>
            </div>
          </div>
          <div class="button-wrapper d-f ai-c jc-sb" v-if="item.cht192 === '0'">
            <ComponentButton
              type="primary"
              name="下单支付确认"
              width="264rpx"
              height="72rpx"
              @click="handlePay(index)"
            ></ComponentButton>
            <ComponentButton
              type="secondary"
              name="取消订单"
              width="264rpx"
              height="72rpx"
              @click="handleCancel(index)"
            ></ComponentButton>
          </div>
        </div>
      </block>
      <block v-else>
        <ComponentNoData tip="未查询到相关数据"></ComponentNoData>
      </block>
      <div class="load-more-wrapper" v-if="isExceedLimit">
        <ComponentLoadMore
          :isOver="isLoadOver"
          bgc="#f5f5f5"
          @click="handleClickLoadMore"
        ></ComponentLoadMore>
      </div>
    </div>
    <!-- <ComponentTabbarShopping currentId="order"></ComponentTabbarShopping> -->
  </view>
</template>

<script>
import ComponentButton from '@/components/common/ez-button/ez-button.vue'
import ComponentLoadMore from '@/components/common/ez-load-more/ez-load-more.vue'
import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
import ComponentTabbarShopping from '../components/ez-tabbar-shopping/ez-tabbar-shopping.vue'

import { navigateTo, showModal } from '@/utils/uni-api'
import { requestB052, requestB068 } from '@/service/api'

import { USER_INFO, USER_LIST, SHOP_INFO, IS_MERCHANT } from '@/store/constants'
import { mapGetters } from 'vuex'

export default {
  name: 'pageOrder',
  data() {
    return {
      queryResultList: [], // 渲染数据
      pageNo: 1, // 查询页数
      pageLimit: 5, // 每页数据条数
      isExceedLimit: false, // 加载条数是否超出限制
      isLoadOver: true, // 是否加载完成
      cht161: '0', // 虚拟账户余额
      cht130: '', // 店铺主键
    }
  },
  components: {
    ComponentButton,
    ComponentLoadMore,
    ComponentNoData,
    ComponentTabbarShopping,
  },
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {
    const { cht130 } = e
    if (cht130) {
      this.cht130 = cht130
    }
  },
  // 监听页面初次渲染完成
  onReady() {},
  // 监听页面显示
  onShow() {
    this._requestB052()
  },
  // 监听页面隐藏
  onHide() {},
  methods: {
    // 用户订单列表查询
    _requestB052() {
      const { cht130, chi031 } = this.shopInfo
      const { idCard } = this.userInfo

      requestB052(
        chi031,
        this.cht130 || cht130,
        '',
        this.isMerchant ? '1' : '',
        this.isMerchant ? '' : idCard,
        this.isMerchant ? '' : idCard
      ).then((res) => {
        const { cht161 } = res
        this.cht161 = cht161
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
            if (item.cht192 === '2') {
              item.cht192Desc = '已取消'
            }
            newList.push(item)
          })
        }
        this.queryResultList = [...list]
      })
    },

    // 加载更多
    handleClickLoadMore() {
      this.pageNo++
      this._requestB052()
    },
    // 支付
    handlePay(index) {
      const item = this.queryResultList[index]
      const cht161 = this.cht161
      navigateTo('scan', 'packageSubsidizedGoods', { ...item, cht161 })
    },
    // 取消
    handleCancel(index) {
      showModal('是否确定取消该订单？', '提示', true).then((res) => {
        const item = this.queryResultList[index]
        const { cht190 } = item
        requestB068(cht190).then(() => {
          this._requestB052()
        })
      })
    },
  },
  computed: {
    ...mapGetters([USER_INFO, USER_LIST, SHOP_INFO, IS_MERCHANT]),
  },
  watch: {},
}
</script>

<style lang="scss" scoped>
.order {
  padding: $spacing;
  // padding-bottom: 100rpx;
  .item {
    background-color: #fff;
    margin-bottom: $spacing;
    padding: 0 40rpx;
    border-radius: 2rpx;
    .name-wrapper {
      height: 102rpx;
      font-size: 30rpx;
      font-weight: 700;
      color: $color;
      border-bottom: 1px solid rgba($primary, 0.25);
      .iconimg {
        width: 30rpx;
        height: 30rpx;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAMAAADWZboaAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAC3UExURUdwTB2Y/1i9/xiT/yuo/zjC/yKi/zO3/x+c/wyA/z3I/yag/zzH/y+0/ymr/wR1/y+1/xuX/ymr/x6c/x6c/zC3/wV3/yWl/yuw/wR1/xqW/wd5/x+d/yan/z7L/wR2/wFy/wZ5/yCf/xOM/xCH/xiS/y+0/xuX/wh8/zS8/wyC/zG3/zvH/zrF/zK6/za//x2b/yKi/xGK/xWP/ySl/yiq/zjC/yyw/w6F/wp//yqt/yan/wuA/2PKJQYAAAAedFJOUwBJA68NczUTknS4H+qy17ib0LbhX+3iy9Xx7BPt3dqCRGsAAALKSURBVEjHnZULn7FAFMZPkW6IZe1iF28kJISw9P0/1zuXLjPN7K7t3/k1Z55nHpEuABhds5qTJ2lamg4ZqvZ0Lk1rKk3WrVTZTrbbiWzL7LydWHVyTGtLCLc/EZYaCx9XC8k0xBWG7Cfw85DdwlBDZ6iJxvAS/oKwoKmDdgkvVUCHtWi3v+xR/byaW7O3oLmvSBPW6z3aCKgh4DnuSyOnoQ7WlYH1brferVEVY0ZpzjgE2H1PsAtQMVNeh6AysAyCZbAkBK+tTuuV97EXkDXUzOYkWtDBN5PeWUoRTRy9Lq+olq30HmzJkoVJ1pLoFbPEu/QGVvWrhOzu1ulaDOTme37rv4tJmQn3jJfcfbkLyEy4x/E9xl07d9tilDNjmoE4p5GajViCxMyij/jRrtMT0Y4LDRXt2/Q81duFB4+CTxu7bw8pb9izPxkFzgx9ch7OUsiJ6rMKRHSMzlF0NrCt5R7RUt/VsGewGkQM5EuNIylj8mNYBSLXjdwIFR7JjzVcl2oYN/XxF1LtQsdRl4V8Y73nCvT0/ENz+OgH+X8UMaqQf+aDjx44yGFRlldpEgxeLUUP9Kpp9FitR0S1cShHfYaD37PpVWOODgefeCOTXmV2z+eB0tzvZretYtS63ZqhpK9Svev/FvW7NkiwhaQPnsBIEYKqMhLXSaKeV2vwyUZNtgpOnnfyTqjoPO1rSj3L1ZUa0jAevxZO3+DVDLPfN40sJwJzntP8hCrvuXlpTTn6B+DIMz/OUR2fARbH4+K4QEVHzJHRMLIe7WDxM7fFDZXUgltlYFP0m9uGgBrS30oeq6MdbCoDSZJskg2qYmQpa8wckq+KJDBYEb5WVECNAPYEPRmAs6qIA+a/aqxMGA+rRYfodWBOK2Hih4dTJemQp13dmU2ns+kMFZWzXjZiUOOkDxHVHM7+xNBU8+fW2HQGz+YGjklemPAfjmrr5Bed9skAAAAASUVORK5CYII=);
        margin-right: 16rpx;
      }
    }
    .cells {
      border-bottom: 1px solid rgba($primary, 0.25);
      font-size: 28rpx;
      line-height: 40rpx;
      padding-top: 30rpx;
      padding-bottom: 24rpx;
      color: $color;
      .cell {
        margin-bottom: 22rpx;
        &.tag {
          .value {
            background-color: #dcffe8;
            border-radius: 4rpx;
            padding: 0 12rpx;
            font-size: 24rpx;
            font-weight: 500;
            font-stretch: normal;
            line-height: 36rpx;
            color: #0cb54d;
          }
        }
      }
      .value {
        font-size: 30rpx;
        font-weight: 700;
        color: #333;
      }
      &.no-btn {
        border-bottom: 0;
        padding-bottom: 30rpx;
      }
    }
    .button-wrapper {
      padding: 24rpx;
    }
  }
}
</style>
