<template>
  <div class="complaint-process">
    <img :src="showImage" />
  </div>
</template>

<script>
import imageProcess from './image/process.jpg'
import imageProcessNj from './image/process-nj.png'
import imageProcessNj1 from './image/process-nj1.png'

import config from '@/config'

export default {
  name: 'complainProcess',
  data() {
    return {}
  },
  computed: {
    showImage() {
      let { areaCode } = config
      if (areaCode == '511000') {
        return imageProcessNj1
      }
      return imageProcess
    },
  },
}
</script>

<style lang="scss" scoped>
.complaint-process {
  img {
    height: 100vh !important;
  }
}
</style>
