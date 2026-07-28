<template>
  <div class="shop-query h5-page">
    <ComponentPanel title="查询条件">
      <div class="panel-content">
        <div class="from">
          <div class="input-wrapper">
            <label for="" class="label">业务局</label>
            <ComponentPicker
              placeholder="请选择业务局"
              :range="chi037Range"
              v-model="chi037"
              idName="chi031"
              rangeKey="name"
              valueKey="id"
            ></ComponentPicker>
          </div>
          <div class="input-wrapper" v-if="chi037">
            <label for="" class="label">补贴项目</label>
            <ComponentPicker
              placeholder="请选择补贴项目"
              :range="chi031Range"
              v-model="chi031"
              idName="chi031"
              rangeKey="name"
              valueKey="id"
            ></ComponentPicker>
          </div>
          <div class="input-wrapper">
            <label for="" class="label">商户名称</label>
            <input
              type="text"
              maxlength="20"
              placeholder="请输入商户名称"
              v-model="shopName"
            />
          </div>
          <div class="button-wrapper">
            <ComponentButton
              type="primary"
              height="68rpx"
              @click="handleQueryData"
              name="查询"
            ></ComponentButton>
          </div>
        </div>
      </div>
    </ComponentPanel>
    <div class="query-result">
      <block v-if="queryResultList.length > 0">
        <block v-for="(item, index) in queryResultList" :key="item.id">
          <div class="shop">
            <div class="name-wrapper d-f ai-c jc-sb">
              <div class="left">{{ item.cht131 }}</div>
              <!-- <div class="right">{{ item.distance }}</div> -->
            </div>
            <div class="desc-wrapper">
              <div class="name">商品简介</div>
              <div class="desc">{{ item.cht138 }}</div>
            </div>
            <div
              class="good-wrapper"
              v-if="item.goods && item.goods.length > 0"
            >
              <div class="name">店铺商品</div>
              <div class="d-f ai-c fw-w">
                <block
                  v-for="(itemGood, indexGood) in item.goods"
                  :key="indexGood"
                  ><div class="tag">{{ itemGood.chi621 }}</div>
                </block>
              </div>
            </div>
            <div class="cells">
              <div class="cell d-f ai-c jc-sb" @click="handleCallPhone(index)">
                <div class="key">联系方式：</div>
                <div class="value">{{ item.aae005 }}</div>
                <div class="iconimg iconimg-tel"></div>
              </div>
              <div class="cell d-f ai-c jc-sb">
                <div class="key">地址：</div>
                <div class="value">{{ item.aae006 }}</div>
                <div class="iconimg iconimg-address"></div>
              </div>
            </div>

            <div class="button-wrapper d-f ai-c jc-sb">
              <ComponentButton
                type="secondary"
                name="导航前往"
                width="264rpx"
                height="72rpx"
                @click="handleNavigationAddress(index)"
              ></ComponentButton>
              <ComponentButton
                type="primary"
                name="进入店铺"
                width="264rpx"
                height="72rpx"
                @click="handleEnterShop(index)"
              ></ComponentButton>
            </div>
          </div>
        </block>
      </block>
      <block v-else>
        <ComponentNoData tip="未查询到相关数据"></ComponentNoData>
      </block>
      <div class="load-more-wrapper" v-if="isExceedLimit">
        <ComponentLoadMore
          :isOver="isLoadOver"
          @click="handleClickLoadMore"
        ></ComponentLoadMore>
      </div>
    </div>
  </div>
</template>
<script>
import ComponentButton from '@/components/common/ez-button/ez-button.vue'
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
import ComponentPicker from '@/components/project/ez-picker/ez-picker.vue'
import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
import ComponentLoadMore from '@/components/common/ez-load-more/ez-load-more.vue'

import {
  navigateTo,
  showLoading,
  hideLoading,
  openLocation,
  makePhoneCall,
} from '@/utils/uni-api'

import { requestB061, requestB062, requestB067 } from '@/service/api'

import { UPDATE_SHOP_INFO, USER_INFO, USER_LIST } from '@/store/constants'
import { mapGetters } from 'vuex'

export default {
  name: 'pageShopQuery',
  data() {
    return {
      chi037: '', // 业务局
      chi037Range: [],
      chi031: '', // 补贴项目
      chi031Range: [],
      shopName: '', // 商品名称
      // 查询结果列表
      queryResultList: [],
      pageNo: 1, // 查询页数
      pageLimit: 5, // 每页数据条数
      isExceedLimit: false, // 加载条数是否超出限制
      isLoadOver: true, // 是否加载完成
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentPicker,
    ComponentNoData,
    ComponentLoadMore,
  },
  onLoad(e) {
    // 查询专项补贴项目业务局列表
    requestB061().then((res) => {
      const { list } = res.lists.chi037List
      this.chi037Range = [...list]
    })
  },
  onReady() {},
  onShow() {},
  methods: {
    // 根据业务局查询专项补贴列表
    _requestB062(chi037) {
      requestB062(chi037).then((res) => {
        const { list } = res.lists.chi031List
        this.chi031Range = [...list]
      })
    },
    // 查询店铺信息
    _requestB067() {
      showLoading()
      const chi037 = this.chi037
      const chi031 = this.chi031
      const shopName = this.shopName
      const pageLimit = this.pageLimit
      const pageNo = this.pageNo

      requestB067(chi031, chi037, shopName, pageNo, pageLimit, false)
        .then((res) => {
          const ht13List = res.lists.ht13List.list
          const ht14List = res.lists.ht14List.list
          let len = ht13List.length
          let newList = []
          if (ht13List && ht13List.length > 0) {
            for (let i = 0; i < len; i++) {
              const item = ht13List[i]
              const arr = []
              for (let j = 0, jLen = ht14List.length; j < jLen; j++) {
                const jItem = ht14List[j]
                if (jItem.cht130 === item.cht130) {
                  arr.push(jItem)
                }
              }
              item.goods = [...arr]
              newList.push(item)
            }

            // 第一次加载
            if (pageNo < 2) {
              // 加载完成
              if (len < pageLimit) {
                this.isLoadOver = true
              } else {
                // 加未载完成 还有文件待加载
                this.isLoadOver = false
                this.isExceedLimit = true
              }
              this.queryResultList = [...newList]
            } else {
              // 加载更多
              // 加载完成
              if (len < pageLimit) {
                this.isLoadOver = true
              } else {
                // 加未载完成 还有文件待加载
                this.isLoadOver = false
              }
              this.queryResultList = [...this.queryResultList, ...newList]
            }
          } else {
            this.isLoadOver = true
            if (pageNo < 2) {
              this.queryResultList = []
            } else {
              this.queryResultList = [...this.queryResultList]
            }
          }
          hideLoading()
        })
        .finally(() => {
          this.isShowSearchResult = true
          hideLoading()
        })
    },
    // 导航
    handleNavigationAddress(index) {
      const { cht13a, cht139, cht131, aae006 } = this.queryResultList[index]
      openLocation(parseFloat(cht13a), parseFloat(cht139), cht131, aae006)
    },
    // 导航
    handleCallPhone(index) {
      const { aae005 } = this.queryResultList[index]
      makePhoneCall(aae005)
    },
    // 进入店铺
    handleEnterShop(index) {
      const item = this.queryResultList[index]
      this.$store.commit(UPDATE_SHOP_INFO, item)
      navigateTo('shop-info', 'packageSubsidizedGoods')
    },
    // 加载更多
    handleClickLoadMore() {
      this.pageNo++
      this._requestB067()
    },
    // 查询数据
    handleQueryData() {
      this.pageNo = 1
      this.queryResultList = []
      this.isExceedLimit = false
      this.isLoadOver = true
      this._requestB067()
    },
  },
  computed: {
    ...mapGetters([USER_INFO, USER_LIST]),
  },
  watch: {
    chi037(val) {
      this._requestB062(val)
    },
  },
}
</script>
<style lang="scss" scoped>
.shop-query {
  padding: $spacing;
  .from {
    background-color: #fff;
    box-shadow: $box-shadow-base;
    padding: $spacing;
    .button-wrapper {
      padding: $spacing $spacing * 2;
    }
  }
  .query-result {
    margin-top: $spacing;
    .shop {
      background-color: #ffffff;
      border-radius: 12rpx;
      padding: 0 40rpx;
      margin-bottom: $spacing;
    }
    .name-wrapper {
      height: 106rpx;
      font-size: 32rpx;
      font-weight: 700;
      color: $color;
      border-bottom: 1px solid rgba($primary, 0.25);
      .right {
        font-weight: 400;
        color: #666666;
        font-size: 26rpx;
      }
    }
    .desc-wrapper {
      padding-top: 28rpx;
      padding-bottom: 22rpx;
      .name {
        font-size: 30rpx;
        font-weight: 700;
        line-height: 42rpx;
        color: $color;
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
    .good-wrapper {
      padding-top: 60rpx;
      .name {
        font-size: 30rpx;
        font-weight: 700;
        line-height: 42rpx;
        color: $color;
      }
      .tag {
        line-height: 56rpx;
        background-image: linear-gradient(
          180deg,
          #afe3ff 0%,
          #6fc8fe 27%,
          #458bff 84%,
          #2d79ff 100%
        );
        border-radius: 34px;
        padding: 0 40rpx;
        font-size: 30rpx;
        color: #fff;
        margin-top: $spacing;
        margin-right: $spacing;
      }
    }
    .cells {
      padding-top: 80rpx;
    }
    .cell {
      font-size: 28rpx;
      line-height: 36rpx;
      color: $color;
      margin-bottom: 26rpx;
      padding-right: 30rpx;
      position: relative;
      .key {
        white-space: nowrap;
      }
      .value {
        font-size: 30rpx;
        font-weight: 700;
        color: #333;
      }
      .iconimg {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }
      .iconimg-tel {
        width: 20rpx;
        height: 24rpx;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAyCAYAAAAus5mQAAAAAXNSR0IArs4c6QAABQtJREFUWAm1mVtoHFUYx//fzG6TFDGbmFokTbShJNDWh1KvSRFfVHxQ8EGL0fpQ0JdKrtX4UMt4IURImosPUgpKKEqtiPXyouCLVbRQWqs0Ppg0Jt081GpDrbfE3T3+z5ZZdrO7s2cuO7CcmfP9v+/85jtzzpw5KyhzbOpXW5BGjwIeoKRVgCs8P74ujqn5MVko4xZ5NdstPAjWKBkMZ4BnoWAVWnkluMbfvqUJOVpkq0JFAeCmXtXNLE0SrKlCW0os7ElOyLsVdKHNOUDCvakUnjeNSMeVeBwd1e7ubBe29KhhP3D6JpjpmlQKr5reUFCdbO5VG1eBJFuMBQiStm20L47LhQC+Ri4W4boDwukG7HQGLxi1FFBkicIjAX2zbnwWn9wypWrCxPDy1c/gRi9BJRuf3frVuexcWUkayG7xYd8QyDPPKSO4I+8y0lNLBPVhIzKLN4eNUc5fd/HlckbjesFvxlqfQosjeMmnT5HcEnxSVBlRhcX3ajJULAvTF8fldKgYHs4acNbD7mniFPNxIoHnPEUhjTGO4q8Y40U/cfR7mIuFA4vjGBPhTFrFw6qpwdfMIldXZgfhZmBj+8UJGa02nCayLrwhV5mDs2Z4XA4KTibHJfBjYdqOq9PTDDHxpVtRqcwo3FVJE6X9OqCCn4XnjtZBtTVKCK9YWcDkpPzA5/B7L2G+TaUwlH9dzfPrGdQtCKZNG2I3P9U2oNpN9WF0OcDaGN4jZMowmL2awkFDbShZDnBuVH7laH7fNBonv+5bB1SnqT6oLgeoA1hxDLMwnXglncbhnYdVPGjjJn4FgItjMsOJ+EMTR63hMmv7pRkMmuqD6AoAs43G8Lpu20ewg639qs2H3pe0CHDpkJxjFo2XT8xiHT+cph1HFcXyRVJGXDqojf2EXCnjU1ytsOvIMl4qNoSvKQmYfddaGPEZ/pXWXrXLp09FeUlA7RVLYIRZnKsYwRXww59LomN6I8CtiqIsC/iLI/9yWWW8V6Nh+Dw2/6dwIsrvZCbJ+2juVcc4pnd7qwqtXJJ9dG8XHv/gCUkXWoD7HRWbW0Yns32bzT3HWC1O6iXfWp17XRGwbUjVr/6Ds5x3NrtOhuXxRCP2nHeEuyukcVRt6kp2Q3Q/L3Pf4gRY4Q29dWMDXqb2z7WxKwJqh5ZedSe77xtC+nprsOFTykafnUYTMzbJGG1rAdxramdtwaMLE/KTW6dLI0AtZFf3s6sP6fMqHr/HLDxIyDNuG8aA2qG5R+kJPNRmk9uwR3mZUF3JKflZa8qO4lIB6hrxNJ3PlbJFWLdBCT7d6aj1OqYvwFlH/rAtPEy/hQiBikMpdFxaxoQ2+OpiNxIn445VDhpe3+TWVaOMW9gRCFDDNA+oe7j+1l+D2a6oBiDT905gQA3U2qe6+H3yGaePRDUACTcXClBD8Y+f27kv8Tkhb4kcUvCXr0FSCoArnx/tOLr0RFvKHqaO2ZsJDagBFkZlvnY9OhnwizBAa335Efd26C7OD6qUkpY+DPGV+BrfOkH+d8mFY4+c4IbCY5Fk0I2qd7sYdCQmuI93Pu/W+y65y2HVYa/2ixTQBeG79NtYI7YScoiZKLuUcvW5ktuA1I8kGnD34ogs6/pIuzjXUN5J+6Bq+juNAxzpz7DrG/JMhaeCM1wg7+NH23f5hqoDuo1tc9S6a1fxUCaN3XzXbuMAaGJ6biD0eVvhyN5GHHUc/lO95vgfsQZOE9JAaaUAAAAASUVORK5CYII=);
      }
      .iconimg-address {
        width: 20rpx;
        height: 26rpx;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAA2CAYAAACx1wu7AAAAAXNSR0IArs4c6QAABXlJREFUaAXNmWtsFFUUx/9ndtulkmjbxAithVoqVTEkJoZoUeMDlRARPoAxMRolhI9AIRKMUVdjTFT6oH7QaBCMXxSNkUfiB00UpUWNCYlSxNrWthZEbWp98Gjp9vo/s93tdjv7uDvbx0l2587c8/jNuc+ZEfiQis3mRjhYYwxuoJsyA8yHQTmE/8AZAX5zj4KTGMWBX5vlRK7h6MtOFtSZJZFRPCEGa0mzyMaawTqN4OOAg729jdJmaZud+tV1phwRvMBAjzNfTnZWKbQEo7zRfQjg2b5GOZ1Ca8LljBm9M2yCP/+F56i4nU1cNMHa54kILrBV6q8twfNfhGUknbu0oMxiKbP4IZ3dlc6J3zpCfM7srmN2B1L5Sgm6cKu5nn3xkG0/TBUo03WCdLLvru5pkh+9dD1BXUiDVjZ1sZfRVF1jVxgMCGq9YCcNigU7TUnE4OB0Q+rNa0yNrQzJyZgAun6/CUTOYz8NqpMVp+tcYyuDsiTGnAB6rBXPsHJFosIMlVeMscTDx/to5ZNm3qVhdHCOnBuvncmC4FxBIaq7X5WzihHPaGQY4VkDqWRMmMukZYqb0aptZvFQBG2sDEYv2/0vXww8eBNwCxfUeWPzxNlB4OtO4OBxoKXdzl9cWzASCmBJV4O0u2DDEWzIBfKaK4FXHgZurY67jhcWXcWNAH+P1ALHOoAd7wG//Bmvzq7AxLlswE636TnS1mRnOa61rAo4tM0bclwrWtIbUV21sZUYm7jNPoKfbBxoJjVw8WU2VsDgeWB1g31mQ0HUOEytdTa1uW0h9ZbURm1tRRm16ZfaGOrA8eqT2fpQW/VhKUsdbjrm2xjp6PYrtj6UUTNaZhNYpyC/koOPMocTqRVobJ70A2vrQxkdzp8hP0GnybZQ++jvNsF0xfErtj6UUZveClSXRb9i60MZrTOqa7dfsfURzahwM2IhusHQtTtXUVvbTQqnphMOn9M/tQ2qGwxdDm1FbdTWVpTRKapCiz5f2xjrLmjDW3awCqk21jsobqCvKEar07FZhjhFfWUDqrrfdkU3GNl0A9XRzYja2AoH0pG2sAy7+1Fm9G1up+6zdaLZWf9adO2eko2zAgn2RA/81ye+1hb3ealSL84WYQI7NpagJhyWUV3r8cFDEmGKG2cLYIyDoA0KqecuqBZKC7CHFfo+c1YIE9fH0b4vBhMH/X6XnOPJpljFjB8dbOJLs/hsFAdVsN7dcpg5fmfGIQV7+5rkk0SOCaBaUQBs5UjrTVSa1jJjh+agLjnmJNDuJhksCOJ+Kto+3Cb7tj7nGBkIClZ2vSx/JxtPAlWF7no5FSQsDScZJDvI2zlXIPpa5fXKUWN4gmpFT4McZ+UDLP6n51Mqgn/5Endt3275JlWclKBqwMF1lJm9g8WeVA7ycL1HHCznV5LP0vlKC6qGmtm5BbiZxbSO0gVJWSc4OqcQyzgN/ZBSZ6wiI6jqtddLf+1tWMk++xQn4ouZnGZVL3ijuAT3dO6SP7LRZ1w7qdxurhu5hDe5677dzjKqzYBnODI2Js+TmXxZg6pDY4ws3ILHRrkWc9dVmimIWx/9CPZ6YRGe9pp+MvnICTTmtGKHKTNDeJewd8eueR3ZZboCATzK/t7qVZ/NNV+gGqC62YQuduIjwq7yCkjI7ziJ36sLiVd9ttd8g2qg6rC5/MIA97MAX0gmiKCfU09Nui9yCdppi1mN+rQeWNkRln84QF5K1uOH2RfzAal+8wKqjrgwHNBjogRDeD/x3E85L00fAyjfYnr5oFgxdt5+ullqYnV+j3nL6BjIqRgQB9HJWDkfx7yCsnkSt4aJZd+seQVls48vr4ll35h5HEzKwrv+kk8H/e7PQcotWy7c/wMdEaHz04jyNAAAAABJRU5ErkJggg==);
      }
    }
    .button-wrapper {
      padding: 44rpx 0;
    }
  }
}
</style>
