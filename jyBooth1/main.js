// #ifndef VUE3
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import utils from './static/public/utils/api.js';
import check from './static/public/utils/check.js'
import cardUtil from './static/public/utils/cardUtil.js'
import requestConstant from './static/public/utils/requestUrl.js'
import loginConfig from './static/public/utils/login_config.js'
import codeConfig from './static/public/utils/code_config.js'
import request from './static/public/utils/app_request.js'
import ws from './static/public/utils/websocket.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'swiper/css/swiper.min.css';
import defaultData from './static/public/config/default_data.js'
import qrCodeConfig from './static/public/config/qr_code_config'
import device from './static/public/utils/device';
import './pages/personInterview/component/remoteRoom/assets/icons/index.js';
import InitObject from './static/public/uim/InitObject'
import './static/public/uim/uim-web-ui.css'
// import '@yh/uim-web-ui/lib/uim-web-ui.css'
import * as UIMUI from '@yh/uim-web-ui'
import Config from './static/public/uim/config.js'

import './static/public/directive/index.js'

Vue.prototype.$ws = ws
Vue.prototype.$utils = utils //其他工具方法
Vue.prototype.$check = check //检查格式
Vue.prototype.$cardUtil = cardUtil //读卡工具
Vue.prototype.$http = request
Vue.prototype.$host = requestConstant.requestUrl; //接口项目地址
Vue.prototype.$requestConstant = requestConstant
Vue.prototype.$fileLoadUrl = requestConstant.fileLoadUrl; //文件下载地址
Vue.prototype.$fileUploadUrl = requestConstant.requestUrl + requestConstant.fileUploadUrl + '?&channelCode=' + requestConstant.channelCode + '&sysCode=' + requestConstant.systemCode; //文件上传地址
Vue.prototype.$loginConfig = loginConfig
Vue.prototype.$codeConfig = codeConfig
Vue.prototype.$defaultData = defaultData
Vue.prototype.$qrCodeConfig = qrCodeConfig
Vue.prototype.$device = device
// 获取真实图片地址
Vue.prototype.getRealImgUrl = utils.getRealImgUrl
Vue.prototype.getFileLoadUrlOrDefault = utils.getFileLoadUrlOrDefault
// 薪资数据处理 1000 - k, 10000 - w
Vue.prototype.getAbbreviatSalary = function (number) {
    return number / 10000 >= 1
        ? String(Number((number / 10000).toFixed(2)) * 100 / 100).concat("w")
        : number / 1000 >= 1
            ? String(Number((number / 1000).toFixed(2)) * 100 / 100).concat("k")
            : String(number);
}
Vue.use(ElementUI);
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {}
})
Vue.use(UIMUI, store, Config)
// InitObject.initObject(Vue)


Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
    store,
})
app.$mount()
// #endif

// #ifdef VUE3
import {createSSRApp} from 'vue'

export function createApp() {
    const app = createSSRApp(App)
    return {
        app
    }
}

// #endif
