<!-- 服务网点查询：移动端适配 -->
<template>
  <query-layout>
    <view class="con_layout">
      <!-- 搜索 -->
      <view class="search_wrap">
        <van-search
            placeholder="输入中心名称进行搜索"
            shape="round"
            clearable
            @search="searchAddress"
            @clear="searchAddress('')"
        />
      </view>

      <!-- 网点列表 -->
      <view class="list_section">
        <scroll-view scroll-y class="scroll_list">
          <view v-for="(item, index) in shoAddressArr"
              :key="index"
              class="address_item"
              :class="{ choose: item === selectItem }"
              @click="chooseAddress(item)"
          >
            <van-icon name="location-o" class="address_icon" />
            <view class="desc">
              <text class="name">{{ item.name }}</text>
              <text class="addr">{{ item.address }}</text>
            </view>
          </view>
          <view v-if="!shoAddressArr || shoAddressArr.length === 0" class="empty_tip">暂无网点数据</view>
        </scroll-view>
      </view>

      <van-popup v-model="showLabel" position="bottom">
        <!-- 网点详情 -->
        <view class="detail_section">
          <view class="detail_header">
            <van-icon name="location-o" class="header_icon" />
            <text class="detail_title">网点详情</text>
          </view>
          <view v-if="selectItem && selectItem.name" class="detail_content">
            <view class="detail_item">
              <text class="detail_label">网点名称：</text>
              <text class="detail_value">{{ selectItem.name }}</text>
            </view>
            <view v-if="selectItem.address" class="detail_item">
              <text class="detail_label">地址：</text>
              <text class="detail_value">{{ selectItem.address }}</text>
            </view>
            <view v-if="selectItem.tel" class="detail_item">
              <text class="detail_label">电话：</text>
              <text class="detail_value">{{ selectItem.tel }}</text>
            </view>
            <view v-if="selectItem.details" class="detail_item">
              <text class="detail_label">详细信息：</text>
              <text class="detail_value">{{ selectItem.details }}</text>
            </view>
          </view>
          <view v-else class="detail_empty">
            <van-icon name="info-o" class="empty_icon" />
            <text class="empty_text">请从上方列表中选择一个网点查看详情</text>
          </view>
          <view class="detail_footer">
            <van-button
                type="primary"
                block
                color="#4788fe"
                :disabled="!selectItem || !selectItem.lat || !selectItem.lon"
                @click="goMap"
            >
              <van-icon name="location-o" />
              导航前往
            </van-button>
          </view>
        </view>
      </van-popup>
    </view>
  </query-layout>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'searchNetface',
  data () {
    return {
      ywdjh: '',
      zoom: 16,
      timer: null,
      addressArr: [],
      shoAddressArr: [],
      showLabel: false,
      showLabelObj: { content: '', offset: [0, 0] },
      selectItem: { address: '', tel: '' },
      icon: { url: '', size: [32, 32], imageOffset: [0, 0], anchor: [0, 0] },
    }
  },
  computed: {
    showPos () {
      return [Number.parseFloat(this.selectItem.lon || 0), Number.parseFloat(this.selectItem.lat || 0)]
    },
  },
  onLoad (options) {
    if (options && options.projectNo) {
      this.setYwdjh(options.projectNo)
    }
  },
  async mounted () {
    await this.searchNetface()
  },
  methods: {
    ...mapActions('serviceOutlets', ['queryNetface']),
    ...mapMutations('serviceOutlets', ['setYwdjh']),
    searchAddress (value) {
      const key = (value || '').trim()
      this.shoAddressArr = key ? this.addressArr.filter(ele => ele.name && ele.name.includes(key)) : this.addressArr
    },
    goMap () {
      const url = `http://api.map.baidu.com/geocoder?location=${this.selectItem.lat},${this.selectItem.lon}&output=html&src=webapp.cd`
      if (typeof plus !== 'undefined') {
        plus.runtime.openURL(url)
      } else {
        window.open(url)
      }
    },
    async searchNetface () {
      try {
        const result = await this.queryNetface({})
        if (result.code !== 200) {
          if (result.message) {
            uni.showToast({ title: result.message, icon: 'none' })
          }
          return
        }
        this.addressArr = JSON.parse(result.data.list[0].data)
        this.shoAddressArr = this.addressArr
        // if (this.shoAddressArr && this.shoAddressArr.length > 0) {
        //   this.chooseAddress(this.shoAddressArr[0])
        // }
      } catch (error) {
        const msg = (error && (error.message || error.msg)) ? (error.message || error.msg) : String(error)
        uni.showToast({ title: msg || '加载失败', icon: 'none' })
      }
    },
    chooseAddress (item) {
      if (!item) return
      const { name, tel } = item
      this.showLabel = `${name}</br>电话：${tel || '暂无'}`
      this.showLabelObj = { content: this.showLabel, offset: [-80, -80] }
      this.selectItem = item
    },
  },
}
</script>

<style scoped lang="scss">
.con_layout {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  box-sizing: border-box;
}

.search_wrap {
  flex-shrink: 0;
  margin-bottom: 24rpx;
}

.list_section {
  flex-shrink: 0;
  border-radius: 16rpx;
  background: #fff;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.scroll_list {
  padding: 12px 12rpx;
}

.address_item {
  width: 92.5%;
  display: flex;
  align-items: flex-start;
  padding: 24rpx 16rpx;
  margin: 0 8rpx 16rpx 0;
  border-radius: 12rpx;
  transition: background 0.2s;

  .address_icon {
    font-size: 40rpx;
    color: #999;
    margin-top: 4rpx;
    flex-shrink: 0;
    margin-right: 16rpx;
  }

  .desc {
    flex: 1;
    display: flex;
    flex-direction: column;
    line-height: 1.5;

    .name {
      font-size: 30rpx;
      font-weight: 500;
      color: #333;
      margin-bottom: 8rpx;
    }

    .addr {
      font-size: 26rpx;
      color: #666;
      word-break: break-all;
    }
  }
}

.address_item.choose {
  background: #ecf5ff;
  border: 2rpx solid #a0cfff;

  .address_icon {
    color: #4788fe;
  }

  .name {
    color: #4788fe;
    font-weight: 600;
  }
}

.empty_tip {
  padding: 48rpx 0;
  text-align: center;
  font-size: 28rpx;
  color: #999;
}

.detail_section {
  flex: 1;
  min-height: 0;
  border-radius: 16rpx;
  background: #fff;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.detail_header {
  flex-shrink: 0;
  padding: 32rpx 32rpx 24rpx;
  border-bottom: 2rpx solid #e8e8e8;
  display: flex;
  align-items: center;

  .header_icon {
    font-size: 40rpx;
    color: #4788fe;
    margin-right: 16rpx;
  }

  .detail_title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
  }
}

.detail_content {
  flex: 1;
  padding: 24rpx 32rpx;
  overflow-y: auto;
  min-height: 0;
}

.detail_item {
  margin-bottom: 32rpx;

  &:last-child {
    margin-bottom: 0;
  }

  .detail_label {
    display: block;
    font-size: 28rpx;
    color: #666;
    margin-bottom: 12rpx;
    font-weight: 500;
  }

  .detail_value {
    display: block;
    font-size: 30rpx;
    color: #333;
    line-height: 1.6;
    word-break: break-all;
    padding: 24rpx;
    background: #f9f9f9;
    border-radius: 8rpx;
    border-left: 6rpx solid #4788fe;
  }
}

.detail_empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 48rpx;

  .empty_icon {
    font-size: 96rpx;
    color: #d9d9d9;
    margin-bottom: 32rpx;
  }

  .empty_text {
    font-size: 28rpx;
    color: #999;
    text-align: center;
  }
}

.detail_footer {
  flex-shrink: 0;
  padding: 24rpx 32rpx 32rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
  border-top: 2rpx solid #e8e8e8;

  .van-button {
    .van-icon {
      margin-right: 12rpx;
    }
  }
}
</style>
