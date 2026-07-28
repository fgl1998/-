<template>
  <div class="attachment page-wrapper">
    <div class="item" v-for="(item, index) in imageList" :key="index">
      <image :src="item.path" mode="aspectFit" @click="onClick(index)" />
    </div>
  </div>
</template>
<script>
  // https://ybimg.widthsoft.com/ybnx2021/zc_Resources/2020/09/000005F8EFDB.jpg
  import { requestSZGetResourcesAttach, requestSZGetVoucherAttach, requestSZGetAssetsAttach } from '@/service/api'
  import { showModal, navigateBack, previewImage } from '@/utils/uni-api'
  export default {
    name: 'attachment',
    components: {},
    data() {
      return {
        imageList: []
      }
    },
    methods: {
      getRoucesAttach(resourcesId) {
        requestSZGetResourcesAttach(resourcesId).then((res) => {
          const { data } = res
          if (!data || data.length == 0) {
            showModal('暂无附件')
            setTimeout(() => {
              navigateBack()
            }, 1000)
          }
          this.imageList = data
        })
      },
      getVoucherAttach(voucherId) {
        requestSZGetVoucherAttach(voucherId).then((res) => {
          const { data } = res
          if (!data || data.length == 0) {
            showModal('暂无附件')
            setTimeout(() => {
              navigateBack()
            }, 1000)
          }
          this.imageList = data
        })
      },
      getAssetsAttach(assetsId) {
        requestSZGetAssetsAttach(assetsId).then((res) => {
          const { data } = res
          if (!data || data.length == 0) {
            showModal('暂无附件')
            setTimeout(() => {
              navigateBack()
            }, 1000)
          }
          this.imageList = data
        })
      },
      onClick(index) {
        const urls = []
        let url = ''
        this.imageList.forEach((item, i) => {
          urls.push(item.path)
          if (index === i) {
            url = item.path
          }
        })

        previewImage(urls, url)
      }
    },
    // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
    onLoad(e) {
      const { resourcesId, voucherId, assetsId } = e
      if (resourcesId) {
        this.getRoucesAttach(resourcesId)
      }
      if (voucherId) {
        this.getVoucherAttach(voucherId)
      }
      if (assetsId) {
        this.getAssetsAttach(assetsId)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .attachment {
    width: 100%;
    padding: $spacing;
    .item {
      width: 100%;
      height: 400rpx;
      background-color: #f4f8ff;
      border-radius: 4rpx;
      overflow: hidden;
      margin-bottom: $spacing;
      display: flex;
      justify-content: center;
      align-items: center;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
</style>
