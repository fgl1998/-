<template>
  <view class="shop-info h5-page" v-if="isRequestOver">
    <ComponentPanel :title="shopInfo.cht131">
      <div class="panel-content">
        <div class="desc-wrapper">
          <div class="name">商铺简介</div>
          <div class="desc">{{ shopInfo.cht138 }}</div>
        </div>
        <div class="swiper-wrapper">
          <swiper
            class="swiper"
            :current="swiperIndexShop"
            @change="handleChangeSwiperShop"
            circular
            autoplay
          >
            <block v-for="(item, index) in shopImageList" :key="index">
              <swiper-item
                class="swiper-item"
                @click="handlePreviewImageShop(index)"
              >
                <img :src="item" alt="" />
              </swiper-item>
            </block>
          </swiper>
          <div class="dots">
            <block v-for="(item, index) in shopImageList" :key="index">
              <div
                class="dot"
                :class="swiperIndexShop === index ? 'active' : ''"
              ></div>
            </block>
          </div>
        </div>
      </div>
    </ComponentPanel>

    <div class="panel-wrapper">
      <div class="goods">
        <block v-for="(item, index) in goods" :key="item.id">
          <div class="good">
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
            <div class="button-wrapper d-f ai-c jc-c">
              <ComponentButton
                type="primary"
                name="我要购买"
                width="264rpx"
                height="72rpx"
                @click="handleBuyGood(index)"
              ></ComponentButton>
            </div>
          </div>
        </block>
      </div>
    </div>
    <ComponentTabbarShopping currentId="home"></ComponentTabbarShopping>
  </view>
</template>

<script>
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
import ComponentButton from '@/components/common/ez-button/ez-button.vue'
import ComponentTabbarShopping from '../components/ez-tabbar-shopping/ez-tabbar-shopping.vue'

import {
  downloadFile,
  navigateTo,
  previewImage,
  hideLoading,
  showLoading,
} from '@/utils/uni-api'
import { requestB046, requestB058, requestB063 } from '@/service/api'
import {
  USER_INFO,
  USER_LIST,
  SHOP_INFO,
  UPDATE_GOOD_INFO,
} from '@/store/constants'
import { mapGetters } from 'vuex'

export default {
  name: 'pageShopInfo',
  components: {
    ComponentPanel,
    ComponentButton,
    ComponentTabbarShopping,
  },
  data() {
    return {
      swiperIndexShop: 0,
      shopImageList: [], // 商铺图片
      goods: [], // 店铺商品
      chi032: '', // 补贴项目名称
      isRequestOver: false, // 是否请求完成
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
    // 查询商铺所有商品列表
    _requestB058(cht130) {
      return new Promise((resolve, reject) => {
        requestB058(cht130, false).then((res) => {
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
          }
          resolve(newList)
        })
      })
    },
    // 根据商铺id返回申报的材料列表
    _requestB063(cht130) {
      return new Promise((resolve, reject) => {
        requestB063(cht130, false).then((res) => {
          const { list } = res.lists.hi21List
          const len = list.length
          const newList = []
          for (let i = 0; i < len; i++) {
            const item = list[i]
            if (item.che110 === '10000000040') {
              newList.push(item)
            }
          }
          resolve(newList)
        })
      })
    },
    // 对物品进行下单操作
    _requestB046(cht140) {
      const { idCard } = this.userInfo
      const { cht130, chi031 } = this.shopInfo
      requestB046(cht130, chi031, cht140, idCard, '').then(() => {
        navigateTo('order', 'packageSubsidizedGoods', { type: 'user' })
      })
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
    // 店铺 swiper change
    handleChangeSwiperShop(e) {
      const value = e.target.current
      this.swiperIndexShop = value
    },
    // 商品 swiper change
    handleChangeSwiper(e, index) {
      // console.log(e, index)
      const goods = [...this.goods]
      const item = goods[index]
      item.swiperIndex = e.target.current
      this.goods = [...goods]
    },
    // 预览商品图片
    handlePreviewImage(i, j) {
      const good = this.goods[i]
      const { imageList } = good
      const current = imageList[j]
      previewImage(imageList, current)
    },
    // 预览商铺图片
    handlePreviewImageShop(index) {
      const shopImageList = this.shopImageList
      const current = shopImageList[index]
      previewImage(shopImageList, current)
    },

    // 导航至店铺地址
    handleNavigateToAddress() {},
    // 购买商品
    handleBuyGood(index) {
      const item = this.goods[index]
      this.$store.commit(UPDATE_GOOD_INFO, item)
      this._requestB046(item.cht140)
    },
    // 初始化数据
    initData(cht130) {
      showLoading()
      Promise.all([this._requestB063(cht130), this._requestB058(cht130)])
        .then(async (res) => {
          const shopImages = res[0]
          const goods = res[1]
          // console.log('=====================1====================')
          // 获取店铺图片
          if (shopImages && shopImages.length > 0) {
            const arr = []
            for (let i = 0, len = shopImages.length; i < len; i++) {
              const item = shopImages[i]
              const res = await this.requestDownloadFile(item.chi215)
              // console.log('=====================2====================', i)
              arr.push(res)
            }
            this.shopImageList = [...arr]
          }
          // console.log('=====================3====================')
          // 获取商品图片
          if (goods && goods.length > 0) {
            const arr = []
            for (let i = 0, len = goods.length; i < len; i++) {
              const item = goods[i]
              item.imageList = []
              item.swiperIndex = 0
              for (let j = 0, jLen = item.hi21List.length; j < jLen; j++) {
                const jtem = item.hi21List[j]
                const res = await this.requestDownloadFile(jtem.chi215)
                // console.log('=====================4====================', i, j)
                item.imageList.push(res)
              }
              arr.push(item)
            }
            this.goods = [...arr]
          }
          // console.log('=====================5====================')
          // console.log(res, 'shopImages', shopImages, 'goods', goods)
          hideLoading()
        })
        .catch((err) => {
          // console.log(err, 778899)
          hideLoading()
        })
        .finally(() => {
          this.isRequestOver = true
        })
    },
  },
  computed: {
    ...mapGetters([USER_INFO, USER_LIST, SHOP_INFO]),
  },
  watch: {
    'shopInfo.cht130': {
      handler(val) {
        if (val) {
          this.initData(val)
        }
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.shop-info {
  position: relative;
  padding-top: $spacing;
  padding-bottom: 100rpx;
  .panel-content {
    .desc-wrapper {
      padding-top: 20rpx;
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
  }
  .panel-wrapper {
    padding: 0 $spacing;
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
    padding-top: $spacing;
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
