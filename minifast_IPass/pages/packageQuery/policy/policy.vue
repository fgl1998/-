<template>
  <div class="query-policy h5-page">
    <div class="toolbar d-f ai-c">
      <div class="input-container f-1 d-f ai-c">
        <div class="range d-f ai-c" @click="openPopup">
          <span v-if="tabIdActive === 'all'">全部</span>
          <span v-else>{{ tabValue === '' ? '条件' : tabValue }}</span>
          <div class="img-wrapper">
            <ComponentImg :path="images.select" height="10rpx" width="14rpx"></ComponentImg>
          </div>
        </div>
        <input
          class="f-1"
          type="text"
          placeholder="请输入关键字"
          confirm-type="search"
          @confirm="handleSearch"
          @blur="handleInputBlur"
          @focus="handleInputFocus"
          :focus="focus"
          placeholder-style="color: #fff;"
          v-model="keyword" />
      </div>
      <div class="search-btn d-f ai-c" @click="handleSearch">
        <ComponentImg :path="images.search" width="28rpx" height="28rpx"></ComponentImg>
        <div class="text">搜索</div>
      </div>
    </div>
    <div class="scroll-wrapper">
      <scroll-view scroll-y class="scroll-view" :enable-back-to-top="true">
        <div class="content">
          <!-- 历史搜索记录 -->
          <block v-if="!isShowSearchResult">
            <div class="search-history" v-if="searchHistory.length > 0">
              <div class="title-wrapper d-f ai-c jc-sb">
                <span>搜索历史</span>
                <div class="img-wrapper" @click="handleClearRecord">
                  <ComponentImg :path="images.delete" height="32rpx" width="28rpx"></ComponentImg>
                </div>
              </div>
              <div class="tag-wrapper d-f ai-c fw-w">
                <block v-for="(item, index) in searchHistory" :key="index">
                  <div class="item" @click="handleClickHistoryItem(index)">
                    {{ item }}
                  </div>
                </block>
              </div>
            </div>
          </block>

          <!-- 搜索结果内容 -->
          <div class="search-content" v-if="isShowSearchResult">
            <!-- 政策 -->
            <ComponentPanel title="政策" v-if="policyDocumentList.length > 0">
              <ComponentPolicyDoc
                :renderData="item"
                v-for="item in policyDocumentList"
                :key="item.chi050"></ComponentPolicyDoc>
              <div class="button-wrapper" v-if="isExceedLimit">
                <ComponentLoadMore
                  :isOver="isLoadOver"
                  height="76rpx"
                  name="加载更多"
                  type="primary"
                  bgc="#ffffff"
                  @click="handleClickLoadMore"></ComponentLoadMore>
              </div>
            </ComponentPanel>
            <block v-else>
              <ComponentNoData tip="未查询到相关政策文件" v-if="isRequestOver"></ComponentNoData>
            </block>
          </div>
        </div>
      </scroll-view>
    </div>
    <!-- 搜索范围选择弹窗 -->
    <ComponentPopup type="bottom" ref="popup">
      <div class="popup-content">
        <div class="title-wrapper">
          <span>选择搜索分类</span>
        </div>
        <div class="tabs d-f ai-c jc-sb">
          <block v-for="item in tabs" :key="item.id">
            <div
              class="item d-f ai-c jc-c"
              :class="[item.id === tabIdActive ? 'active' : '']"
              @click="handleClickTab(item.id)">
              <span>{{ item.name }}</span>
            </div>
          </block>
        </div>
        <div class="tab-content-wrapper">
          <div class="tab-content d-f ai-c fw-w" v-if="tabIdActive !== 'all'">
            <block v-if="tabIdActive === 'area'">
              <block v-for="item in area" :key="item.id">
                <div
                  class="item d-f ai-c jc-c"
                  :class="[item.checked ? 'active' : '']"
                  @click="handleSelectRange(item.id)">
                  <span>{{ item.name }}</span>
                </div>
              </block>
            </block>
            <block v-if="tabIdActive === 'department'">
              <block v-for="item in department" :key="item.id">
                <div
                  class="item d-f ai-c jc-c"
                  :class="[item.checked ? 'active' : '']"
                  @click="handleSelectRange(item.id)">
                  <span>{{ item.name }}</span>
                </div>
              </block>
            </block>
          </div>
        </div>

        <div class="button-wrapper">
          <ComponentButton height="68rpx" name="查找政策" type="primary" @click="handleClickQuery"></ComponentButton>
        </div>
      </div>
    </ComponentPopup>
  </div>
</template>
<script>
  const SEARCH_HISTORY = 'SEARCH_HISTORY'

  import imageSearch from './images/search.png'
  import imageSelect from './images/select.png'
  import imageDelete from './images/delete.png'

  import ComponentImg from '@/components/common/ez-img/ez-img.vue'
  import ComponentPopup from '@/components/common/ez-popup/ez-popup.vue'
  import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
  import ComponentButton from '@/components/common/ez-button/ez-button.vue'
  import ComponentLoadMore from '@/components/common/ez-load-more/ez-load-more.vue'
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
  import ComponentPolicyDoc from '@/components/project/ez-policy-doc/ez-policy-doc.vue'

  import config from '@/config'

  import { getStorage, removeStorage, setStorage, showToast } from '@/utils/uni-api' // 封装过后的api，推荐使用。方便以后统一修改，便于维护。
  import {
    requestSPGetHi05List,
    requestFFGetPolicyFileList,
    requestFFGetChi037ListForPolicyFile,
    requestFFGetOrgNextLevelList,
    requestSPGetOrgListByOrgId,
    requestB097
  } from '@/service/api'
  import { previewPDF } from '@/utils/custom-api'
  import { useGetUserInfoH5 } from '@/mixins'
  import { USER_INFO, USER_LIST } from '@/store/constants' // 常量
  import { mapGetters } from 'vuex'
  export default {
    name: 'pageQueryPolicy',
    mixins: [useGetUserInfoH5],
    data() {
      return {
        // 本地图片
        images: {
          search: {
            src: '',
            httpSrc: imageSearch
          },
          select: {
            src: '',
            httpSrc: imageSelect
          },
          delete: {
            src: '',
            httpSrc: imageDelete
          }
        },
        keyword: '', // 搜索关键词
        focus: false, // 搜索输入框是否自动聚焦
        policyDocumentList: [], // 政策文件 list
        // 搜索历史
        searchHistory: [],
        // 弹窗 当前显示tab id 其id对应tabs每项中的id
        tabIdActive: 'all',
        tabValue: '',
        // 弹窗 tab 数据
        tabs: [
          {
            id: 'all',
            name: '全部',
            isSelect: false
          },
          {
            id: 'area',
            name: '地区选择',
            isSelect: true
          },
          {
            id: 'department',
            name: '部门',
            isSelect: true
          }
        ],

        // 弹窗 地区选择 数据
        area: [],
        // 弹窗 地区选择 选中地区的 id 组成的数组
        areaList: [],

        // 弹窗 部门选择 数据
        department: [],
        // 弹窗 部门选择 选中部门的 id 组成的数组
        departmentList: [],
        //部门默认值
        defaultChi037: '',

        // 搜索结果显示控制
        isShowSearchResult: false,

        isRequestOver: false, // 是否请求完成
        isLoadOver: false, // 是否加载完
        isExceedLimit: false, // 是否超出条数限制
        pageNo: 1, // 查询页数
        pageLimit: 10, // 查询条数

        isReady: false // onReady是否执行完成 解决h5端blur事件会先执行bug
      }
    },
    components: {
      ComponentImg,
      ComponentPopup,
      ComponentButton,
      ComponentNoData,
      ComponentLoadMore,
      ComponentPolicyDoc,
      ComponentPanel
    },
    onLoad(e) {
      let { chi037, focus, q } = e
      const param = {}
      // 手机扫码
      if (q) {
        const url = decodeURIComponent(q)
        const queryString = url.substring(url.indexOf('?') + 1)
        const queryStringArray = queryString.split('&')

        for (var i = 0, len = queryStringArray.length; i < len; i++) {
          const item = queryStringArray[i]
          const item_arr = item.split('=')
          const item_key = item_arr[0]
          const item_val = item_arr[1]
          param[item_key] = item_val
        }

        chi037 = param.chi037
      }
      if (chi037) {
        this.defaultChi037 = chi037
        this.departmentList.push(chi037)
      }
      if (focus && focus === '1') {
        this.focus = true
      }
    },
    onReady() {
      this.getDistrictRange() // 查询区县
      this.requestGetChi037ListForPolicyFile() // 查询部门
      this.requestGetPolicyFileList() // 查询最近政策文件列表
      this.isReady = true
    },
    onShow() {
      // 获取搜索历史记录
      getStorage(SEARCH_HISTORY).then((res) => {
        const data = JSON.parse(res) || []
        this.searchHistory = [...data]
      })
    },
    methods: {
      // 打开弹窗
      openPopup() {
        //如果是扫码进入，存在默认值，则第一次点击打开弹窗时不清空,点击之后清空默认值
        if (!this.defaultChi037) {
          this.clearSearchContent()
        }
        this.defaultChi037 = ''
        this.$refs['popup'].open()
      },
      // 关闭弹窗
      closePopup() {
        this.$refs['popup'].close()
      },
      // 处理返回的数据
      handleLoadMoreData(list) {
        const pageNo = this.pageNo
        const pageLimit = this.pageLimit

        if (list) {
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
            this.policyDocumentList = [...list]
          } else {
            // 加载更多

            // 加载完成
            if (len < pageLimit) {
              this.isLoadOver = true
            } else {
              // 加未载完成 还有文件待加载
              this.isLoadOver = false
            }
            this.policyDocumentList = [...this.policyDocumentList, ...list]
          }
        } else {
          this.isLoadOver = true
          if (pageNo < 2) {
            this.policyDocumentList = []
          } else {
            this.policyDocumentList = [...this.policyDocumentList]
          }
        }
      },
      // 请求 查询最近政策文件列表
      requestGetPolicyFileList() {
        const { isRequestYGFF, areaCode } = config

        const pageNo = this.pageNo
        const pageLimit = this.pageLimit
        const keyword = this.keyword
        const chi037 = this.departmentList.join(',')
        let yab003 = this.areaList.join(',')

        // 达州地区筛选
        if (areaCode == '511700') {
          yab003 = '511700,511722'
        }
        if (isRequestYGFF) {
          requestFFGetPolicyFileList(keyword, chi037, '', yab003, pageNo, pageLimit)
            .then((res) => {
              let { list } = res
              if (res && list && list.length > 0) {
                this.handleLoadMoreData(list)
              }
            })
            .finally(() => {
              this.isShowSearchResult = true
              this.isRequestOver = true
            })
        } else {
          requestSPGetHi05List(keyword, chi037, '', yab003, pageNo, pageLimit)
            .then((res) => {
              let { list } = res.lists.hi05List
              if (res && list && list.length > 0) {
                this.handleLoadMoreData(list)
              }
            })
            .finally(() => {
              this.isShowSearchResult = true
              this.isRequestOver = true
            })
        }
      },
      // 请求 查询区县
      getDistrictRange() {
        const { isRequestYGFF } = config
        if (isRequestYGFF) {
          requestFFGetOrgNextLevelList().then((res) => {
            let { list } = res
            if (res && list && list.length > 0) {
              list.map((item) => {
                item.checked = false
                item.name = item.orgname
                item.id = item.yab003
              })
              this.area = [...list]
            }
          })
        } else {
          requestSPGetOrgListByOrgId().then((res) => {
            let { list } = res.lists.orgList
            if (res && list && list.length > 0) {
              list.map((item) => {
                item.checked = false
                item.name = item.orgname
                item.id = item.orgid
              })
              this.area = [...list]
            }
          })
        }
      },
      setDefaultDepartment() {
        //存在默认值，进行勾选
        if (this.defaultChi037) {
          this.tabIdActive = 'department'
          let arr = []
          const department = this.department
          department.map((item) => {
            item.checked = false
            if (item.id === this.defaultChi037) {
              item.checked = true
              this.tabValue = item.chi011
            }
            if (item.checked) {
              arr.push(item.id)
            }
          })
          this.department = [...department]
          this.departmentList = [...arr]
        }
      },
      // 请求 查询部门
      requestGetChi037ListForPolicyFile() {
        const { isRequestYGFF, areaCode } = config
        // 发放系统
        if (isRequestYGFF) {
          requestFFGetChi037ListForPolicyFile().then((res) => {
            let { list } = res
            if (res && list && list.length > 0) {
              list.map((item) => {
                item.checked = false
                item.name = item.chi037_desc
                item.id = item.chi037
              })
              this.department = [...list]
              //获取部门后立即设置扫码跳转默认值
              this.setDefaultDepartment()
            }
          })
        } else {
          requestB097().then((res) => {
            let { list } = res.lists.chi037List

            // 南充地区筛选
            if (res && list && list.length > 0 && areaCode == '511300') {
              list.map((item) => {
                if (item.chi037 == '全部业务局') {
                  item.chi011 = '全部业务局'
                  item.chi037 = ''
                }
                return item
              })
            }
            if (res && list && list.length > 0) {
              list.map((item) => {
                item.checked = false
                item.name = item.chi011
                item.id = item.chi037
              })
              this.department = [...list]
              this.setDefaultDepartment()
            }
          })
        }
      },
      handleInputFocus() {
        this.isShowSearchResult = false
      },
      handleInputBlur() {
        const keyword = this.keyword
        this.focus = false
        if (!keyword && this.isReady) {
          this.handleResetQueryInfo()
          this.requestGetPolicyFileList()
        } else {
          this.isShowSearchResult = true
        }
      },
      // 清除历史搜索记录
      handleClearRecord() {
        removeStorage(SEARCH_HISTORY).then((res) => {
          this.searchHistory = []
        })
      },
      // 点击 最近搜索 item
      handleClickHistoryItem(index) {
        const item = this.searchHistory[index]
        this.keyword = item
        this.handleSearch()
      },
      // 选择范围 触发 回调函数
      handleSelectRange(id) {
        const tabIdActive = this.tabIdActive
        const area = this.area
        const department = this.department

        // 地区选择
        if (tabIdActive === 'area') {
          let arr = []
          area.map((item) => {
            item.checked = false
            if (item.id === id) {
              item.checked = true
              this.tabValue = item.name
            }
            if (item.checked) {
              arr.push(item.id)
            }
          })
          this.area = [...area]
          this.areaList = [...arr]
        }
        // 部门选择
        if (tabIdActive === 'department') {
          let arr = []
          department.map((item) => {
            item.checked = false
            if (item.id === id) {
              item.checked = true
              this.tabValue = item.name
            }
            if (item.checked) {
              arr.push(item.id)
            }
          })
          this.department = [...department]
          this.departmentList = [...arr]
        }
      },
      // 清空搜索内容
      clearSearchContent() {
        const area = this.area
        const department = this.department
        this.keyword = ''
        area.map((item) => {
          item.checked = false
        })
        department.map((item) => {
          item.checked = false
        })
        this.areaList = []
        this.departmentList = []
        this.area = [...area]
        this.department = [...department]
      },
      // 点击 tab
      handleClickTab(id) {
        // 全部
        if (id === 'all') {
          this.clearSearchContent()
          this.tabValue = ''
        }
        this.tabIdActive = id
      },
      // 点击 发现政策 回调函数
      handleClickQuery() {
        this.handleResetQueryInfo('query')
        this.requestGetPolicyFileList()
        this.closePopup()
      },
      // 重置查询信息
      handleResetQueryInfo(resetType) {
        this.isLoadOver = false
        this.isRequestOver = false
        this.isShowSearchResult = false
        this.isExceedLimit = false
        this.pageNo = 1
        this.policyDocumentList = []

        if (resetType == 'keyword') {
          this.areaList = []
          this.departmentList = []
        } else if (resetType == 'query') {
          this.keyword = ''
        } else {
          this.areaList = []
          this.departmentList = []
          this.keyword = ''
        }
      },
      // 搜索 回调函数
      handleSearch(event, hasKeyWord = true) {
        const keyword = this.keyword
        let searchHistory = this.searchHistory
        if (!keyword && hasKeyWord) {
          showToast('搜索关键字不能为空')
          return
        }
        // 包含关键词搜索
        if (hasKeyWord) {
          this.handleResetQueryInfo('keyword')
          searchHistory.push(keyword)
          searchHistory = [...new Set([...searchHistory])]
          setStorage(SEARCH_HISTORY, JSON.stringify(searchHistory))
          this.searchHistory = [...searchHistory]
          this.requestGetPolicyFileList()
        } else {
          // 未包含关键词搜索
          this.requestGetPolicyFileList()
        }
      },
      // 点击查看政策
      handleClickPolicyFile(index) {
        const item = this.policyDocumentList[index]
        previewPDF(item.chi050)
      },
      // 加载更多
      handleClickLoadMore() {
        this.pageNo++
        this.handleSearch('', false)
      }
    },
    computed: {
      ...mapGetters([USER_INFO, USER_LIST])
    },
    watch: {
      keyword(val) {
        if (!val) {
          this.isShowSearchResult = false
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  $search-height: 128rpx;
  .query-policy {
    height: 100%;
    height: 100vh;
    overflow: hidden;
    .toolbar {
      width: 100%;
      height: $search-height;
      background-color: $primary;
      padding-left: 30rpx;
      position: relative;
      color: #fff;
      font-size: 28rpx;
      .input-container {
        height: $search-height / 2;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 100px;
        padding: 0 32rpx;
        .range {
          font-weight: 500;
          position: relative;
          &::after {
            content: '';
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            width: 2rpx;
            height: 24rpx;
            background-color: rgba(255, 255, 255, 0.3);
          }
          .img-wrapper {
            margin: 0 14px 0 10px;
          }
        }
        input {
          height: 100%;
          padding-left: 16rpx;
          color: inherit;
          font-size: 28rpx;
        }
      }
      .search-btn {
        padding-left: 32rpx;
        padding-right: 60rpx;
        font-weight: 500;
        line-height: $search-height;
        .text {
          padding-left: 12rpx;
        }
      }
    }

    .scroll-wrapper {
      flex: 1;
      overflow: hidden;
      .scroll-view {
        height: 100%;
        .content {
          padding: 30rpx 0;
        }
      }
    }

    .title-wrapper {
      padding: 0 32rpx;
      font-size: 32rpx;
      font-weight: 700;
      color: $color;
      span {
        position: relative;
        padding-left: 16rpx;
        &::before {
          content: '';
          position: absolute;
          width: 8rpx;
          height: 32rpx;
          left: 0;
          top: 50%;
          border-radius: 2rpx;
          background-color: $primary;
          transform: translateY(-50%);
        }
      }
      img {
        width: 28rpx;
        height: 32rpx;
      }
    }
    .search-history {
      .tag-wrapper {
        padding: 0 8rpx 0 32rpx;
        .item {
          height: 54rpx;
          background-color: #ebedf0;
          border-radius: 27px;
          padding: 14rpx 24rpx;
          font-size: 26rpx;
          margin-right: 12rpx;
          margin-top: 12rpx;
          color: $color;
          line-height: 1;
          font-weight: 500;
        }
      }
    }

    .search-content {
      padding: 0 $spacing;
    }
  }

  .popup-content {
    background-color: #fff;
    border-radius: 8rpx 8rpx 0 0;
    padding: 30rpx 0 50rpx;
    .tabs {
      padding: 32rpx 30rpx;
      .item {
        width: 200rpx;
        height: 64rpx;
        background-color: #ffffff;
        border-radius: 4rpx;
        border: solid 2rpx #e3e4e6;
        line-height: 60rpx;
        color: #5c5f66;
        font-size: 26rpx;
        font-weight: 500;
        transition: all 0.3s;
        .icon {
          margin-left: 8rpx;
          transition: all 0.3s;
        }
        &.active {
          color: $primary;
          border-color: $primary;
        }
      }
    }
    .tab-content-wrapper {
      padding: 0 30rpx;
    }
    .tab-content {
      width: 100%;
      padding: 24rpx 14rpx 8rpx;
      background-color: #f0f2f5;
      border-radius: 4rpx;
      .item {
        width: 180rpx;
        padding: 0 8rpx;
        margin-bottom: 24rpx;
        height: 68rpx;
        background-color: #fff;
        border-radius: 4rpx;
        margin-right: 60rpx;
        transition: all 0.3s;
        color: #5c5f66;
        span {
          font-size: 26rpx;
          line-height: 30rpx;
          @include textOverflow(2);
          max-height: 60rpx;
        }
        &:nth-of-type(3n) {
          margin-right: 0;
        }
        &.active {
          background-color: $primary;
          color: #fff;
        }
      }
    }
    .button-wrapper {
      padding: 62rpx 120rpx;
    }
  }
</style>
