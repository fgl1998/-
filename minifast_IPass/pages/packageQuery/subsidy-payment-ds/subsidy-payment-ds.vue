<template>
  <div class="query-publicity h5-page">
    <div class="main">
      <div class="toolbar d-f ai-c jc-sb">
        <ComponentButton
          v-if="_isOpenPersonQuery"
          :type="type === '1' ? 'primary' : 'secondary'"
          name="个人补贴查询"
          width="284rpx"
          height="66rpx"
          @click="handleChangeTab('1')"
        ></ComponentButton>
        <ComponentButton
          v-if="_isOpenVillageQuery"
          :type="type === '2' ? 'primary' : 'secondary'"
          :name="titleVillageQuery"
          width="284rpx"
          height="66rpx"
          @click="handleChangeTab('2')"
        ></ComponentButton>
      </div>
      <div class="from">
        <block v-if="type === '1'">
          <div class="input-wrapper">
            <label for class="label">姓名</label>
            <input
              type="text"
              maxlength="12"
              placeholder="请输入姓名"
              v-model="personalQuery.hideName"
              @input="getPersonalName"
            />
          </div>
          <div class="input-wrapper">
            <label for class="label">身份证号</label>
            <input
              type="idcard"
              maxlength="18"
              placeholder="请输入身份证号"
              v-model="personalQuery.hideIdcard"
              @input="getPersonalIdcard"
            />
          </div>
          <div class="input-wrapper">
            <label for class="label">年度</label>
            <ComponentPicker
              idName="years"
              mode="date"
              fields="year"
              placeholder="请选择年度"
              v-model="years"
              :endTime="today_y"
              :renderValue="yearsDesc || years"
            ></ComponentPicker>
          </div>
        </block>
        <block v-else>
          <div class="input-wrapper">
            <label for class="label">地区选择</label>
            <ComponentPicker
              idName="address"
              type="address"
              placeholder="请选择地址"
              :disabled="addressDisabled"
              v-model="address"
              :address="getAddressArr"
              @change="handleChangePicker"
            ></ComponentPicker>
          </div>
          <div class="input-wrapper">
            <label for class="label">主管单位</label>
            <ComponentPicker
              placeholder="请选择主管单位"
              :range="unitRange"
              rangeKey="name"
              valueKey="value"
              v-model="unit"
            ></ComponentPicker>
          </div>
          <div class="input-wrapper" v-if="unit && subsidyRange.length > 0">
            <label for class="label">补贴项目</label>
            <ComponentPicker
              placeholder="请选择补贴项目"
              :range="subsidyRange"
              rangeKey="name"
              valueKey="value"
              v-model="subsidy"
            ></ComponentPicker>
          </div>
          <div class="input-wrapper">
            <label for class="label">时间段</label>
            <ComponentPicker
              placeholder="请选择时间段"
              idName="time"
              :range="timeRange"
              rangeKey="name"
              valueKey="value"
              v-model="time"
            ></ComponentPicker>
          </div>
        </block>
        <div class="button-wrapper">
          <ComponentButton
            type="primary"
            name="查询"
            height="68rpx"
            fontSize="28rpx"
            @click="handleQuery"
          ></ComponentButton>
        </div>
      </div>
      <div class="tool-wrapper" v-if="queryResultList.length > 0">
        <div class="tool" @click="handleChangeSort">
          <div class="icon"></div>
          <div class="text">{{ sortTitle ? '按时间升序' : '按时间降序' }}</div>
        </div>
      </div>

      <div class="query-result">
        <block v-if="queryResultList.length > 0">
          <div
            class="subsidy-item"
            v-for="(item, index) in queryResultList"
            :key="item.id"
          >
            <div class="subsidy-name">
              <div class="iconimg iconimg-subsidy"></div>
              <div class="subsidy-name-text">{{ item.chi031_desc }}</div>
            </div>
            <div class="subsidy-con">
              <div class="cell">
                <div class="key">姓名：</div>
                <div class="value">
                  <span>{{ getUserName(item.aac003) }}</span>
                </div>
              </div>
              <div class="cell">
                <div class="key">身份证号：</div>
                <div class="value">
                  <span>{{ getIdcard(item.aac002) }}</span>
                </div>
              </div>
              <div class="cell" v-if="item.aae010">
                <div class="key">银行卡号：</div>
                <div class="value">
                  <span>{{ item.aae010 | TMBankCard }}</span>
                </div>
              </div>
              <div class="cell">
                <div class="key">发放金额：</div>
                <div class="value">
                  <span>{{ item.aae019 }}元</span>
                </div>
              </div>
              <div class="cell">
                <div class="key">发放期号：</div>
                <div class="value primary">
                  <span>{{ item.aae209 }}</span>
                </div>
              </div>
              <!-- <div class="cell">
                <div class="key">经办时间：</div>
                <div class="value">
                  <span>{{ item.aae036 }}</span>
                </div>
              </div>-->
              <div class="cell">
                <div class="key">经办部门：</div>
                <div class="value">
                  <span>{{ item.aae017_desc }}</span>
                </div>
              </div>
              <div class="cell" v-if="item.chb204">
                <div class="key">实发时间：</div>
                <div class="value">
                  <span>{{ item.chb204 }}</span>
                </div>
              </div>
              <div class="cell" v-if="item.chb017_desc">
                <div class="key">申报乡镇：</div>
                <div class="value">
                  <span>{{ item.chb017_desc }}</span>
                </div>
              </div>
            </div>
            <div class="btn-wrapper">
              <div class="btn" @click.stop="handleViewProcess(index)">
                <span>查询发放进度</span>
                <i class="iconfont iconfont-arrow-right-double"></i>
              </div>
            </div>
          </div>
        </block>
        <block v-else>
          <ComponentNoData
            v-if="isInquired"
            tip="未查询到相关补贴发放数据"
          ></ComponentNoData>
        </block>
        <div
          class="load-more-wrapper"
          v-if="isExceedLimit && queryResultList.length > 0"
        >
          <ComponentLoadMore
            :isOver="isLoadOver"
            @click="handleClickLoadMore"
          ></ComponentLoadMore>
        </div>
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

// import { useTMIDCard } from '@/hooks'
import { showModal, navigateTo } from '@/utils/uni-api'
import { checkIDCard } from '@/utils/check'
import { getDate } from '@/utils/get'
import { USER_INFO } from '@/store/constants'
import {
  requestDSGetDepartment,
  requestDSGetChi031ListByChi037,
  requestDSGetStageTreatment,
  requestDSGetVillageDetailInfo
} from '@/service/api'

import config from '@/config'
const { isOpenSchoolQuery, isOpenVillageQuery, isOpenPersonQuery, areaCode } =
  config

import { useTMUserName, useTMIDCard } from '@/hooks'

export default {
  name: 'pageQueryPublicity',
  data() {
    return {
      years: '', // 个人查询 年度
      yearsDesc: '', // 个人查询 年度
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
      addressInfo: {
        chb018: '',
        chb015: '',
        chb017: ''
      }, // 地区选择
      pageNo: 1, // 查询页数
      pageLimit: 10, // 每页数据条数
      isExceedLimit: false, // 加载条数是否超出限制
      isLoadOver: true, // 是否加载完成
      today_y: getDate('year'),
      sortTitle: true, // 排序按钮true为升序

      addressDisabled: false,
      _isOpenSchoolQuery: false, // 是否开启学校补贴查询
      _isOpenVillageQuery: false, // 是否开启村组查询
      _isOpenPersonQuery: false, // 是否开启个人查询
      queryCount: 0, // 查询开启个数
      titleVillageQuery: '村组补贴查询'
    }
  },
  components: {
    ComponentButton,
    ComponentNoData,
    ComponentLoadMore,
    ComponentPicker
  },

  onLoad(e) {
    this._isOpenSchoolQuery = isOpenSchoolQuery || false
    this._isOpenVillageQuery = isOpenVillageQuery || false
    this._isOpenPersonQuery = isOpenPersonQuery || false

    if (areaCode === '511100') {
      this.titleVillageQuery = '村（社区）查询'
    }
    this.getUnitRange()
  },
  onShow() {
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

    // 排序
    handleChangeSort() {
      this.sortTitle = !this.sortTitle
      if (this.sortTitle) {
        // 升序
        this.queryResultList.sort((a, b) => {
          let x = new Date(a.chb204).getTime(),
            y = new Date(b.chb204).getTime()
          return y - x
        })
      } else {
        // 降序
        this.queryResultList.sort((a, b) => {
          let x = new Date(a.chb204).getTime(),
            y = new Date(b.chb204).getTime()
          return x - y
        })
      }
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

    // 获取主管单位数据
    getUnitRange() {
      const { chb015, aac021Arr } = this.userInfo
      requestDSGetDepartment(chb015).then((res) => {
        const { list } = res
        if (list) {
          const newList = []
          //现在只保留市级主管单位
          // const filterArr511100 = [
          //   '1101133',//乐山市发展和改革委
          //   //'1102136',//市中区教育局
          //   //'1102133',//市中区发展和改革局
          //   //'1102134',//市中区民政局
          //   '1101143',//乐山市人力资源和社会保障局
          //   '1102155',//乐山市市中区自然资源局
          //   '1101127',//乐山市住房城乡建设局
          //   //'1102148',//市中区水务局
          //   '1101131',//乐山市农业农村局
          //   '1101128',//乐山市卫生健康委
          //   '1101154',//乐山市应急管理局
          //   '1102129',//乐山市市中区乡村振兴
          //   //'1102130',//市中区林业局
          //   //'1102153',//市中区医保局
          //   '1101147',//乐山市体育局
          //   '1101163',//乐山市总工会
          //   '1101162',//峨眉山风景名胜
          //   '1101151',//乐山市妇女联合会
          //   '1101125',//市残疾人联合会
          //   '1101139',//乐山职业技术学院
          //   '1101161'//乐山市第一职业高级中学
          // ]
          //获取乐山对应区县名字,下列区县特殊处理
          let district = aac021Arr[0].slice(0, aac021Arr[0].length - 1)
          if (district.indexOf('峨边') != -1) {
            district = '峨边'
          } else if (district.indexOf('高新') != -1) {
            district = '高新'
          } else if (district.indexOf('马边') != -1) {
            district = '马边'
          }
          for (let i = 0, len = list.length; i < len; i++) {
            let item = list[i]
            if (areaCode === '511100') {
              // if (filterArr511100.includes(item.chi037)) {
              //   newList.push({
              //     id: item.chi037,
              //     value: item.chi037,
              //     name: item.chi011
              //   })
              // }

              //获取区县对应组织机构
              if (item.chi011.indexOf(district) != -1) {
                newList.push({
                  id: item.chi037,
                  value: item.chi037,
                  name: item.chi011
                })
              }
            } else {
              newList.push({
                id: item.chi037,
                value: item.chi037,
                name: item.chi011
              })
            }
          }
          this.unitRange = [...newList]
        }
      })
    },

    // 获取某单位补贴项目
    getSubsidyRange(chi037) {
      requestDSGetChi031ListByChi037(chi037).then((res) => {
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
          showModal('您选择的部门暂无项目，请重新选择！')
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
        lastMonthStartTime = `${year}/${
          lastMonth < 10 ? '0' + lastMonth : lastMonth
        }/01 00:00:00`
        dayNum = new Date(year, lastMonth, 0).getDate()
        //解决上一个月结束时间有误bug
        lastMonthEndTime = `${year}/${
          lastMonth < 10 ? '0' + lastMonth : lastMonth
        }/${dayNum} 23:59:59`
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
          chb015: value[0].orgid || '',
          chb017: value[1].orgid || '',
          chb018: value[2].orgid || ''
        }
      }
    },

    // 初始化查询状态
    hanldeInitQueryStatus() {
      this.pageNo = 1
      this.isInquired = false
      this.isExceedLimit = false
      this.isLoadOver = true
      this.queryResultList = []
    },
    // picker change
    handleChangeTab(type) {
      this.type = type
      this.hanldeInitQueryStatus()
    },

    // 加载更多
    handleClickLoadMore() {
      this.pageNo++
      const type = this.type
      if (type === '1') {
        this.handleQueryPersonal()
      }
      if (type === '2') {
        this.handleQueryVillage()
      }
    },

    // 检测必输入项
    handleCheck() {
      const type = this.type
      if (type === '1') {
        const keywordUserName = this.keywordUserName
        const keywordIdCard = this.keywordIdCard
        const years = this.years
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
        if (!years) {
          showModal('请选择年度')
          return false
        }
        return true
      }
      if (type === '2') {
        const unit = this.unit
        const subsidy = this.subsidy
        const subsidyRange = this.subsidyRange
        const time = this.time
        const { chb018 } = this.addressInfo
        if (!chb018) {
          showModal('请选择地址')
          return false
        }
        if (!unit) {
          showModal('请选择主管单位')
          return false
        }
        if (subsidyRange && subsidyRange.length > 0) {
          if (!subsidy) {
            showModal('请选择补贴项目')
            return false
          }
        } else {
          showModal('请重新选择主管单位')
          return false
        }
        if (!time) {
          showModal('请选择时间段')
          return false
        }
        return true
      }
    },
    // 点击查询 重置状态
    handleQuery() {
      const type = this.type
      const checkResult = this.handleCheck()

      this.hanldeInitQueryStatus()

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

      requestDSGetStageTreatment(
        keywordIdCard,
        keywordUserName,
        year,
        pageNo,
        pageLimit
      )
        .then((res) => {
          const { list } = res
          if (res && list) {
            const len = list.length
            for (let i = 0; i < len; i++) {
              const item = list[i]
              item.aac002 = useTMIDCard(item.aac002)
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

    // 查询 村组补贴
    handleQueryVillage() {
      const pageLimit = this.pageLimit
      const pageNo = this.pageNo
      const timeRange = this.timeRange
      const time = this.time
      const subsidy = this.subsidy
      const { chb018, chb015, chb017 } = this.addressInfo

      let start_time = ''
      let end_time = ''

      timeRange.map((item) => {
        if (item.value === time) {
          start_time = item.start_time
          end_time = item.end_time
        }
      })
      requestDSGetVillageDetailInfo(
        '',
        '',
        chb015,
        chb017,
        chb018,
        subsidy,
        start_time,
        end_time,
        pageNo,
        pageLimit
      )
        .then((res) => {
          const { list } = res
          if (res && list) {
            const len = list.length
            for (let i = 0; i < len; i++) {
              const item = list[i]
              let { chb204, aae036 } = item
              if (chb204) {
                chb204 = chb204.substring(0, 19)
              }
              if (aae036) {
                aae036 = aae036.substring(0, 19)
              }
              item.aac002 = useTMIDCard(item.aac002)
              item.chb204 = chb204
              item.aae036 = aae036
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
  computed: {
    ...mapGetters([USER_INFO]),
    getAddressArr() {
      const { aac021, aac021Arr, chb015, chb017, chb018 } = this.userInfo
      let arr = []
      if (areaCode === '511100') {
        if (aac021) {
          this.address = aac021
          this.addressInfo = {
            chb015,
            chb017,
            chb018
          }
          this.addressDisabled = true
          arr = aac021Arr.concat([])
        }
      }

      return arr
    }
  },
  watch: {
    unit: {
      handler(val) {
        this.getSubsidyRange(val)
        this.subsidy = ''
        this.subsidyRange = []
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

  .query-result {
    padding: $spacing 0;
  }

  .button-wrapper {
    padding: $spacing 2 * $spacing;
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
  .tool-wrapper {
    display: flex;
    justify-content: flex-end;
    padding-top: 30rpx;
    .tool {
      display: flex;
      align-items: center;
      color: $primary;
      font-size: 28rpx;
      .icon {
        width: 28rpx;
        height: 28rpx;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAABOhJREFUeF7tm1toHGUYht93VyF4oaLghVBUNEKlhWhtdzbBHlSsp2o9xCvFQ2ujVS/UGw/dfzKTerixXqjV1lYremU81FO14qEqyc62VgMtFqyiUvBCUNQLCejuJ7NuREPS+f9//plN0sxNLub93u/9nvl2k53ZEEf4wSN8fswCaOcGlAbk0rh/rcId7crRtg3oWS/n1hvYFQ9eLGDp0Dp+3g4IbQHQvV5OaTTwMYDTWkN/Vyhg2fA6/pA3hNwB9L4sxUMHMAxi0f+GFeyeMxfdg9exnieE3AF4obwF4PJJhnw7UlwxYwGUQ9kqwC2HG5DAc1XFVXlByG0DyqE8IsB9OoMReLSqeL+ONq0mFwBeKPcAeMww7L2R4gbDGmN55gBKoVxP4EXjZAAEuKGm+JJNrW5NpgBKgSwj8ZFumIl0Iji/5jP+lZnJkRmA0oB0UrAHwHEpk/8mxMJahQdT+kxYngmABf1yzNEFjADodBT64J8NdO3t5x+O/P61yQSAF8gQiG6nYQXDkc8ep56A+0+DpVBeJ7DSddDYT4DtNcWrXHo73YByKJsEWOMy4HgvApurin2uejgDUA5FCRC4Cpbw16JfVQxd9HICoBzIKiG2uAik60HB6qrPrbr6yXSpAZQDWS7Ee2mD2NRTcHHV506b2rGaVAC6+2Veo4B9aQKkrS00MH+4n/ttfawBdPlyfEcR3wA40ba5o7qfR+s4YyTgrzZ+1gC8UL4CMNemaQY1ByLFs2x8rQB4oXwA4AKbhhnWfBgpXmjqbwzAG5BtENxo2igXPfFCVOFNJr2MAHihPATgAZMGbdA+HCk+qNtXG4A3ILdDsFHXuK06Ym1U4dM6GbQAeANyBQR36xhOGQ3xeFThm0l5tAAkmUzn87MApvPVc5F9dgNcUJzOHrMboHP1vEBWgIgfbkyfQ7Ah8hk/hzzsob0B5UD6hHgmyXAqnKfgtqrPTTpZtAHEZqVQAgJKx7hdGgHCmqKv298IQGzqhfIsgNW6DXLWbYkUbzXpaQygBeEdAM3v90yhY0ekeJlpHisAzZdDIF+S6DJtmIVeBCM1n2fbeNsD8OVYFhE/rzvJprHDmp+kjs5awN9tPK0BNLfgnwegX9s0dlUjxJlpHpymAhAPsSiU8wrAp64GMvFpAIt3K35mUjNemxpAaxOupWAwTRDTWiF6axW+YlqXCYDYtBzKnQI8kTaQTj2Bu6qKT+pokzRONmCsSU73DI3u+eUKIG7mhfI8AKM7s0kh/3N+W6R4s4E+Uep0A8a6lUPZKcBFid0NBATeryouNyjRkmYCYKkvHaNHYQ8E87RSJImI/R1/YeGugKNJUtPzmQBovhR8ORVF7AVwgmmocfpfUMeCKOD3KX0mLM8MQOv9oAQgShncixRrKT0mLc8UQNy1FMiVJLbbDCCClTWfb9jU6tZkDqAJIZQ1BLRuUIwFF6CvprhZdxBbXS4A4nAm3yEi4Ow7QElgcgPQek94CsDahFAbI8U7koK7Op8rgBaEVwFcPckAr0WK17gaTscndwC9vVI8NB+fABj/rc+hOfuwZHBwhv/LTHxVenw5uV5sfoQ+vXWVvi3WsXgo4I86V82lJvcNGAvv+XIOis1NAOpYEgX8wuVgul5tA9B8Pwjkkvhn5PNd3cCudW0F4HoYG79ZADbUZlLN373/R1ADL9UGAAAAAElFTkSuQmCC)
          no-repeat center center;
        background-size: 100% 100%;
        margin-right: 4rpx;
      }
    }
  }
}
</style>
