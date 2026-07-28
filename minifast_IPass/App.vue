<script>
import { customLogin, checkAppUpdate } from '@/utils/custom-api'

import { M_UPDATE_USER_INFO } from '@/store/constants'

import { useAppLaunch } from '@/hooks/analysis'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { useGetHaltMessage } from '@/hooks'

export default {
  // 当uni-app 初始化完成时触发（全局只触发一次）
  onLaunch(e) {
    // #ifdef MP-WEIXIN
    // 登录 登录成功后获取社保卡信息
    const { scene } = e
    this.$store.commit(M_UPDATE_USER_INFO, {
      scene
    })
    customLogin(false, true)
      .then((res) => {
        const { user_id } = res
        if (user_id) {
          useGetUserInfo(res)
        } else {
          this.$store.commit(M_UPDATE_USER_INFO, {
            ...res
          })
        }
      })
      .finally(() => {
        useAppLaunch(e)
      })
    // 获取停机维护信息并弹窗提示
    useGetHaltMessage()
    // #endif

    // #ifdef H5
    useAppLaunch(e)
    // #endif
  },
  // 当 uni-app 启动，或从后台进入前台显示
  onShow(e) {
    // this.$store.commit(M_UPDATE_USER_BEHAVIOR_DATA, null)
    // #ifdef MP-WEIXIN
    checkAppUpdate()
    // #endif
  },
  // 当 uni-app 从前台进入后台
  onHide(e) {
    console.info(`onHide => `, e)
  },
  // 当 uni-app 报错时触发
  onError(err) {
    console.warn(`onError => `, err)
  },
  // 页面不存在监听函数
  onPageNotFound(e) {
    console.info(`onPageNotFound => `, e)
  },
  // 监听系统主题变化
  onThemeChange(e) {
    console.info(`onThemeChange => `, e)
  }
}
</script>

<style lang="scss">
// 所有页面共用样式
@import './common/styles/scss/index.scss';
@import '@/common/iconfont/index.scss'; // iconfont
@import '@/common/fonts/PangMenZhengDao/PangMenZhengDao.scss'; // 字体文件
@import '@/common/fonts/YouSheBiaoTiHei/YouSheBiaoTiHei.scss'; // 字体文件
</style>
