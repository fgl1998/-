<template>
  <div class="query-publicity h5-page">
    <div class="main">
      <div class="from">
        <block>
          <div class="input-wrapper">
            <label for="" class="label">姓名</label>
            <input
              type="text"
              maxlength="12"
              placeholder="请输入姓名"
              v-model="personalQuery.hideName"
              @input="getPersonalName" />
          </div>
          <div class="input-wrapper">
            <label for="" class="label">身份证号</label>
            <input
              type="idcard"
              maxlength="18"
              placeholder="请输入身份证号"
              v-model="personalQuery.hideIdcard"
              @input="getPersonalIdcard" />
          </div>
          <div class="input-wrapper">
            <label for="" class="label">年度</label>
            <ComponentPicker
              idName="years"
              mode="date"
              fields="year"
              placeholder="请选择年度"
              v-model="years"
              :endTime="today_y"></ComponentPicker>
          </div>
        </block>
        <div class="button-wrapper">
          <ComponentButton
            type="primary"
            name="查询"
            height="68rpx"
            fontSize="28rpx"
            @click="handleQuery"></ComponentButton>
          <div class="button-reset">
            <ComponentButton
              type="default"
              name="重置"
              height="68rpx"
              fontSize="28rpx"
              @click="handleResetSelectData"></ComponentButton>
          </div>
        </div>
      </div>

      <div class="table-result">
        <div class="table" v-if="queryResultList.length > 0">
          <div class="tr">
            <div class="title td">巴中市惠民惠农财政补贴资金年度发放清单</div>
          </div>
          <div class="tr">
            <div class="td">姓名</div>
            <div class="td">{{ getUserName(keywordUserName) }}</div>
            <div class="td">身份证号</div>
            <div class="td td-idCard">{{ getIdcard(keywordIdCard) }}</div>
          </div>
          <div class="tr">
            <div class="td tdIndex">序号</div>
            <div class="td tdName">补贴项目</div>
            <div class="td">补贴期号</div>
            <div class="td">补贴金额</div>
            <div class="td">发放时间</div>
          </div>
          <div class="tr" v-for="(item, index) in queryResultList" :key="item.id">
            <div class="td tdIndex">{{ index + 1 }}</div>
            <div class="td tdName" @click="showTexts(index, 'chi031_desc')">
              {{ item.chi031_desc }}
            </div>
            <div class="td" @click="showTexts(index, 'aae209')">
              {{ item.aae209 }}
            </div>
            <div class="td" @click="showTexts(index, 'aae019')">
              {{ item.aae019 }}
            </div>
            <div class="td" @click="showTexts(index, 'chb204')">
              {{ item.chb204 }}
            </div>
          </div>
          <div class="tr">
            <div class="td setAll">合计</div>
            <div class="td">{{ sumAae019 }}</div>
          </div>
        </div>
        <div class="search-time" v-if="queryResultList.length > 0">查询时间:{{ queryTime }}</div>
        <block v-else>
          <ComponentNoData v-if="isInquired" tip="未查询到相关补贴发放数据"></ComponentNoData>
        </block>
      </div>
    </div>
  </div>
</template>
<script>
  import ComponentButton from '@/components/common/ez-button/ez-button.vue'
  import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
  import ComponentLoadMore from '@/components/common/ez-load-more/ez-load-more.vue'
  import ComponentPicker from '@/components/project/ez-picker/ez-picker.vue'

  import { mapGetters } from 'vuex'

  import { getDate } from '@/utils/get'
  import { showModal, navigateTo } from '@/utils/uni-api'
  import { checkIDCard } from '@/utils/check'
  import { USER_INFO } from '@/store/constants'
  import {
    requestFFGetChi037List,
    requestFFGetChi031ListByChi037,
    requestFFGetStageTreatment,
    requestFFGetVillageDetailInfo
  } from '@/service/api'

  import config from '@/config'
  import { useTMUserName, useTMIDCard } from '@/hooks'

  export default {
    name: 'pageQueryPublicity',
    data() {
      return {
        years: '', // 个人查询 年度
        type: '1', // 查询类型 1 个人 2 村组
        keywordUserName: '', // 查询关键字 姓名
        keywordIdCard: '', // 查询关键字 身份证号

        personalQuery: {
          hideName: '',
          hideIdcard: ''
        },

        queryResultList: [], // 查询结果列表
        isInquired: false, // 是否已查询
        time: '', // 时间段
        timeRange: [], // 时间段选择 下拉选
        unit: '', // 主管单位
        unitRange: [], // 主管单位选择 下拉选
        subsidy: '', // 补贴项目
        subsidyRange: [], // 补贴项目选择 下拉选
        address: '', // 地区
        addressInfo: {}, // 地区选择
        pageNo: 1, // 查询页数
        pageLimit: 100, // 每页数据条数
        isExceedLimit: false, // 加载条数是否超出限制
        isLoadOver: true, // 是否加载完成
        today_y: getDate('year'),
        sumAae019: 0,
        queryTime: '',
        areaCode: config.areaCode
      }
    },
    components: {
      ComponentButton,
      ComponentNoData,
      ComponentLoadMore,
      ComponentPicker
    },

    onLoad(e) {
      if (this.areaCode === '511900') {
        showModal('当前信息默认查询自己的，查询其他人的需要修改信息再查询！')
      }
    },
    onShow() {
      this.getUnitRange()
      this.getTimeRange()
      this.setDefaultData()
    },
    created() {},
    onReady() {},
    methods: {
      getUserName(userName) {
        let str = ''
        if (userName) {
          str = useTMUserName(userName)
        }
        return str
      },
      getIdcard(idcard) {
        let str = ''
        if (idcard) {
          str = useTMIDCard(idcard)
        }
        return str
      },
      getPersonalName() {
        this.keywordUserName = this.personalQuery.hideName
      },

      getPersonalIdcard() {
        this.keywordIdCard = this.personalQuery.hideIdcard
      },

      // 设置默认信息 用于演示
      setDefaultData() {
        const { idCard, userName } = this.userInfo

        //用户登录的姓名与身份证号进行脱敏
        if (userName) {
          this.keywordUserName = userName
          this.personalQuery.hideName = useTMUserName(userName)
        }

        if (idCard) {
          this.keywordIdCard = idCard
          this.personalQuery.hideIdcard = useTMIDCard(idCard)
        }
      },
      showTexts(index, val) {
        console.log(index, val, 'val')
        showModal(this.queryResultList[index][val])
      },
      // 重置查询信息
      handleResetSelectData() {
        this.keywordUserName = ''
        this.keywordIdCard = ''
        this.personalQuery.hideName = ''
        this.personalQuery.hideIdcard = ''
        this.years = ''
        this.queryResultList = ''
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

      // 获取某单位补贴项目
      getSubsidyRange(chi037) {
        requestFFGetChi031ListByChi037(chi037, '').then((res) => {
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

      // picker change
      handleChangePicker(id, value) {
        if (id === 'address') {
          this.addressInfo = {
            chb018: value[2].orgid
          }
        }
      },

      // picker change
      handleChangeTab(type) {
        this.type = type
        this.pageNo = 1
        this.isInquired = false
        this.isExceedLimit = false
        this.isLoadOver = true
        this.queryResultList = []
      },

      // 加载更多
      handleClickLoadMore() {
        this.pageNo++
        this.handleQuery()
      },

      // 检测必输入项
      handleCheck() {
        const type = this.type
        if (type === '1') {
          const keywordUserName = this.keywordUserName
          const keywordIdCard = this.keywordIdCard
          if (!keywordUserName) {
            showModal('请输入姓名')
            return false
          }
          if (!keywordIdCard) {
            showModal('请输入身份证号')
            return false
          } else {
            const checkIDCardResult = checkIDCard(keywordIdCard)
            if (checkIDCardResult.status === '0') {
              showModal(checkIDCardResult.msg)
              return false
            }
          }
          return true
        }
        if (type === '2') {
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
        }
      },

      // 查询
      handleQuery() {
        const type = this.type
        const checkResult = this.handleCheck()
        if (!checkResult) {
          return
        }
        if (type === '1') {
          this.handleQueryPersonal()
        }
        if (type === '2') {
          this.handleQueryVillage()
        }
      },

      // 查询 个人补贴
      handleQueryPersonal() {
        const keywordUserName = this.keywordUserName
        const keywordIdCard = this.keywordIdCard
        const year = this.years
        const pageLimit = this.pageLimit
        const pageNo = this.pageNo

        this.queryTime = new Date().toLocaleString()

        requestFFGetStageTreatment(keywordIdCard, keywordUserName, '', year, pageNo, pageLimit)
          .then((res) => {
            var { list } = res
            if (res && list) {
              const len = list.length
              list = list.map((item) => {
                if (item.chb204) {
                  let date = item.chb204.slice(0, 8)
                  return { ...item, chb204: date }
                }
                return { ...item }
              })
              let array = []
              list.forEach((item) => {
                if (item.chb204) {
                  array.push(item)
                }
              })
              this.queryResultList = [...array]
              this.sumAae019 = array.reduce((pre, val) => {
                let res = pre + 0
                if (val.aae019 && Number(val.aae019) > 0) {
                  res = pre + Number(val.aae019)
                }
                return res
              }, 0)
              this.sumAae019 = this.sumAae019.toFixed(2)
              // 第一次加载
              // if (pageNo < 2) {
              //   // 加载完成
              //   if (len < pageLimit) {
              //     this.isLoadOver = true
              //   } else {
              //     // 加未载完成 还有文件待加载
              //     this.isLoadOver = false
              //     this.isExceedLimit = true
              //   }
              //   this.queryResultList = [...list]
              // } else {
              //   // 加载更多
              //   // 加载完成
              //   if (len < pageLimit) {
              //     this.isLoadOver = true
              //   } else {
              //     // 加未载完成 还有文件待加载
              //     this.isLoadOver = false
              //   }
              //   this.queryResultList = [...this.queryResultList, ...list]
              // }
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

      // 查询 村组补贴
      handleQueryVillage() {
        this.pageLimit = 5
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

      // 发放进度
      handleViewProcess(index) {
        const data = this.queryResultList[index]
        const { chb010, chi031_desc } = data
        navigateTo('process', 'packageDeclare', { chb010, chi031_desc })
      }
    },
    computed: { ...mapGetters([USER_INFO]) },
    watch: {
      unit: {
        handler(val) {
          this.getSubsidyRange(val)
          this.subsidy = ''
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .query-publicity {
    width: 100%;
    padding: $spacing;
    .main {
      background-color: #fff;
      border-radius: 8rpx;
      padding: $spacing;
    }
    .from {
      margin-top: $spacing;
      background-color: #fff;
      box-shadow: $box-shadow-base;
      padding: $spacing;
    }

    .table-result {
      .table {
        border-bottom: 1px solid #3882ff;
        border-left: 1px solid #3882ff;
        width: 100%;
      }
      .tr {
        border-top: 1px solid #3882ff;
        width: 100%;
        display: flex;
        .td {
          border-right: 1px solid #3882ff;
          font-size: 20rpx;
          width: 100%;
          height: 60rpx;
          line-height: 60rpx;
          text-align: center;
          overflow: hidden;
        }
        .tdIndex {
          width: 50%;
        }
        .tdName {
          width: 200%;
        }
        // .showDetail{
        // 	position: relative;
        // 	&::after{
        // 		content: attr(data-value);
        // 		position: absolute;
        // 		// display: none;
        // 		top: 0;
        // 		left: 0;
        // 		max-width: 300rpx;
        // 		background: $color;
        // 		color: #fff;
        // 		padding: 10rpx;
        // 	}

        // 	&:hover{
        // 		&::after{
        // 			display: block;
        // 		}
        // 	}
        // }
        .td-idCard {
          width: 200%;
        }
        .title {
          font-weight: 700;
        }
        .setAll {
          width: 25%;
        }
      }
      .search-time {
        text-align: right;
        font-size: 14px;
      }
    }

    .query-result {
      padding: $spacing 0;
    }

    .button-wrapper {
      padding: $spacing 2 * $spacing;
      .button-reset {
        margin-top: $spacing;
      }
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
</style>
