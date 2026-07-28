<template>
  <view class="threeCapitalWx page-wrapper">
    <div class="switch-tabs d-f">
      <div
        v-for="(item, index) in tabs"
        :key="index"
        :class="['tab', activeTab === index ? 'active' : '']"
        @click="handleTabChange(index)">
        {{ item.name }}
      </div>
    </div>

    <div class="query-condition">
      <ComponentPanel title="查询条件">
        <div class="panel-content">
          <!-- <div class="query-item">
            <Picker
              :disabled="true"
              label="区县"
              idName="chb015"
              :range="rangeList.districtRange"
              rangeKey="unitname"
              valueKey="unitid"
              required
              :valueDesc="queryInfo.chb015Desc"
              placeholder="请选择区县"
              @change="handleDistrictChange"
            >
            </Picker>
          </div>
          <div class="query-item">
            <Picker
              :disabled="true"
              label="乡镇"
              idName="chb017"
              :range="rangeList.townRange"
              rangeKey="unitname"
              valueKey="unitid"
              required
              :valueDesc="queryInfo.chb017Desc"
              placeholder="请选择乡镇"
              @change="handleTownChange"
            >
            </Picker>
          </div>
          <div class="query-item">
            <Picker
              :disabled="true"
              label="村社"
              idName="chb018"
              :range="rangeList.villageRange"
              rangeKey="unitname"
              valueKey="unitid"
              required
              :valueDesc="queryInfo.chb018Desc"
              @change="handleVillageChange"
              placeholder="请选择村社"
            >
            </Picker>
          </div> -->
          <div class="query-item">
            <Picker
              label="单位"
              idName="chb019"
              rangeKey="unitname"
              valueKey="unitid"
              required
              :range="rangeList.unitRange"
              :valueDesc="queryInfo.chb019Desc"
              @change="handleUnitChange"
              placeholder="请选择单位">
            </Picker>
          </div>
          <div class="query-item">
            <Picker
              label="开始年月日"
              idName="startTime"
              mode="date"
              :required="true"
              :endTime="queryInfo.endTime"
              :valueDesc="queryInfo.startTimeDesc"
              @change="handleStarttimeChange"
              placeholder="请选择开始年月日">
            </Picker>
          </div>
          <div class="query-item">
            <Picker
              label="结束年月日"
              idName="endTime"
              mode="date"
              :required="true"
              :startTime="queryInfo.startTimeDesc"
              :valueDesc="queryInfo.endTimeDesc"
              placeholder="请选择结束年月日"
              @change="handleEndtimeChange">
            </Picker>
          </div>
          <div class="query-item" v-if="activeTab === 2">
            <Picker
              label="会计年度"
              idName="year"
              mode="date"
              :required="true"
              fields="year"
              :valueDesc="queryInfo.yearDesc"
              @change="handleYearChange"
              placeholder="请选择会计年度">
            </Picker>
          </div>
          <div class="button-wrapper d-f jc-c">
            <div class="btn query" @click="query">查询</div>
            <div class="btn reset" @click="reset">重置</div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <div class="query-result">
      <template v-if="activeTab === 0">
        <Resources
          :unitName="queryInfo.chb019Desc"
          :renderData="resourcesList"
          :isRequestOver="isRequestOver_Resources"
          :isExceedLimit="isExceedLimit_Resources"
          :isLoadOver="isLoadOver_Resources"
          :startTime="queryInfo.startTime"
          :endTime="queryInfo.endTime"
          @loadMore="loadMoreResources" />
      </template>
      <template v-if="activeTab === 1">
        <Property
          :renderData="propertyList"
          :isRequestOver="isRequestOver_property"
          :isExceedLimit="isExceedLimit_property"
          :isLoadOver="isLoadOver_property"
          :startTime="startTime"
          :endTime="endTime"
          @loadMore="loadMoreProproty" />
      </template>
      <template v-if="activeTab === 2">
        <Fund
          :opening="opening"
          :end="end"
          :incomeList="incomeList"
          :expenditureList="expenditureList"
          :startTime="queryInfo.startTime"
          :endTime="queryInfo.endTime"
          :isShowTotal="isShowTotal"
          :isRequestOver="isRequestOverFinancial" />
      </template>
    </div>
  </view>
</template>
<script>
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'

  import Fund from './Fund.vue'
  import Property from './PropertyResult.vue'
  import Resources from './ResourcesResult.vue'
  import Picker from './components/picker.vue'
  import { navigateBack, showModal } from '@/utils/uni-api'
  import {
    requestSZQueryAreaUnit,
    requestSZSelectZyResourcesList,
    requestSZGetAssetsList,
    requestSZFinancialDisclosure,
    requestSZUnitListByIdentity
  } from '@/service/api'
  import { USER_INFO } from '@/store/constants'
  import { mapGetters } from 'vuex'
  export default {
    name: 'ThreeCapitalWx',
    data() {
      return {
        //请求组织机构传入的year
        year: '2023',
        activeTab: 0,
        rangeList: {
          districtRange: [],
          townRange: [],
          villageRange: [],
          unitRange: []
        },
        disableTown: false,
        disableVillage: false,
        disableUnit: false,
        queryInfo: {
          chb015Desc: '',
          chb015: '',
          chb017Desc: '',
          chb017: '',
          chb018Desc: '',
          chb018: '',
          chb019Desc: '',
          chb019: '',
          startTimeDesc: '',
          startTime: '',
          endTimeDesc: '',
          endTime: '',
          yearDesc: '',
          year: ''
        },
        tabs: [
          {
            id: 0,
            name: '资源公开'
          },
          {
            id: 1,
            name: '资产公开'
          },
          {
            id: 2,
            name: '资金公开'
          }
        ],

        startTime: '',
        endTime: '',
        // 资产
        pageNo_property: 1, // 页数
        pageLmit_property: 3, // 每页条数限制
        isExceedLimit_property: false, // 数据是否超出 pageLmit 大小
        isLoadOver_property: true, // 数据是否加载完成
        isRequestOver_property: false,
        propertyList: [],
        isShowProperty: false,

        // 资源分页信息
        pageNo_Resources: 1, // 页数
        pageLmit_Resources: 3, // 每页条数限制
        isExceedLimit_Resources: false, // 数据是否超出 pageLmit 大小
        isLoadOver_Resources: true, // 数据是否加载完成
        isRequestOver_Resources: false,
        resourcesList: [],
        isShowResources: false,
        // 期初余额
        opening: {
          cash: 0.0,
          bank: 0.0
        },
        // 期末余额
        end: {
          cash: 0.0,
          bank: 0.0
        },
        incomeList: [], // 收入明细
        expenditureList: [], // 支出明细
        isShowTotal: false, // 是否显示资金数据
        isRequestOverFinancial: false // 资金数据是否加载完成
      }
    },
    components: {
      ComponentPanel,
      Fund,
      Property,
      Resources,
      Picker
    },
    // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
    onLoad(e) {
      // this.initQueryCondition()
      this.getUnitAddressList()
    },
    methods: {
      //pageInfo信息回归初态
      resetPageInfo() {
        this.pageNo_property = 1 // 页数
        this.pageLmit_property = 3 // 每页条数限制
        this.isExceedLimit_property = false // 数据是否超出 pageLmit 大小
        this.isLoadOver_property = true // 数据是否加载完成
        this.isRequestOver_property = false
        this.propertyList = []
        this.isShowProperty = false

        //资源分页信息
        this.pageNo_Resources = 1 // 页数
        this.pageLmit_Resources = 3 // 每页条数限制
        this.isExceedLimit_Resources = false // 数据是否超出 pageLmit 大小
        this.isLoadOver_Resources = true // 数据是否加载完成
        this.isRequestOver_Resources = false
        this.resourcesList = []
        this.isShowResource = false
      },
      // tab改变
      handleTabChange(index) {
        this.activeTab = index
        this.reset()
        this.resetPageInfo()
      },
      // 请求下一级地址
      requestOrgList(year, returnTop, parentId) {
        return new Promise((resolve, reject) => {
          requestSZQueryAreaUnit(year, returnTop, parentId)
            .then((res) => {
              const { data } = res
              if (data && data.length > 0) {
                resolve(data)
              }
            })
            .catch((err) => {
              reject(err)
            })
        })
      },
      async initQueryCondition() {
        this.rangeList.districtRange = await this.requestOrgList(this.year, 'false', '')
      },
      // 请求单位地址
      getUnitAddressList() {
        const { userName, idCard } = this.userInfo
        requestSZUnitListByIdentity(userName, idCard)
          .then((res) => {
            const data = res.data
            if (data && data.length > 0) {
              this.rangeList.unitRange = [...data]
            }
          })
          .catch((err) => {
            const { message } = err
            showModal(message ? message : '接口错误').then(() => {
              navigateBack()
            })
          })
      },
      async handleDistrictChange(e) {
        //解除不可写
        this.disableTown = true
        this.disableVillage = false
        this.disableUnit = false
        //清空数据
        this.queryInfo.chb017 = ''
        this.queryInfo.chb017Desc = ''
        this.queryInfo.chb018 = ''
        this.queryInfo.chb018Desc = ''
        this.queryInfo.chb019 = ''
        this.queryInfo.chb019Desc = ''
        const val = e.target.__args__[0]
        const { unitid, unitname } = val
        this.queryInfo.chb015Desc = unitname
        this.queryInfo.chb015 = unitid
        this.rangeList.townRange = await this.requestOrgList(this.year, '', unitid)
      },
      async handleTownChange(e) {
        //解除不可写
        this.disableVillage = true
        this.disableUnit = false
        //清空数据
        this.queryInfo.chb018 = ''
        this.queryInfo.chb018Desc = ''
        this.queryInfo.chb019 = ''
        this.queryInfo.chb019Desc = ''
        const val = e.target.__args__[0]
        const { unitname, unitid } = val
        this.queryInfo.chb017Desc = unitname
        this.queryInfo.chb017 = unitid
        this.rangeList.villageRange = await this.requestOrgList(this.year, '', unitid)
      },
      async handleVillageChange(e) {
        //解除不可写
        this.disableUnit = true
        //清空数据
        this.queryInfo.chb019 = ''
        this.queryInfo.chb019Desc = ''
        const val = e.target.__args__[0]
        const { unitname, unitid } = val
        this.queryInfo.chb018Desc = unitname
        this.queryInfo.chb018 = unitid
        this.rangeList.unitRange = await this.requestOrgList(this.year, '', unitid)
      },
      handleUnitChange(e) {
        const val = e.target.__args__[0]
        const { unitname, unitid } = val
        this.queryInfo.chb019Desc = unitname
        this.queryInfo.chb019 = unitid
      },
      handleStarttimeChange(e) {
        const val = e.target.__args__[0]
        this.queryInfo.startTimeDesc = val
        this.queryInfo.startTime = val
      },
      handleEndtimeChange(e) {
        const val = e.target.__args__[0]
        this.queryInfo.endTimeDesc = val
        this.queryInfo.endTime = val
      },
      handleYearChange(e) {
        const val = e.target.__args__[0]
        this.queryInfo.yearDesc = val
        this.queryInfo.year = val
      },
      handleCheckData() {
        const { startTime, endTime, chb015, chb017, chb018, chb019, year } = this.queryInfo
        // if (!chb015) {
        //   showModal('请选择区县')
        //   return false
        // }
        // if (!chb017) {
        //   showModal('请选择乡镇')
        //   return false
        // }
        // if (!chb018) {
        //   showModal('请选择村社')
        //   return false
        // }
        if (!chb019) {
          showModal('请选择单位')
          return false
        }
        //资源不用选开始结束日期
        // if (this.activeTab === 0) {
        //   return true
        // }
        if (!startTime) {
          showModal('请选择开始年月日')
          return false
        }
        if (!endTime) {
          showModal('请选择结束年月日')
          return false
        }
        //资源、资产不用选年度
        if (this.activeTab !== 2) {
          return true
        }
        if (!year) {
          showModal('请选择年度')
          return false
        }
        return true
      },
      query() {
        const result = this.handleCheckData()
        if (!result) {
          return
        }
        this.resetPageInfo()
        if (this.activeTab === 0) {
          this.queryResources()
        } else if (this.activeTab === 1) {
          this.queryProperty()
        } else if (this.activeTab === 2) {
          this.queryFinancial()
        }
      },
      reset() {
        Object.keys(this.queryInfo).forEach((key) => {
          this.queryInfo[key] = ''
        })
        this.disableTown = false
        this.disableVillage = false
        this.disableUnit = false
        this.isShowTotal = false
        this.isRequestOver_Resources = false
        this.isRequestOver_property = false
      },
      // 查询资产
      queryProperty() {
        const { chb019, startTime, endTime } = this.queryInfo
        this.startTime = startTime
        this.endTime = endTime
        const pageNo = this.pageNo_property
        const pageLmit = this.pageLmit_property
        requestSZGetAssetsList(chb019, startTime, endTime, pageNo, pageLmit)
          .then((res) => {
            const list = res.data.items
            if (res && list) {
              this.handleLoadMoreData_property(list)
            }
          })
          .finally(() => {
            this.isRequestOver_property = true
          })
      },
      queryResources() {
        const { chb019, startTime, endTime } = this.queryInfo
        const pageNo = this.pageNo_Resources
        const pageLmit = this.pageLmit_Resources
        const unitno = chb019
        requestSZSelectZyResourcesList(unitno, startTime, endTime, pageNo, pageLmit)
          .then((res) => {
            const items = res && res.data && res.data.items
            if (items && items.length > 0) {
              this.handleLoadMoreData_Resources(items)
            }
          })
          .finally(() => {
            this.isRequestOver_Resources = true
          })
      },
      // 查询资金数据
      queryFinancial() {
        const { chb019, startTime, endTime, year } = this.queryInfo
        requestSZFinancialDisclosure(chb019, startTime, endTime, year)
          .then((res) => {
            if (res.data) {
              const { bank, cash, incomeList, payList } = res.data
              this.opening.cash = cash.beginBalance
              this.opening.bank = bank.beginBalance
              this.end.cash = cash.endBalance
              this.end.bank = bank.endBalance
              incomeList && (this.incomeList = [...incomeList])
              payList && (this.expenditureList = [...payList])
              this.isShowTotal = true
            } else {
              this.isShowTotal = false
            }
            this.isRequestOverFinancial = true
          })
          .catch(() => {
            this.isShowTotal = false
          })
          .finally(() => {
            this.isRequestOverFinancial = true
          })
      },
      // 处理返回的数据
      handleLoadMoreData_property(list) {
        const pageNo = this.pageNo_property
        const pageLimit = this.pageLmit_property

        if (list) {
          const len = list.length
          // 第一次加载
          if (pageNo < 2) {
            // 加载完成
            if (len < pageLimit) {
              this.isLoadOver_property = true
            } else {
              // 加未载完成 还有文件待加载
              this.isLoadOver_property = false
              this.isExceedLimit_property = true
            }
            this.propertyList = [...list]
          } else {
            // 加载更多

            // 加载完成
            if (len < pageLimit) {
              this.isLoadOver_property = true
            } else {
              // 加未载完成 还有文件待加载
              this.isLoadOver_property = false
            }
            this.propertyList = [...this.propertyList, ...list]
          }
        } else {
          this.isLoadOver_property = true
          if (pageNo < 2) {
            this.propertyList = []
          } else {
            this.propertyList = [...this.propertyList]
          }
        }
      },
      // 加载更多
      loadMoreProproty() {
        this.pageNo_property++
        this.queryProperty()
      },
      handleLoadMoreData_Resources(list) {
        const pageNo = this.pageNo_Resources
        const pageLimit = this.pageLmit_Resources

        if (list) {
          const len = list.length
          // 第一次加载
          if (pageNo < 2) {
            // 加载完成
            if (len < pageLimit) {
              this.isLoadOver_Resources = true
            } else {
              // 加未载完成 还有文件待加载
              this.isLoadOver_Resources = false
              this.isExceedLimit_Resources = true
            }
            this.resourcesList = [...list]
          } else {
            // 加载更多

            // 加载完成
            if (len < pageLimit) {
              this.isLoadOver_Resources = true
            } else {
              // 加未载完成 还有文件待加载
              this.isLoadOver_Resources = false
            }
            this.resourcesList = [...this.resourcesList, ...list]
          }
        } else {
          this.isLoadOver_Resources = true
          if (pageNo < 2) {
            this.resourcesList = []
          } else {
            this.resourcesList = [...this.resourcesList]
          }
        }
      },
      // 加载更多
      loadMoreResources() {
        this.pageNo_Resources++
        this.queryResources()
      }
    },
    computed: {
      ...mapGetters([USER_INFO])
    }
  }
</script>
<style lang="scss" scoped>
  .threeCapitalWx {
    padding: 0 $spacing;

    .switch-tabs {
      background-color: #fff;
      width: 100%;
      margin: $spacing 0;
      border: 1px solid $primary;
      border-radius: 10rpx;

      .tab {
        width: 33.33%;
        height: 100%;
        line-height: 72rpx;
        font-size: 28rpx;
        text-align: center;
        color: $primary;
        &:nth-child(2) {
          border-left: 1px solid $primary;
          border-right: 1px solid $primary;
        }
      }

      .active {
        background-color: $primary;
        color: #fff;
      }
    }

    .query-condition {
      .button-wrapper {
        padding-top: $spacing;
        .btn {
          width: 220rpx;
          line-height: 72rpx;
          font-size: 26rpx;
          text-align: center;
          color: #423e3f;
          border: 1rpx solid #e8f1ff;
          border-radius: 12rpx;
        }

        .query {
          background-color: $primary;
          color: #fff;
          margin-right: 40rpx;
        }

        .btn:hover {
          opacity: 0.8;
        }
      }
    }

    .query-result {
      width: 100%;
      margin: $spacing 0;
    }
  }
</style>
