import store from '@/store'
import { useGetUserInfo } from '@/hooks'
import { requestWXGetUserInfoByDzsb } from '@/service/api'

/**
 * 获取用户信息 h5端使用
 */
const useGetUserInfoH5 = {
  onLoad() {
    // #ifdef H5
    this.getH5UserInfo()
    // #endif
  },
  methods: {
    /**
     * 获取用户信息 h5 使用
     */
    getH5UserInfo() {
      // #ifdef H5
      const { userInfo } = store.state
      if (userInfo.user_id) {
        return
      }

      requestWXGetUserInfoByDzsb().then((res) => {
        const { aac002, aac003, channelNo, token } = res.data
        useGetUserInfo({
          ...res.data,
          userName: aac003,
          idCard: aac002,
          user_id: aac002,
          loginId: aac002,
          openId: aac002,
          openid: aac002,
          sessionId: aac002,
          tel: channelNo,
          userId: aac002,
          token
        })
      })
      // #endif
    }
  }
}

export { useGetUserInfoH5 }
