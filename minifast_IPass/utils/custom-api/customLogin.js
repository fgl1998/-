import { login, showModal, navigateTo } from '@/utils/uni-api'
import { requestWXGetOpenId } from '@/service/api'
import store from '@/store'
import { M_UPDATE_USER_INFO } from '@/store/constants'
/**
 * 自定义登录 业务逻辑请自行更改
 * @param {Boolean} [showTip]  用户未登录时 是否进行提示
 * @param {Boolean} [isShowLoading]  是否显示加载中
 * @returns {Promise}
 *
 * @example
  customLogin().then(res => {
    // 登录成功
  }).catch(err => {
    // 登录失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const customLogin = (showTip = true, isShowLoading = false) => {
  return new Promise((resolve, reject) => {
    login()
      .then((res) => {
        const { code } = res
        if (code) {
          requestWXGetOpenId(code, isShowLoading)
            .then((res) => {
              const { openid, sessionId, wxUserInfo, token } = res.data
              if (wxUserInfo) {
                resolve({
                  sessionId,
                  openid,
                  openId: openid,
                  user_id: wxUserInfo.userId,
                  userName: wxUserInfo.userName,
                  idCard: wxUserInfo.idCard,
                  loginId: wxUserInfo.loginId,
                  tel: wxUserInfo.tel,
                  avatarUrl: wxUserInfo.portraiturl,
                  token,
                })
              } else {
                let routes = getCurrentPages()
                let curRoute = routes[routes.length - 1].route
                // 没有绑定信息 未登录 并也不为扫码后进入的家庭成员加入页面
                if (showTip && curRoute !== 'pages/packageHome/home-add/home-add') {
                  if (!openid) {
                    showModal('openid 数据解析失败，请联系管理员！')
                  } else {
                    showModal('检测到您还未进行登录验证，点击确定按钮进行登录验证！', '提示', true)
                      .then((res) => {
                        store.commit(M_UPDATE_USER_INFO, {
                          isCancelLogin: false,
                        })
                        navigateTo('login', 'packageCommon')
                      })
                      .catch(() => {
                        store.commit(M_UPDATE_USER_INFO, {
                          isCancelLogin: true,
                        })
                      })
                      .finally(() => {
                        resolve({
                          openid,
                        })
                      })
                  }
                } else {
                  resolve({
                    openid,
                  })
                }
              }
            })
            .catch((err) => {
              reject(err)
            })
        }
      })
      .catch((err) => {})
  })
}
export { customLogin }
