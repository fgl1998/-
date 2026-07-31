<template>
  <view class="demo-page">
    <view class="demo-card">
      <view class="demo-title">懒加载行政区划组件示例</view>

      <view class="demo-subtitle">四级示例：省 / 市 / 县 / 乡镇街道</view>
      <modal-address-remote-selector
        v-model="fullAddressName"
        :areaCode="fullAddressCode"
        :rootData="rootOptions"
        :fetchChildren="fetchMockChildren"
        :levelLabels="['省', '市', '县', '乡镇街道']"
        @setAreaValue="handleFullChange"
      ></modal-address-remote-selector>
      <view class="result-item">已选编码：{{ fullAddressCode || '-' }}</view>
      <view class="result-item">已选名称：{{ fullAddressName || '-' }}</view>

      <view class="demo-subtitle second">三级示例：省 / 市 / 县</view>
      <modal-address-remote-selector
        v-model="provinceCityCountyName"
        :areaCode="provinceCityCountyCode"
        :rootData="rootOptions"
        :fetchChildren="fetchMockChildren"
        :levelLabels="['省', '市', '县']"
        placeholder="选择省市县"
        @setAreaValue="handleProvinceCityCountyChange"
      ></modal-address-remote-selector>
      <view class="result-item">已选编码：{{ provinceCityCountyCode || '-' }}</view>
      <view class="result-item">已选名称：{{ provinceCityCountyName || '-' }}</view>
    </view>
  </view>
</template>

<script>
import ModalAddressRemoteSelector from './index.vue'
import { fetchAddressChildren, getRootAddressList } from './mock/api'

export default {
  components: {
    ModalAddressRemoteSelector,
  },
  data() {
    return {
      rootOptions: getRootAddressList(),
      fullAddressCode: '140105001000',
      fullAddressName: '',
      provinceCityCountyCode: '',
      provinceCityCountyName: '',
    }
  },
  methods: {
    fetchMockChildren(node) {
      return fetchAddressChildren(node)
    },
    handleFullChange(item) {
      this.fullAddressCode = item.areaCode
      this.fullAddressName = item.areaname
    },
    handleProvinceCityCountyChange(item) {
      this.provinceCityCountyCode = item.areaCode
      this.provinceCityCountyName = item.areaname
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
  max-width: 1400px;
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

.demo-subtitle {
  margin: 24px 0 16px;
  font-size: 18px;
  font-weight: 500;
  color: #333333;
}

.demo-subtitle.second {
  margin-top: 40px;
}

.result-item {
  margin-top: 12px;
  font-size: 16px;
  line-height: 24px;
  color: #666666;
}
</style>
