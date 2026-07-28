<template>
  <view class="shop-center h5-page">
    <div class="header-wrapper">
      <div class="avatar-wrapper">
        <img :src="shopAvatar" alt="" class="avatar" />
        <div class="name">{{ shopInfo.cht131 }}</div>
      </div>
    </div>
    <div class="panel-wrapper">
      <div class="shop-info-wrapper">
        <div class="shop-info">
          <div class="cells">
            <div class="cell address" @click="handleNavigateToAddress">
              <div class="key">地址：</div>
              <div class="value">
                {{ shopInfo.aae006 }}
              </div>
              <div class="iconimg iconimg-address"></div>
            </div>
            <div class="cell">
              <div class="key">入驻时间：</div>
              <div class="value">{{ shopInfo.aae036.substr(0, 10) }}</div>
            </div>
          </div>
          <div class="button-wrapper">
            <div class="btn" @click="handleAddGood">
              <div class="iconimg"></div>
              <div>新增商品</div>
            </div>
          </div>
        </div>
      </div>
      <div class="goods">
        <block v-if="queryResultList.length > 0">
          <div
            class="good"
            v-for="(item, index) in queryResultList"
            :key="item.id"
          >
            <div class="name-wrapper d-f ai-c jc-sb">
              <div class="left">{{ item.chi621 }}</div>
              <!-- <div class="right">成交量：{{ item.num }}笔</div> -->
            </div>
            <div class="swiper-wrapper">
              <swiper
                class="swiper"
                :current="item.swiperIndex"
                @change="handleChangeSwiper($event, index)"
                circular
                autoplay
              >
                <block
                  v-for="(itemImg, indexImg) in item.imageList"
                  :key="indexImg"
                >
                  <swiper-item
                    class="swiper-item"
                    @click="handlePreviewImage(index, indexImg)"
                  >
                    <img :src="itemImg" alt="" />
                  </swiper-item>
                </block>
              </swiper>
              <div class="dots">
                <block
                  v-for="(itemImg, indexImg) in item.imageList"
                  :key="indexImg"
                >
                  <div
                    class="dot"
                    :class="item.swiperIndex === indexImg ? 'active' : ''"
                  ></div>
                </block>
              </div>
            </div>
            <div class="desc-wrapper">
              <div class="name">商品简介</div>
              <div class="desc">{{ item.chi625 }}</div>
            </div>
            <div class="cell d-f ai-c jc-sb">
              <div class="key">商品价格：</div>
              <div class="value">{{ item.chi622 }}</div>
            </div>
            <div class="cell d-f ai-c jc-sb">
              <div class="key">补贴比例：</div>
              <div class="value">{{ item.chi624Desc }}</div>
            </div>
            <div class="button-wrapper d-f ai-c jc-sb">
              <ComponentButton
                type="secondary"
                name="删除"
                width="264rpx"
                height="72rpx"
                @click="handleDeleteGood(index)"
              ></ComponentButton>
              <ComponentButton
                type="primary"
                name="修改"
                width="264rpx"
                height="72rpx"
                @click="handleEditGood(index)"
              ></ComponentButton>
            </div>
          </div>
        </block>
        <block v-else>
          <ComponentNoData tip="该店铺未查询到相关商品"></ComponentNoData>
        </block>
        <div class="load-more-wrapper" v-if="isExceedLimit">
          <ComponentLoadMore
            :isOver="isLoadOver"
            @click="handleClickLoadMore"
          ></ComponentLoadMore>
        </div>
      </div>
    </div>
    <ComponentTabbarShopping currentId="home"></ComponentTabbarShopping>
  </view>
</template>

<script>
import ComponentButton from '@/components/common/ez-button/ez-button.vue'
import ComponentTabbarShopping from '../components/ez-tabbar-shopping/ez-tabbar-shopping.vue'
import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
import ComponentLoadMore from '@/components/common/ez-load-more/ez-load-more.vue'

import {
  showModal,
  navigateTo,
  previewImage,
  downloadFile,
  showLoading,
  hideLoading,
  getStorage,
} from '@/utils/uni-api'
import { requestB058, requestB063 } from '@/service/api'
import {
  USER_INFO,
  USER_LIST,
  SHOP_INFO,
  UPDATE_GOOD_INFO,
  UPDATE_SHOP_INFO,
} from '@/store/constants'
import { mapGetters } from 'vuex'

export default {
  name: 'pageShopCenter',
  components: {
    ComponentButton,
    ComponentTabbarShopping,
    ComponentNoData,
    ComponentLoadMore,
  },
  data() {
    return {
      shopAvatar: '', // 店铺头像
      pageNo: 1, // 查询页数
      pageLimit: 5, // 每页数据条数
      isExceedLimit: false, // 加载条数是否超出限制
      isLoadOver: true, // 是否加载完成
      queryResultList: [], // 查询结果列表
      requestTime: 0, // 请求次数 控制 onShow
    }
  },
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {},
  // 监听页面初次渲染完成
  onReady() {},
  // 监听页面显示
  onShow() {
    getStorage('SHOP_CENTER_TYPE').then((res) => {
      console.log(res, 'SHOP_CENTER_TYPE')
      if (res) {
        const { cht130 } = this.shopInfo
        this._requestB058(cht130)
      }
    })
  },
  // 监听页面隐藏
  onHide() {},
  methods: {
    // 查询商铺所有商品列表
    _requestB058(cht130) {
      requestB058(cht130)
        .then((res) => {
          const { list } = res.lists.ht14List
          const hi21List = res.lists.hi21List.list
          const newList = []
          if (list && list.length > 0) {
            list.map((item) => {
              item.hi21List = []
              item.chi624Desc = parseFloat(item.chi624) * 10 + '%'
              for (let j = 0, jLen = hi21List.length; j < jLen; j++) {
                const jItem = hi21List[j]
                if (jItem.chi211 === item.cht140) {
                  item.hi21List.push(jItem)
                }
              }
              newList.push(item)
            })

            this.getUploadImages(newList)
          } else {
            this.queryResultList = []
          }
        })
        .catch((err) => {})
        .finally(() => {
          this.requestTime++
        })
    },
    // 根据商铺id返回申报的材料列表
    _requestB063(cht130) {
      requestB063(cht130)
        .then((res) => {
          const { list } = res.lists.hi21List
          const len = list.length
          const newList = []
          for (let i = 0; i < len; i++) {
            const item = list[i]
            if (item.che110 === '10000000021') {
              newList.push(item)
              break
            }
          }
          this.getUploadImageAvatar(newList)
        })
        .catch((err) => {})
    },
    // 请求文件下载
    requestDownloadFile(fileid) {
      return new Promise((resolve, reject) => {
        downloadFile('/upload/downloadFile/' + fileid)
          .then((res) => {
            const { tempFilePath } = res
            resolve(tempFilePath)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 获取已上传的商品图片
    async getUploadImages(data) {
      showLoading()
      if (!data || data.length < 1) {
        hideLoading()
        return
      }
      let tempArr = []
      for (let i = 0, len = data.length; i < len; i++) {
        const item = data[i]
        item.imageList = []
        item.swiperIndex = 0
        for (let j = 0, jLen = item.hi21List.length; j < jLen; j++) {
          const jtem = item.hi21List[j]
          const res = await this.requestDownloadFile(jtem.chi215)
          item.imageList.push(res)
        }
        tempArr.push(item)
      }
      // console.log(tempArr, 'tempArr')
      this.queryResultList = [...tempArr]
      hideLoading()
    },
    // 获取已上传的店铺头像
    async getUploadImageAvatar(data) {
      showLoading()
      if (!data || data.length < 1) {
        hideLoading()
        return
      }
      const res = await this.requestDownloadFile(data[0].chi215)
      this.shopAvatar = res
      this.$store.commit(UPDATE_SHOP_INFO, { avatar: res })
      hideLoading()
    },
    // 加载更多商品
    handleClickLoadMore() {
      this.pageNo++
      this._requestB058()
    },
    // 添加商品
    handleAddGood() {
      const { cht137 } = this.shopInfo
      if (cht137 === '1') {
        navigateTo('good-edit', 'packageSubsidizedGoods')
      } else {
        showModal('该店铺暂未认证通过，请通过后再添加商品！')
      }
    },
    // swiper change
    handleChangeSwiper(e, index) {
      // console.log(e, index)
      const queryResultList = [...this.queryResultList]
      const item = queryResultList[index]
      item.swiperIndex = e.target.current
      this.queryResultList = [...queryResultList]
    },
    // 预览图片
    handlePreviewImage(i, j) {
      const good = this.queryResultList[i]
      const { imageList } = good
      const current = imageList[j]
      previewImage(imageList, current)
    },
    // 导航至店铺地址
    handleNavigateToAddress() {},
    // 编辑商品回调
    handleEditGood(index) {
      const good = this.queryResultList[index]
      this.$store.commit(UPDATE_GOOD_INFO, good)
      navigateTo('good-edit', 'packageSubsidizedGoods')
    },
    // 删除商品回调
    handleDeleteGood(index) {
      const good = this.queryResultList[index]
    },
  },
  computed: {
    ...mapGetters([USER_INFO, USER_LIST, SHOP_INFO]),
  },
  watch: {
    'shopInfo.cht130': {
      handler(val) {
        if (val) {
          this._requestB063(val)
          this._requestB058(val)
        }
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.shop-center {
  position: relative;
  padding-bottom: 100rpx;
  .header-wrapper {
    width: 100%;
    height: 276rpx;
    background-color: $primary;
    padding: 10rpx $spacing;
    font-size: 28rpx;
    font-weight: 700;
    line-height: 40rpx;
    color: #ffffff;
    text-align: center;
    .avatar {
      width: 138rpx;
      height: 138rpx;
      border: 8rpx solid #d8e7ff;
      border-radius: 50%;
      margin: auto;
    }
    .name {
      padding-top: 6rpx;
    }
  }
  .panel-wrapper {
    padding: 0 $spacing;
  }

  .shop-info-wrapper {
    position: relative;
    width: 100%;
    height: 312rpx;
    .shop-info {
      width: 100%;
      height: 348rpx;
      position: absolute;
      top: -64rpx;
      left: 0;
      background-color: #ffffff;
      border-radius: 12rpx;
      padding: 40rpx;
    }
    .cells {
      position: relative;
      padding-top: 8rpx;
      padding-bottom: 42rpx;
      &::after {
        content: '';
        position: absolute;
        left: 0;
        width: 100%;
        bottom: 0;
        height: 4rpx;
        background-color: rgba($primary, 0.06);
        border-radius: 8rpx;
      }
    }
    .cell {
      display: flex;
      align-items: center;
      font-size: 28rpx;
      letter-spacing: 0rpx;
      color: #4e5767;
      line-height: 40rpx;
      margin-bottom: 16rpx;
      .value {
        flex: 1;
        margin-left: 20rpx;
        overflow: hidden;
        font-weight: 700;
        color: #333333;
        text-align: right;
        @include textOverflow();
      }
      &.address {
        margin-right: 30rpx;
        position: relative;
        .iconimg-address {
          position: absolute;
          right: -30rpx;
          top: 50%;
          transform: translateY(-50%);
          width: 21rpx;
          height: 27rpx;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAA2CAYAAACx1wu7AAAAAXNSR0IArs4c6QAABXlJREFUaAXNmWtsFFUUx/9ndtulkmjbxAithVoqVTEkJoZoUeMDlRARPoAxMRolhI9AIRKMUVdjTFT6oH7QaBCMXxSNkUfiB00UpUWNCYlSxNrWthZEbWp98Gjp9vo/s93tdjv7uDvbx0l2587c8/jNuc+ZEfiQis3mRjhYYwxuoJsyA8yHQTmE/8AZAX5zj4KTGMWBX5vlRK7h6MtOFtSZJZFRPCEGa0mzyMaawTqN4OOAg729jdJmaZud+tV1phwRvMBAjzNfTnZWKbQEo7zRfQjg2b5GOZ1Ca8LljBm9M2yCP/+F56i4nU1cNMHa54kILrBV6q8twfNfhGUknbu0oMxiKbP4IZ3dlc6J3zpCfM7srmN2B1L5Sgm6cKu5nn3xkG0/TBUo03WCdLLvru5pkh+9dD1BXUiDVjZ1sZfRVF1jVxgMCGq9YCcNigU7TUnE4OB0Q+rNa0yNrQzJyZgAun6/CUTOYz8NqpMVp+tcYyuDsiTGnAB6rBXPsHJFosIMlVeMscTDx/to5ZNm3qVhdHCOnBuvncmC4FxBIaq7X5WzihHPaGQY4VkDqWRMmMukZYqb0aptZvFQBG2sDEYv2/0vXww8eBNwCxfUeWPzxNlB4OtO4OBxoKXdzl9cWzASCmBJV4O0u2DDEWzIBfKaK4FXHgZurY67jhcWXcWNAH+P1ALHOoAd7wG//Bmvzq7AxLlswE636TnS1mRnOa61rAo4tM0bclwrWtIbUV21sZUYm7jNPoKfbBxoJjVw8WU2VsDgeWB1g31mQ0HUOEytdTa1uW0h9ZbURm1tRRm16ZfaGOrA8eqT2fpQW/VhKUsdbjrm2xjp6PYrtj6UUTNaZhNYpyC/koOPMocTqRVobJ70A2vrQxkdzp8hP0GnybZQ++jvNsF0xfErtj6UUZveClSXRb9i60MZrTOqa7dfsfURzahwM2IhusHQtTtXUVvbTQqnphMOn9M/tQ2qGwxdDm1FbdTWVpTRKapCiz5f2xjrLmjDW3awCqk21jsobqCvKEar07FZhjhFfWUDqrrfdkU3GNl0A9XRzYja2AoH0pG2sAy7+1Fm9G1up+6zdaLZWf9adO2eko2zAgn2RA/81ye+1hb3ealSL84WYQI7NpagJhyWUV3r8cFDEmGKG2cLYIyDoA0KqecuqBZKC7CHFfo+c1YIE9fH0b4vBhMH/X6XnOPJpljFjB8dbOJLs/hsFAdVsN7dcpg5fmfGIQV7+5rkk0SOCaBaUQBs5UjrTVSa1jJjh+agLjnmJNDuJhksCOJ+Kto+3Cb7tj7nGBkIClZ2vSx/JxtPAlWF7no5FSQsDScZJDvI2zlXIPpa5fXKUWN4gmpFT4McZ+UDLP6n51Mqgn/5Endt3275JlWclKBqwMF1lJm9g8WeVA7ycL1HHCznV5LP0vlKC6qGmtm5BbiZxbSO0gVJWSc4OqcQyzgN/ZBSZ6wiI6jqtddLf+1tWMk++xQn4ouZnGZVL3ijuAT3dO6SP7LRZ1w7qdxurhu5hDe5677dzjKqzYBnODI2Js+TmXxZg6pDY4ws3ILHRrkWc9dVmimIWx/9CPZ6YRGe9pp+MvnICTTmtGKHKTNDeJewd8eueR3ZZboCATzK/t7qVZ/NNV+gGqC62YQuduIjwq7yCkjI7ziJ36sLiVd9ttd8g2qg6rC5/MIA97MAX0gmiKCfU09Nui9yCdppi1mN+rQeWNkRln84QF5K1uOH2RfzAal+8wKqjrgwHNBjogRDeD/x3E85L00fAyjfYnr5oFgxdt5+ullqYnV+j3nL6BjIqRgQB9HJWDkfx7yCsnkSt4aJZd+seQVls48vr4ll35h5HEzKwrv+kk8H/e7PQcotWy7c/wMdEaHz04jyNAAAAABJRU5ErkJggg==);
        }
      }
    }
    .button-wrapper {
      padding: 38rpx;
      font-size: 28rpx;
      font-weight: 700;
      line-height: 24rpx;
      .iconimg {
        width: 24rpx;
        height: 24rpx;
        position: relative;
        margin-right: 18rpx;
        &::before,
        &::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: #fff;
          border-radius: 4px;
        }
        &::before {
          width: 4rpx;
          height: 100%;
        }
        &::after {
          width: 100%;
          height: 4rpx;
        }
      }
      .btn {
        width: 200rpx;
        height: 72rpx;
        display: flex;
        align-items: center;
        align-items: center;
        justify-content: center;
        background-color: $primary;
        border-radius: 8rpx;
        margin: auto;
        color: #fff;
      }
    }
  }
  .swiper-wrapper {
    padding-bottom: 36rpx;
    position: relative;
    .swiper {
      height: 322rpx;
      background-color: #f4f8ff;
      border-radius: 16rpx;
      overflow: hidden;
    }
    .dots {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 0;
      display: flex;
      align-items: center;
      .dot {
        width: 14rpx;
        height: 14rpx;
        background-color: #a8c8ff;
        border-radius: 60px;
        margin-right: 10rpx;
        transition: all 0.3s;
        &.active {
          width: 54rpx;
          background-color: $primary;
        }
      }
    }
  }
  .goods {
    .good {
      background-color: #ffffff;
      border-radius: 12rpx;
      padding: 0 40rpx;
      margin-bottom: $spacing;
    }
    .name-wrapper {
      height: 106rpx;
      font-size: 32rpx;
      font-weight: 700;
      color: #3d424d;
      .right {
        font-weight: 400;
        color: #666666;
        font-size: 26rpx;
      }
    }
    .desc-wrapper {
      padding-top: 76rpx;
      padding-bottom: 46rpx;
      .name {
        font-size: 30rpx;
        font-weight: 700;
        line-height: 42rpx;
        color: #4e5767;
      }
      .desc {
        background-color: rgba(#f0f2f5, 0.58);
        border-radius: 12rpx;
        padding: 28rpx;
        line-height: 38rpx;
        font-size: 26rpx;
        color: #333333;
        margin-top: 22rpx;
      }
    }
    .cell {
      font-size: 28rpx;
      line-height: 36rpx;
      color: #4e5767;
      margin-bottom: 26rpx;
      .value {
        font-size: 30rpx;
        font-weight: 700;
        color: #333333;
      }
    }
    .button-wrapper {
      padding: 44rpx 0;
    }
  }
}
</style>
