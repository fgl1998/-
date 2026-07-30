<!-- 合作楼盘查询 -->
<template>
  <query-layout>
    <view class="con_layout">
      <!-- 查询条件卡片 -->
      <view class="query-card">
        <view class="card-title">
          <van-icon name="search" class="title-icon" />
          <text>查询条件</text>
        </view>
        <van-form ref="form" class="query-form">
          <van-form-item-map
            v-for="(item, index) in formConfig.fields"
            :key="index"
            :formItemConfig.sync="item"
            :formData="formData"
          />
        </van-form>
        <view class="btn-group">
          <van-button plain hairline size="small" @click="onReset">重置</van-button>
          <van-button type="primary" size="small" color="#4788fe" :loading="loading" @click="onQuery">查询</van-button>
        </view>
      </view>
      <view class="result-card">
        <view class="card-head">
          <view class="card-title">
            <van-icon name="orders-o" class="title-icon" />
            <text>查询结果</text>
          </view>
          <text class="record-tip">共 {{ total }} 条</text>
        </view>

        <view v-if="loading" class="loading-box">
          <van-loading type="spinner" color="#4788fe" />
          <text class="loading-text">加载中...</text>
        </view>

        <view v-else-if="list.length === 0" class="empty-box">
          <van-empty description="暂无查询记录" />
        </view>

        <view v-else class="result-list">
          <view class="list-item" v-for="item in list" :key="item.name + item.address">
            <view class="item-content">
              <view class="content-row" v-for="(row, idx) in getDetailRows(item)" :key="idx">
                <text class="row-label">{{ row.label }}</text>
                <text class="row-value">{{ row.value }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </query-layout>
</template>

<script>
import cooperatePropertyMixin from '@osppm/store/person/query/cooperateProperty/cooperatePropertyMixin'

const mockSource = [
  { area: '市南区', name: '海信君汇', address: '东海西路5号' },
  { area: '市南区', name: '远洋公馆', address: '燕儿岛路' },
  { area: '市北区', name: '万科未来城', address: '四流南路66号' },
  { area: '市北区', name: '保利叶公馆', address: '合肥路' },
  { area: '崂山区', name: '海尔波尔多小镇', address: '辽阳东路' },
  { area: '李沧区', name: '融创都会中心', address: '金水路' },
  { area: '城阳区', name: '龙湖顺安府', address: '顺安路' },
  { area: '西海岸新区', name: '融创阿朵小镇', address: '藏马山' },
  { area: '即墨区', name: '鲁信和璧花园', address: '温泉街道' },
  { area: '胶州市', name: '保利云禧', address: '常州路' },
  { area: '平度市', name: '中南漫悦湾', address: '红旗路' },
  { area: '莱西市', name: '奥润千禧', address: '南京路' },
]

export default {
  name: 'cooperateProperty',
  mixins: [cooperatePropertyMixin],
  data() {
    return {
      list: [],
      total: 0,
      loading: false,
    }
  },
  onLoad() {
    this.onQuery()
  },
  methods: {
    getDetailRows(item) {
      return [
        { label: '所属区域', value: item.area },
        { label: '楼盘名称', value: item.name },
        { label: '楼盘地址', value: item.address },
      ]
    },
    onQuery() {
      this.loading = true
      setTimeout(() => {
        const { area, name, address } = this.formData
        this.list = mockSource.filter(item => {
          const matchArea = !area || item.area === area
          const matchName = !name || item.name.includes(name)
          const matchAddress = !address || item.address.includes(address)
          return matchArea && matchName && matchAddress
        })
        this.total = this.list.length
        this.loading = false
      }, 500)
    },
    onReset() {
      this.resetFormData()
      this.onQuery()
    },
  },
}
</script>

<style scoped lang="scss">
.con_layout {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.query-card, .result-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.card-title {
  display: flex;
  align-items: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 24rpx;

  .title-icon {
    font-size: 36rpx;
    color: #4788fe;
    margin-right: 12rpx;
  }
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .card-title { margin-bottom: 0; }

  .record-tip {
    font-size: 26rpx;
    color: #999;
  }
}

.query-form {
  border-radius: 12rpx;
  overflow: hidden;
}

.btn-group {
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
  margin-top: 32rpx;
}

.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0;

  .loading-text {
    margin-top: 16rpx;
    font-size: 26rpx;
    color: #999;
  }
}

.empty-box { padding: 40rpx 0; }

.result-list { margin-top: 24rpx; }

.list-item {
  border: 2rpx solid #ebedf0;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  background: #fafbfc;
}

.item-content {
  .content-row {
    display: flex;
    padding: 10rpx 0;
    font-size: 28rpx;
    line-height: 1.6;

    .row-label {
      width: 180rpx;
      color: #999;
      flex-shrink: 0;
    }

    .row-value {
      flex: 1;
      color: #333;
      word-break: break-all;
    }
  }
}
</style>
