import bMapWxJssdk from '@/utils/map/bmap-wx.min.js'
import config from '@/config/index.js'
/**
 * 使用百度地图
 */
const useBMap = {
  data() {
    return {
      bMap: null,
    }
  },
  onLoad() {
    this.bMap = new bMapWxJssdk.BMapWX({
      ak: config.bMapKey,
    })
    this.getBMapWeather()
  },
  methods: {
    getBMapWeather() {
      this.bMap.weather({
        success(res) {
          console.log(res, 123)
        },
        fail(err) {
          console.log(err, 456)
        },
      })
    },
  },
}
export { useBMap }
