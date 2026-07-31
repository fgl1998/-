<template>
  <view class="demo-page">
    <view class="demo-card">
      <view class="demo-title" @click="$refs.industryPopupSelector.open()">行业弹窗组件示例</view>
      <industry-popup-selector
        ref="industryPopupSelector"
        v-model="industryName"
        :moduleId="industryCode"
        :dataSource="industryOptions"
        @setModalValue="handleChange"
        :maxLevel="3"
      ></industry-popup-selector>

      <view class="result-item">已选编码：{{ industryCode || '无' }}</view>
      <view class="result-item">已选名称：{{ industryName || '无' }}</view>
      <view class="result-item">已选路径：{{ industryPath || '无' }}</view>
    </view>
  </view>
</template>

<script>
import IndustryPopupSelector from './index.vue'

export default {
  components: {
    IndustryPopupSelector,
  },
  data() {
    return {
      industryCode: '',
      industryName: '',
      industryPath: '',
      industryOptions: [
        {
          aab022: '01',
          aab022Desc: '制造业',
          children: [
            {
              aab022: '0101',
              aab022Desc: '装备制造',
              children: [
                {
                  aab022: '010101',
                  aab022Desc: '通用设备制造',
                },
                {
                  aab022: '010102',
                  aab022Desc: '专用设备制造',
                },
              ],
            },
            {
              aab022: '0102',
              aab022Desc: '食品制造',
            },
          ],
        },
        {
          aab022: '02',
          aab022Desc: '信息传输、软件和信息技术服务业',
          children: [
            {
              aab022: '0201',
              aab022Desc: '软件和信息技术服务业',
              children: [
                {
                  aab022: '020101',
                  aab022Desc: '基础软件开发',
                },
                {
                  aab022: '020102',
                  aab022Desc: '应用软件开发',
                },
              ],
            },
          ],
        },
        {
          aab022: '03',
          aab022Desc: '批发和零售业',
          children: [
            {
              aab022: '0301',
              aab022Desc: '零售业',
            },
            {
              aab022: '0302',
              aab022Desc: '批发业',
            },
          ],
        },
      ],
    }
  },
  methods: {
    handleChange(item) {
      this.industryCode = item.value
      this.industryName = item.label
      this.industryPath = item.pathLabels.join(' / ')
    },
  },
}
</script>

<style lang="scss" scoped>
.demo-page {
  min-height: 100vh;
  padding: 24px;
  box-sizing: border-box;
  background: #f5f7fb;
}

.demo-card {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
}

.demo-title {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: 600;
  color: #333333;
}

.result-item {
  margin-top: 16px;
  font-size: 16px;
  line-height: 24px;
  color: #666666;
}
</style>
