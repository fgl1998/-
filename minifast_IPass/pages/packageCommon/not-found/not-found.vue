<template>
  <view class="not-found">
    <ComponentNotFound type="building-02"></ComponentNotFound>
  </view>
</template>

<script>
import ComponentNotFound from '@/components/common/ez-not-found/ez-not-found.vue'

import config from '@/config'
import { setNavigationBarTitle } from '@/utils/uni-api/index.js'
export default {
  name: 'pageNotFound',
  components: {
    ComponentNotFound,
  },
  data() {
    return {}
  },
  onLoad(e) {
    const { title } = e
    if (title) {
      setNavigationBarTitle(title)
    } else {
      const { areaName_zh } = config
      setNavigationBarTitle(areaName_zh + '一卡通')
    }
  },
  onReady() {},
  onShow() {},
  onHide() {},
  methods: {},
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
