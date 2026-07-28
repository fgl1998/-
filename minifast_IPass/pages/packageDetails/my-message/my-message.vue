<template>
  <div class="my-message h5-page">
    <ComponentPanel title="我的消息" v-if="isRequestOver">
      <div class="panel-content">
        <block v-if="queryResultList.length > 0">
          <div class="subsidy-item" v-for="item in queryResultList" :key="item.id">
            <div class="subsidy-name">
              <div class="iconimg iconimg-subsidy"></div>
              <div class="subsidy-name-text">{{ item.chi031_desc }}</div>
            </div>
            <div class="subsidy-con">
              <div class="cell">
                <div class="key">姓名：</div>
                <div class="value">
                  <span>{{ item.aac003 | TMUserName }}</span>
                </div>
              </div>
              <div class="cell">
                <div class="key">身份证号：</div>
                <div class="value">
                  <span>{{ item.aac002 | TMIdcard }}</span>
                </div>
              </div>

              <div class="cell">
                <div class="key">发放金额：</div>
                <div class="value">
                  <span>{{ item.aae019 || '0' }}元</span>
                </div>
              </div>
              <div class="cell">
                <div class="key">发放期号：</div>
                <div class="value">
                  <span>{{ item.aae209 || '暂无' }}</span>
                </div>
              </div>
              <div class="cell">
                <div class="key">经办时间：</div>
                <div class="value">
                  <span>{{ item.aae036 || '暂无' }}</span>
                </div>
              </div>
              <block v-if="areaCode == '511500'">
                <div class="cell">
                  <div class="key">经办人员：</div>
                  <div class="value">
                    <span>{{ item.aae011 || '暂无' }}</span>
                  </div>
                </div>
                <div class="cell">
                  <div class="key">经办事项类型：</div>
                  <div class="value">
                    <span>{{ item.type || '暂无' }}</span>
                  </div>
                </div>
                <div class="cell">
                  <div class="key">流程环节名称：</div>
                  <div class="value">
                    <span>{{ item.cse241 || '暂无' }}</span>
                  </div>
                </div>
              </block>
              <div class="cell">
                <div class="key">经办部门：</div>
                <div class="value">
                  <span>{{ item.aae017_desc ? item.aae017_desc : c ? aae017_desc : '暂无' }}</span>
                </div>
              </div>
              <div class="cell">
                <div class="key">处理结果：</div>
                <div class="value primary">
                  <span>{{ item.chb014 || '暂无' }}</span>
                </div>
              </div>
              <div class="cell">
                <div class="key">审核意见：</div>
                <div class="value">
                  <span>{{ item.cse285 || '暂无' }}</span>
                </div>
              </div>
            </div>
          </div>
        </block>
        <block v-else>
          <ComponentNoData tip="未查询到相关数据"></ComponentNoData>
        </block>
        <div class="load-more-wrapper" v-if="isExceedLimit">
          <ComponentLoadMore :isOver="isLoadOver" @click="handleClickLoadMore"></ComponentLoadMore>
        </div>
      </div>
    </ComponentPanel>
  </div>
</template>
<script>
  import ComponentImg from '@/components/common/ez-img/ez-img.vue'
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
  import ComponentLoadMore from '@/components/common/ez-load-more/ez-load-more.vue'
  import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'

  import { mapGetters } from 'vuex'
  import config from '@/config'
  import { requestFFGetDynamicByAac002, requestDSGetDynamicByAac002 } from '@/service/api'

  import { USER_INFO } from '@/store/constants' // 常量

  export default {
    name: 'pageMyMessage',
    data() {
      return {
        queryResultList: [], // 数据明细
        pageNo: 1, // 查询页数
        pageLimit: 5, // 每页数据条数
        isExceedLimit: false, // 加载条数是否超出限制
        isLoadOver: true, // 是否加载完成
        isRequestOver: false, // 是否请求完成 用于控制未查询到数据的显示
        areaCode: ''
      }
    },
    components: {
      ComponentImg,
      ComponentPanel,
      ComponentNoData,
      ComponentLoadMore
    },
    onLoad(e) {
      this.areaCode = config.areaCode
    },

    onShow() {
      this.getData()
    },
    methods: {
      handleData(list) {
        const pageLimit = this.pageLimit
        const pageNo = this.pageNo
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
      },
      // 获取数据
      getData() {
        const { isOpenYGFF, isOpenYGFFByDS } = config
        const { idCard } = this.userInfo
        const pageLimit = this.pageLimit
        const pageNo = this.pageNo

        if (isOpenYGFFByDS) {
          requestDSGetDynamicByAac002(idCard, pageNo, pageLimit)
            .then((res) => {
              const { list } = res
              this.handleData(list)
            })
            .finally(() => {
              this.isRequestOver = true
            })
        } else {
          if (isOpenYGFF) {
            requestFFGetDynamicByAac002(idCard, pageNo, pageLimit)
              .then((res) => {
                const { list } = res
                this.handleData(list)
              })
              .finally(() => {
                this.isRequestOver = true
              })
          } else {
            this.isRequestOver = true
          }
        }
      },
      // 加载更多
      handleClickLoadMore() {
        this.pageNo++
        this.getData()
      }
    },
    computed: {
      ...mapGetters([USER_INFO])
    },
    watch: {}
  }
</script>
<style lang="scss" scoped>
  .my-message {
    padding: $spacing;
  }
</style>
