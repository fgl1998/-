const base = require('./applet.base.js');

/**
 * 通过module.exports方式提供给外部调用
 */
/**
 * 需要缓存的码值
 */
const sysCodeNameArr = [
	'AAC004',
	'AAC011',
	'ADC111',
	'AAE017',
	'YAE421',
	'AAC012',
	'YCC020',
	'AJC093',
	'YESORNO',
	'SEX',
	'YCC131_RD',
	'AAC005',
	'YCC131',
];

/**
 * 获取字典，字典初始化
 * @param {Object} callback 成功回调
 */
function initDictCache(callback) {
	if (sysCodeNameArr.length == 0) {
		return;
	}
	let codeType_str = "";
	let param = {
		codeTypes: sysCodeNameArr.join(",")
	};
	base.post('/dict/getDictTexts', param, data => {
		if (data.codeListMap) {
			let codeCacheMap = data.codeListMap
			// 设置缓存
			uni.setStorage({
				key: 'codeCacheMap',
				data: codeCacheMap
			})
			if (callback) {
				callback()
			}
		} else {
			uni.showToast({
				title: '初始化码表失败',
				icon: 'none',
				duration: 2000,
				mask: true
			})
		}
	}, data => {
		uni.showToast({
			title: '获取码值失败',
			icon: 'none',
			duration: 2000,
			mask: true
		})
	})
}

/**
 * 获取字典，字典初始化
 * @param {Object} code 字典类型
 * @param {Object} value  码值
 */
function loadDict(codeType, callback) {
	let param = {
		codeType: codeType.toUpperCase()
	}
	base.post('/dict/getDictText', param, data => {
		if (data.codeList) {
			callback(data.codeList)
		}
	}, data => {

	})
}

/**
 * 字典码值转换工具
 * @param {*} codeType 
 * @param {*} callBack 
 */
function getDictList(codeType, callBack) {
	let codeCacheMap = uni.getStorageSync("codeCacheMap")
	if (codeCacheMap != null && codeCacheMap.length > 0) {
		let dicts = codeCacheMap[codeType.toUpperCase()]
		if (typeof callBack == "function") {
			callBack(dicts);
		}
	} else {
		let codeType_str = "";
		let param = {
			codeType: codeType.toUpperCase()
		};
		base.post('/dict/getDictText', param, res => {
			if (res.codeList) {
				codeCacheMap = uni.getStorageSync("codeCacheMap")
				let dicts = res.codeList
				codeCacheMap[codeType.toUpperCase()] = dicts
				// 设置缓存
				uni.setStorage({
					key: 'codeCacheMap',
					data: codeCacheMap
				})
				if (typeof callBack == "function") {
					callBack(dicts);
				}
			} else {
				uni.showToast({
					title: '加载码表失败',
					icon: 'none',
					duration: 2000,
					mask: true
				})
			}
		}, data => {
			uni.showToast({
				title: '获取码值失败',
				icon: 'none',
				duration: 2000,
				mask: true
			})
		})
	}
}

/**
 * 字典码值转换工具 不取缓存避免同域问题
 * @param {*} codeType 
 * @param {*} callBack 
 */
function getDictListNoCatch(codeType, callBack) {
	let param = {
		codeType: codeType.toUpperCase()
	};
	base.post('/dict/getDictText', param, res => {
		if (res.codeList) {
			let dicts = res.codeList
			if (typeof callBack == "function") {
				callBack(dicts);
			}
		} else {
			uni.showToast({
				title: '加载码表失败',
				icon: 'none',
				duration: 2000,
				mask: true
			})
		}
	}, data => {
		uni.showToast({
			title: '获取码值失败',
			icon: 'none',
			duration: 2000,
			mask: true
		})
	})
}

/**
 * 字典码值转换工具
 */
function getDict(codeType, value) {
	let codeCacheMap = uni.getStorageSync("codeCacheMap")
	if (!codeCacheMap) {
		return null
	}
	let dicts = codeCacheMap[codeType.toUpperCase()]
	if (dicts) {
		if (value != null && value != "" && value != undefined) {
			for (let i = 0; i < dicts.length; i++) {
				if (dicts[i].value == value) {
					return dicts[i].label
				}
			}
		} else {
			// return dicts
			return value
		}
	}
	return value
}

module.exports = {
	getDict: getDict,
	loadDict: loadDict,
	getDictList: getDictList,
	initDictCache: initDictCache,
	getDictListNoCatch: getDictListNoCatch
}