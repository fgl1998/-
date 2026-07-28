import config from '@/config'
import { getLocation } from '@/utils/uni-api'
// #ifdef MP-WEIXIN
import aMapWxJssdk from '@/utils/map/amap-wx.js'
// #endif

/**
 * 使用高德地图
 */
const useAMap = {
  data() {
    return {
      aMap: null,
      weatherInfo: {},
    }
  },
  created() {
    // #ifdef MP-WEIXIN
    this.aMap = new aMapWxJssdk.AMapWX({
      key: config.aMapKey,
    })
    this.getAMapWeatherWEIXIN()
    // #endif
    // #ifdef H5
    this.getAMapWeatherH5()
    // #endif
  },
  mounted() {},
  methods: {
    getAMapWeatherH5() {
      getLocation()
        .then((res) => {
          uni.request({
            method: 'GET',
            url: 'https://restapi.amap.com/v3/geocode/regeo',
            data: {
              key: config.aMapKeyH5,
              location: `${res.longitude},${res.latitude}`,
              poitype: '中国',
            },
            success: ({ data }) => {
              if (data.infocode === '10000') {
                const { adcode } = data.regeocode.addressComponent
                let url2 =
                  'https://restapi.amap.com/v3/weather/weatherInfo?key=' +
                  config.aMapKeyH5 +
                  '&city=' +
                  adcode
                uni.request({
                  method: 'GET',
                  url: url2,
                  success: (res) => {
                    const { infocode, lives } = res.data
                    if (infocode === '10000') {
                      const weatherInfo = lives[0]
                      this.weatherInfo = {
                        ...weatherInfo,
                      }
                    }
                  },
                  fail: (err) => {
                    console.log(err)
                  },
                })
              }
            },
            fail: (r) => {
              console.log(r)
            },
          })
        })
        .catch((err) => {
          console.log(err, 123455)
        })
    },
    getAMapWeatherWEIXIN() {
      const _this = this
      this.aMap.getWeather({
        success(res) {
          // console.log(res)
          _this.weatherInfo = { ...res.liveData }
        },
        fail(err) {
          // console.log(err)
        },
      })
    },
  },
}
export { useAMap }
