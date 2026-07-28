import { getLocation, getSetting } from '@/utils/uni-api'
/**
 * 验证用户是否授权其位置信息 并且获取用户位置信息 目前只适用于微信端
 */
const useUserLocation = {
  data() {
    return {
      isAuthorizationUserLocation: false, // 是否授权获取用户位置信息
      userLocation: null // 用户位置信息
    }
  },
  created() {
    this.ckeckUserLocationAuthorizatio()
  },
  methods: {
    // 获取用户地理微信信息
    getUserLocationInfo() {
      getLocation()
        .then((res) => {
          this.userLocation = {
            ...res,
            long: res.longitude,
            lat: res.latitude
          }
          this.isAuthorizationUserLocation = true
        })
        .catch((err) => {
          this.isAuthorizationUserLocation = false
        })
    },
    // 检测用户是否授权使用地理位置信息
    ckeckUserLocationAuthorizatio() {
      getSetting()
        .then((res) => {
          const { authSetting } = res
          // 已经授权 || 未授过权
          if (authSetting['scope.userLocation'] === true || authSetting['scope.userLocation'] === undefined) {
            this.getUserLocationInfo()
          }
          // 已拒绝授权
          if (authSetting['scope.userLocation'] === false) {
            this.isAuthorizationUserLocation = false
          }
        })
        .catch((err) => {
          this.isAuthorizationUserLocation = false
        })
    }
  }
}
export { useUserLocation }
