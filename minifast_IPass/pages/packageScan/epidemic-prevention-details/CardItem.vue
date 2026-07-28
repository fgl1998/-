<template>
  <div class="card-item">
    <div class="cell-wrapper">
      <div class="cell">
        <div class="key">登记时间</div>
        <div class="value">{{ renderData.handleTime }}</div>
      </div>
      <div class="cell">
        <div class="key">姓名</div>
        <div class="value">{{ renderData.aac003 }}</div>
      </div>
      <div class="cell">
        <div class="key">身份证号</div>
        <div class="value">{{ renderData.aac002 }}</div>
      </div>
      <div class="cell">
        <div class="key">联系电话</div>
        <div class="value" @click="handleCallPhone">
          {{ renderData.tel }}
        </div>
      </div>
      <div class="cell">
        <div class="key">人员类别</div>
        <div class="value">{{ renderData.aka131Desc || '暂无' }}</div>
      </div>
      <div class="cell">
        <div class="key">单位名称</div>
        <div class="value">{{ renderData.visitplace }}</div>
      </div>
      <div class="cell">
        <div class="key">访客来自地点</div>
        <div class="value">
          {{ renderData.place }}
        </div>
      </div>
      <div class="cell">
        <div class="key">来访内容</div>
        <div class="value">{{ renderData.content }}</div>
      </div>
      <div class="cell">
        <div class="key">到访单位</div>
        <div class="value">{{ renderData.unitnameDesc || '暂无' }}</div>
      </div>
      <!-- <div class="cell">
        <div class="key">体温</div>
        <div class="value">{{ renderData.temperature + '℃' }}</div>
      </div>
      <div class="cell">
        <div class="key">请选择是否出示健康码</div>
        <div class="value">{{ renderData.showcodeDesc || '暂无' }}</div>
      </div> -->
      <div class="cell">
        <div class="key">出入证编号</div>
        <div class="value">{{ renderData.visitnumber || '暂无' }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { useTMBankCard, useTMPhone } from '@/hooks'
import { makePhoneCall } from '@/utils/uni-api'
export default {
  name: 'pageEPDcardItem',
  props: {
    // 渲染信息
    renderData: {
      type: [Object],
      required: true
    }
  },
  methods: {
    _useTMBankCard(aac002) {
      return useTMBankCard(aac002)
    },
    _useTMPhone(tel) {
      return useTMPhone(tel)
    },
    handleCallPhone() {
      const { tel } = this.renderData
      makePhoneCall(tel)
    }
  }
}
</script>
<style lang="scss" scoped>
.card-item {
  background-color: #fff;
  box-shadow: $box-shadow-base;
  padding: 0 $spacing;
  font-size: 28rpx;
  color: $color;
  border-radius: 8rpx;
  font-weight: 500;
  .cell {
    display: flex;
    align-items: center;
    line-height: 1.4;
    border-bottom: 1px solid #ededed;
    padding: 16rpx 0;
    .key {
      color: $color-placeholder;
    }
    .value {
      flex: 1;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 12rpx 0;
      margin-left: 20rpx;
    }
    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
