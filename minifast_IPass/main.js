import App from './App'

// 引入全局状态管理 store
import store from './store'
import { useMixinStatisticalRouteInfo } from '@/hooks/analysis/useMixinStatisticalRouteInfo'

// 引入自定义过滤器 注意：vue3.0不再支持过滤器
import Vue from './utils/custom-filter'

Vue.mixin(useMixinStatisticalRouteInfo)
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  store,
  ...App,
})

app.$mount()
