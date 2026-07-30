<!-- 业务办理查询 · 我的办理 -->
<template>
  <query-layout>
    <view class="con_layout">
      <view class="tab_gjj">
        <!-- 查询年度 -->
        <van-field
            readonly
            clickable
            inputAlign="right"
            :value="selectYear ? selectYear + '年' : ''"
            label="查询年度"
            placeholder="请选择"
            @click="showYearPicker = true"
        />
        <!-- 业务类型 -->
<!--        <van-field
            readonly
            clickable
            inputAlign="right"
            :value="businessTypeLabel"
            label="业务类型"
            placeholder="请选择"
            @click="showBusinessPicker = true"
        />-->
        <view class="btn_row" @click="fnQueryData">
<!--          <text>查询</text>-->
          <van-button block type="info">查询</van-button>
        </view>
      </view>
      <!-- 办理记录列表（上拉加载更多） -->
      <view class="repay_list">
        <scroll-view :lower-threshold="100" @scrolltolower="loadMore">
          <view class="repay_item" v-for="(row, i) in displayList" :key="i">
            <van-cell title="办理时间" :value="row.slsj" />
            <van-cell title="业务登记号" :value="row.ywdjh" />
            <van-cell title="业务类型" :value="row.ywlx" />
            <van-cell title="业务状态" :value="row.ywzt" />
            <van-cell title="备注信息" :value="row.bzxx" />
            <van-cell title="办理渠道" :value="row.xxly" />
            <view class="btn-group">
              <van-button type="info" size="small" class="btn">提交</van-button>
              <van-button type="info" size="small" class="btn">修改</van-button>
              <van-button type="info" size="small" class="btn">作废</van-button>
            </view>
          </view>
          <view v-if="querying && rawList.length === 0" class="empty_tip">加载中...</view>
          <view v-else-if="rawList.length === 0" class="empty_tip">
            <van-empty description="暂无数据" />
          </view>
          <view v-else class="load_more_footer">
            <van-divider v-if="hasMore">上拉加载更多</van-divider>
            <van-divider v-else>没有更多了</van-divider>
          </view>
        </scroll-view>
      </view>
      <!-- 年度选择 -->
      <van-popup v-model="showYearPicker" position="bottom">
        <van-datetime-picker
            type="date"
            :value="selectYear ? new Date(selectYear + '-06-01') : minYearDate"
            :min-date="minYearDate"
            :max-date="maxYearDate"
            @confirm="onConfirmYear"
            @cancel="showYearPicker = false"
        />
      </van-popup>
      <!-- 业务类型选择 -->
      <van-popup v-model="showBusinessPicker" position="bottom">
        <view class="picker_list">
          <view
              v-for="opt in businessTypeOptionsWithAll"
              :key="opt.value"
              class="picker_item"
              @click="onSelectBusiness(opt)"
          >{{ opt.label }}</view>
        </view>
      </van-popup>
    </view>
  </query-layout>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions, mapMutations } from 'vuex'
import codeTableMixin from '@osppm/mixin/codeTableMixin'
import commonMixin from '@osppm/mixin/common.js'

const auditTableColumn = [
  { title: '办理时间', dataIndex: 'slsj' },
  { title: '业务登记号', dataIndex: 'ywdjh' },
  { title: '业务类型', dataIndex: 'ywlx', codeType: 'YWLX' },
  { title: '业务状态', dataIndex: 'ywzt' },
  { title: '备注信息', dataIndex: 'bzxx' },
  { title: '消息来源', dataIndex: 'xxly', codeType: 'XXLY' },
]

export default {
  name: 'deal',
  mixins: [codeTableMixin, commonMixin],
  data () {
    return {
      auditTableColumn,
      selectYear: moment().format('YYYY'),
      businessType: '',
      showYearPicker: false,
      showBusinessPicker: false,
      handleBusinessOverride: null,
      pageSize: 10,
      displayPage: 1,
      querying: false,
      minYearDate: new Date('2019-01-01'),
      maxYearDate: new Date(),
    }
  },
  computed: {
    ...mapState('serviceInquiry', ['ywdjh', 'handleBusiness', 'yearLimit','businessTypeOptions']),
    businessTypeOptionsWithAll () {
      // 接口返回的数据格式已经是 {label, value}，直接使用
      const options = Array.isArray(this.businessTypeOptions) ? this.businessTypeOptions : []
      console.log('businessTypeOptions 原始数据:', this.businessTypeOptions)
      console.log('options 数组:', options)
      // 确保每个选项都有 value 和 label
      const validOptions = options.filter(opt => opt && opt.value && opt.label)
      console.log('有效选项:', validOptions)
      return [{ value: '', label: '全部' }, ...validOptions]
    },
    businessTypeLabel () {
      if (!this.businessType) return '全部'
      const opt = (this.businessTypeOptionsWithAll || []).find(o => String(o.value) === String(this.businessType))
      return opt ? opt.label : '全部'
    },
    rawList () {
      if (this.handleBusinessOverride !== null) return this.handleBusinessOverride
      return this.handleBusiness || []
    },
    convertedList () {
      return this.convertTableDatas(this.rawList, this.auditTableColumn) || []
    },
    displayList () {
      return this.convertedList.slice(0, this.pageSize * this.displayPage)
    },
    hasMore () {
      return this.pageSize * this.displayPage < this.convertedList.length
    },
  },
  onLoad (options) {
    if (options?.projectNo) {
      this.setYwdjh(options.projectNo)
    }
  },
  async mounted () {
    // await this.initCodeTable(['YWLX', 'YWZT', 'XXLY'])
    if (this.yearLimit) {
      this.minYearDate = new Date(String(this.yearLimit) + '-01-01')
    }
    try {
      await this.getBusinessType({})
      // 等待 Vuex 更新完成
      await this.$nextTick()
      console.log('mounted 中 businessTypeOptions:', this.businessTypeOptions)
      console.log('mounted 中 businessTypeOptionsWithAll:', this.businessTypeOptionsWithAll)
    } catch (e) {
      console.error('获取业务类型失败:', e)
      uni.showToast({ title: '获取业务类型失败', icon: 'none' })
    }
    await this.fnQueryData()
  },
  methods: {
    ...mapActions('serviceInquiry', ['queryOnlineHandle', 'getBusinessType']),
    ...mapMutations('serviceInquiry', ['setYwdjh']),
    onConfirmYear (v) {
      this.selectYear = moment(v).format('YYYY')
      this.showYearPicker = false
    },
    onSelectBusiness (opt) {
      this.businessType = opt.value
      this.showBusinessPicker = false
    },
    async init (year, businessType) {
      try {
        this.querying = true
        this.handleBusinessOverride = [
          {
            slsj: "2026-04-07 10:22:33",
            ywdjh: "BL202604070001",
            ywlx: "购房提取",
            ywzt: "办理成功",
            bzxx: "--",
            xxly: "柜台"
          },
          {
            slsj: "2026-04-06 09:15:00",
            ywdjh: "BL202604060002",
            ywlx: "按月还款",
            ywzt: "办理成功",
            bzxx: "--",
            xxly: "爱山东"
          },
          {
            slsj: "2026-04-04 11:20:11",
            ywdjh: "BL202604040004",
            ywlx: "提取还款",
            ywzt: "已驳回",
            bzxx: "材料不全",
            xxly: "爱山东"
          }
        ]
        const params = { year }
        if (businessType) params.businessType = businessType
        // await this.queryOnlineHandle(params)
        this.displayPage = 1
      } catch (e) {
        this.handleBusinessOverride = []
        this.displayPage = 1
        uni.showToast({ title: e?.message || e || '查询失败', icon: 'none' })
      } finally {
        this.querying = false
      }
    },
    fnQueryData () {
      if (!this.selectYear) {
        uni.showToast({ title: '请选择查询年度', icon: 'none' })
        return
      }
      this.init(this.selectYear, this.businessType || '')
    },
    loadMore () {
      if (this.hasMore) this.displayPage++
    },
  },
}
</script>

<style scoped lang="scss">
.tab_gjj {
  background-color: #ffffff;
  padding: 24rpx 0;

  .btn_row {
    display: flex;
    margin-top: 24rpx;
    margin-bottom: 12rpx;
    flex-direction: column;
    align-items: center;
    color: #4788FE;
    font-size: 30rpx;
    padding: 0 24rpx;
  }
}

.repay_list {
  margin-top: 24rpx;

  .repay_item {
    background: #fff;
    border-radius: 16rpx;
    padding: 12rpx 0;
    margin-bottom: 20rpx;
    border: 1rpx solid #e5e6eb;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
  }

  .list_item {
    display: flex;
    align-items: center;
    min-height: 56rpx;
    font-size: 28rpx;

    .label { min-width: 200rpx; color: #666; }
    .value { flex: 1; color: #333; word-break: break-all; }
  }

  .empty_tip {
    text-align: center;
    color: #999;
    font-size: 28rpx;
    padding: 48rpx 0;
  }

  .load_more_footer {
    text-align: center;
    padding: 24rpx 0;
    font-size: 24rpx;
    color: #999;
  }
}

.picker_list {
  padding: 24rpx 0 48rpx;

  .picker_item {
    padding: 28rpx 32rpx;
    font-size: 30rpx;
    color: #333;

    &:active {
      background-color: #f5f5f5;
    }
  }
}

.btn-group {
  text-align: right;
  margin-top: 24rpx;

  .btn {
    margin-right: 24rpx;
  }
}
</style>
