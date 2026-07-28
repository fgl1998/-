<template>
  <view class="policy-relief">
    <ComponentPanel title="政策详情">
      <div class="panel-content">
        <div
          @click="handlePreviewFile(baseUrl + item.chi215, item.chi212)"
          class="card"
          v-for="item in renderList"
          :key="item.chi215"
        >
          <div class="name">
            {{ item.chi212.substring(0, item.chi212.lastIndexOf('.')) }}
          </div>
          <div class="info">
            <div class="unit">{{ chi037_desc }}</div>
            <div class="time">{{ item.aae036.split(' ')[0] }}</div>
          </div>
        </div>
      </div>
    </ComponentPanel>
  </view>
</template>

<script>
import config from '@/config'
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
import { previewAndSaveFiles } from '@/utils/custom-api'
export default {
  name: 'PolicyRelief',
  components: {
    ComponentPanel,
  },
  data() {
    return {
      baseUrl: config.requestUrl + '/upload/downloadFile/',
      renderList: [],
      chi037_desc: '',
    }
  },
  onLoad(e) {
    const { hi21_zcList, chi037_desc } = e
    const list = JSON.parse(hi21_zcList)
    if (list && list.length > 0) {
      this.renderList = [...list]
      this.chi037_desc = chi037_desc
    }
  },
  methods: {
    // 预览政策文件
    handlePreviewFile(url, name) {
      const type = name.substring(name.lastIndexOf('.') + 1)
      previewAndSaveFiles(url, type)
    },
  },
}
</script>

<style lang="scss" scoped>
.policy-relief {
  width: 100%;
  padding: $spacing;

  .card {
    width: 100%;
    position: relative;
    padding: 0 $spacing;
    height: 214rpx;
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
}
</style>