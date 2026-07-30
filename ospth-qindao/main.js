import Vue from 'vue'
import App from './App'
import store from './store'
import base from './static/public/utils/applet.base.js'
import user from './static/public/utils/applet.user.js'
import util from './static/public/utils/applet.util.js'
import dict from './static/public/utils/applet.dict.js'
import svc from './static/public/utils/applet.service.js'
import gather from './static/public/utils/applet.gather.js'
import QQMapWX from './static/common/js/qqmap-wx-jssdk.min.js'//地图
import './static/common/terminalUtil.js'
import commonJs from './static/common/commonJs.js'
import filters from '@osppm/filter/index.js'
import '@/components/providentFund/index'
import MockData  from '@osppm/mock/index.js'
import mixins from './common/mixin/index.js'
import uView from 'uview-ui';

Vue.use(uView);

import Vant from 'vant'
Vue.use(Vant);

import { Dialog } from 'vant'
Vue.use(Dialog)
// 挂载到全局
Vue.prototype.$dialog = Dialog


uni.$mock = MockData
uni.$mixin = mixins
// 注册过滤器
Vue.use(filters)


//基础方法等
Vue.prototype.$base = base;
//用户登录、注册等用户相关
Vue.prototype.$user = user;
//格式校验工具
Vue.prototype.$util = util;
//码表工具
Vue.prototype.$dict = dict;
//栏目、服务、内容、专题等
Vue.prototype.$svc = svc;
// 数据采集
Vue.prototype.$gather = gather;
// 通用工具方法
Vue.prototype.$commonJs = commonJs;

Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$QQMapWX = QQMapWX;
Vue.prototype.$QQMapKey="RF6BZ-UAC34-ESVUF-D5FGH-QY4LZ-FCF23"; // 地图key
Vue.prototype.$chooseLocationKey = "OMLBZ-TOUCO-OJHWC-SA3QD-4F5C7-GYB4S"; // 定位key


Vue.prototype.setRestItem = function (restItem) {
	if (!restItem) {
		return;
	}
	if (restItem.disabled != null) {
		restItem.disabled = this.getItemParam(restItem.disabled,restItem);
	}
};

Vue.prototype.getItemParam = function (value,column) {
	let this_ = this.getVue();
	if (this_.disabledParams[column.name] != null) {
		if (this_.params[value]!=null){
			return this_.params[value]
		}
		return this_.disabledParams[column.name]
	}
	if (value==null||value === ''){
		this_.$set(this_.disabledParams,column.name,false)
		return this_.disabledParams[column.name];
	}
	if (typeof value === "boolean") {
		this_.$set(this_.disabledParams,column.name,value)
		return this_.disabledParams[column.name];
	}
	if (!value || value === "true") {
		this_.$set(this_.disabledParams,column.name,true)
		return this_.disabledParams[column.name];
	} else if (value === "false") {
		this_.$set(this_.disabledParams,column.name,false)
		return this_.disabledParams[column.name];
	} else if (this_.params[value] == null) {
		this_.$set(this_.disabledParams,column.name,false)
		return this_.disabledParams[column.name];
	}
	Object.defineProperty(this_.disabledParams,column.name, {//设置双向绑定
		get () {
			return this_.params[value]
		},
		set (newVal) {
			this_.params[value]=newVal
		}
	})
	return this_.disabledParams[column.name];
};

Vue.prototype.initVue = function (obj) {
	window.$self=obj;
	window.$vm=obj;
	let url = window.location.href;
	let hash = url.split("/");
	let key = hash[hash.length - 1];
	if (key.indexOf("?") > -1) {
		key = key.slice(0, key.indexOf("?"));
	}
	window[key] = obj;
};
Vue.prototype.getVue = function () {
	let url = window.location.href;
	let hash = url.split("/");
	let key = hash[hash.length - 1];
	if (key.indexOf("?") > -1) {
		key = key.slice(0, key.indexOf("?"));
	}
	return window[key];
};


const app = new Vue({
    store,
    ...App
})
app.$mount()
