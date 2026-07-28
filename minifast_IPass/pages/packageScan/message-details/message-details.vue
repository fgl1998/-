<template>
  <div class="message-details">
    <block v-for="(item, index) in renderList" :key="index">
      <img :src="item" alt="" @click="handlePreviewImage(index)" />
    </block>
  </div>
</template>
<script>
import config from '@/config'
import { previewImage, showModal, switchTab } from '@/utils/uni-api'
import { requestWXGetFileBase64ByFileId } from '@/service/api'
export default {
  name: 'pageMD',
  data() {
    return {
      renderList: [],
    }
  },
  components: {},
  onLoad(e) {
    // pages/packageScan/message-details/message-details?chi215=dbfb6176492c46fd9dce44367ec4efc6,dbfb6176492c46fd9dce44367ec4efc6
    let { chi215 } = e
    if (chi215) {
      const chi215Arr = chi215.split(',')
      // console.log(chi215Arr, 'chi215Arr==')
      this.init(chi215Arr)
    } else {
      showModal('缺失必要参数chi215').then(() => {
        switchTab('home')
      })
    }
  },
  methods: {
    handlePreviewImage(i) {
      const data = this.renderList
      const current = data[i]
      previewImage(data, current)
    },
    // 请求文件下载
    requestDownloadFile(fileId) {
      return new Promise((resolve, reject) => {
        requestWXGetFileBase64ByFileId(fileId)
          .then((res) => {
            const { data } = res
            resolve(data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    async init(data) {
      let arr = []
      for (let i = 0, len = data.length; i < len; i++) {
        const item = data[i]
        const res = await this.requestDownloadFile(item)
        arr.push('data:image/png;base64,' + res)
      }
      this.renderList = [...arr]
    },
  },
  computed: {},
  watch: {},
}
</script>
<style lang="scss" scoped>
.message-details {
  padding: $spacing;
  img {
    width: 100%;
    height: 388.12rpx;
    margin-bottom: $spacing;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
