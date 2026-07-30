<template>
  <view class="service-page" id="contrainer">
    <h-navbar
      v-if="$base.isApp()"
      title="失业登记"
      :border-bottom="false"
      title-color="#000"
      back-icon-color="#000"
      :background="{ background: '#FFF' }"
      back-icon-name="arrow-left"
      back-icon-size="22"
    ></h-navbar>
    <view class="service-box">
      <view class="function-entry-card">
        <view class="entry-title">求职创业补贴</view>
        <view class="entry-actions">
          <view class="action-btn primary-btn" @click="openAddPage">新增</view>
          <view class="action-btn secondary-btn active" @click="handleSearch">查询</view>
        </view>
      </view>
      <!-- 基本信息卡片组件 -->
      <view>
        <infoCard :userInfo="infoForm" />
      </view>
      <!-- 申请记录卡片组件 -->
      <RecordCardList :data="tableData" :schema="recordSchema2" :actions="recordActions" @action="handleRecordAction" />
    </view>
  </view>
</template>

<script>
import infoCard from '@/components/common/infoCard.vue'
import RecordCardList from '@/components/common/RecordCardList.vue'
import { recordSchema2 } from '../grassrootsEntreSubsidy/js/record.schema'
export default {
  name: 'UnemploymentRegistration',
  components: {
    infoCard,
    RecordCardList,
  },
  data() {
    return {
      recordSchema2,
      userInfo: {},
      infoForm: {},
      tableData: [],
      current: 1,
      pageSize: 10,
      recordActions: [
        {
          key: 'edit',
          text: '编辑',
          type: 'secondary',
          disabledWhen: (record) => false,
        },
        {
          key: 'view',
          text: '查看',
          type: 'secondary',
          disabledWhen: (record) => false,
        },
      ],
    }
  },
  mounted() {
    // 获取用户信息
    try {
      const info = this.$base.getUser(true, true)
      if (info && info.naturalBo) {
        this.userInfo = info.naturalBo
        this.init()
        this.queryPageList()
      } else {
        this.$message.error('获取用户信息失败，请重新登录')
      }
    } catch (error) {
      console.error('获取用户信息异常:', error)
      this.$message.error('系统异常，请稍后重试')
    }
    setTimeout(() => {
      this.test()
    }, 500)
  },
  // 页面初次渲染完成时触发，一个页面只会调用一次
  onReady() {
    console.log('页面初次渲染完成 - onReady')
    this.test()
  },
  methods: {
    test() {
      const query = uni.createSelectorQuery().in(this)
      query
        .select('#contrainer')
        .boundingClientRect((data) => {
          if (data) {
            this.componentHeight = data.height
            terminalUtil._setIframeHeight(data.height)
          }
        })
        .exec()
    },
    init() {
      const param = {
        no: '000-0016',
        data: JSON.stringify({
          yac002: this.userInfo.certNo,
        }),
      }
      this.$base.post('', param, (res) => {
        if (res.serviceSuccess) {
          if (!res.data) {
            this.$message.error('查询失败,未找到数据！')
            return
          } else {
            let info = res.data || {}
            this.infoForm = info
          }
        }
      })
    },
    queryPageList() {
      const param = {
        no: '325-0005',
        data: JSON.stringify({
          yac002: this.userInfo.certNo,
        }),
      }
      this.$base.post('', param, (res) => {
        if (res.serviceSuccess) {
          console.log(res.data, '8888888')

          this.tableData = res.data.dataList || []
          if (!this.tableData || this.tableData.length === 0) {
            this.$message.success('查询成功，数据为空！')
          } else {
            this.$message.success('查询成功')
          }
        } else {
          this.$message.error(res.message || '查询失败')
        }
      })
    },
    openAddPage() {
      if (!this.userInfo || !this.userInfo.certNo) {
        this.$message.error('用户信息不完整，无法新增')
        return
      }
      try {
        uni.navigateTo({
          // url: `/pages/personalServices/UnemploymentRegistration/UnemploymentRegistrationAdd?params=${encodeURIComponent(
          //   JSON.stringify(this.userInfo)
          // )}`,
          url: `/pages/personalServices/travelExpensesSubsidy/travelExpensesSubsidyAdd?params=${encodeURIComponent(
            JSON.stringify(this.userInfo)
          )}`,
        })
      } catch (error) {
        console.error('导航到新增页面失败:', error)
        this.$message.error('无法打开新增页面，请稍后重试')
      }
    },
    handleSearch() {
      this.queryPageList()
    },
    handleRecordAction({ key, record }) {
      if (key === 'edit') {
        const info = {
          ...this.userInfo,
          type: 'edit',
          intripallowanceid: record.intripallowanceid,
        }
        uni.navigateTo({
          url: `/pages/personalServices/travelExpensesSubsidy/travelExpensesSubsidyAdd?params=${encodeURIComponent(
            JSON.stringify(info)
          )}`,
        })
      }
      if (key === 'view') {
        const info = {
          ...this.userInfo,
          type: 'edit',
          intripallowanceid: record.intripallowanceid,
        }
        uni.navigateTo({
          url: `/pages/personalServices/travelExpensesSubsidy/travelExpensesSubsidyDetail?params=${encodeURIComponent(
            JSON.stringify(info)
          )}`,
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import url('@/static/css/sass/record.scss');
</style>
