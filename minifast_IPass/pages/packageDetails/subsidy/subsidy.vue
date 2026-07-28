<template>
  <div class="details-subsidy h5-page">
    <div class="main">
      <div class="toolbar d-f ai-c jc-sb">
        <block v-for="item in tabsData" :key="item.id">
          <div
            class="item d-f ai-c jc-c"
            :class="[item.type == type ? 'active' : '']"
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
                    {{ item.chi031_desc || '暂无' }}
                  </div>
                </div>
              </div>
              <div class="cell-wrapper">
                <div class="cell d-f ai-c">
                  <div class="key">姓名：</div>
                  <div class="value f-1">{{ item.aac003 }}</div>
                </div>
                <div class="cell d-f ai-c">
                  <div class="key">身份证号：</div>
                  <div class="value f-1">{{ item.aac002 | TMIdcard }}</div>
                </div>
                <div class="cell d-f ai-c">
                  <div class="key">发放业务局名称：</div>
                  <div class="value f-1" v-if="areaCode === '511500'">
                    {{ item.aae017_desc || '暂无' }}
                  </div>
                  <div class="value f-1" v-else>
                    {{ item.chi037_desc || '暂无' }}
                  </div>
                </div>
                <div class="cell d-f ai-c">
                  <div class="key">发放期号：</div>
                  <div class="value f-1">{{ item.aae209 || '暂无' }}</div>
                </div>
                <div class="cell d-f ai-c">
                  <div class="key">发放金额：</div>
                  <div class="value f-1">{{ item.aae019 || '暂无' }}</div>
                </div>
                <div class="cell d-f ai-c" v-if="areaCode !== '511500'">
                  <div class="key">发放时间：</div>
                  <div class="value f-1">{{ item.aae036 || '暂无' }}</div>
                </div>
                <div class="cell d-f ai-c">
                  <div class="key">发放状态：</div>
                  <div class="value f-1">{{ item.chb01e_desc || '暂无' }}</div>
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
  requestFFGetVillageDetailInfo,
  requestDSGetVillageDetailInfo,
} from '@/service/api'

import { USER_INFO } from '@/store/constants' // 常量
import { mapGetters } from 'vuex'
export default {
  name: 'pageSubsidyDetails',
  data() {
    return {
      tabsData: [
        {
          id: 'success',
          type: 1,
          name: '发放成功',
        },
        {
          id: 'time',
          type: config.areaCode == '511500' ? 0 : 3,
          name: '发放中',
        },
        {
          id: 'fail',
          type: 2,
          name: '发放失败',
        },
      ],
      subsidyList: [], // 补贴列表
      type: 1, // 1 成功 2 失败 3 发放中(宜宾为 0)
      pageNo: 1, // 页数
      pageLmit: 10, // 每页条数限制
      isExceedLimit: false, // 数据是否超出 pageLmit 大小
      isLoadOver: true, // 数据是否加载完成
      chb015: '', // 区县编码
      chb017: '', // 乡镇编码
      chb018: '', // 村编码
      aae209: '', // 发放期号
      isRequestOver: false, // 是否请求完成 用于控制未查询到数据的显示
      isRequestTown: false, // 数据请求到镇级
      areaCode: '',
    }
  },
  components: {
    ComponentLoadMore,
    ComponentNoData,
  },
  onLoad(e) {
    let { chb015, chb017, chb018, aae209, type, YBType } = e
    if (chb015) {
      this.chb015 = chb015
    }
    if (chb018) {
      this.chb018 = chb018
    }
    if (chb017) {
      this.chb017 = chb017
    }
    if (aae209) {
      this.aae209 = aae209
    }
    if (type) {
      this.type = type
    }
    // 宜宾地市专属传参解析
    if (YBType) {
      YBType = JSON.parse(YBType).type
      if (YBType || YBType == 0) {
        this.type = YBType
      }
    }

    const { areaCode } = config
    // 成都地市通过乡镇查询
    if (areaCode == '510100') {
      this.isRequestTown = true
    }
    this.areaCode = areaCode
    this.getsSubsidyList(this.type)
  },
  onShow() {},
  methods: {
    handleData(list) {
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
    // 查询补贴发放详情列表 1 成功 2 失败 3 发放中(宜宾为 0)
    getsSubsidyList(type) {
      const { isOpenYGFF, isOpenYGFFByDS } = config
      const isRequestTown = this.isRequestTown
      const pageNo = this.pageNo
      const pageLmit = this.pageLmit

      const aae209 = this.aae209
      let chb018 = ''
      let chb017 = ''
      let chb015 = this.chb015

      if (isRequestTown) {
        chb017 = this.chb017
      } else {
        chb018 = this.chb018
      }

      // 第一次
      if (pageNo < 2) {
        this.subsidyList = []
      }

      if (isOpenYGFFByDS) {
        requestDSGetVillageDetailInfo(
          type,
          aae209,
          chb015,
          chb017,
          chb018,
          '',
          '',
          '',
          pageNo,
          pageLmit
        )
          .then((res) => {
            const { list } = res
            this.handleData(list)
          })
          .finally(() => {
            this.isRequestOver = true
          })
      } else {
        if (isOpenYGFF) {
          requestFFGetVillageDetailInfo(
            type,
            aae209,
            chb015,
            chb017,
            chb018,
            '',
            '',
            '',
            pageNo,
            pageLmit
          )
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
    // tab change
    handleChangegTab(type) {
      if (this.type !== type) {
        this.pageNo = 1
        this.pageLmit = 10
        this.isExceedLimit = false
        this.isRequestOver = false
        this.isLoadOver = true
        this.subsidyList = []
        this.type = type
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
.details-subsidy {
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
      width: 200rpx;
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
