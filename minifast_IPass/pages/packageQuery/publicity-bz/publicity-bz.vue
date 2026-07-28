<template>
  <div class="publicity h5-page">
    <ComponentPanel title="村社公示" buttonText="重置" @click="handleResetSelectData">
      <div class="panel-content">
        <div class="from">
          <div class="input-wrapper">
            <label for="" class="label">主管单位</label>
            <ComponentPicker
              placeholder="请选择主管单位"
              :range="unitRange"
              rangeKey="name"
              valueKey="value"
              v-model="unit"
              @change="handleUnitChange"></ComponentPicker>
          </div>
          <block v-if="unit">
            <div class="input-wrapper">
              <label for="" class="label">补贴项目</label>
              <ComponentPicker
                placeholder="请选择补贴项目"
                :range="subsidyRange"
                rangeKey="name"
                valueKey="id"
                v-model="subsidy"></ComponentPicker>
            </div>
          </block>

          <div class="input-wrapper">
            <label for="" class="label">地区选择</label>
            <ComponentPicker
              idName="address"
              type="address"
              placeholder="请选择地址"
              v-model="address"
              @change="handleChangePicker"></ComponentPicker>
          </div>
          <div class="input-wrapper">
            <label for="" class="label">时间段</label>
            <ComponentPicker
              placeholder="请选择时间段"
              idName="time"
              :range="timeRange"
              rangeKey="name"
              valueKey="value"
              v-model="time"></ComponentPicker>
          </div>
          <div class="button-wrapper">
            <ComponentButton type="primary" height="68rpx" @click="handleQueryData" name="查询"></ComponentButton>
          </div>
        </div>

        <div class="query-result">
          <block v-if="queryResultList.length > 0">
            <div class="subsidy-item">
              <div class="subsidy-name" style="border: unset">
                <div class="iconimg iconimg-subsidy"></div>
                <div class="subsidy-name-text">{{ subsidyDesc }}</div>
              </div>
              <div class="subsidy-name">
                <div class="subsidy-name-text">业务局：{{ unitDesc }}</div>
              </div>
              <div class="subsidy-con">
                <div class="cell">
                  <div>姓名</div>
                  <div>发放金额</div>
                  <div>发放期号</div>
                  <div>发放时间</div>
                </div>
                <div class="cell" v-for="item in queryResultList" :key="item.id">
                  <div>{{ item.aac003 }}</div>
                  <div>{{ item.aae019 }}</div>
                  <div>{{ item.aae209 }}</div>
                  <div>{{ item.chb204 | timeChange }}</div>
                </div>
              </div>
            </div>
          </block>
          <block v-else>
            <ComponentNoData v-if="isInquired" tip="未查询到相关数据"></ComponentNoData>
          </block>
          <div class="load-more-wrapper" v-if="isExceedLimit">
            <ComponentLoadMore :isOver="isLoadOver" @click="handleClickLoadMore"></ComponentLoadMore>
          </div>
        </div>
      </div>
    </ComponentPanel>
  </div>
</template>
<script>
  import ComponentButton from '@/components/common/ez-button/ez-button.vue'
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
  import ComponentPicker from '@/components/project/ez-picker/ez-picker.vue'
  import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
  import ComponentLoadMore from '@/components/common/ez-load-more/ez-load-more.vue'

  import config from '@/config'

  import { showModal } from '@/utils/uni-api'
  import { requestFFGetChi037List, requestFFGetChi031ListByChi037, requestFFGetVillageDetailInfo } from '@/service/api'
  export default {
    name: 'pagePublicity',
    data() {
      return {
        unitRange: [], // 主管单位渲染数据
        unit: '',
        subsidy: '',
        subsidyRange: [], // 补贴项目
        queryResultList: [], // 查询结果列表
        time: '', // 时间段
        timeRange: [], // 时间段选择 下拉选
        isInquired: false, // 是否已查询
        pageNo: 1, // 查询页数
        pageLimit: 20, // 每页数据条数
        isExceedLimit: false, // 加载条数是否超出限制
        isLoadOver: true, // 是否加载完成
        address: '', // 地区
        addressInfo: {} // 地区选择
      }
    },
    components: {
      ComponentButton,
      ComponentPanel,
      ComponentPicker,
      ComponentNoData,
      ComponentLoadMore
    },
    onLoad(e) {
      const { SPAddressRequestParams } = config
      if (SPAddressRequestParams) {
        this.districtOrglevel = SPAddressRequestParams.orglevel
      }

      this.getUnitRange()
      this.getTimeRange()
    },
    filters: {
      timeChange(val) {
        if (val) {
          return val.replace(/[\d]{2}:[\d]{2}:[\d]{2}/g, '')
        }
        return ''
      }
    },
    methods: {
      // 获取时间段
      getTimeRange() {
        const newTime = new Date()
        let year = newTime.getFullYear()
        let month = newTime.getMonth() + 1
        let day = newTime.getDate()
        let hours = newTime.getHours()
        let minutes = newTime.getMinutes()
        let seconds = newTime.getSeconds()
        if (month < 10) {
          month = '0' + month
        }
        if (day < 10) {
          day = '0' + day
        }
        if (hours < 10) {
          hours = '0' + hours
        }
        if (minutes < 10) {
          minutes = '0' + minutes
        }
        if (seconds < 10) {
          seconds = '0' + seconds
        }
        const newTimeRange = []

        /*========== 本月 ==========*/
        let monthObj = {
          id: 'month',
          value: 'month',
          name: '本月',
          start_time: `${year}/${month}/01 00:00:00`,
          end_time: `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
        }
        newTimeRange.push(monthObj)
        /*========== 上一个月 ==========*/
        let lastMonthStartTime = ''
        let lastMonthEndTime = ''
        let lastMonth = parseInt(month) - 1
        let dayNum = ''
        // 当前月份为1月
        if (lastMonth == 0) {
          lastMonthStartTime = `${year - 1}/12/01 00:00:00`
          dayNum = new Date(year - 1, 12, 0).getDate()
          lastMonthEndTime = `${year - 1}/12/${dayNum} 23:59:59`
        } else {
          lastMonthStartTime = `${year}/${lastMonth < 10 ? '0' + lastMonth : lastMonth}/01 00:00:00`
          dayNum = new Date(year, lastMonth, 0).getDate()
          lastMonthEndTime = `${year - 1}/${lastMonth < 10 ? '0' + lastMonth : lastMonth}/${dayNum} 23:59:59`
        }
        let lastMonthObj = {
          id: 'lastMonth',
          value: 'lastMonth',
          name: '上一个月',
          start_time: lastMonthStartTime,
          end_time: lastMonthEndTime
        }
        newTimeRange.push(lastMonthObj)
        /*========== 上一季度 ==========*/
        let lastQuarterStartTime = ''
        let lastQuarterEndTime = ''
        let currentMonth = parseInt(month) // 当前月份
        let quarterNum = Math.floor((currentMonth - 1) / 3) // 上季度值
        if (currentMonth <= 3) {
          lastQuarterStartTime = `${year - 1}/10/01 00:00:00`
          lastQuarterEndTime = `${year - 1}/12/31 23:59:59`
        } else {
          switch (quarterNum) {
            case 1:
              lastQuarterStartTime = `${year}/01/01 00:00:00`
              lastQuarterEndTime = `${year}/03/31 23:59:59`
              break
            case 2:
              lastQuarterStartTime = `${year}/04/01 00:00:00`
              lastQuarterEndTime = `${year}/06/30 23:59:59`
              break
            case 3:
              lastQuarterStartTime = `${year}/07/01 00:00:00`
              lastQuarterEndTime = `${year}/09/30 23:59:59`
              break
            default:
              break
          }
        }
        let lastQuarterObj = {
          id: 'lastQuarter',
          value: 'lastQuarter',
          name: '上一季度',
          start_time: lastQuarterStartTime,
          end_time: lastQuarterEndTime
        }
        newTimeRange.push(lastQuarterObj)
        /*========== 去年 ==========*/
        let lastYear = {
          id: 'lastYear',
          value: 'lastYear',
          name: '去年',
          start_time: `${year - 1}/01/01 00:00:00`,
          end_time: `${year - 1}/12/31 23:59:59`
        }
        newTimeRange.push(lastYear)
        /*========== 今年 ==========*/
        let nowYear = {
          id: 'nowYear',
          value: 'nowYear',
          name: '今年',
          start_time: `${year}/01/01 00:00:00`,
          end_time: `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
        }
        newTimeRange.push(nowYear)

        // console.log(year, month, day, hours, minutes, seconds, newTimeRange)

        this.timeRange = [...newTimeRange]
      },
      // 重置筛选数据
      handleResetSelectData() {
        this.district = ''
        this.unit = ''
        this.time = ''
        this.queryResultList = []
        ;(this.address = ''), // 地区
          (this.pageNo = 1)
        this.isExceedLimit = false
        this.isLoadOver = true
        this.isInquired = false
      },
      // 获取主管单位数据
      getUnitRange() {
        requestFFGetChi037List().then((res) => {
          const { list } = res
          if (list) {
            const newList = []
            for (let i = 0, len = list.length; i < len; i++) {
              let item = list[i]
              newList.push({
                id: item.chi037,
                value: item.chi037,
                name: item.chi011
              })
            }
            this.unitRange = [...newList]
          }
        })
      },
      // 主管单位变化触发函数
      handleUnitChange() {
        this.subsidy = ''
        this.getSubsidyRange(this.unit)
      },
      // picker change
      handleChangePicker(id, value) {
        if (id === 'address') {
          this.addressInfo = {
            chb018: value[2].orgid
          }
        }
      },
      handleCheckInput() {
        const unit = this.unit
        const subsidy = this.subsidy
        const { chb018 } = this.addressInfo
        if (!unit) {
          showModal('请选择主管单位')
          return false
        }
        if (!subsidy) {
          showModal('请选择补贴项目')
          return false
        }
        if (!chb018) {
          showModal('请选择地址')
          return false
        }
        return true
      },
      // 获取某单位补贴项目
      getSubsidyRange(chi037) {
        requestFFGetChi031ListByChi037(chi037).then((res) => {
          const { list } = res
          if (list) {
            const newList = []
            for (let i = 0, len = list.length; i < len; i++) {
              const item = list[i]
              newList.push({
                id: item.chi031,
                value: item.chi031,
                name: item.chi031_desc
              })
            }
            this.subsidyRange = [...newList]
          } else {
            showModal('您选择的部门暂无项目')
          }
        })
      },

      // 查询 村组补贴
      handleQueryData() {
        if (!this.handleCheckInput()) {
          return
        }

        const pageLimit = this.pageLimit
        const pageNo = this.pageNo
        const timeRange = this.timeRange
        const time = this.time
        const subsidy = this.subsidy
        const { chb018 } = this.addressInfo
        const { chb017 } = this.userInfo
        let start_time = ''
        let end_time = ''

        timeRange.map((item) => {
          if (item.value === time) {
            start_time = item.start_time
            end_time = item.end_time
          }
        })

        requestFFGetVillageDetailInfo('', '', '', chb017, chb018, subsidy, start_time, end_time, pageNo, pageLimit)
          .then((res) => {
            const { list } = res
            if (res && list) {
              const newList = []
              list.map((item) => {
                let { chb204, aae036 } = item
                if (chb204) {
                  chb204 = chb204.substring(0, 19)
                }
                if (aae036) {
                  aae036 = aae036.substring(0, 19)
                }
                item.chb204 = chb204
                item.aae036 = aae036
                newList.push(item)
              })

              const len = list.length
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
                this.queryResultList = [...list]
              } else {
                // 加载更多
                // 加载完成
                if (len < pageLimit) {
                  this.isLoadOver = true
                } else {
                  // 加未载完成 还有文件待加载
                  this.isLoadOver = false
                }
                this.queryResultList = [...this.queryResultList, ...list]
              }
            } else {
              this.isLoadOver = true
              if (pageNo < 2) {
                this.queryResultList = []
              } else {
                this.queryResultList = [...this.queryResultList]
              }
            }
          })
          .finally(() => {
            this.isShowSearchResult = true
            this.isInquired = true
          })
      },
      // 加载更多
      handleClickLoadMore() {
        this.pageNo++
        this.handleQueryData()
      }
    },
    computed: {
      unitDesc() {
        if (this.unitRange && this.unitRange.length > 0 && this.unit) {
          let res = this.unitRange.find((item) => item.value == this.unit)
          return res.name
        }
        return ''
      },
      subsidyDesc() {
        if (this.subsidyRange && this.subsidyRange.length > 0 && this.subsidy) {
          let res = this.subsidyRange.find((item) => item.value == this.subsidy)
          return res.name
        }
        return ''
      }
    },
    watch: {
      subsidy() {
        this.queryResultList = []
        this.pageNo = 1
        this.isExceedLimit = false
        this.isLoadOver = true
        this.isInquired = false
      }
    }
  }
</script>
<style lang="scss" scoped>
  .publicity {
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
    }
    .btn-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      color: $primary;
      padding: 20rpx 0;
      .btn {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        line-height: 60rpx;
        .iconfont {
          font-size: 26rpx;
          padding-left: 4rpx;
        }
      }
    }
  }
  .cell {
    display: flex;
    justify-content: space-between;
    align-items: center;
    div {
      width: 25%;
      text-align: center;
    }
  }
</style>
