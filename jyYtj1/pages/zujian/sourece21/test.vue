<template>
  <div class="demo-page">
    <div class="demo-card">
      <div class="demo-header">
        <div class="demo-title">行业弹窗组件示例</div>
        <button type="button" class="demo-open-button" @click="$refs.industryPopupSelector.open()">
          打开行业选择器
        </button>
      </div>

      <industry-popup-selector
        ref="industryPopupSelector"
        v-model="industryName"
        :moduleId="industryCode"
        :dataSource="industryOptions"
        :maxLevel="3"
        @setModalValue="handleChange"
      ></industry-popup-selector>

      <div class="result-item">已选编码：{{ industryCode || '无' }}</div>
      <div class="result-item">已选名称：{{ industryName || '无' }}</div>
      <div class="result-item">已选路径：{{ industryPath || '无' }}</div>
    </div>
  </div>
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

.demo-header {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.demo-title {
  font-size: 22px;
  font-weight: 600;
  color: #333333;
}

.demo-open-button {
  height: 40px;
  padding: 0 18px;
  border: none;
  border-radius: 999px;
  background: #0c6af7;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
}

.result-item {
  margin-top: 16px;
  font-size: 16px;
  line-height: 24px;
  color: #666666;
}

@media (max-width: 768px) {
  .demo-page,
  .demo-card {
    padding: 16px;
  }

  .demo-title {
    font-size: 18px;
  }

  .result-item {
    font-size: 14px;
  }
}
</style>
