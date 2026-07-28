<template>
  <div class="my-declare h5-page">
    <div class="name" v-if="type !== 'agent'">
      <i class="iconimg"></i>
      <span>{{ titleName }}</span>
    </div>
    <div class="query" v-else>
      <ComponentQuery
        :title="titleName"
        :renderData="queryRenderData"
        @change="handleQueryChange"
        @click="getDeclareData"></ComponentQuery>
    </div>
    <div class="items" v-if="isRequestOver">
      <block v-if="queryResultList.length > 0">
        <div class="item" v-for="item in queryResultList" :key="item.id">
          <ComponentSubsidyReview
            :renderData="item"
            :declareType="declareType"
            :isShowApprovalProcess="isShowApprovalProcess"
            @change="handleSubsidyReviewChange"></ComponentSubsidyReview>
        </div>
      </block>
      <block v-else>
        <ComponentNoData tip="未查询到相关数据"></ComponentNoData>
      </block>
      <div class="load-more-wrapper" v-if="isExceedLimit">
        <ComponentLoadMore :isOver="isLoadOver" bgc="#f5f5f5" @click="handleClickLoadMore"></ComponentLoadMore>
      </div>
    </div>
  </div>
</template>
<script>
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
  import ComponentSubsidyReview from '@/components/project/ez-subsidy-review/ez-subsidy-review.vue'
  import ComponentLoadMore from '@/components/common/ez-load-more/ez-load-more.vue'
  import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
  import ComponentQuery from '@/components/project/ez-query/ez-query.vue'

  import config from '@/config'
  import { setNavigationBarTitle } from '@/utils/uni-api'
  import { requestB015 } from '@/service/api'

  import { USER_INFO, USER_LIST } from '@/store/constants' // 常量
  import { mapGetters } from 'vuex'
  export default {
    name: 'pageMyDeclare',
    data() {
      return {
        queryResultList: [], // 申报渲染数据
        type: '', // agent 待办
        declareType: '01', // 申报类型
        titleName: '我的阳光申报', // 标题名称
        pageNo: 1, // 查询页数
        pageLimit: 5, // 每页数据条数
        isExceedLimit: false, // 加载条数是否超出限制
        isLoadOver: true, // 是否加载完成
        isRequestOver: false, // 是否请求完成 用于控制未查询到数据的显示
        queryRenderData: [
          {
            id: 'aac003',
            key: '姓名',
            value: '',
            type: 'text',
            placeholder: '请输入姓名',
            required: false,
            disabled: false,
            maxlength: 10
          },
          {
            id: 'aac002',
            key: '身份证号',
            value: '',
            type: 'idCard',
            placeholder: '请输入身份证号',
            required: false,
            disabled: false,
            maxlength: 20
          }
        ]
      }
    },
    components: {
      ComponentPanel,
      ComponentSubsidyReview,
      ComponentLoadMore,
      ComponentNoData,
      ComponentQuery
    },
    onLoad(e) {
      const { type } = e
      if (type && type === 'agent') {
        this.type = type
        this.declareType = '02'
        this.titleName = '我的代办项目'
        setNavigationBarTitle(this.titleName)
      }
    },
    onShow() {
      this.pageNo = 1
      this.isExceedLimit = false
      this.isLoadOver = true
      this.getDeclareData()
    },
    methods: {
      // 查询条件改变触发
      handleQueryChange(id, value, obj) {
        const queryRenderData = [...this.queryRenderData]
        queryRenderData.forEach((item) => {
          if (item.id === id) {
            item.value = value
          }
        })
        this.queryRenderData = [...queryRenderData]
      },
      // 获得 正在申报的补贴数据
      getDeclareData() {
        let type = this.type
        const { idCard } = this.userInfo
        const pageNo = this.pageNo
        const pageLimit = this.pageLimit

        let aac002 = ''
        let aac003 = ''
        let chb009 = ''
        let chb00z = ''

        if (type === 'agent') {
          aac003 = this.queryRenderData[0].value
          aac002 = this.queryRenderData[1].value
          chb009 = '02'
          chb00z = idCard
        } else {
          aac002 = idCard
        }
        requestB015('', '', '', '', chb009, chb00z, aac002, aac003, pageNo, pageLimit, 'aac002')
          .then((res) => {
            const { list } = res.lists.hb00List

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
            this.isRequestOver = true
          })
      },
      // 补贴项目撤销 change
      handleSubsidyReviewChange() {
        const type = this.type
        this.pageNo = 1
        this.isExceedLimit = false
        this.isLoadOver = true
        this.queryResultList = []
        this.getDeclareData()
      },
      // 加载更多
      handleClickLoadMore() {
        this.pageNo++
        this.getDeclareData()
      }
    },
    computed: {
      ...mapGetters([USER_INFO, USER_LIST]),
      isShowApprovalProcess() {
        const { areaCode } = config
        const declareType = this.declareType

        let result = true
        // 乐山特殊处理
        if (areaCode == '511100') {
          result = false
        }
        return result
      }
    },
    watch: {}
  }
</script>
<style lang="scss" scoped>
  .my-declare {
    padding: $spacing;
    .name {
      width: 100%;
      height: 96rpx;
      background-color: #ffffff;
      border-radius: 8rpx;
      display: flex;
      align-items: center;
      font-size: 32rpx;
      font-weight: 700;
      padding-left: 32rpx;
      color: $color;
      .iconimg {
        width: 8rpx;
        height: 32rpx;
        background-color: $primary;
        border-radius: 2rpx;
        margin-right: 24rpx;
      }
    }
    .items {
      padding-top: $spacing;
    }
    .item {
      margin-bottom: $spacing;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
</style>
