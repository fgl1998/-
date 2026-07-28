<template>
  <view class="ez-policy-doc-wrapper" :class="'city-' + areaCode" @click="handleClick">
    <template v-if="type === 'normal' || areaCode !== '513400'">
      <div class="name">{{ renderData.chi051 }}</div>
      <div class="info">
        <div class="unit">{{ getUnitStr }}</div>
        <div class="time">{{ getTime }}</div>
      </div>
    </template>
    <template v-else>
      <div class="project-name">
        <div class="iconimg iconimg-subsidy"></div>
        <div>{{ renderData.chi032 || '暂无' }}</div>
      </div>
      <div class="cells">
        <div class="cell">
          <div class="key">补贴项目所属业务局：</div>
          <div class="value">{{ renderData.chi037_desc || '暂无' }}</div>
        </div>
        <div class="cell">
          <div class="key">补贴对象：</div>
          <div class="value">{{ renderData.chi70g || '暂无' }}</div>
        </div>
        <div class="cell">
          <div class="key">补贴标准：</div>
          <div class="value">{{ renderData.chi702 || '暂无' }}</div>
        </div>
        <div class="cell">
          <div class="key">发放周期：</div>
          <div class="value">{{ renderData.chi03b_desc || '暂无' }}</div>
        </div>
        <div class="cell cell-policy" v-if="renderData.hi05List && renderData.hi05List.length > 0">
          <div class="key">相关政策文件：</div>
          <div class="value">
            <div class="items">
              <div
                class="item"
                v-for="item in renderData.hi05List"
                :key="item.chi050"
                @click.stop="handleClick(item.chi050, item.chi056)">
                {{ item.chi056 }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </view>
</template>

<script>
import config from '@/config'
import { previewPDFWeixin, previewPDFAlipay, previewPDFH5 } from '@/utils/custom-api/index'

const { areaCode, isRequestYGFF } = config

/**
 * 政策文件渲染item
 * @description 政策文件渲染item
 */
export default {
  name: 'ezPolicyDoc',
  props: {
    // 渲染数据
    renderData: {
      type: [Object],
      default: () => {
        return {
          // chi031: '28',
          // chi037: '6',
          // chi037_desc: '卫生健康局',
          // chi050: '10307',
          // chi051:
          //   '计生委关于调整全国农村部分计划生育家庭奖励扶助和计划生育家庭特别扶助标准的通知',
          // chi052: '2019-03-06 15:23:11.0',
          // chi053: '115485',
          // chi054: '',
          // myrownum: '1',
          // yab003: '511011',
          // yab003_desc: '东兴区',
        }
      },
    },
    // 是否请求审批系统
    isRequestYGSP: {
      type: [Boolean],
      default: false,
    },
    // 类型 normal 正常 兼容凉山地市申报须知显示正常的政策文件卡片
    type: {
      type: String,
      default: '',
    },
  },
  components: {},
  data() {
    return {
      areaCode,
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleClick(_chi050, _chi056) {
      if (this.type === 'normal' || areaCode !== '513400') {
        const isRequestYGSP = this.isRequestYGSP
        const { chi050, chi051, chi056 } = this.renderData
        // #ifdef MP-WEIXIN
        previewPDFWeixin(chi050, 'pdf', chi056, isRequestYGSP)
        // #endif
        // #ifdef MP-ALIPAY
        previewPDFAlipay(chi050, 'pdf', chi056, isRequestYGSP)
        // #endif
        // #ifdef H5
        previewPDFH5(chi050, chi056, isRequestYGSP ? 'ygsp' : isRequestYGFF ? 'ygff' : 'ygsp')
        // #endif
      } else {
        if (_chi050 && _chi056) {
          // #ifdef MP-WEIXIN
          previewPDFWeixin(_chi050, 'pdf', _chi056, true)
          // #endif
        }
      }
    },
  },
  computed: {
    getTime() {
      const data = this.renderData
      const type = this.type
      let str = ''
      if (type === 'normal' || areaCode !== '513400') {
        str = data.chi052.substr(0, 10)
      }
      return str
    },
    getUnitStr() {
      const isRequestYGSP = this.isRequestYGSP
      const renderData = this.renderData
      const type = this.type
      let str = ''
      if (type === 'normal' || areaCode !== '513400') {
        // 优先拦截 优先考虑传参
        if (isRequestYGSP) {
          if (renderData.chi037desc) {
            str = renderData.chi037desc
            if (renderData.yab003desc) {
              str = str + '(' + renderData.yab003desc + ')'
            }
          }
          return str
        }
        if (!isRequestYGFF) {
          if (renderData.chi037desc) {
            str = renderData.chi037desc
            if (renderData.yab003desc) {
              str = str + '(' + renderData.yab003desc + ')'
            }
          }
        } else {
          str = renderData.chi037_desc
        }
      }

      return str
    },
  },
  watch: {},
}
</script>

<style lang="scss" scoped>
.ez-policy-doc-wrapper {
  width: 100%;
  position: relative;
  padding: 0 $spacing;
  height: 214rpx;
  &.city-513400 {
    height: auto;
    min-height: 214rpx;
    &::before {
      // display: none;
    }
    .project-name {
      display: flex;
      align-items: center;
      border-bottom: solid 1px rgba(#1b6eff, 0.2);
      position: relative;
      z-index: $z-index-position;
      padding: 32rpx 0;
      font-size: 28rpx;
      font-weight: 500;
      .iconimg {
        margin-right: 10rpx;
      }
    }
    .cells {
      position: relative;
      z-index: $z-index-position;
      padding: 20rpx 0;
      .cell {
        display: flex;
        line-height: 1.4;
        font-size: 24rpx;
        margin-bottom: 12rpx;
        .key {
          color: #666;
        }
        .value {
          flex: 1;
          overflow: hidden;
          color: #333;
        }

        .tip {
          color: #f00;
          opacity: 0.5;
        }
        .items {
          padding-top: 10rpx;
          .item {
            line-height: 1.4em;
            background-color: #f5f5f5;
            color: #333;
            margin-bottom: 10rpx;
            padding: 20rpx;
            border-radius: 8rpx;
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
        &.cell-policy {
          flex-wrap: wrap;
          .key {
            width: 100%;
          }
          .value {
            width: 100%;
            flex: auto;
          }
        }
      }
    }
  }
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    left: 0;
    height: 80px;
    background-image: linear-gradient(180deg, #f6f7f8 0%, #ffffff 100%);
    z-index: $z-index;
  }

  .name {
    padding-top: 24rpx;
    position: relative;
    z-index: $z-index-position;
    font-size: 28rpx;
    line-height: 42rpx;
    height: 106rpx;
    font-weight: 500;
    color: $color;
    @include textOverflow(2);
  }
  .info {
    position: relative;
    padding-top: 18rpx;
    z-index: $z-index-position;
    display: flex;
    justify-content: space-between;
    color: $color-placeholder;
    font-size: 24rpx;
    .unit {
      flex: 1;
      overflow: hidden;
    }
  }
}
</style>
