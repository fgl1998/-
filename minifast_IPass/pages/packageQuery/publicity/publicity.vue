<template>
  <div class="publicity h5-page">
    <ComponentPanel title="阳光申报公示" buttonText="重置" @click="handleResetSelectData">
      <div class="panel-content">
        <div class="from">
          <div class="input-wrapper">
            <label for="" class="label">区/县</label>
            <ComponentPicker
              placeholder="请选择区/县"
              :range="districtRange"
              rangeKey="orgname"
              valueKey="orgid"
              v-model="district"
              idName="district"
              @change="handlePickerChange"
              :renderValue="districtDesc"></ComponentPicker>
          </div>
          <div
            class="input-wrapper"
            v-if="
              district && userInfo.idCard == '511002198812031225' ? true : townRange.length > 0
            ">
            <label for="" class="label">乡镇/街道</label>
            <ComponentPicker
              placeholder="请选择乡镇/街道"
              :range="townRange"
              rangeKey="orgname"
              valueKey="orgid"
              v-model="town"
              idName="town"
              @change="handlePickerChange"
              :renderValue="townDesc"></ComponentPicker>
          </div>
          <div class="input-wrapper" v-if="town && villageRange.length > 0">
            <label for="" class="label">村/社区</label>
            <ComponentPicker
              placeholder="请选择村/社区"
              :range="villageRange"
              rangeKey="orgname"
              valueKey="orgid"
              v-model="village"
              idName="village"
              @change="handlePickerChange"></ComponentPicker>
          </div>
          <div class="input-wrapper">
            <label for="" class="label">补贴项目</label>
            <ComponentPicker
              placeholder="请选择补贴项目"
              :range="subsidyRange"
              rangeKey="name"
              valueKey="id"
              v-model="subsidy"
              :renderValue="subsidyDesc"></ComponentPicker>
          </div>
          <div class="button-wrapper">
            <ComponentButton
              type="primary"
              height="68rpx"
              @click="handleQueryData('')"
              name="查询"></ComponentButton>
          </div>
        </div>

        <div class="query-result">
          <block v-if="queryResultList.length > 0">
            <div class="subsidy-item" v-for="(item, index) in queryResultList" :key="item.id">
              <div class="subsidy-name">
                <div class="iconimg iconimg-subsidy"></div>
                <div class="subsidy-name-text">{{ item.name }}</div>
              </div>
              <div class="subsidy-con">
                <block v-for="(itemCell, indexCell) in item.list" :key="itemCell.id">
                  <div class="cell">
                    <div class="key">{{ itemCell.key }}：</div>
                    <div class="value">{{ itemCell.value }}</div>
                  </div>
                </block>
              </div>
              <div class="btn-wrapper">
                <div class="btn" @click.stop="handleViewDetail(index)">
                  <span>查看详情</span>
                  <i class="iconfont iconfont-arrow-right-double"></i>
                </div>
              </div>
            </div>
          </block>
          <block v-else>
            <ComponentNoData v-if="isInquired" tip="未查询到相关数据"></ComponentNoData>
          </block>
          <div class="load-more-wrapper" v-if="isExceedLimit">
            <ComponentLoadMore
              :isOver="isLoadOver"
              @click="handleClickLoadMore"></ComponentLoadMore>
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
import { navigateTo } from '@/utils/uni-api'
import {
  requestSPQueryChi031,
  requestSPQueryPublicTitle,
  requestSPGetOrgListByOrgId,
} from '@/service/api'
import { USER_INFO } from '@/store/constants' // 常量
import { mapGetters } from 'vuex'
export default {
  name: 'pagePublicity',
  data() {
    return {
      district: '',
      districtDesc: '',
      districtOrglevel: '',
      districtRange: [], // 区县渲染数据
      town: '',
      townDesc: '',
      townOrglevel: '',
      townRange: [], // 乡镇渲染数据
      village: '',
      villageOrglevel: '',
      villageRange: [], // 村渲染数据
      subsidy: '',
      subsidyDesc: '',
      subsidyRange: [], // 区县渲染数据
      queryResultList: [], // 查询结果列表
      isInquired: false, // 是否已查询
      pageNo: 1, // 查询页数
      pageLimit: 5, // 每页数据条数
      isExceedLimit: false, // 加载条数是否超出限制
      isLoadOver: true, // 是否加载完成
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentPicker,
    ComponentNoData,
    ComponentLoadMore,
  },
  onLoad(e) {
    const { SPAddressRequestParams, areaCode } = config
    if (SPAddressRequestParams) {
      this.districtOrglevel = SPAddressRequestParams.orglevel
      this.requestAddressData(SPAddressRequestParams.orgid, SPAddressRequestParams.orglevel)
    }
    this.setDefaultData()
    this.getSubsidyRange()
  },
  methods: {
    // 设置默认信息 用于演示
    setDefaultData() {
      const { idCard } = this.userInfo
      if (idCard == '511002198812031225') {
        this.district = '165003'
        this.districtDesc = '东兴区'
        this.town = '165122'
        this.townDesc = '西林街道'
        this.subsidy = '20008'
        this.subsidyDesc = '雨露计划'
      }
    },
    // 重置筛选数据
    handleResetSelectData() {
      this.district = ''
      this.town = ''
      this.village = ''
      this.subsidy = ''
      this.queryResultList = []
      this.pageNo = 1
      this.isExceedLimit = false
      this.isLoadOver = true
      this.isInquired = false
    },
    // 请求地区选择数据
    requestAddressData(orgid, orglevel) {
      const { areaCode } = config
      const { aac021Arr = [] } = this.userInfo
      const param = {
        orgid,
        orglevel,
      }
      requestSPGetOrgListByOrgId(param).then((res) => {
        const districtOrglevel = this.districtOrglevel
        const townOrglevel = this.townOrglevel
        const villageOrglevel = this.villageOrglevel
        let { list } = res.lists.orgList
        if (list) {
          let arr = [{ orgname: '全部', orgid: '0', orglevel: '0' }]
          let tempArr = []

          for (let i = 0, len = list.length; i < len; i++) {
            const item = list[i]
            if (orglevel === districtOrglevel) {
              if (item.orgname === aac021Arr[0]) {
                tempArr.push(item)
                if (areaCode == '511100') {
                  this.handleQueryData(item.orgid)
                }
                break
              }
            }
            if (orglevel === townOrglevel) {
              if (item.orgname === aac021Arr[1]) {
                tempArr.push(item)
                break
              }
            }
            if (orglevel === villageOrglevel) {
              if (item.orgname === aac021Arr[2]) {
                tempArr.push(item)
                break
              }
            }
          }

          if (orglevel === districtOrglevel) {
            if (areaCode === '511100') {
              this.districtRange = [...tempArr]
            } else {
              this.districtRange = [...arr, ...list]
            }
          }
          if (orglevel === townOrglevel) {
            if (areaCode === '511100') {
              this.townRange = [...tempArr]
            } else {
              this.townRange = [...arr, ...list]
            }
          }
          if (orglevel === villageOrglevel) {
            if (areaCode === '511100') {
              this.villageRange = [...tempArr]
            } else {
              this.villageRange = [...arr, ...list]
            }
          }
        }
      })
    },
    // 获取补贴项目数据
    getSubsidyRange() {
      requestSPQueryChi031().then((res) => {
        const { list } = res.lists.chi031List
        if (list) {
          this.subsidyRange = [...list]
        }
      })
    },
    // 捕获 change
    handlePickerChange(id, val) {
      if (id === 'district') {
        console.log(id, val, 987)
        this.town = ''
        this.townRange = []
        this.village = ''
        this.villageRange = []
        this.queryResultList = []
        this.pageNo = 1
        this.isExceedLimit = false
        this.isLoadOver = true
        this.isInquired = false

        const districtRange = this.districtRange
        let orglevel = ''
        for (let i = 0, len = districtRange.length; i < len; i++) {
          const item = districtRange[i]
          if (val === item.orgid) {
            orglevel = Number(item.orglevel) + 1 + ''
            break
          }
        }
        this.townOrglevel = orglevel
        // 选择全部不在加载数据
        if (val != '0') {
          this.requestAddressData(val, orglevel)
        }
      }
      if (id === 'town') {
        this.village = ''
        this.villageRange = []
        this.queryResultList = []
        this.pageNo = 1
        this.isExceedLimit = false
        this.isLoadOver = true
        this.isInquired = false

        const townRange = this.townRange
        let orglevel = ''
        for (let i = 0, len = townRange.length; i < len; i++) {
          const item = townRange[i]
          if (val === item.orgid) {
            orglevel = Number(item.orglevel) + 1 + ''
            break
          }
        }
        this.villageOrglevel = orglevel
        this.requestAddressData(val, orglevel)
      }
    },
    // 查询数据
    handleQueryData(orgid = '') {
      const district = this.district || orgid
      const town = this.town
      const village = this.village
      const subsidy = this.subsidy
      const pageNo = this.pageNo
      const pageLimit = this.pageLimit

      requestSPQueryPublicTitle(
        subsidy,
        district == '0' ? '' : district,
        town == '0' ? '' : town,
        village == '0' ? '' : village,
        pageNo,
        pageLimit
      )
        .then((res) => {
          const { list } = res.lists.hb57List
          if (res && list) {
            list.map((item) => {
              item.name = item.chb57e || '无'
              item.list = [
                {
                  id: 'city',
                  key: '市（州）',
                  value: item.aab301_name || '无',
                },
                {
                  id: 'district',
                  key: '区（县）',
                  value: item.chb015_name || '无',
                },
                {
                  id: 'name',
                  key: '标题',
                  value: item.chb57e || '无',
                },
                {
                  id: 'date',
                  key: '日期',
                  value: item.chb578.substring(0, 10) || '无',
                },
                {
                  id: 'num',
                  key: '查看次数',
                  value: item.chb57f || '0',
                },
                {
                  id: 'allNum',
                  key: '总人数',
                  value: item.chb572 || '0',
                },
              ]
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
    },
    // 查看详情
    handleViewDetail(index) {
      const queryResultList = [...this.queryResultList]
      for (let i = 0, len = queryResultList.length; i < len; i++) {
        const item = queryResultList[index]
        if (i === index) {
          const { cpb100, chi031, chi032 } = item
          item.list[item.list.length - 1].value = Number(item.list[item.list.length - 1].value) + 1
          this.queryResultList = [...queryResultList]
          navigateTo('publicity', 'packageDetails', { cpb100, chi031, chi032 })
          break
        }
      }
    },
  },
  computed: { ...mapGetters([USER_INFO]) },
  watch: {
    subsidy() {
      this.queryResultList = []
      this.pageNo = 1
      this.isExceedLimit = false
      this.isLoadOver = true
      this.isInquired = false
    },
  },
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
</style>
