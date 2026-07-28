<template>
  <div class="fund">
    <div v-if="isShowTotal" class="main">
      <div class="tip d-f ai-c">
        <div class="icon-img"></div>
        <div class="tip-t">{{ startTime + '到' + endTime + '财务收支' }}</div>
      </div>
      <div class="query-result">
        <div class="summary">
          <div>收支总结</div>
          <div class="s-con">期初余额：</div>
          <div class="s-con">
            <span>{{ '现金：' + opening.cash + '元' }}</span>
            <span>{{ '银行存款：' + opening.bank + '元' }}</span>
          </div>
          <div class="s-con">期末余额：</div>
          <div class="s-con">
            <span>{{ '现金：' + end.cash + '元' }}</span>
            <span>{{ '银行存款：' + end.bank + '元' }}</span>
          </div>
        </div>
        <div v-if="incomeList.length > 0" class="details">
          <div class="title">
            <span>本期资金流向明细(入)</span>
            <span class="total">合计：{{ incomeList[incomeList.length - 1].amount }}元</span>
          </div>
          <div v-if="incomeList.slice(0, -1).length > 0" class="con">
            <div class="item" v-for="(item, index) in incomeList.slice(0, -1)" :key="item.voucherId">
              <div>{{ '收入明细' + (Number(index) + 1) }}</div>
              <div class="i-con">
                <span class="key">日期</span>
                <span class="value">{{ item.makingDate || '暂无' }}</span>
              </div>
              <div class="i-con">
                <span class="key">摘要</span>
                <span class="value">{{ item.summary || '暂无' }}</span>
              </div>
              <div class="i-con">
                <span class="key">金额</span>
                <span class="value">{{ item.amount || '0' }}</span>
              </div>
              <div class="i-con">
                <span class="key">附件</span>
                <span class="file" @click="handleJumpRoute('attachment', 'packageThreeCapital', item.voucherId)">{{
                  item.voucherId ? '查看附件' : '无附件'
                }}</span>
              </div>
            </div>
          </div>
          <div v-else class="no-data">
            <ComponentNoData tip="暂无数据"></ComponentNoData>
          </div>
        </div>
        <div v-if="expenditureList.length > 0" class="details">
          <div class="title">
            <span>本期资金流向明细(出)</span>
            <span class="total">合计：{{ expenditureList[expenditureList.length - 1].amount }}元</span>
          </div>
          <div v-if="expenditureList.slice(0, -1).length > 0" class="con">
            <div class="item" v-for="(item, index) in expenditureList.slice(0, -1)" :key="item.voucherId">
              <div>{{ '支出明细' + (Number(index) + 1) }}</div>
              <div class="i-con">
                <span class="key">日期</span>
                <span class="value">{{ item.makingDate || '暂无' }}</span>
              </div>
              <div class="i-con">
                <span class="key">摘要</span>
                <span class="value">{{ item.summary || '暂无' }}</span>
              </div>
              <div class="i-con">
                <span class="key">金额</span>
                <span class="value">{{ item.amount || '0' }}</span>
              </div>
              <div class="i-con">
                <span class="key">附件</span>
                <span class="file" @click="handleJumpRoute('attachment', 'packageThreeCapital', item.voucherId)">{{
                  item.voucherId ? '查看附件' : '无附件'
                }}</span>
              </div>
            </div>
          </div>
          <div v-else class="no-data">
            <ComponentNoData tip="暂无数据"></ComponentNoData>
          </div>
        </div>
        <block v-if="incomeList.length === 0 && expenditureList.length === 0">
          <ComponentNoData tip="暂无数据" v-if="isRequestOver"></ComponentNoData>
        </block>
        <div class="footer">以上数据来自于宜宾市农业农村局</div>
      </div>
    </div>
  </div>
</template>
<script>
  import { navigateTo } from '@/utils/uni-api'
  import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
  export default {
    name: 'Fund',
    components: {
      ComponentNoData
    },
    props: {
      opening: {
        type: Object,
        required: true
      },
      end: {
        type: Object,
        required: true
      },
      incomeList: {
        type: Array,
        default: () => []
      },
      expenditureList: {
        type: Array,
        default: () => []
      },
      startTime: {
        type: String,
        required: true
      },
      endTime: {
        type: String,
        required: true
      },
      isShowTotal: {
        type: Boolean,
        default: () => false
      },
      isRequestOver: {
        type: Boolean,
        default: () => false
      }
    },
    data() {
      return {}
    },
    // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
    onLoad(e) {},
    methods: {
      handleJumpRoute(pageName, packageName, id) {
        if (id) {
          navigateTo(pageName, packageName, { voucherId: id })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .fund {
    width: 100%;

    .main {
      background-color: #fff;
      border-radius: 8rpx;
      padding: $spacing;

      .tip {
        width: 100%;
        padding: $spacing;
        background-color: #fff;
        box-shadow: $box-shadow-base;

        .icon-img {
          width: 30rpx;
          height: 24rpx;
          background-image: url('./images/bankCard.png');
          background-size: 100% 100%;
        }

        .tip-t {
          line-height: 24rpx;
          margin-left: 16rpx;
          font-size: 28rpx;
          font-weight: bold;
        }
      }

      .query-result {
        width: 100%;
        margin-top: $spacing;
        padding: $spacing;
        box-shadow: $box-shadow-base;
        background-color: #fff;

        .summary {
          width: 100%;
          padding-bottom: 16rpx;

          .s-con {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 28rpx;
            color: #a1a7b3;
            margin-top: 16rpx;
          }
        }

        .details {
          width: 100%;
          margin-top: 32rpx;

          .title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 32rpx;
            font-weight: bold;
            padding-bottom: 32rpx;
            border-bottom: 1rpx solid #a1a7b3;

            .total {
              font-size: 28rpx;
              color: #a1a7b3;
              white-space: nowrap;
              font-weight: normal;
            }
          }

          .con {
            margin-top: 16rpx;

            .item {
              width: 100%;

              &:not(:first-child) {
                margin-top: 32rpx;
              }

              .i-con {
                width: 100%;
                margin-top: 16rpx;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 28rpx;

                .key {
                  color: #a1a7b3;
                  white-space: nowrap;
                }

                .value {
                  padding-left: 16rpx;
                }

                .file {
                  color: #3882ff;
                }
              }
            }
          }
        }

        .footer {
          padding-top: 30rpx;
          width: 100%;
          text-align: center;
          font-weight: 500;
          font-size: 24rpx;
          line-height: 1;
          color: #c8c9cc;
        }
      }
    }
  }
</style>
