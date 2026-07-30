import smUtil from './index.js'
import { CRYPT_TYPE, BACK_DECRYPT } from '@/config.js'

/**
 * 加密级别
 * 0.不做任何处理 1.加密 2.加密+签名 3.加密+签名+时间戳
 */
const reqDataLevel = CRYPT_TYPE
/**
 * 返回数据解密 false不解密，true解密
 */
const backDecrypt = BACK_DECRYPT
/**
 * 返回数据解密密钥
 */
const decryptKey = "437a05b1c00b2d6a54453cc28ad23ab5167b2e1dc774ec4a3e9958679bba2992"
/**
 * 不加密url地址
 */
const noDecryptUrls = []
/**
 * 支付宝小程序加密密钥
 */
const publicKeys = {
	applet001: `MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////v//////////
//////////8AAAAA//////////8wRAQg/////v////////////////////8AAAAA
//////////wEICjp+p6dn140TVqeS89lCafzl4n1FauPkt28vUFNlA6TBEEEMsSu
LB8ZgRlfmQRGajnJlI/jC7/yZgvhcVpFiTNMdMe8Nzai9PZ3nFm9zuNraSFT0KmH
fMYqR0AC3zLlITnwoAIhAP////7///////////////9yA99rIcYFK1O79Ak51UEj
AgEBA0IABIZKpXWPbJ4h4Wi0W8+kJUgIt6I6d1L3XtjW+KLplkEQGERMdpggyhLo
R2mh0HLsB3c+CltiwJTq9vocY9wYpMY=`,
	app001: `MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////v//////////
//////////8AAAAA//////////8wRAQg/////v////////////////////8AAAAA
//////////wEICjp+p6dn140TVqeS89lCafzl4n1FauPkt28vUFNlA6TBEEEMsSu
LB8ZgRlfmQRGajnJlI/jC7/yZgvhcVpFiTNMdMe8Nzai9PZ3nFm9zuNraSFT0KmH
fMYqR0AC3zLlITnwoAIhAP////7///////////////9yA99rIcYFK1O79Ak51UEj
AgEBA0IABC5pdyCBrnWBLk3cYb/0jUQCodjfmqcBmuXjcuAcYmAutgyE/s5kitJ3
JmQCzXP6l+B4c9++hHTYvf+mxCxSW5w=`,
	'osp-02-006-app': `MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////v//////////
//////////8AAAAA//////////8wRAQg/////v////////////////////8AAAAA
//////////wEICjp+p6dn140TVqeS89lCafzl4n1FauPkt28vUFNlA6TBEEEMsSu
LB8ZgRlfmQRGajnJlI/jC7/yZgvhcVpFiTNMdMe8Nzai9PZ3nFm9zuNraSFT0KmH
fMYqR0AC3zLlITnwoAIhAP////7///////////////9yA99rIcYFK1O79Ak51UEj
AgEBA0IABC5pdyCBrnWBLk3cYb/0jUQCodjfmqcBmuXjcuAcYmAutgyE/s5kitJ3
JmQCzXP6l+B4c9++hHTYvf+mxCxSW5w=`,
	'osp-02-007-wechat': `MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////v//////////
//////////8AAAAA//////////8wRAQg/////v////////////////////8AAAAA
//////////wEICjp+p6dn140TVqeS89lCafzl4n1FauPkt28vUFNlA6TBEEEMsSu
LB8ZgRlfmQRGajnJlI/jC7/yZgvhcVpFiTNMdMe8Nzai9PZ3nFm9zuNraSFT0KmH
fMYqR0AC3zLlITnwoAIhAP////7///////////////9yA99rIcYFK1O79Ak51UEj
AgEBA0IABIZKpXWPbJ4h4Wi0W8+kJUgIt6I6d1L3XtjW+KLplkEQGERMdpggyhLo
R2mh0HLsB3c+CltiwJTq9vocY9wYpMY=`,
	'zwfw-01-002-zww': `MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////v//////////
//////////8AAAAA//////////8wRAQg/////v////////////////////8AAAAA
//////////wEICjp+p6dn140TVqeS89lCafzl4n1FauPkt28vUFNlA6TBEEEMsSu
LB8ZgRlfmQRGajnJlI/jC7/yZgvhcVpFiTNMdMe8Nzai9PZ3nFm9zuNraSFT0KmH
fMYqR0AC3zLlITnwoAIhAP////7///////////////9yA99rIcYFK1O79Ak51UEj
AgEBA0IABJbHmRQghrWu2L2/2PGgqmYQ/rHrMWG1PKUbMsuucZXX2i9Vz9W1cSJX
7VX9iknDvH1i0sKVxIc+5gXFVDpsZyk=`
}

const sm4Key = "A4a2gRHrWDvtUaGu"

/**
 * 数据加密
 * @param {Object} parameterObj
 */
function cryptoData(parameterObj, channelCode, url) {
	//不做任何处理0
	if (reqDataLevel == 0) {
		return parameterObj
	}
	let publicKey = publicKeys[channelCode]
	if(!publicKey) {
		console.log("请设置对应渠道的加密公钥！")
		return;
	}
	if(url) {
		for(let i=0;i<noDecryptUrls.length;i++) {
			if(url.indexOf(noDecryptUrls[i]) != -1) {
				return parameterObj;
			}
		}
	}
	//只加密1
	if(reqDataLevel == 1){
		return encryptedParam(parameterObj, publicKey)
	}
	//既加密  又验签2   加密  验签  时间戳（混合）3
	if(reqDataLevel == 2 || reqDataLevel == 3){
		return encryptedAndSignParam(parameterObj, publicKey, channelCode)
	}
}

//加密
function encryptedParam(parameterObj, publicKey){
	if (typeof parameterObj === 'string') {
		Modal.error({
			title: '提示',
			content: '加密只支持对象形式{}',
		})
		return
	}
	const newParameterObj = {}
	const ivKey = getRandomKey()
	for (const obj in parameterObj) {
		let value = ''
		if (Array.isArray(parameterObj[obj])) {
			if (parameterObj[obj].length === 0) {
				value = ''
			} else {
				value = JSON.stringify(parameterObj[obj])
			}
		} else {
			value = parameterObj[obj]
		}
		if (value == '' || value == null) {
			value = ''
		} else {
			if(obj != 'channelCode') {
				value = smUtil.sm4Encrypt(value, ivKey)
			}
		}
		newParameterObj[obj] = value
	}
	newParameterObj.ivKey = smUtil.sm2Encrypt(ivKey, publicKey)
	return newParameterObj
}

//加密和验签
function encryptedAndSignParam(parameterObj, publicKey, channelCode){
	if (typeof parameterObj === 'string') {
		Modal.error({
			title: '提示',
			content: '加密只支持对象形式{}',
		})
		return
	}
	parameterObj = signParam(parameterObj)
	let sign = getSignStr(parameterObj)
	//时间戳
	let signTime = Date.now()
	//签名后的内容
	parameterObj.sign = smUtil.sm3Sign(channelCode + signTime + sign)
	let newParameterObj = {}
	const ivKey = getRandomKey()
	for (const obj in parameterObj) {
		let value = ''
		if (Array.isArray(parameterObj[obj])) {
			if (parameterObj[obj].length === 0) {
				value = ''
			} else {
				value = JSON.stringify(parameterObj[obj])
			}
		} else {
			value = parameterObj[obj]
		}
		if (value == '' || value == null) {
			value = ''
		} else {
			if(obj != 'channelCode') {
				value = smUtil.sm4Encrypt(value, ivKey)
			}
		}
		newParameterObj[obj] = value
	}
	newParameterObj.signTime = smUtil.sm4Encrypt(signTime, ivKey)
	newParameterObj.ivKey = smUtil.sm2Encrypt(ivKey, publicKey)
	return newParameterObj
}
function getSignStr(parameterObj) {
	let keys = []
	for(let key in parameterObj) {
		keys.push(key)
	}
	keys.sort()
	let str = ""
	for(let i in keys) {
		if(str == "") {
			str += keys[i]+"="+parameterObj[keys[i]]
		} else {
			str += "&"+keys[i]+"="+parameterObj[keys[i]]
		}
	}
	return str;
}
//验签前处理参数
function signParam(parameterObj){
	let newParameterObj = {}
	for(let item in parameterObj){
		if(parameterObj[item]){
			newParameterObj[item] = parameterObj[item]
		} else {
			newParameterObj[item] = ""
		}
	}
	return newParameterObj
}

function getRandomKey() {
	const random = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
		'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g',
		'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
	let key = ''
	for (let i = 0; i < 16; i++) {
		const index = Math.floor(Math.random() * 62)
		key += random[index]
	}
	return key
}

/**
 * sm4加密
 * @param content
 * @returns {*}
 */
function doEncrypt(content) {
	if (content instanceof Object) {
		content = JSON.stringify(content)
	}
	return smUtil.sm4Encrypt(content, sm4Key)
}
/**
 * sm4解密
 * @param encryptData
 * @returns {*|string|[]|string}
 */
function doDecrypt(encryptData) {
	let data = smUtil.sm4Decrypt(encryptData, sm4Key)
	if (!data) {
		return data
	}
	if ((data.startsWith('{') && data.endsWith('}')) || (data.startsWith('[') && data.endsWith(']'))) {
		data = JSON.parse(data)
	}
	return data
}

/**
 * 返回数据解密
 */
function decryptResult(res) {
    if(!backDecrypt || !res || !res.data || Object.keys(res.data).length === 0) {
      return res;
    }
    const data_ = res.data
	const ivKey = smUtil.sm2Decrypt(data_.ivKey, decryptKey)
    const dataStr = smUtil.sm4Decrypt(data_.data, ivKey)
    const signTime = smUtil.sm4Decrypt(data_.signTime, ivKey)
    const sign = smUtil.sm4Decrypt(data_.sign, ivKey)
    const sign_ = smUtil.sm3Sign(`${signTime}:${dataStr}`)
    if(sign !== sign_.toLowerCase()) {
      throw new Error('验签失败！')
    }
    const timestamp_ = Date.now()
    if(timestamp_ - Number(signTime) > 600000) {
      throw new Error('数据已失效，请稍后重新！')
    }
    res.data = JSON.parse(dataStr)
    return res;
}

export default {
   cryptoData,
   doEncrypt,
   doDecrypt,
   doEncrypt,
   doDecrypt,
   decryptResult
}