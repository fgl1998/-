<template>
  <div class="epidemic-prevention-details" v-if="isRequestOver">
    <div class="card-wrapper">
      <CardItem :renderData="cardInfo"></CardItem>
    </div>
    <!-- <div class="files">
      <block v-for="item in uploadFiles" :key="item.id">
        <div class="file">
          <UploadFile :title="item.name" :imageSrc="item.src"></UploadFile>
        </div>
      </block>
    </div> -->
  </div>
</template>
<script>
import CardItem from './CardItem.vue'
import UploadFile from './UploadFile.vue'

import config from '@/config'
import { requestWXGetRegisterBaseInfo } from '@/service/api'

export default {
  name: 'pageEPD',
  data() {
    return {
      cardInfo: {},
      uploadFiles: [],
      isRequestOver: false,
    }
  },
  components: {
    CardItem,
    UploadFile,
  },
  onLoad(e) {
    if (e.id) {
      this.getData(e.id)
    }
  },
  methods: {
    getData(id) {
      const { requestUrl } = config
      requestWXGetRegisterBaseInfo(id)
        .then((res) => {
          const { data } = res
          const { epivMaterPoList } = data
          if (data) {
            this.cardInfo = {
              ...data,
            }
          }

          if (epivMaterPoList && epivMaterPoList.length > 0) {
            let arr = []
            epivMaterPoList.map((item) => {
              arr.push({
                id: item.id,
                name: item.epmaname,
                src: requestUrl + '/upload/downloadFile/' + item.storageid,
              })
            })
            this.uploadFiles = [...arr]
          }
        })
        .finally(() => {
          this.isRequestOver = true
        })
    },
  },
}
</script>
<style lang="scss" scoped>
.epidemic-prevention-details {
  padding: $spacing 0;
  .card-wrapper {
    padding: 0 $spacing;
  }
  .files {
    padding-top: $spacing;
    .file {
      margin-bottom: $spacing;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
