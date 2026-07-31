import App from './App'
import utils from './static/public/utils/api.js'
import check from './static/public/utils/check.js'
import cardUtil from './static/public/utils/cardUtil.js'
import Url from './static/public/utils/requestUrl.js'
import xssUtils from './static/public/utils/xssUtil.js'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 百度地图 调用百度
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  ak: 'qKDwtLCbBFu5PAb5EXYdPNmIXQccY07d',
})

import './static/public/directive/index'

import moment from 'moment'
moment.locale('zh-cn')

import uView from 'uview-ui'
Vue.use(uView)

Vue.prototype.$utils = utils //其他工具方法
Vue.prototype.$check = check //检查格式
Vue.prototype.$cardUtil = cardUtil //读卡工具
Vue.prototype.$host = Url.requestUrl //接口项目地址
Vue.prototype.$moment = moment
Vue.prototype.$xssUtils = xssUtils
// Vue.prototype.$baseImgSrc = Url.assertsUrl + '/images';

Vue.prototype.$baseImgSrc = '/static/images'
// Vue.prototype.$downLoadImgSrc = Url.requestUrl + '/api/base/downloadBusinessFile.do?channelCode=lgApplet&sysCode=jyplat&fileId='; //图片下载地址
Vue.prototype.$downLoadImgSrc = Url.requestUrl + '/api/businessCommon/fileDownload?channelCode=jyyz&fileId=' //图片下载地址

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App,
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
Vue.use(UIMUI, store, config)
export function createApp() {
  const app = createSSRApp(App)
  return {
    app,
  }
}
// #endif
