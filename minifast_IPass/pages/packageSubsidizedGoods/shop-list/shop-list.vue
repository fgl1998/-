<template>
  <view class="shop-list h5-page">
    <block v-for="(item, index) in shopList" :key="index">
      <div class="shop" :class="[item.cht137 == '1' ? '' : 'fail']">
        <div class="name-wrapper d-f ai-c jc-sb">
          <div class="iconimg"></div>
          <div class="name">{{ item.cht131 }}</div>
          <div class="tag">
            {{ item.cht137Desc }}
          </div>
          <div class="iconimg"></div>
        </div>
        <div class="cells">
          <div class="cell d-f ai-c">
            <div class="key">补贴项目：</div>
            <div class="value">{{ item.chi032 || '暂无' }}</div>
          </div>
          <div class="cell d-f ai-c address">
            <div class="key">商铺地址：</div>
            <div class="value">{{ item.aae006 }}</div>
            <div class="iconimg iconimg-address"></div>
          </div>
        </div>
        <div
          class="handle-wrapper d-f ai-c jc-fe"
          v-if="item.cht137 == '1'"
          @click="handleJumpRoute(index)"
        >
          <div>查看详情</div>
          <div class="iconimg"></div>
        </div>
      </div>
    </block>
    <div class="button-wrapper" v-if="shopList.length > 0">
      <ComponentButton
        name="添加店铺"
        height="68rpx"
        type="primary"
        @click="handleAddShop"
      ></ComponentButton>
    </div>
  </view>
</template>

<script>
import ComponentButton from '@/components/common/ez-button/ez-button.vue'

import { showModal, navigateTo } from '@/utils/uni-api'
import { requestB049 } from '@/service/api'
import { UPDATE_SHOP_INFO, USER_INFO, USER_LIST } from '@/store/constants'
import { mapGetters } from 'vuex'

export default {
  name: 'pageShopList',
  data() {
    return {
      shopList: [],
    }
  },
  components: {
    ComponentButton,
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
    // 查询用户店铺信息
    _requestB049(aac002) {
      requestB049(aac002, 1, 99)
        .then((res) => {
          const { list } = res.lists.ht13List
          const newList = []
          list.map((item) => {
            const cht137 = item.cht137
            switch (cht137) {
              case '0':
                item.cht137Desc = '未认定'
                break
              case '1':
                item.cht137Desc = '认定通过'
                break
              case '2':
                item.cht137Desc = '认定不通过'
                break
              default:
                item.cht137Desc = '未知状态'
                break
            }
            newList.push(item)
          })
          this.shopList = [...newList]
        })
        .catch((err) => {})
    },
    // 跳转路由
    handleJumpRoute(index) {
      const item = this.shopList[index]
      if (item.cht137 === '1') {
        this.$store.commit(UPDATE_SHOP_INFO, item)
        navigateTo('shop-center', 'packageSubsidizedGoods')
      } else {
        showModal('该商铺暂未认定通过，请通过后再访问！')
      }
    },
    // 添加商铺
    handleAddShop() {
      navigateTo('shop-add', 'packageSubsidizedGoods')
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
          this._requestB049(idCard)
        }
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.shop-list {
  padding: $spacing;
  .shop {
    background-color: #ffffff;
    border-radius: 8rpx;
    margin-bottom: 20rpx;
    padding: 0 40rpx;
    .name-wrapper {
      padding: 30rpx 0 30rpx 42rpx;
      border-bottom: 1px solid rgba($primary, 0.2);
      position: relative;
      .name {
        flex: 1;
        overflow: hidden;
        margin-right: 30rpx;
        line-height: 42rpx;
        font-size: 30rpx;
        color: $color;
        font-weight: 700;
        position: relative;
      }
      .tag {
        line-height: 1;
        font-size: 24rpx;
        background-color: #dcffe8;
        border-radius: 4px;
        padding: 12rpx 22rpx;
        font-weight: 400;
        color: #0cb54d;
      }
      .iconimg {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        width: 30rpx;
        height: 30rpx;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAMAAADWZboaAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAC3UExURUdwTB2Y/1i9/xiT/yuo/zjC/yKi/zO3/x+c/wyA/z3I/yag/zzH/y+0/ymr/wR1/y+1/xuX/ymr/x6c/x6c/zC3/wV3/yWl/yuw/wR1/xqW/wd5/x+d/yan/z7L/wR2/wFy/wZ5/yCf/xOM/xCH/xiS/y+0/xuX/wh8/zS8/wyC/zG3/zvH/zrF/zK6/za//x2b/yKi/xGK/xWP/ySl/yiq/zjC/yyw/w6F/wp//yqt/yan/wuA/2PKJQYAAAAedFJOUwBJA68NczUTknS4H+qy17ib0LbhX+3iy9Xx7BPt3dqCRGsAAALKSURBVEjHnZULn7FAFMZPkW6IZe1iF28kJISw9P0/1zuXLjPN7K7t3/k1Z55nHpEuABhds5qTJ2lamg4ZqvZ0Lk1rKk3WrVTZTrbbiWzL7LydWHVyTGtLCLc/EZYaCx9XC8k0xBWG7Cfw85DdwlBDZ6iJxvAS/oKwoKmDdgkvVUCHtWi3v+xR/byaW7O3oLmvSBPW6z3aCKgh4DnuSyOnoQ7WlYH1brferVEVY0ZpzjgE2H1PsAtQMVNeh6AysAyCZbAkBK+tTuuV97EXkDXUzOYkWtDBN5PeWUoRTRy9Lq+olq30HmzJkoVJ1pLoFbPEu/QGVvWrhOzu1ulaDOTme37rv4tJmQn3jJfcfbkLyEy4x/E9xl07d9tilDNjmoE4p5GajViCxMyij/jRrtMT0Y4LDRXt2/Q81duFB4+CTxu7bw8pb9izPxkFzgx9ch7OUsiJ6rMKRHSMzlF0NrCt5R7RUt/VsGewGkQM5EuNIylj8mNYBSLXjdwIFR7JjzVcl2oYN/XxF1LtQsdRl4V8Y73nCvT0/ENz+OgH+X8UMaqQf+aDjx44yGFRlldpEgxeLUUP9Kpp9FitR0S1cShHfYaD37PpVWOODgefeCOTXmV2z+eB0tzvZretYtS63ZqhpK9Svev/FvW7NkiwhaQPnsBIEYKqMhLXSaKeV2vwyUZNtgpOnnfyTqjoPO1rSj3L1ZUa0jAevxZO3+DVDLPfN40sJwJzntP8hCrvuXlpTTn6B+DIMz/OUR2fARbH4+K4QEVHzJHRMLIe7WDxM7fFDZXUgltlYFP0m9uGgBrS30oeq6MdbCoDSZJskg2qYmQpa8wckq+KJDBYEb5WVECNAPYEPRmAs6qIA+a/aqxMGA+rRYfodWBOK2Hih4dTJemQp13dmU2ns+kMFZWzXjZiUOOkDxHVHM7+xNBU8+fW2HQGz+YGjklemPAfjmrr5Bed9skAAAAASUVORK5CYII=);
        margin-right: 16rpx;
      }
    }
    .cells {
      font-size: 28rpx;
      color: $color;
      line-height: 1.4;
      padding: 20rpx 0;
      .cell {
        padding: 10rpx 0;
        .value {
          flex: 1;
          overflow: hidden;
          text-align: right;
          font-weight: 500;
        }
        &.address {
          padding-right: 30rpx;
          position: relative;
          .iconimg-address {
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            width: 21rpx;
            height: 27rpx;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAA2CAYAAACx1wu7AAAAAXNSR0IArs4c6QAABXlJREFUaAXNmWtsFFUUx/9ndtulkmjbxAithVoqVTEkJoZoUeMDlRARPoAxMRolhI9AIRKMUVdjTFT6oH7QaBCMXxSNkUfiB00UpUWNCYlSxNrWthZEbWp98Gjp9vo/s93tdjv7uDvbx0l2587c8/jNuc+ZEfiQis3mRjhYYwxuoJsyA8yHQTmE/8AZAX5zj4KTGMWBX5vlRK7h6MtOFtSZJZFRPCEGa0mzyMaawTqN4OOAg729jdJmaZud+tV1phwRvMBAjzNfTnZWKbQEo7zRfQjg2b5GOZ1Ca8LljBm9M2yCP/+F56i4nU1cNMHa54kILrBV6q8twfNfhGUknbu0oMxiKbP4IZ3dlc6J3zpCfM7srmN2B1L5Sgm6cKu5nn3xkG0/TBUo03WCdLLvru5pkh+9dD1BXUiDVjZ1sZfRVF1jVxgMCGq9YCcNigU7TUnE4OB0Q+rNa0yNrQzJyZgAun6/CUTOYz8NqpMVp+tcYyuDsiTGnAB6rBXPsHJFosIMlVeMscTDx/to5ZNm3qVhdHCOnBuvncmC4FxBIaq7X5WzihHPaGQY4VkDqWRMmMukZYqb0aptZvFQBG2sDEYv2/0vXww8eBNwCxfUeWPzxNlB4OtO4OBxoKXdzl9cWzASCmBJV4O0u2DDEWzIBfKaK4FXHgZurY67jhcWXcWNAH+P1ALHOoAd7wG//Bmvzq7AxLlswE636TnS1mRnOa61rAo4tM0bclwrWtIbUV21sZUYm7jNPoKfbBxoJjVw8WU2VsDgeWB1g31mQ0HUOEytdTa1uW0h9ZbURm1tRRm16ZfaGOrA8eqT2fpQW/VhKUsdbjrm2xjp6PYrtj6UUTNaZhNYpyC/koOPMocTqRVobJ70A2vrQxkdzp8hP0GnybZQ++jvNsF0xfErtj6UUZveClSXRb9i60MZrTOqa7dfsfURzahwM2IhusHQtTtXUVvbTQqnphMOn9M/tQ2qGwxdDm1FbdTWVpTRKapCiz5f2xjrLmjDW3awCqk21jsobqCvKEar07FZhjhFfWUDqrrfdkU3GNl0A9XRzYja2AoH0pG2sAy7+1Fm9G1up+6zdaLZWf9adO2eko2zAgn2RA/81ye+1hb3ealSL84WYQI7NpagJhyWUV3r8cFDEmGKG2cLYIyDoA0KqecuqBZKC7CHFfo+c1YIE9fH0b4vBhMH/X6XnOPJpljFjB8dbOJLs/hsFAdVsN7dcpg5fmfGIQV7+5rkk0SOCaBaUQBs5UjrTVSa1jJjh+agLjnmJNDuJhksCOJ+Kto+3Cb7tj7nGBkIClZ2vSx/JxtPAlWF7no5FSQsDScZJDvI2zlXIPpa5fXKUWN4gmpFT4McZ+UDLP6n51Mqgn/5Endt3275JlWclKBqwMF1lJm9g8WeVA7ycL1HHCznV5LP0vlKC6qGmtm5BbiZxbSO0gVJWSc4OqcQyzgN/ZBSZ6wiI6jqtddLf+1tWMk++xQn4ouZnGZVL3ijuAT3dO6SP7LRZ1w7qdxurhu5hDe5677dzjKqzYBnODI2Js+TmXxZg6pDY4ws3ILHRrkWc9dVmimIWx/9CPZ6YRGe9pp+MvnICTTmtGKHKTNDeJewd8eueR3ZZboCATzK/t7qVZ/NNV+gGqC62YQuduIjwq7yCkjI7ziJ36sLiVd9ttd8g2qg6rC5/MIA97MAX0gmiKCfU09Nui9yCdppi1mN+rQeWNkRln84QF5K1uOH2RfzAal+8wKqjrgwHNBjogRDeD/x3E85L00fAyjfYnr5oFgxdt5+ullqYnV+j3nL6BjIqRgQB9HJWDkfx7yCsnkSt4aJZd+seQVls48vr4ll35h5HEzKwrv+kk8H/e7PQcotWy7c/wMdEaHz04jyNAAAAABJRU5ErkJggg==);
          }
        }
      }
    }
    .handle-wrapper {
      border-top: 1px solid rgba($primary, 0.2);
      height: 88rpx;
      font-size: 28rpx;
      font-weight: 500;
      color: $primary;
      line-height: 1.4;
      .iconimg {
        width: 44rpx;
        height: 44rpx;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAMAAABGS8AGAAAAdVBMVEUAAAA4g/84g/84gv84gv84g/84g/84g/84hP85g/85g/86hP87hP89iP9Bh/9Aif9Jm/84gv85g/85g/86g/86h/9Gi/9Av/85gv84gv84g/85g/85hP85g/84hP88g/85g/85gv84g/84gv85hP87hv84gv8JxbXpAAAAJnRSTlMA+/bw6uLQtJ2Uby8oHRYQB9mohlo2CwS8rI5/emNKIsXAo2RVPQwp/I4AAADZSURBVFjD7da3EoJQEIVhQQURJQcjGPf9H9FxuNg4x2K3YcbzlX+xBdw0IyIiIiKi33Y17DYi+w3qxsHirbaw68mbf0hg15LB/JjCrhOIs1hnsKtUuTjLewu7RnteipM/YFfJ1gtxgg52leY0F+daw66Slr44YQy7ShJ54tx62FW2q3GEF8GusynEgV0rDocB332ag42fYoR/nl+iblpuXpSgbtogRY+6aUuHMeqmQ+jyRN10bAYd6raDvkJ9UlfT59JsULdd/ynqU3yw4CfWNB+FRERERH/hBS4DRCd5ULrmAAAAAElFTkSuQmCC)
          no-repeat center center;
        background-size: 100% 100%;
      }
    }
    &:last-of-type {
      margin-bottom: 0;
    }
    &.fail {
      opacity: 0.6;
      .name-wrapper {
        .tag {
          color: #fff;
          background-color: #f00;
        }
      }
    }
  }
  .button-wrapper {
    padding: 30rpx 0;
  }
}
</style>
