<template>
  <div class="news h5-page">
    <div class="query-result">
      <block v-if="queryResultList.length > 0">
        <div
          class="subsidy-item"
          v-for="item in queryResultList"
          :key="item.id"
        >
          <div class="subsidy-name">
            <div class="iconimg iconimg-subsidy"></div>
            <div class="subsidy-name-text">{{ item.chi031_desc }}</div>
          </div>
          <div class="subsidy-con">
            <div class="cell">
              <div class="key">业务名称：</div>
              <div class="value tag">
                <span>{{ item.chi031_desc }}</span>
              </div>
            </div>
            <div class="cell">
              <div class="key">姓名：</div>
              <div class="value">
                <span>{{ item.aac003 }}</span>
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
                <span>{{ item.aae019 }}元</span>
              </div>
            </div>
            <div class="cell">
              <div class="key">发放期号：</div>
              <div class="value primary">
                <span>{{ item.aae209 }}</span>
              </div>
            </div>
            <div class="cell">
              <div class="key">经办时间：</div>
              <div class="value">
                <span>{{ item.aae036 }}</span>
              </div>
            </div>
            <div class="cell" v-if="item.aae017">
              <div class="key">经办部门：</div>
              <div class="value">
                <span>{{ item.aae017 }}</span>
              </div>
            </div>
            <div class="cell" v-if="item.chb014">
              <div class="key">处理结果：</div>
              <div class="value">
                <span>{{ item.chb014 }}</span>
              </div>
            </div>
            <div class="cell" v-if="item.cse285">
              <div class="key">审核意见：</div>
              <div class="value">
                <span>{{ item.cse285 }}</span>
              </div>
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
      <div class="load-more-wrapper" v-if="isExceedLimit">
        <ComponentLoadMore
          :isOver="isLoadOver"
          @click="handleClickLoadMore"
        ></ComponentLoadMore>
      </div>
    </div>
  </div>
</template>
<script>
import ComponentButton from '@/components/common/ez-button/ez-button.vue'
import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
import ComponentLoadMore from '@/components/common/ez-load-more/ez-load-more.vue'

import config from '@/config'
import {
  requestFFGetDynamicByFamily,
  requestDSGetDynamicByFamily,
} from '@/service/api'

export default {
  name: 'pageFamilyNews',
  data() {
    return {
      idCardList: '',
      queryResultList: [], // 查询结果
      pageNo: 1, // 查询页数
      pageLimit: 5, // 每页数据条数
      isExceedLimit: false, // 加载条数是否超出限制
      isLoadOver: true, // 是否加载完成
    }
  },
  components: {
    ComponentNoData,
    ComponentButton,
    ComponentLoadMore,
  },
  onLoad(e) {
    const { idCardList } = e
    this.idCardList = idCardList
    this.requestGetDynamicByFamily()
  },

  created() {},
  mounted() {},
  methods: {
    // 加载更多
    handleClickLoadMore() {
      this.pageNo++
      this.requestGetDynamicByFamily()
    },
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
    // 获取 家庭最新动态
    requestGetDynamicByFamily() {
      const { isOpenYGFF, isOpenYGFFByDS } = config
      const idCardList = this.idCardList
      const pageLimit = this.pageLimit
      const pageNo = this.pageNo

      if (isOpenYGFFByDS) {
        requestDSGetDynamicByFamily(idCardList, pageNo, pageLimit)
          .then((res) => {
            const { list } = res
            this.handleData(list)
          })
          .finally(() => {
            this.isShowSearchResult = true
            this.isInquired = true
          })
      } else {
        if (isOpenYGFF) {
          requestFFGetDynamicByFamily(idCardList, pageNo, pageLimit)
            .then((res) => {
              const { list } = res
              this.handleData(list)
            })
            .finally(() => {
              this.isShowSearchResult = true
              this.isInquired = true
            })
        } else {
          this.isShowSearchResult = true
          this.isInquired = true
        }
      }
    },
  },
  computed: {},
  watch: {},
}
</script>
<style lang="scss" scoped>
.news {
  width: 100%;
  padding: $spacing;
}
</style>
