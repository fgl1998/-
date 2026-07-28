import qqMapWxJssdk from '@/utils/map/qqmap-wx-jssdk.min.js'
import config from '@/config/index.js'
/**
 * 使用腾讯地图
 */
const useQQMap = {
  data() {
    return {
      qqMap: null,
    }
  },
  created() {
    this.qqMap = new qqMapWxJssdk({
      key: config.qqMapKey,
    })
  },
  methods: {},
}
export { useQQMap }
