/**
 * @projectName mobileMakerWeb
 * @author zhang wei
 * @date 2022-11-17 16:20
 */
import Vue from "vue";
/* import "./vant-module"; */
import "./baseModule";
import "../style/cover.less";
import '@vant/touch-emulator';

Vue.prototype.hideLabel = ["space", "label-con", "upload", "button", "button-group", "divider", "span", "photo", "bigTable", "iframe"];
Vue.prototype.disableLableArr = ["divider"];

Vue.prototype.setRestItem = function (restItem) {
	if (!restItem) {
		return;
	}
	/* if (restItem.disabled != null) {
		restItem.disabled = this.getItemParam(restItem.disabled,restItem);
	} */
	// console.log(restItem);
	restItem.disabled = this.getItemParam(restItem.disabled,restItem);
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