import store from '@/store'
import { navigateTo, showModal } from '@/utils/uni-api'
/**
 * 针对必须登录的路由，跳转到登录界面
 * @param {*} value
 * @returns
 */
const useJumpToLogin = (value) => {
  const { openid } = store.state.userInfo
  if (openid) {
    showModal('请登录后再访问').then(() => {
      navigateTo('login', 'packageCommon')
    })
  } else {
    showModal('网络错误，请重新打开小程序！').then(() => {
      // 此处强制用户重启
    })
  }
}

export { useJumpToLogin }
