<!-- 个人明细账 -->
<template>
  <query-layout>
    <view class="account-tabs-wrap">
      <!-- 日期查询栏 → 放在标签外面，手机端最舒服排版 -->
      <view class="query-bar">
        <!-- 左侧日期组 -->
        <view class="date-group">
          <view class="date-item" @click="showStartPicker=true">
            <van-icon name="calendar-o" color="#1677ff"/>
            <text>{{ startDate }}</text>
            <van-icon name="arrow-down" size="12" color="#999"/>
          </view>

          <text class="divider">-</text>

          <view class="date-item" @click="showEndPicker=true">
            <van-icon name="calendar-o" color="#1677ff"/>
            <text>{{ endDate }}</text>
            <van-icon name="arrow-down" size="12" color="#999"/>
          </view>
        </view>

        <!-- 查询按钮 -->
        <van-button type="primary" size="small" color="#1677ff" class="query-btn" @click="searchTable(transactionType)">
          查询
        </van-button>
      </view>
      <!-- 标签栏 -->
      <van-tabs v-model="transactionType" animated class="account-tabs">
        <van-tab v-for="item in transactionTypeArr" :key="item.value" :title="item.label" :name="item.value"/>
      </van-tabs>

      <view class="detail_list" v-if="transactionType === '00'">
        <view class="detail_item" v-for="(row, i) in tableDataObj['00']" :key="'00-' + i">
          <van-cell title="交易日期" :value="row.qsny" />
          <van-cell title="业务类型" :value="row.ywlx" />
          <van-cell title="发生金额(元)" :value="row.bgqgrzhye" />
          <van-cell title="账户余额(元)" :value="row.bqjs" />
          <van-cell title="办理渠道" :value="row.informationSource" />
        </view>
        <view v-if="!tableDataObj['00'] || tableDataObj['00'].length === 0" class="empty_tip">
          <van-empty description="暂无数据" />
        </view>
      </view>

      <view class="detail_list" v-if="transactionType === '01'">
        <view class="detail_item" v-for="(row, i) in tableDataObj['01']" :key="'01-' + i">
          <van-cell title="缴款月份" :value="row.jsny" />
          <van-cell title="单位名称" :value="row.dwmc" />
          <van-cell title="个人缴存(元)" :value="row.grjc" />
          <van-cell title="单位缴存(元)" :value="row.dwjc" />
          <van-cell title="缴存金额(元)" :value="row.hjyjce" />
          <van-cell title="账户余额(元)" :value="row.hjyjce" />
          <van-cell title="缴存原因" :value="row.bzxx" />
        </view>
        <view v-if="!tableDataObj['01'] || tableDataObj['01'].length === 0" class="empty_tip">
          <van-empty description="暂无数据" />
        </view>
      </view>

      <view class="detail_list" v-if="transactionType === '02'">
        <view class="detail_item" v-for="(row, i) in tableDataObj['02']" :key="'02-' + i">
          <van-cell title="受理时间" :value="row.slsj" />
          <van-cell title="提取方式" :value="row.tqfs" />
          <van-cell title="提取原因" :value="row.tqyy" />
          <van-cell title="提取金额(元)" :value="row.fse" />
          <van-cell title="收款银行名称" :value="row.skyhmc" />
          <van-cell title="收款账户" :value="row.skzh" />
          <van-cell title="业务状态" :value="row.djzt" />
          <van-cell title="提取类别" :value="row.tqlb" />
          <van-cell title="办理渠道" :value="row.blqd" />
        </view>
        <view v-if="!tableDataObj['02'] || tableDataObj['02'].length === 0" class="empty_tip">
          <van-empty description="暂无数据" />
        </view>
      </view>

      <!-- 日期选择 -->
      <van-popup v-model="showStartPicker" position="bottom">
        <van-datetime-picker
            type="date"
            :value="startDate ? new Date(startDate) : minStartDate"
            :min-date="minStartDate"
            :max-date="endDate ? new Date(endDate) : maxEndDate"
            @confirm="onConfirmStartDate"
            @cancel="showStartPicker = false"
        />
      </van-popup>
      <van-popup v-model="showEndPicker" position="bottom">
        <van-datetime-picker
            type="date"
            :value="endDate ? new Date(endDate) : maxEndDate"
            :min-date="startDate ? new Date(startDate) : minStartDate"
            :max-date="maxEndDate"
            @confirm="onConfirmEndDate"
            @cancel="showEndPicker = false"
        />
      </van-popup>
    </view>
  </query-layout>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex'
import moment from 'moment'
import codeTableMixin from '@osppm/mixin/codeTableMixin'
import commonMixin from '@osppm/mixin/common.js'

// 列配置（含 codeType 的列会经 convertTableDatas 做码值转换）
const accountDetailsTableColumn = [
  {title: '交易日期', dataIndex: 'qsny'},
  {title: '业务类型', dataIndex: 'ywlx', codeType: 'YWLX'},
  {title: '发生金额（元）', dataIndex: 'bgqgrzhye'},
  {title: '余额（元）', dataIndex: 'bqjs'},
  {title: '办理渠道', dataIndex: 'informationSource'},
]
const depositDetailsTableColumn = [
  {title: '缴款月份', dataIndex: 'jsny'},
  {title: '单位名称', dataIndex: 'dwmc'},
  {title: '缴存金额', dataIndex: 'hjyjce'},
  {title: '备注信息', dataIndex: 'bzxx'},
]
const fetchDetailsTableColumn = [
  {title: '受理时间', dataIndex: 'slsj'},
  {title: '提取方式', dataIndex: 'tqfs', codeType: 'TQFS'},
  {title: '提取原因', dataIndex: 'tqyy', codeType: 'TQYY'},
  {title: '提取金额', dataIndex: 'fse'},
  {title: '收款银行名称', dataIndex: 'skyhmc'},
  {title: '收款账户', dataIndex: 'skzh'},
  {title: '办理渠道', dataIndex: 'blqd'},
]

export default {
  name: 'accountDetails',
  mixins: [codeTableMixin, commonMixin],
  data() {
    return {
      transactionType: '00',
      transactionTypeArr: [
        {label: '账户明细', value: '00'},
        {label: '缴存明细', value: '01'},
        {label: '提取明细', value: '02'},
      ],
      tableDataObj: {},
      sizeObj: {},
      currentObj: {},
      totalObj: {},
      startDateObj: {},
      expiryDateObj: {},
      startDate: '2026/01/01',
      endDate: '2026/07/01',
      showStartPicker: false,
      showEndPicker: false,
      commonBizApply: {bizApplyType: 'MP020'},
      accInfo: {},
      minStartDate: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
      maxEndDate: new Date(),
    }
  },
  computed: {
    ...mapState('accountDetails', ['details', 'pagination', 'ywdjh']),
    totalPages() {
      const total = this.totalObj[this.transactionType] || 0
      const size = this.sizeObj[this.transactionType] || 10
      return Math.ceil(total / size) || 1
    },
  },
  onLoad(options) {
    if (options?.projectNo) {
      this.setYwdjh(options.projectNo)
    }
  },
  async mounted() {
    await this.initCodeTable(['YWLX', 'TQFS', 'TQYY'])
    this.accInfo = await this.queryRemittance({
      ...this.commonBizApply,
      startDate: moment().subtract(2, 'year').format('YYYY-MM-DD'),
      expiryDate: moment().format('YYYY-MM-DD'),
    })
    const startDate = moment().subtract(10, 'years').format('YYYY-MM-DD')
    const expiryDate = moment().format('YYYY-MM-DD')
    this.startDate = startDate
    this.endDate = expiryDate
    this.startDateObj = {'00': startDate, '01': startDate, '02': startDate}
    this.expiryDateObj = {'00': expiryDate, '01': expiryDate, '02': expiryDate}
    const transactionTypeArr = JSON.parse(JSON.stringify(this.transactionTypeArr))
    transactionTypeArr.reverse().forEach(ele => {
      this.startDateObj[ele.value] = startDate
      this.expiryDateObj[ele.value] = expiryDate
      this.tableDataObj[ele.value] = []
      this.sizeObj[ele.value] = 10
      this.currentObj[ele.value] = 1
      this.totalObj[ele.value] = 0
      this.searchTable(ele.value)
    })
  },
  methods: {
    ...mapActions('accountDetails', ['getPersonalLedgers', 'queryRemittance', 'buildAccountDetailsDownloadParams']),
    ...mapMutations('accountDetails', ['setYwdjh']),
    /**
     * 根据交易类型获取对应的列配置（用于 convertTableDatas 码值转换）
     * @param {String} transactionType - 交易类型 '00'/'01'/'02'
     * @returns {Array} 列配置数组
     */
    getTableColumnByType(transactionType) {
      if (transactionType === '00') return accountDetailsTableColumn
      if (transactionType === '01') return depositDetailsTableColumn
      if (transactionType === '02') return fetchDetailsTableColumn
      return []
    },
    onConfirmStartDate(v) {
      this.startDate = moment(v).format('YYYY-MM-DD')
      this.showStartPicker = false
    },
    onConfirmEndDate(v) {
      this.endDate = moment(v).format('YYYY-MM-DD')
      this.showEndPicker = false
    },
    onTransactionTypeChange(val) {
      if (val === this.transactionType) return
      this.startDateObj[this.transactionType] = this.startDate
      this.expiryDateObj[this.transactionType] = this.endDate
      this.transactionType = val
      this.startDate = this.startDateObj[val] || this.startDate
      this.endDate = this.expiryDateObj[val] || this.endDate
    },
    async searchTable(transactionType) {
      // =============== 假数据开始（直接加在这里） ===============
      let fakeData = []

      // 账户明细假数据
      if(transactionType === '00') {
        fakeData = [
          { id: 1, qsny: '2025-01-02', ywlx: '提取', bgqgrzhye: '1000.00', bqjs: '5000.00', informationSource: '柜台' },
          { id: 2, qsny: '2025-01-01', ywlx: '提取', bgqgrzhye: '2000.00', bqjs: '7000.00', informationSource: 'APP' },
        ]
      }

      // 缴存明细假数据
      if(transactionType === '01') {
        fakeData = [
          { id: 1, jsny: '2025-02', dwmc: '某某科技有限公司', dwjc: '600.00', grjc: '600.00', hjyjce: '1200.00', bzxx: '正常缴存' },
          { id: 2, jsny: '2025-01', dwmc: '某某科技有限公司', dwjc: '600.00', grjc: '600.00', hjyjce: '1200.00', bzxx: '正常缴存' },
        ]
      }

      // 提取明细假数据
      if(transactionType === '02') {
        fakeData = [
          { id: 1, slsj: '2025-01-05', tqfs: '银行卡', tqyy: '离退休提取', fse: '3000.00', skyhmc: '工商银行', skzh: '6222****1234', djzt:'已入账', tqlb:'销户提取', blqd: 'APP' },
        ]
      }

      // 直接把假数据赋值给表格
      this.tableDataObj[transactionType] = fakeData
      this.totalObj[transactionType] = fakeData.length
      this.$forceUpdate()
      return // 直接return，不走接口
      // =============== 假数据结束 ===============

      if (!this.startDate) {
        uni.showToast({title: '请选择起始日期', icon: 'none'})
        return
      }
      if (!this.endDate) {
        uni.showToast({title: '请选择结束日期', icon: 'none'})
        return
      }
      const params = {
        transactionType,
        startDate: this.startDate,
        expiryDate: this.endDate,
        start: this.currentObj[transactionType],
        limit: this.sizeObj[transactionType],
        ...this.commonBizApply,
      }
      try {
        await this.getPersonalLedgers(params)
        const columns = this.getTableColumnByType(transactionType)
        const convertedData = this.convertTableDatas(this.details, columns)
        this.tableDataObj[transactionType] = convertedData
        this.totalObj[transactionType] = this.pagination?.total || 0
      } catch (e) {
        const msg = e?.message || e?.toString() || '查询失败，请稍后重试'
        uni.showToast({title: msg, icon: 'none'})
      }
    },
    async download() {
      if (!this.tableDataObj[this.transactionType] || this.tableDataObj[this.transactionType].length === 0) {
        uni.showToast({title: '当前列表无数据不可下载', icon: 'none'})
        return
      }
      try {
        const downloadParams = await this.buildAccountDetailsDownloadParams({
          transactionType: this.transactionType,
          startDate: this.startDate,
          expiryDate: this.endDate,
          ...this.commonBizApply,
        })
        await this.downloadReportNLC014(downloadParams)
      } catch (e) {
        const msg = e?.message || e?.toString() || '下载失败，请稍后重试'
        uni.showModal({
          title: '温馨提示',
          content: msg,
          showCancel: false,
          success: () => uni.navigateBack(),
        })
      }
    },
    pagePrev() {
      const t = this.transactionType
      if ((this.currentObj[t] || 1) <= 1) return
      this.currentObj[t] = (this.currentObj[t] || 1) - 1
      this.searchTable(t)
    },
    pageNext() {
      const t = this.transactionType
      if ((this.currentObj[t] || 1) >= this.totalPages) return
      this.currentObj[t] = (this.currentObj[t] || 1) + 1
      this.searchTable(t)
    },
  },
}
</script>

<style scoped lang="scss">
/* 外层容器 */
.account-tabs-wrap {
  padding: 0;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

/* 标签栏样式 */
.account-tabs {
}

/* 核心查询栏 */
.query-bar {
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 30rpx;
  border-top: 1rpx solid #f5f5f5;
}

/* 日期组 */
.date-group {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 28rpx;
  color: #333;
  padding: 8rpx 12rpx;
  border-radius: 8rpx;
  background: #f7f8fa;
}

.date-item text {
  color: #333;
}

.divider {
  font-size: 28rpx;
  color: #999;
}

/* 查询按钮 */
.query-btn {
  height: 54rpx !important;
  line-height: 54rpx !important;
  font-size: 26rpx;
  width: 100%;
  margin-left: 24rpx;
}

.detail_list {
  .detail_item {
    border: 1px solid #e5e6eb; /* 柔和浅灰边框，不刺眼 */
    border-radius: 16rpx;      /* 精致圆角 */
    padding: 12rpx 0;
    margin-top: 24rpx;
    background: #ffffff;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04); /* 轻微阴影，提升层次 */
  }
}
</style>
