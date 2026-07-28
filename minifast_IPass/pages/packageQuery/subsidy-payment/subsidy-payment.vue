<template>
  <div class="query-publicity h5-page">
    <div class="main">
      <div class="toolbar d-f ai-c jc-sb">
        <ComponentButton
          v-if="_isOpenPersonQuery"
          :type="type === '1' ? 'primary' : 'secondary'"
          name="个人补贴查询"
          :width="queryCount == 3 ? '184rpx' : '284rpx'"
          height="66rpx"
          @click="handleChangeTab('1')"></ComponentButton>
        <ComponentButton
          v-if="_isOpenVillageQuery"
          :type="type === '2' ? 'primary' : 'secondary'"
          :name="areaCode === '510400' ? '项目补贴查询' : '村组补贴查询'"
          :width="queryCount == 3 ? '184rpx' : '284rpx'"
          height="66rpx"
          @click="handleChangeTab('2')"></ComponentButton>
        <ComponentButton
          v-if="_isOpenSchoolQuery"
          :type="type === '3' ? 'primary' : 'secondary'"
          name="学校补贴查询"
          :width="queryCount == 3 ? '184rpx' : '284rpx'"
          height="66rpx"
          @click="handleChangeTab('3')"></ComponentButton>
      </div>
      <div class="from">
        <block v-if="type === '1'">
          <div class="input-wrapper">
            <label for="" class="label">姓名</label>
            <input
              type="text"
              maxlength="12"
              :disabled="personalQuery.disabledName"
              placeholder="请输入姓名"
              v-model="personalQuery.hideName"
              @input="getPersonalName" />
          </div>
          <div class="input-wrapper">
            <label for="" class="label">身份证号</label>
            <input
              type="idcard"
              maxlength="18"
              :disabled="personalQuery.disabledIdcard"
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
              :endTime="today_y"
              :renderValue="yearsDesc"></ComponentPicker>
          </div>
        </block>
        <block v-if="type === '2'">
          <div class="input-wrapper">
            <label for="" class="label">主管单位</label>
            <ComponentPicker
              placeholder="请选择主管单位"
              :range="unitRange"
              rangeKey="name"
              valueKey="value"
              v-model="unit"></ComponentPicker>
          </div>
          <div class="input-wrapper" v-if="unit">
            <label for="" class="label">补贴项目</label>
            <ComponentPicker
              placeholder="请选择补贴项目"
              :range="subsidyRange"
              rangeKey="name"
              valueKey="value"
              v-model="subsidy"></ComponentPicker>
          </div>
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
        </block>
        <block v-if="type === '3'">
          <div class="input-wrapper">
            <label for="" class="label">地区选择</label>
            <ComponentPicker
              idName="address"
              type="address"
              placeholder="请选择地址"
              v-model="address"
              isSchoolQuery
              @change="handleChangePicker"></ComponentPicker>
          </div>
          <div class="input-wrapper">
            <label for="" class="label">主管单位</label>
            <ComponentPicker
              placeholder="请选择主管单位"
              :range="schoolUnitRange"
              rangeKey="name"
              valueKey="value"
              v-model="unit"></ComponentPicker>
          </div>
          <div class="input-wrapper" v-if="unit">
            <label for="" class="label">补贴项目</label>
            <ComponentPicker
              placeholder="请选择补贴项目"
              :range="subsidyRange"
              rangeKey="name"
              valueKey="value"
              v-model="subsidy"></ComponentPicker>
          </div>
          <!-- 学校查询补贴新增加时间段 -->
          <div class="input-wrapper" v-if="areaCode === '511600'">
            <label for="" class="label">时间段</label>
            <ComponentPicker
              placeholder="请选择时间段"
              idName="time"
              :range="timeRange"
              rangeKey="name"
              valueKey="value"
              v-model="schoolTime"></ComponentPicker>
          </div>
        </block>
        <div class="button-wrapper">
          <ComponentButton
            type="primary"
            name="查询"
            height="68rpx"
            fontSize="28rpx"
            @click="handleQuery"></ComponentButton>
        </div>
      </div>
      <div class="query-result">
        <block v-if="queryResultList.length > 0">
          <div class="subsidy-item" v-for="(item, index) in queryResultList" :key="item.id">
            <div class="subsidy-name">
              <div class="iconimg iconimg-subsidy"></div>
              <div class="subsidy-name-text">{{ item.chi031_desc }}</div>
            </div>
            <div class="subsidy-con">
              <div class="cell">
                <div class="key">业务状态：</div>
                <div class="value tag">
                  <span>{{ item.chb01e_desc }}</span>
                </div>
              </div>
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
              <div class="cell" v-if="item.aae010 && areaCode !== '510100'">
                <div class="key">银行卡号：</div>
                <div class="value">
                  <span>{{ item.aae010 }}</span>
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
              <div class="cell" v-if="areaCode !== '510500'">
                <div class="key">经办时间：</div>
                <div class="value">
                  <span>{{ item.aae036 }}</span>
                </div>
              </div>
              <div class="cell">
                <div class="key">经办部门：</div>
                <div class="value">
                  <span>{{ item.chi037_desc }}</span>
                </div>
              </div>
              <div class="cell" v-if="item.chb204 && areaCode !== '510500'">
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
              <div class="cell" v-if="item.chb01e === '11' && areaCode === '513400'">
                <div class="key">失败原因：</div>
                <div class="value">
                  <span>{{ item.chb203 }}</span>
                </div>
              </div>
            </div>
            <div class="btn-wrapper" v-if="areaCode != '510100'">
              <div class="btn" @click.stop="handleViewProcess(index)">
                <span>查询发放进度</span>
                <i class="iconfont iconfont-arrow-right-double"></i>
              </div>
            </div>
          </div>
        </block>
        <block v-else>
          <ComponentNoData v-if="isInquired" tip="未查询到相关补贴发放数据"></ComponentNoData>
        </block>
        <div class="load-more-wrapper" v-if="isExceedLimit && queryResultList.length > 0">
          <ComponentLoadMore :isOver="isLoadOver" @click="handleClickLoadMore"></ComponentLoadMore>
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

  import { getDate } from '@/utils/get'
  import { showModal, navigateTo } from '@/utils/uni-api'
  import {
    requestFFGetChi037List,
    requestFFGetChi031ListByChi037,
    requestFFGetStageTreatment,
    requestFFGetVillageDetailInfo,
    requestFFGetSchoolDetailInfo
  } from '@/service/api'
  import { checkIDCard } from '@/utils/check'
  import { USER_INFO, M_UPDATE_SUBSIDY_PROJECT_AUDIT_CHANNEL } from '@/store/constants/index.js'
  import { useTMUserName, useTMIDCard } from '@/hooks'
  import config from '@/config'
  import { useGetUserInfoH5 } from '@/mixins'
  const { areaCode, isOpenSchoolQuery, isOpenVillageQuery, isOpenPersonQuery } = config

  export default {
    name: 'pageQueryPublicity',
    mixins: [useGetUserInfoH5],
    data() {
      return {
        years: '', // 个人查询 年度
        yearsDesc: '', // 个人查询 年度
        type: '1', // 查询类型 1 个人 2 村组 3 学校
        keywordUserName: '', // 查询关键字 姓名
        keywordIdCard: '', // 查询关键字 身份证号

        // 个人查询脱敏后的身份证号和姓名
        personalQuery: {
          disabledName: false,
          disabledIdcard: false,
          hideName: '',
          hideIdcard: ''
        },
        queryResultList: [], // 查询结果列表
        isInquired: false, // 是否已查询
        time: '', // 时间段
        schoolTime: '', //学校补贴查询时间
        timeRange: [], // 时间段选择 下拉选
        unit: '', // 主管单位
        unitRange: [], // 主管单位选择 下拉选
        schoolUnitRange: [], // 学校补贴主管单位选择
        subsidy: '', // 补贴项目
        subsidyRange: [], // 补贴项目选择 下拉选
        address: '', // 地区
        addressInfo: {}, // 地区选择
        pageNo: 1, // 查询页数
        pageLimit: 5, // 每页数据条数
        isExceedLimit: false, // 加载条数是否超出限制
        isLoadOver: true, // 是否加载完成
        today_y: getDate('year'),
        _isOpenSchoolQuery: false, // 是否开启学校补贴查询
        _isOpenVillageQuery: false, // 是否开启村组查询
        _isOpenPersonQuery: false, // 是否开启个人查询
        queryCount: 0, // 查询开启个数
        areaCode
      }
    },
    components: {
      ComponentButton,
      ComponentNoData,
      ComponentLoadMore,
      ComponentPicker
    },

    onLoad(e) {
      const { isFromProcess } = e
      this._isOpenSchoolQuery = isOpenSchoolQuery || false
      this._isOpenVillageQuery = isOpenVillageQuery || false
      this._isOpenPersonQuery = isOpenPersonQuery || false
      if (this._isOpenSchoolQuery) {
        this.queryCount++
      }
      if (this._isOpenVillageQuery) {
        this.queryCount++
      }
      if (this._isOpenPersonQuery) {
        this.queryCount++
      }
      if (isFromProcess) {
        const { idCard, userName } = this.userInfo
        this.keywordUserName = userName
        this.keywordIdCard = idCard
        this.handleQueryPersonal()
      }
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
      // 设置默认信息 用于演示
      setDefaultData() {
        const { idCard, userName } = this.userInfo
        // 杨忠 510124199111053218 身份证号设置默认查询条件
        // if (idCard == '510124199111053218') {
        //   this.keywordUserName = '饶雨'
        //   this.keywordIdCard = '511011200402225445'
        // }

        // 杨钰宁 511002198812031225 身份证号设置默认查询条件
        // if (idCard == '511002198812031225') {
        //   this.keywordUserName = '熊宇婷'
        //   this.keywordIdCard = '511011200312172546'
        //   this.years = '2022'
        //   this.yearsDesc = '2022'
        // }

        // 凉山
        if (areaCode == '513400' && idCard) {
          this.keywordUserName = userName
          this.keywordIdCard = idCard
        }

        // 用户登录的姓名进行脱敏
        if (userName) {
          this.keywordUserName = userName
          this.personalQuery.hideName = useTMUserName(userName)
        }
        // 用户登录的身份证号进行脱敏
        if (idCard) {
          this.keywordIdCard = idCard
          this.personalQuery.hideIdcard = useTMIDCard(idCard)
        }

        // 遂宁｜成都｜攀枝花｜雅安不能修改
        if (areaCode == '510900' || areaCode == '510100' || areaCode == '510400' || areaCode == '511800') {
          this.personalQuery.disabledName = true
          this.personalQuery.disabledIdcard = true
        }

        // 内江杜盼登录展示
        if (idCard == '511526199912254218' || idCard == '511325199604210056' || idCard == '510124199111053218') {
          this.personalQuery.hideName = '李书火'
          this.personalQuery.hideIdcard = '511021194503076770'
          this.keywordUserName = '李书火'
          this.keywordIdCard = '511021194503076770'
        }
      },
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
            // 学校补贴主管单位目前只要教育局
            this.schoolUnitRange = this.unitRange.filter((item) => item.id == '7')
          }
        })
      },

      // 获取某单位补贴项目
      getSubsidyRange(chi037) {
        requestFFGetChi031ListByChi037(chi037, this.type === '3' ? '1' : '').then((res) => {
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

        this.timeRange = [...newTimeRange]
      },

      // picker change
      handleChangePicker(id, value) {
        if (id === 'address') {
          if (this.type === '2') {
            const chb015Obj = value[0] || {}
            const chb017Obj = value[1] || {}
            const chb018Obj = value[2] || {}
            this.addressInfo = {
              chb015: chb015Obj.orgid,
              chb017: chb017Obj.orgid,
              chb018: chb018Obj.orgid
            }
            //攀枝花地址特殊处理
            if (this.areaCode === '510400') {
              const chb019Obj = value[3] || {}
              this.addressInfo.chb019 = chb019Obj.orgid
            }
          } else if (this.type === '3' && value.length >= 2) {
            const chb015Obj = value[1] || null
            const chb018Obj = value[2] || null
            this.addressInfo = {
              orgid: chb018Obj ? chb018Obj.orgid : chb015Obj ? chb015Obj.orgid : '',
              che015: chb015Obj ? '3' : '4'
            }
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
        this.address = ''
        this.subsidy = ''
        this.unit = ''
        if (type == '3') {
          this.$store.commit(M_UPDATE_SUBSIDY_PROJECT_AUDIT_CHANNEL, '2')
        } else {
          this.$store.commit(M_UPDATE_SUBSIDY_PROJECT_AUDIT_CHANNEL, '')
        }
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
          const { chb018, chb015 } = this.addressInfo
          if (!unit) {
            showModal('请选择主管单位')
            return false
          }
          if (!subsidy) {
            showModal('请选择补贴项目')
            return false
          }

          if (!chb015) {
            showModal('请选择地址')
            return false
          } else {
            if (!chb018) {
              showModal('请重新选择一个包含村社的完整地址')
              return false
            }
          }
          return true
        }
        if (type === '3') {
          const unit = this.unit
          const subsidy = this.subsidy
          const address = this.address
          if (!address) {
            showModal('请选择地址')
            return false
          }
          if (!unit) {
            showModal('请选择主管单位')
            return false
          }
          if (!subsidy) {
            showModal('请选择补贴项目')
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
        if (type === '3') {
          this.handleQuerySchool()
        }
      },

      // 查询 个人补贴
      handleQueryPersonal() {
        const keywordUserName = this.keywordUserName
        const keywordIdCard = this.keywordIdCard
        const year = this.years
        const pageLimit = this.pageLimit
        const pageNo = this.pageNo

        requestFFGetStageTreatment(keywordIdCard, keywordUserName, '', year, pageNo, pageLimit)
          .then((res) => {
            const { list } = res
            if (res && list) {
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

      // 查询 村组补贴
      handleQueryVillage() {
        const pageLimit = this.pageLimit
        const pageNo = this.pageNo
        const timeRange = this.timeRange
        const time = this.time
        const subsidy = this.subsidy
        const { chb018, chb019 } = this.addressInfo
        const { chb017 } = this.userInfo
        let start_time = ''
        let end_time = ''

        timeRange.map((item) => {
          if (item.value === time) {
            start_time = item.start_time
            end_time = item.end_time
          }
        })

        //攀枝花市项目补贴查询地址特殊处理
        requestFFGetVillageDetailInfo(
          '',
          '',
          '',
          chb017,
          this.areaCode === '510400' ? chb019 : chb018,
          subsidy,
          start_time,
          end_time,
          pageNo,
          pageLimit
        )
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

      // 查询学校补贴
      handleQuerySchool() {
        const pageLimit = this.pageLimit
        const pageNo = this.pageNo
        const timeRange = this.timeRange
        const time = this.schoolTime
        const subsidy = this.subsidy
        const { orgid, che015 } = this.addressInfo

        let start_time = ''
        let end_time = ''

        timeRange.map((item) => {
          if (item.value === time) {
            start_time = item.start_time
            end_time = item.end_time
          }
        })

        requestFFGetSchoolDetailInfo(orgid, che015, subsidy, start_time, end_time, pageNo, pageLimit)
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
    computed: {
      ...mapGetters([USER_INFO])
    },
    watch: {
      unit: {
        handler(val) {
          // 切换tab会清空选项，当val不为空时才调用
          val && this.getSubsidyRange(val)
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
  }
</style>
