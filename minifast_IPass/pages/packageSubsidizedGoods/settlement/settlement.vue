<template>
  <view class="settlement h5-page">
    <div class="tabs">
      <block v-for="item in tabs" :key="item.id">
        <div
          class="tab"
          :class="[currentTabId === item.id ? 'active' : '']"
          @click="handleClickTab(item.id)"
        >
          {{ item.name }}
        </div>
      </block>
    </div>
    <div class="items">
      <block v-if="queryResultList.length > 0">
        <div class="item" v-for="item in queryResultList" :key="item.id">
          <div class="name-wrapper d-f ai-c">
            <div class="iconimg"></div>
            <div class="name">拖拉机</div>
          </div>
          <div class="cells">
            <div class="cell d-f ai-c jc-sb">
              <div class="key">申请人：</div>
              <div class="value fw-700">123</div>
            </div>
            <div class="cell d-f ai-c jc-sb">
              <div class="key">身份证：</div>
              <div class="value fw-700">123</div>
            </div>
            <div class="cell d-f ai-c jc-sb">
              <div class="key">补贴项目：</div>
              <div class="value">123</div>
            </div>
            <div class="cell d-f ai-c jc-sb">
              <div class="key">行政区划：</div>
              <div class="value">123</div>
            </div>
            <div class="cell d-f ai-c jc-sb">
              <div class="key">受理区县：</div>
              <div class="value">已提交申请</div>
            </div>
            <div class="cell d-f ai-c jc-sb">
              <div class="key">受理乡镇：</div>
              <div class="value">已提交申请</div>
            </div>
            <div class="cell d-f ai-c jc-sb">
              <div class="key">受理街道：</div>
              <div class="value">已提交申请</div>
            </div>
            <div class="cell d-f ai-c jc-sb">
              <div class="key">人员类别：</div>
              <div class="value">已提交申请</div>
            </div>
          </div>
          <div class="review-wrapper">
            <div class="review-toolbar">
              <div>查看审批流程</div>
              <div class="iconimg"></div>
            </div>
            <div class="review-items">
              <block v-for="(reviewItem, reviewIndex) in 2" :key="reviewIndex">
                <div class="review-item">
                  <div class="item-name">农业农村局初审</div>
                  <div class="item-cell d-f ai-c jc-sb">
                    <div class="key">审核人</div>
                    <div class="value fw-700">张三</div>
                  </div>
                  <div class="item-cell d-f ai-c jc-sb">
                    <div class="key">审核时间</div>
                    <div class="value">2021-02-01</div>
                  </div>
                  <div class="item-cell d-f ai-c jc-sb">
                    <div class="key">审核结果</div>
                    <div class="value tag">通过</div>
                  </div>
                  <div class="item-cell d-f ai-c jc-sb">
                    <div class="key">备注</div>
                    <div class="value textarea">
                      经室房管局核查，XXXX自身不符合条件享受危房改建政策。
                    </div>
                  </div>
                </div>
              </block>
            </div>
          </div>

          <div class="button-wrapper">
            <ComponentButton
              type="primary"
              name="撤销申请"
              width="264rpx"
              height="72rpx"
              @click="handleSave"
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
    <!-- <ComponentTabbarShopping currentId="home"></ComponentTabbarShopping> -->
  </view>
</template>

<script>
import ComponentButton from '@/components/common/ez-button/ez-button.vue'
import ComponentLoadMore from '@/components/common/ez-load-more/ez-load-more.vue'
import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
import ComponentTabbarShopping from '../components/ez-tabbar-shopping/ez-tabbar-shopping.vue'

import { requestB054 } from '@/service/api'
import { USER_INFO, USER_LIST } from '@/store/constants'
import { mapGetters } from 'vuex'

export default {
  name: 'pageSettlement',
  data() {
    return {
      tabs: [
        {
          id: 'ing',
          name: '进行中',
        },
        {
          id: 'success',
          name: '成功',
        },
        {
          id: 'fail',
          name: '打回',
        },
      ],
      currentTabId: 'ing',
      queryResultList: [], // 渲染数据
      pageNo: 1, // 查询页数
      pageLimit: 5, // 每页数据条数
      isExceedLimit: false, // 加载条数是否超出限制
      isLoadOver: true, // 是否加载完成
    }
  },
  components: {
    ComponentButton,
    ComponentLoadMore,
    ComponentNoData,
    ComponentTabbarShopping,
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
    // 结算列表查询
    _requestB054(aac002) {
      requestB054(aac002).then((res) => {
        const { list } = res.lists.ht20List
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
        }
        this.queryResultList = [...list]
      })
    },
    // 加载更多
    handleClickLoadMore() {
      this.pageNo++
      this.requestB052()
    },
    handleClickTab(id) {
      this.currentTabId = id
    },
  },
  computed: {
    ...mapGetters([USER_INFO, USER_LIST]),
  },
  watch: {
    'userInfo.user_id': {
      handler(val) {
        if (val) {
          const { idCard } = this.userInfo
          this._requestB054(idCard)
        }
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
$border-color-p: rgba($primary, 0.2);
.settlement {
  padding: $spacing;
  // padding-bottom: 100rpx;
  .tabs {
    width: 100%;
    margin-bottom: $spacing;
    display: flex;
    align-items: center;
    line-height: 68rpx;
    text-align: center;
    font-weight: 500;
    color: $primary;
    font-size: 24rpx;
    .tab {
      width: 33.3333%;
      border: 1px solid $primary;
      transition: all 0.3s;
      &.active {
        color: #fff;
        background-color: $primary;
      }
      &:first-of-type {
        border-top-left-radius: 8rpx;
        border-bottom-left-radius: 8rpx;
        border-right: 0;
      }
      &:last-of-type {
        border-top-right-radius: 8rpx;
        border-bottom-right-radius: 8rpx;
        border-left: 0;
      }
    }
  }
  .items {
    width: 100%;
  }
  .item {
    width: 100%;
    background-color: #fff;
    border-radius: 8rpx;
    margin-bottom: $spacing;
    padding: 0 40rpx;
    .name-wrapper {
      height: 104rpx;
      border-bottom: 1px solid $border-color-p;
      color: $color;
      font-weight: 700;
      font-size: 30rpx;
      .iconimg {
        width: 30rpx;
        height: 30rpx;
        margin-right: 16rpx;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAMAAADWZboaAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAC3UExURUdwTB2Y/1i9/xiT/yuo/zjC/yKi/zO3/x+c/wyA/z3I/yag/zzH/y+0/ymr/wR1/y+1/xuX/ymr/x6c/x6c/zC3/wV3/yWl/yuw/wR1/xqW/wd5/x+d/yan/z7L/wR2/wFy/wZ5/yCf/xOM/xCH/xiS/y+0/xuX/wh8/zS8/wyC/zG3/zvH/zrF/zK6/za//x2b/yKi/xGK/xWP/ySl/yiq/zjC/yyw/w6F/wp//yqt/yan/wuA/2PKJQYAAAAedFJOUwBJA68NczUTknS4H+qy17ib0LbhX+3iy9Xx7BPt3dqCRGsAAALKSURBVEjHnZULn7FAFMZPkW6IZe1iF28kJISw9P0/1zuXLjPN7K7t3/k1Z55nHpEuABhds5qTJ2lamg4ZqvZ0Lk1rKk3WrVTZTrbbiWzL7LydWHVyTGtLCLc/EZYaCx9XC8k0xBWG7Cfw85DdwlBDZ6iJxvAS/oKwoKmDdgkvVUCHtWi3v+xR/byaW7O3oLmvSBPW6z3aCKgh4DnuSyOnoQ7WlYH1brferVEVY0ZpzjgE2H1PsAtQMVNeh6AysAyCZbAkBK+tTuuV97EXkDXUzOYkWtDBN5PeWUoRTRy9Lq+olq30HmzJkoVJ1pLoFbPEu/QGVvWrhOzu1ulaDOTme37rv4tJmQn3jJfcfbkLyEy4x/E9xl07d9tilDNjmoE4p5GajViCxMyij/jRrtMT0Y4LDRXt2/Q81duFB4+CTxu7bw8pb9izPxkFzgx9ch7OUsiJ6rMKRHSMzlF0NrCt5R7RUt/VsGewGkQM5EuNIylj8mNYBSLXjdwIFR7JjzVcl2oYN/XxF1LtQsdRl4V8Y73nCvT0/ENz+OgH+X8UMaqQf+aDjx44yGFRlldpEgxeLUUP9Kpp9FitR0S1cShHfYaD37PpVWOODgefeCOTXmV2z+eB0tzvZretYtS63ZqhpK9Svev/FvW7NkiwhaQPnsBIEYKqMhLXSaKeV2vwyUZNtgpOnnfyTqjoPO1rSj3L1ZUa0jAevxZO3+DVDLPfN40sJwJzntP8hCrvuXlpTTn6B+DIMz/OUR2fARbH4+K4QEVHzJHRMLIe7WDxM7fFDZXUgltlYFP0m9uGgBrS30oeq6MdbCoDSZJskg2qYmQpa8wckq+KJDBYEb5WVECNAPYEPRmAs6qIA+a/aqxMGA+rRYfodWBOK2Hih4dTJemQp13dmU2ns+kMFZWzXjZiUOOkDxHVHM7+xNBU8+fW2HQGz+YGjklemPAfjmrr5Bed9skAAAAASUVORK5CYII=);
      }
    }
    .cells {
      padding-top: 40rpx;
      padding-bottom: 14rpx;
    }
    .cell {
      font-size: 28rpx;
      line-height: 40rpx;
      margin-bottom: 26rpx;
      color: $color;
      .value {
        color: #333;
        font-size: 30rpx;
        &.fw-700 {
          font-weight: 700;
        }
      }
    }
    .button-wrapper {
      padding: $spacing 0;
    }
  }
  .review-wrapper {
    border-top: 1px solid $border-color-p;
    border-bottom: 1px solid $border-color-p;
    .review-toolbar {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 88rpx;
      font-size: 28rpx;
      font-weight: 700;
      color: $primary;

      .iconimg {
        width: 22rpx;
        height: 20rpx;
        margin-left: 4rpx;
        transition: all 0.3s;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAoCAYAAACFFRgXAAAAAXNSR0IArs4c6QAABDJJREFUWAntWE1oVFcU/u6b/CFKEtD+RbCFgl20UCiCmUlMoGqcLvoH/iyEtiCVWuyi0GqbRGMyIdWNtAuJbqRQrDTiwrZqQttEcZJV/dmVtlZpFaotqDGg4/je8btj7vS+1zczMXHi5g0M95zvnHvO9+49794zA0Sf8q6AMuEbe+VluOinPp/gvobn8OnAGuUa+2yOXSLOYAopCN4ThX9iDjam29Ww5vAf4R65JIKGPDGFIzULsXbkHXU7j82CkPxCqq/dwAGSfdOkI8k/x7apRVp3DEiHW3lZC4JXM39hqHW31PnwMirLP5Pa69cxaJOdTHfXpM0Tlgq8TXDcGPQoQHNmAiebe+VJGy+H3LpLnpjI4gRzttjxuboTzn1uOThfElqL98qLnofjZPq4PYnyxSqFlSc71W8B/KGojX3yrNzFEPM+Ywckuasx4JVT29TPBs+vsAZG29VZAgk6/mEcJsens0C6qVteCuAzVnMxs0gHyfLtulCp0GST1cl8hDUw2qnOz4khrhTOat18+EIucBWGc6eJAWc4Lu2R5Tomy+AxXyiFczXViIft6P8I64k/tqsrdbWsJYUROxBJzxMXRxtTstrGpyMnUrKWq/q9jmnP5+6emFuJlpGP1d82buRQwtp47AM1Xl+LVSR92DhPjlXi4WA8JZsC+JRVruxm1+PRBVT5JjFXXR3aftiqbvhwS+EDFf+s/kZil37BHm7bu0FPR2EHS6griBfTSVZfCO1BH5bg3rYObOpSygvabL0kYeO8tFt6KHcY3YwM0N/WifdLJdIPfvlX9PMU2mDmmpExunkxbDd6sXHKhHUQvZUcPucK+eZxdQ6x5tezjDJhyVr3Sw0voYPcpdcCds9xsHm0Q+0J4AVVX+KCXpYh3i3ruGdfEvLVH0n/5FTh9fQWddNyh74pMzdxhGSbbZz+GSZfz5I6ZOOl5AcmrAMmemWF5+IwScy1E5DEaVWD5OhH6mrOb6c85d3BcZ4EL9h+lMdjMT7cZEMTsBVVp0VYR4z3yRIvi6MU59sZGPB3HvgrvRgqXRdDJLvItrOYrihBkjV7xodPUZk2YR0/0SOLWR6DIaT+ZZ3zVkW9zYM7cJ4J2/TlZOMPIucJT7cf5iXSQHJ6258vlphkz8xxkNSXUjE/bSt7P9zUJ/VuFt+yphNhZEg29IUM852VfvjUJ+oaX78VJPZdkASxgYWLkQyeHkE/rc9qPzz2obpV3YQ32E4NkKSrv+TwFW+vdfypdSeMoI1F/XDUD7Meon446ofvl0HUD9vHo0+O+uGoH/YVhF+J+mH/ehTU8v1wQY8ShnL0w8VSFvwjpdgk2zbWoS7HKrCMT562cVtm56b74ZapNO/2vDB5xoR10IfVD4cRDGIzLgk7YOuwVNxO4wB/ZOb+PefPpq9XdeKtUn+y2DEi+VGvwD1HBULns0o8dgAAAABJRU5ErkJggg==);
        &.active {
          transform: rotate(-180deg);
        }
      }
    }
    .review-items {
      padding-top: 12rpx;
    }
    .review-item {
      background-color: #eef4ff;
      border-radius: 12rpx;
      padding: 0 40rpx;
      margin-bottom: $spacing;
      .item-name {
        font-size: 32rpx;
        font-weight: 700;
        color: $color;
        line-height: 100rpx;
      }
      .item-cell {
        font-size: 28rpx;
        font-weight: 700;
        line-height: 40rpx;
        color: $color;
        padding: 26rpx 4rpx;
        border-bottom: 1px solid #979797;
        .value {
          overflow: hidden;
          text-align: right;
          font-weight: 400;
          margin-left: 100rpx;
          &.tag {
            font-size: 24rpx;
            line-height: 34rpx;
            font-weight: 500;
            padding: 0 20rpx;
            background-color: #ffffff;
            border-radius: 4rpx;
            border: solid 1rpx $primary;
            color: $primary;
          }
          &.fw-700 {
            font-weight: 700;
          }
          &.textarea {
            flex: 1;
          }
        }
        &:last-of-type {
          border-bottom: 0;
        }
      }
    }
  }
}
</style>
