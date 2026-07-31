<template>
  <view class="demo-page">
    <view class="demo-card">
      <view class="demo-title">行政区划弹窗组件示例</view>

      <view class="demo-subtitle">四级示例：省 / 市 / 县 / 乡镇街道</view>
      <modal-address-selector
        v-model="fullAddressName"
        :areaCode="fullAddressCode"
        :dataSource="provinceOptions"
        :levelLabels="['省', '市', '县', '乡镇街道']"
        @setAreaValue="handleFullChange"
      ></modal-address-selector>
      <view class="result-item">已选编码：{{ fullAddressCode || '-' }}</view>
      <view class="result-item">已选名称：{{ fullAddressName || '-' }}</view>

      <view class="demo-subtitle second">三级示例：省 / 市 / 县</view>
      <modal-address-selector
        v-model="provinceCityCountyName"
        :areaCode="provinceCityCountyCode"
        :dataSource="provinceCityCountyOptions"
        :levelLabels="['省', '市', '县']"
        placeholder="选择省市县"
        @setAreaValue="handleProvinceCityCountyChange"
      ></modal-address-selector>
      <view class="result-item">已选编码：{{ provinceCityCountyCode || '-' }}</view>
      <view class="result-item">已选名称：{{ provinceCityCountyName || '-' }}</view>

      <view class="demo-subtitle second">三级示例：市 / 县 / 乡镇街道</view>
      <modal-address-selector
        v-model="cityCountyTownName"
        :areaCode="cityCountyTownCode"
        :dataSource="cityCountyTownOptions"
        :levelLabels="['市', '县', '乡镇街道']"
        placeholder="选择市县乡镇街道"
        @setAreaValue="handleCityCountyTownChange"
      ></modal-address-selector>
      <view class="result-item">已选编码：{{ cityCountyTownCode || '-' }}</view>
      <view class="result-item">已选名称：{{ cityCountyTownName || '-' }}</view>

      <view class="demo-subtitle second">两级示例：市 / 县</view>
      <modal-address-selector
        v-model="cityCountyName"
        :areaCode="cityCountyCode"
        :dataSource="cityCountyOptions"
        :levelLabels="['市', '县']"
        placeholder="选择市县"
        @setAreaValue="handleCityCountyChange"
      ></modal-address-selector>
      <view class="result-item">已选编码：{{ cityCountyCode || '-' }}</view>
      <view class="result-item">已选名称：{{ cityCountyName || '-' }}</view>
    </view>
  </view>
</template>

<script>
import ModalAddressSelector from './index.vue'

export default {
  components: {
    ModalAddressSelector,
  },
  data() {
    return {
      fullAddressCode: '',
      fullAddressName: '',
      provinceCityCountyCode: '',
      provinceCityCountyName: '',
      cityCountyTownCode: '',
      cityCountyTownName: '',
      cityCountyCode: '',
      cityCountyName: '',
      provinceOptions: [
        {
          areaid: '140000',
          areaname: '山西省',
          children: [
            {
              areaid: '140100',
              areaname: '太原市',
              children: [
                {
                  areaid: '140105',
                  areaname: '小店区',
                  children: [
                    {
                      areaid: '140105001',
                      areaname: '坞城街道',
                    },
                    {
                      areaid: '140105002',
                      areaname: '平阳路街道',
                    },
                  ],
                },
                {
                  areaid: '140106',
                  areaname: '迎泽区',
                  children: [
                    {
                      areaid: '140106001',
                      areaname: '柳巷街道',
                    },
                  ],
                },
              ],
            },
            {
              areaid: '140200',
              areaname: '大同市',
              children: [
                {
                  areaid: '140212',
                  areaname: '新荣区',
                  children: [
                    {
                      areaid: '140212001',
                      areaname: '花园屯镇',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      provinceCityCountyOptions: [
        {
          areaid: '140000',
          areaname: '山西省',
          children: [
            {
              areaid: '140100',
              areaname: '太原市',
              children: [
                {
                  areaid: '140105',
                  areaname: '小店区',
                },
                {
                  areaid: '140106',
                  areaname: '迎泽区',
                },
              ],
            },
            {
              areaid: '140300',
              areaname: '阳泉市',
              children: [
                {
                  areaid: '140302',
                  areaname: '城区',
                },
                {
                  areaid: '140311',
                  areaname: '郊区',
                },
              ],
            },
          ],
        },
      ],
      cityCountyTownOptions: [
        {
          areaid: '140100',
          areaname: '太原市',
          children: [
            {
              areaid: '140105',
              areaname: '小店区',
              children: [
                {
                  areaid: '140105001',
                  areaname: '坞城街道',
                },
                {
                  areaid: '140105002',
                  areaname: '平阳路街道',
                },
              ],
            },
            {
              areaid: '140106',
              areaname: '迎泽区',
              children: [
                {
                  areaid: '140106001',
                  areaname: '柳巷街道',
                },
              ],
            },
          ],
        },
        {
          areaid: '140300',
          areaname: '阳泉市',
          children: [
            {
              areaid: '140302',
              areaname: '城区',
              children: [
                {
                  areaid: '140302001',
                  areaname: '上站街道',
                },
              ],
            },
          ],
        },
      ],
      cityCountyOptions: [
        {
          areaid: '140100',
          areaname: '太原市',
          children: [
            {
              areaid: '140105',
              areaname: '小店区',
            },
            {
              areaid: '140106',
              areaname: '迎泽区',
            },
          ],
        },
        {
          areaid: '140300',
          areaname: '阳泉市',
          children: [
            {
              areaid: '140302',
              areaname: '城区',
            },
            {
              areaid: '140311',
              areaname: '郊区',
            },
          ],
        },
      ],
    }
  },
  methods: {
    handleFullChange(item) {
      this.fullAddressCode = item.areaCode
      this.fullAddressName = item.areaname
    },
    handleProvinceCityCountyChange(item) {
      this.provinceCityCountyCode = item.areaCode
      this.provinceCityCountyName = item.areaname
    },
    handleCityCountyTownChange(item) {
      this.cityCountyTownCode = item.areaCode
      this.cityCountyTownName = item.areaname
    },
    handleCityCountyChange(item) {
      this.cityCountyCode = item.areaCode
      this.cityCountyName = item.areaname
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
