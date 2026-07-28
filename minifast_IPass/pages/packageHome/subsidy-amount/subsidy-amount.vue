<template>
  <div class="subsidy-amount h5-page">
    <div class="top">
      <div class="img-wrapper">
        <ComponentImg
          height="206rpx"
          width="722rpx"
          :path="images.header"
        ></ComponentImg>
      </div>
      <div class="content">
        <div class="item">
          <div class="value">
            <span class="PangMenZhengDao">{{ cardData.amount }}</span>
            <span class="PangMenZhengDao unit">元</span>
          </div>
          <div class="key">
            <span>总金额</span>
          </div>
        </div>
        <div class="item">
          <div class="value">
            <span class="PangMenZhengDao">{{ cardData.subsidyNum }}</span>
          </div>
          <div class="key">
            <span>补贴项目数</span>
          </div>
        </div>
        <div class="item">
          <div class="value">
            <span class="PangMenZhengDao">{{ cardData.paymentNum }}</span>
          </div>
          <div class="key">
            <span>发放总期数</span>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <ComponentPanel :title="panelTitle">
        <div class="panel-content">
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
                <div class="cell" v-if="item.aae010">
                  <div class="key">银行卡号：</div>
                  <div class="value">
                    <span>{{ item.aae010 | TMBankCard }}</span>
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
                <div class="cell" v-if="item.chb204">
                  <div class="key">实发时间：</div>
                  <div class="value">
                    <span>{{ item.chb204 }}</span>
                  </div>
                </div>
                <div class="cell" v-if="item.chb01e_desc">
                  <div class="key">业务状态：</div>
                  <div class="value">
                    <span>{{ item.chb01e_desc }}</span>
                  </div>
                </div>
                <div class="cell" v-if="item.chi037_desc">
                  <div class="key">业务局：</div>
                  <div class="value">
                    <span>{{ item.chi037_desc }}</span>
                  </div>
                </div>
                <div class="cell" v-if="item.chb017_desc">
                  <div class="key">申报乡镇：</div>
                  <div class="value">
                    <span>{{ item.chb017_desc }}</span>
                  </div>
                </div>
              </div>
            </div>
          </block>
          <block v-else>
            <ComponentNoData tip="未查询到相关数据"></ComponentNoData>
          </block>
          <div class="load-more-wrapper" v-if="isExceedLimit">
            <ComponentLoadMore
              :isOver="isLoadOver"
              @click="handleClickLoadMore"
            ></ComponentLoadMore>
          </div>
        </div>
      </ComponentPanel>
    </div>
  </div>
</template>
<script>
import imageHeader from './images/header.png'

import ComponentImg from '@/components/common/ez-img/ez-img.vue'
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
import ComponentLoadMore from '@/components/common/ez-load-more/ez-load-more.vue'
import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'

import { mapGetters } from 'vuex'

import { setNavigationBarTitle } from '@/utils/uni-api'
import {
  requestFFGetStageTreatmentByFamily,
  requestFFGetMyFamilyEcard,
} from '@/service/api'

import { USER_INFO } from '@/store/constants' // 常量

export default {
  name: 'pageFamilySubsidyAmount',
  data() {
    return {
      // 本地图片
      images: {
        header: {
          src: '',
          httpSrc: imageHeader,
        },
      },
      type: '01', // 类型 01 已发金额 02 审核中 03 本月到账
      panelTitle: '',
      cardData: {
        amount: '0', // 总金额
        subsidyNum: '0', // 补贴项目数
        paymentNum: '0', // 发放总期数
      },
      queryResultList: [], // 数据明细
      pageNo: 1, // 查询页数
      pageLimit: 5, // 每页数据条数
      isExceedLimit: false, // 加载条数是否超出限制
      isLoadOver: true, // 是否加载完成
    }
  },
  components: {
    ComponentImg,
    ComponentPanel,
    ComponentLoadMore,
    ComponentNoData,
  },
  onLoad(e) {
    const { type, name, idCardList } = e
    if (name) {
      setNavigationBarTitle(name)
    }
    if (type) {
      this.type = type
    }
    if (idCardList) {
      this.idCardList = idCardList
    }
    if (type === '01') {
      this.panelTitle = '家庭成员补贴发放明细'
    }
    if (type === '02') {
      this.panelTitle = '家庭成员审核明细'
    }
    if (type === '03') {
      this.panelTitle = '家庭成员本月补贴发放明细'
    }
  },
  onShow() {
    this.getQueryResultList()
    this.getCardData()
  },
  methods: {
    // 获取数据
    getQueryResultList() {
      const pageLimit = this.pageLimit
      const pageNo = this.pageNo
      const type = this.type
      const idCardList = this.idCardList

      requestFFGetStageTreatmentByFamily(
        idCardList,
        type,
        pageNo,
        pageLimit
      ).then((res) => {
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
    },
    // 获取数据
    getCardData() {
      const type = this.type
      const idCardList = this.idCardList

      requestFFGetMyFamilyEcard(idCardList).then((res) => {
        const { list } = res
        if (list) {
          const data = { ...list[0] }
          switch (type) {
            case '01':
              this.cardData = {
                amount: data.aae019_cg, // 总金额
                subsidyNum: data.chi031_cg, // 补贴项目数
                paymentNum: data.aae209_cg, // 发放总期数
              }
              break
            case '02':
              this.cardData = {
                amount: data.aae019_zt, // 总金额
                subsidyNum: data.chi031_zt, // 补贴项目数
                paymentNum: data.aae209_zt, // 发放总期数
              }
              break
            case '03':
              this.cardData = {
                amount: data.aae019_dq, // 总金额
                subsidyNum: data.chi031_dq, // 补贴项目数
                paymentNum: data.aae209_dq, // 发放总期数
              }
              break
            default:
              break
          }
        }
      })
    },
    // 加载更多
    handleClickLoadMore() {
      this.pageNo++
      this.getQueryResultList()
    },
  },
  computed: {
    ...mapGetters([USER_INFO]),
  },
  watch: {},
}
</script>
<style lang="scss" scoped>
.subsidy-amount {
  padding-top: 10rpx;
  padding-bottom: $spacing;
  .top {
    position: relative;
    .img-wrapper {
      position: relative;
    }
    .content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 16rpx 30rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .item {
      width: 33.3333%;
      text-align: center;
      color: #fff;
      .key {
        font-size: 26rpx;
        padding-top: 12rpx;
        opacity: 0.7;
      }
      .value {
        font-weight: 700;
        font-size: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .unit {
        font-size: 26rpx;
        padding-left: 4rpx;
      }
    }
  }
  .main {
    padding-top: 14rpx;
  }
}
</style>
