<template>
  <div class="details-SSC h5-page">
    <div class="main">
      <div class="toolbar d-f ai-c jc-sb">
        <block v-for="item in tabsData" :key="item.id">
          <div
            class="item d-f ai-c jc-c"
            :class="[item.type === type ? 'active' : '']"
            @click="handleChangegTab(item.type)"
          >
            <div class="iconfont" :class="['iconfont-' + item.id]"></div>
            <div class="label">{{ item.name }}</div>
          </div>
        </block>
      </div>
      <div class="content">
        <div class="items" v-if="subsidyList.length > 0">
          <block v-for="item in subsidyList" :key="item.aac002">
            <div class="item">
              <div class="name d-f ai-c jc-sb">
                <div class="left d-f ai-c">
                  <div class="iconimg iconimg-subsidy"></div>
                  <div class="f-1">
                    {{ item.aac003 }}
                  </div>
                </div>
              </div>
              <div class="cell-wrapper">
                <div class="cell d-f ai-c">
                  <div class="key">身份证号：</div>
                  <div class="value f-1">{{ item.aac002 | TMIdcard }}</div>
                </div>
                <div class="cell d-f ai-c">
                  <div class="key">社保卡号：</div>
                  <div class="value f-1">{{ item.aaz500 }}</div>
                </div>
                <div class="cell d-f ai-c">
                  <div class="key">社保卡状态：</div>
                  <div class="value f-1">{{ item.aaz502_desc }}</div>
                </div>
                <div class="cell d-f ai-c">
                  <div class="key">银行卡号：</div>
                  <div class="value f-1">{{ item.aac203 | TMBankCard }}</div>
                </div>
                <div class="cell d-f ai-c">
                  <div class="key">银行类别：</div>
                  <div class="value f-1">{{ item.aac080_desc }}</div>
                </div>
                <div class="cell d-f ai-c">
                  <div class="key">银行卡状态：</div>
                  <div class="value f-1">{{ item.aaz702_desc || '暂无' }}</div>
                </div>
              </div>
            </div>
          </block>
        </div>
        <div class="no-data-wrapper" v-else>
          <ComponentNoData
            tip="未查询到相关补贴发放数据"
            v-if="isRequestOver"
          ></ComponentNoData>
        </div>
        <div class="button-wrapper" v-if="isExceedLimit">
          <ComponentLoadMore
            :isOver="isLoadOver"
            height="76rpx"
            name="加载更多"
            type="primary"
            @click="handleClickLoadMore"
          ></ComponentLoadMore>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ComponentLoadMore from '@/components/common/ez-load-more/ez-load-more.vue'
import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'

import config from '@/config'
import {
  requestFFGetHandleCardList,
  requestFFGetNoCardList,
} from '@/service/api'

import { USER_INFO } from '@/store/constants' // 常量
import { mapGetters } from 'vuex'
export default {
  name: 'pageSSCDetails',
  data() {
    return {
      tabsData: [
        {
          id: 'success',
          type: 1,
          name: '已办卡',
        },
        {
          id: 'fail',
          type: 2,
          name: '未办卡',
        },
      ],
      subsidyList: [], // 补贴列表
      type: 1, // 1 已办卡 2 未办卡
      pageNo: 1, // 页数
      pageLmit: 10, // 每页条数限制
      isExceedLimit: false, // 数据是否超出 pageLmit 大小
      isLoadOver: true, // 数据是否加载完成
      chb015: '', // 村编码
      chb018: '', // 村编码
      chb017: '', // 乡镇编码
      isRequestOver: false, // 是否请求完成 用于控制未查询到数据的显示
      isRequestTown: false, // 数据请求到镇级
    }
  },
  components: {
    ComponentLoadMore,
    ComponentNoData,
  },
  onLoad(e) {
    const { chb018, chb017, chb015 } = e
    if (chb015) {
      this.chb015 = chb015
    }
    if (chb018) {
      this.chb018 = chb018
    }
    if (chb017) {
      this.chb017 = chb017
    }
    const { areaCode } = config
    if (areaCode == '510100') {
      this.isRequestTown = true
    }
    this.getsSubsidyList(this.type)
  },
  onShow() {},
  methods: {
    handleLoadMoreData(list) {
      const pageNo = this.pageNo
      const pageLmit = this.pageLmit
      if (list && list.length > 0) {
        // 第一次 加载
        const len = list.length
        if (pageNo < 2) {
          if (len < pageLmit) {
            this.isExceedLimit = false
            this.isLoadOver = true
          } else {
            this.isExceedLimit = true
            this.isLoadOver = false
          }
          this.subsidyList = [...list]
        } else {
          // 第 n 次 加载
          if (len < pageLmit) {
            this.isLoadOver = true
          } else {
            this.isLoadOver = false
          }
          this.subsidyList = [...this.subsidyList, ...list]
        }
      } else {
        // 返回 [] 或者没有 list
        this.isLoadOver = true
      }
    },
    // 查询 社保卡办卡详情列表 // 1 已办卡 2 未办卡
    getsSubsidyList(type) {
      const { isOpenThreeFundedVersion } = config
      const isRequestTown = this.isRequestTown

      const pageNo = this.pageNo
      const pageLmit = this.pageLmit

      let chb015 = ''
      let chb018 = ''
      let chb017 = ''

      if (isOpenThreeFundedVersion) {
        chb015 = this.chb015
        chb017 = this.chb017
        chb018 = this.chb018
      } else {
        if (isRequestTown) {
          chb017 = this.chb017
        } else {
          chb018 = this.chb018
        }
      }

      // 第一次
      if (pageNo < 2) {
        this.subsidyList = []
      }

      if (type === 1) {
        requestFFGetHandleCardList(chb015, chb017, chb018, pageNo, pageLmit)
          .then((res) => {
            const { list } = res
            this.handleLoadMoreData(list)
          })
          .finally(() => {
            this.isRequestOver = true
          })
      }
      if (type === 2) {
        requestFFGetNoCardList(chb015, chb017, chb018, pageNo, pageLmit)
          .then((res) => {
            const { list } = res
            this.handleLoadMoreData(list)
          })
          .finally(() => {
            this.isRequestOver = true
          })
      }
    },
    // tab change
    handleChangegTab(type) {
      if (this.type !== type) {
        this.pageNo = 1
        this.isExceedLimit = false
        this.isLoadOver = true
        this.isRequestOver = false
        this.type = type
        this.subsidyList = []
      }
    },
    // 加载更多
    handleClickLoadMore() {
      this.pageNo++
      this.getsSubsidyList(this.type)
    },
  },
  computed: {
    ...mapGetters([USER_INFO]),
  },
  watch: {
    type: {
      handler(val) {
        this.getsSubsidyList(val)
      },
    },
  },
}
</script>
<style lang="scss" scoped>
.details-SSC {
  width: 100%;
  padding: $spacing;
  .main {
    background-color: #fff;
    padding: $spacing;
    border-radius: 8rpx;
  }
  .toolbar {
    width: 100%;
    padding: $spacing 0;
    .item {
      width: 264rpx;
      height: 66rpx;
      background-color: #ffffff;
      border-radius: 8rpx;
      border: solid 2rpx $border-color;
      font-size: 26rpx;
      color: $color-placeholder;
      transition: all 0.3s;
      .iconfont {
        font-size: 28rpx;
        font-weight: 600;
      }
      .label {
        padding-left: 8rpx;
        white-space: nowrap;
      }
      &.active {
        background-color: $primary;
        color: #fff;
        border-color: $primary;
        font-weight: 500;
      }
    }
  }
  .content {
    width: 100%;
  }
  .items {
    width: 100%;
  }
  .item {
    background-color: #ffffff;
    box-shadow: 0rpx 0rpx 16rpx 0rpx rgba(144, 162, 188, 0.2);
    border-radius: 8rpx;
    border: solid 2rpx rgba(144, 162, 188, 0.02);
    padding: 0 $spacing;
    margin-bottom: $spacing;
    .name {
      font-size: 28rpx;
      color: $color;
      line-height: 1;
      min-height: 82rpx;
      line-height: 36rpx;
      margin-bottom: $spacing;
      padding: 22rpx 0;
      font-weight: 700;
      border-bottom: 1px solid $border-color;
      .iconimg {
        margin-right: 10rpx;
      }
    }
    .cell-wrapper {
      background-color: #f2f4f7;
      border-radius: 6rpx;
      padding: 24rpx;
      margin-bottom: $spacing;
      .cell {
        font-size: 24rpx;
        line-height: 28rpx;
        padding: 14rpx 0;
      }

      .key {
        color: $color-placeholder;
      }
      .value {
        color: $color;
        text-align: right;
      }
    }
  }
  .no-data-wrapper {
    padding: $spacing 0;
  }
}
</style>
