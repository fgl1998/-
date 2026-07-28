<template>
  <div class="epidemic-prevention-records">
    <Statistics
      :aka131_01_num="aka131_01_num"
      :aka131_02_num="aka131_02_num"
      :aka131_03_num="aka131_03_num"></Statistics>
    <div class="query-wrapper">
      <QueryCriteria :aka131Range="codeTableData.visitors" @query="handleQueryData"></QueryCriteria>
      <QueryResult
        :renderList="queryResultList"
        :isRequestOver="isRequestOver"
        :isLoadOver="isLoadOver"
        :isMultiplePages="isMultiplePages"
        @loadMore="loadMoreData"></QueryResult>
    </div>
  </div>
</template>
<script>
  import Statistics from './Statistics.vue'
  import QueryCriteria from './QueryCriteria.vue'
  import QueryResult from './QueryResult.vue'

  import { getDate } from '@/utils/get'
  import { navigateTo, showModal, showLoading, hideLoading } from '@/utils/uni-api'
  import { requestWXGetRegisterInfo, requestWXGetRegisterCount } from '@/service/api'
  import { getCodeListByCodeName } from '@/utils/custom-api'
  import { USER_INFO } from '@/store/constants' // 常量
  import { mapGetters } from 'vuex'
  export default {
    name: 'pageEPR',
    data() {
      return {
        formData: {
          registime: '',
          aka131: ''
        },
        unitname: '', // 到访单位
        aka131_01_num: 0,
        aka131_02_num: 0,
        aka131_03_num: 0,

        codeTableData: {
          visitors: []
        },
        pageNo: 1,
        pageSize: 5,
        queryResultList: [], // 数据查询结果
        isRequestOver: false, // 是否请求完成 控制no-data组件在未请求完成时显示
        isLoadOver: false, // 是否加载完成
        isMultiplePages: false // 是否多页
      }
    },
    components: {
      Statistics,
      QueryCriteria,
      QueryResult
    },
    onLoad(e) {
      // 设置到访单位
      if (e.unitname) {
        this.unitname = e.unitname
      }
    },
    methods: {
      // 初始化数据同时判断用户是否登录
      initData() {
        const { user_id } = this.userInfo
        if (user_id) {
          this.getData()
        } else {
          showModal('请登录后再访问').then((res) => {
            navigateTo('login', 'packageCommon')
          })
        }
      },
      // 获取数据
      getData() {
        showLoading()
        Promise.allSettled([
          getCodeListByCodeName('visitors'),
          requestWXGetRegisterCount(getDate(), this.unitname)
        ]).then((res) => {
          const res0 = res[0]
          const res1 = res[1]

          const { status: statusRes0, value: valueRes0 } = res0
          const { status: statusRes1, value: valueRes1 } = res1

          // 人员类别码表
          if (statusRes0 === 'fulfilled' && valueRes0) {
            this.codeTableData = {
              ...this.codeTableData,
              visitors: valueRes0
            }
          }

          if (statusRes1 === 'fulfilled' && valueRes1) {
            const { data } = valueRes1
            if (data && data.length > 0) {
              data.forEach((item) => {
                if (item.aka131 === '01') {
                  this.aka131_01_num = item.count
                }
                if (item.aka131 === '02') {
                  this.aka131_02_num = item.count
                }
                if (item.aka131 === '03') {
                  this.aka131_03_num = item.count
                }
              })
            }
          }

          hideLoading()
        })
      },
      // 处理分页数据 判断是否已经加载完成 该方法不用修改
      handleMultiplePagesData(data) {
        const pageNo = this.pageNo
        const pageSize = this.pageSize
        if (data && data.length > 0) {
          const len = data.length

          // 第一次加载
          if (pageNo < 2) {
            // 加载完成
            if (len < pageSize) {
              this.isLoadOver = true
            } else {
              // 加未载完成 还有文件待加载
              this.isLoadOver = false
              this.isMultiplePages = true
            }
            this.queryResultList = [...data]
          } else {
            // 加载更多
            // 加载完成
            if (len < pageSize) {
              this.isLoadOver = true
            } else {
              // 加未载完成 还有文件待加载
              this.isLoadOver = false
            }
            this.queryResultList = [...this.queryResultList, ...data]
          }
        } else {
          this.isLoadOver = true
          if (pageNo < 2) {
            this.queryResultList = []
          } else {
            this.queryResultList = [...this.queryResultList]
          }
        }
        this.isRequestOver = true
      },
      // 查询数据
      queryData() {
        const pageNo = this.pageNo
        const pageSize = this.pageSize
        const { registime, aka131 } = this.formData

        requestWXGetRegisterInfo(pageNo, pageSize, this.unitname, aka131, registime)
          .then((res) => {
            const { data } = res
            this.handleMultiplePagesData(data)
          })
          .catch(() => {
            this.isRequestOver = true
          })
      },
      // 加载更多数据
      loadMoreData() {
        ++this.pageNo
        this.queryData()
      },

      // 点击按钮查询
      handleQueryData(data) {
        this.formData = { ...data }
        this.queryResultList = []
        this.pageNo = 1
        this.isRequestOver = false
        this.isLoadOver = false
        this.isMultiplePages = false
        this.queryData()
      }
    },
    computed: {
      ...mapGetters([USER_INFO])
    },
    watch: {
      'userInfo.openid': {
        handler(val) {
          if (val) {
            this.initData()
          }
        },
        immediate: true
      }
    }
  }
</script>
<style lang="scss" scoped>
  .epidemic-prevention-records {
    padding: $spacing $spacing 0;
    .query-wrapper {
      padding-top: $spacing;
    }
  }
</style>
