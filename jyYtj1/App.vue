<script>
import { getCurrentareaName } from '@/static/public/utils/location.js'
import { verifyDevice } from '@/static/public/utils/device.js'
export default {
  created() {
    this.$utils.appStorage(this)
    setInterval(() => {
      let ace711 = uni.getStorageSync('ace711')
      let ace772 = uni.getStorageSync('ace772')
      //缓存中获取设备校验码
      //如果设备编码和校验码同时存在，则轮询
      // return
      if (ace711 && ace772) {
        let param = {
          ace711: ace711,
          ace772: ace772,
          ace769: '7',
          apiCode: 'jy204_hrm259',
          method: 'jy204_hrm259',
        }

        this.$utils.request(null, param, false, true, null).then((res) => {
          if (res.result.ace350) {
            //自动登录
            let loginParam = {
              authType: 'DEVICE_ID',
              user_type: 'UT01',
              ace350: res.result.ace350,
              yae100: '14',
            }
            this.$utils.request('/api/login/loginAuth.do', loginParam, false, false, 'publicity').then((res0) => {
              if (res0.token && res0.user?.loginUser) {
                uni.setStorageSync('userInfo', res0.user.loginUser)
                uni.setStorageSync('setToken', res0.token)
                setTimeout(() => {
                  this.$utils.redirectTo('/pages/index/index')
                }, 1000)
              }
            })
          }

          if (res.result.code === '-1001') {
            uni.removeStorageSync('ace711')
            uni.removeStorageSync('ace772')
            uni.removeStorageSync('userInfo')
            uni.removeStorageSync('resumeInfo')
            uni.removeStorageSync('setToken')
            clearInterval(uni.getStorageSync('timerTask'))
            this.$utils.showModal('提示', res.result.messge, false, (succ) => {
              uni.reLaunch({
                url: '/pages/machineRegister/machineRegister',
              })
            })
          }
        })
      } else {
        const pages = getCurrentPages()
        if (
          pages[pages.length - 1].route !== 'pages/machineRegister/machineRegister' &&
          pages[pages.length - 1].route !== 'pages/staticPage/staticPage'
        ) {
          uni.removeStorageSync('ace711')
          uni.removeStorageSync('ace772')
          uni.removeStorageSync('userInfo')
          uni.removeStorageSync('resumeInfo')
          uni.removeStorageSync('setToken')
          clearInterval(uni.getStorageSync('timerTask'))
          this.$utils.showModal('提示', '设备注册已失效，请重新注册！', false, (succ) => {
            uni.reLaunch({
              url: '/pages/machineRegister/machineRegister',
            })
          })
        }
      }
      verifyDevice(this)
    }, 5000)
  },
  onLaunch: function () {},
  onShow: function () {},
  onHide: function () {},
  mounted() {
    // this.disableDevTools();
    getCurrentareaName('ac6453603b41dfa9a6bd22b011e9e97e')
  },
  methods: {
    disableDevTools() {
      // 1. 禁用右键菜单
      document.addEventListener('contextmenu', function (e) {
        e.preventDefault()
        return false
      })

      // 2. 禁用 F12 等快捷键
      document.addEventListener('keydown', function (e) {
        // F12
        if (e.keyCode === 123) {
          e.preventDefault()
          return false
        }
        // Ctrl+Shift+I
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
          e.preventDefault()
          return false
        }
        // Ctrl+Shift+J
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
          e.preventDefault()
          return false
        }
        // Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
          e.preventDefault()
          return false
        }
        // Ctrl+U
        if (e.ctrlKey && e.keyCode === 85) {
          e.preventDefault()
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss">
/*每个页面公共css */
@import '~@/static/scss/common.scss';
@import '~@/static/scss/icon.scss';
</style>
