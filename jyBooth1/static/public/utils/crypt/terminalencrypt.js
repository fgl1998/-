import smUtil from './cryptoFn.js'
import Hex from './hex.js'
import publicKeys from './public_key.js'

/**
 * 加密级别
 * 0.不做任何处理 1.加密 2.加密+签名 3.加密+签名+时间戳
 */
const reqDataLevel = 0

/**
 * applet001 公钥
 */
const publicKey_applet = `MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////v//////////
//////////8AAAAA//////////8wRAQg/////v////////////////////8AAAAA
//////////wEICjp+p6dn140TVqeS89lCafzl4n1FauPkt28vUFNlA6TBEEEMsSu
LB8ZgRlfmQRGajnJlI/jC7/yZgvhcVpFiTNMdMe8Nzai9PZ3nFm9zuNraSFT0KmH
fMYqR0AC3zLlITnwoAIhAP////7///////////////9yA99rIcYFK1O79Ak51UEj
AgEBA0IABMdL8s4y9U0jk43YQsghQ7xfBAboolPw8VoVvWbsULSCb/IcmLt9oRZ9
76x+vyObLqpdgS+/sMo+ZEx5DyGItg8=`
/**
 * 支付宝小程序加密密钥
 */
const publicKey_alipay = `MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////v//////////
//////////8AAAAA//////////8wRAQg/////v////////////////////8AAAAA
//////////wEICjp+p6dn140TVqeS89lCafzl4n1FauPkt28vUFNlA6TBEEEMsSu
LB8ZgRlfmQRGajnJlI/jC7/yZgvhcVpFiTNMdMe8Nzai9PZ3nFm9zuNraSFT0KmH
fMYqR0AC3zLlITnwoAIhAP////7///////////////9yA99rIcYFK1O79Ak51UEj
AgEBA0IABMOvgpVDo7T5974sCdFiGfELsj34OkSnYjz7jS1v/z4qoh6emD55h5lg
E0+KQKdIVRKZiSJab1Wg0sd92cN/dMo=`

/**
 * 西安人社通app
 */
const publicKey_ggfwxarsapp = `MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////v//////////
//////////8AAAAA//////////8wRAQg/////v////////////////////8AAAAA
//////////wEICjp+p6dn140TVqeS89lCafzl4n1FauPkt28vUFNlA6TBEEEMsSu
LB8ZgRlfmQRGajnJlI/jC7/yZgvhcVpFiTNMdMe8Nzai9PZ3nFm9zuNraSFT0KmH
fMYqR0AC3zLlITnwoAIhAP////7///////////////9yA99rIcYFK1O79Ak51UEj
AgEBA0IABORbehYxo+ri7OTJWyfgSO/G+6wJxbgD0QHX9CzWPkLMfuPuwUk37z96
TgKmUXK5/h3qUBYxpwA8Ka1T6oOZpw4=`

/**
 * 微信公众号
 */
const publicKey_ggfwxarswx = `MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////v//////////
//////////8AAAAA//////////8wRAQg/////v////////////////////8AAAAA
//////////wEICjp+p6dn140TVqeS89lCafzl4n1FauPkt28vUFNlA6TBEEEMsSu
LB8ZgRlfmQRGajnJlI/jC7/yZgvhcVpFiTNMdMe8Nzai9PZ3nFm9zuNraSFT0KmH
fMYqR0AC3zLlITnwoAIhAP////7///////////////9yA99rIcYFK1O79Ak51UEj
AgEBA0IABNh/XeP/PEd+PXNC5MkUoGKt7u22+IYsJdiBL4L7cNtLXUTrE7Bkgknb
ZJXriD4fD/LpnS4uVlkbb19KffJATWA=`

/**
 * 数据加密
 * @param {Object} parameterObj
 */
function cryptoData(parameterObj, channelCode) {
  //不做任何处理0
  if (reqDataLevel == 0) {
    return parameterObj
  }
  // 获取对应渠道公钥
  let publicKey = ''
  publicKey = publicKey_applet

  //只加密1
  if (reqDataLevel == 1) {
    return encryptedParam(parameterObj, publicKey)
  }
  //既加密  又验签2
  if (reqDataLevel == 2) {
    return encryptedAndSignParam(parameterObj, publicKey, channelCode)
  }
  //加密  验签  时间戳（混合）3
  if (reqDataLevel == 3) {
    return mixParam(parameterObj, publicKey, channelCode)
  }
}

/**
 *  数据解密
= * @param {Object} parameterObj
 */
function decryptedParam(parameterObj) {
  if (reqDataLevel == 1 && parameterObj.resultData.ivKey) {
    if (typeof parameterObj === 'string') {
      Modal.error({
        title: '提示',
        content: '加密只支持对象形式{}',
      })
      return
    }
    const encrypt_data = parameterObj.resultData.data
    let key = Hex.BAtob64(Hex.utf8StrToBytes(encodeURIComponent(parameterObj.resultData.ivKey.substr(0, 16))))
    let data = smUtil.sm4Decrypt(encrypt_data, key, key)
    parameterObj.resultData.data = JSON.parse(data)
  }
  return parameterObj
}

//加密
function encryptedParam(parameterObj, publicKey) {
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
      if (obj != 'channelCode') {
        value = smUtil.sm4Encrypt(value, ivKey)
      }
    }
    newParameterObj[obj] = value
  }
  newParameterObj.ivKey = smUtil.sm2Encrypt(ivKey, publicKey)
  return newParameterObj
}

//加密和验签
function encryptedAndSignParam(parameterObj, publicKey, channelCode) {
  if (typeof parameterObj === 'string') {
    Modal.error({
      title: '提示',
      content: '加密只支持对象形式{}',
    })
    return
  }
  parameterObj = signParam(parameterObj)
  let sign = JSON.stringify(parameterObj)
  //时间戳
  let signTime = Date.now()
  //签名后的内容
  parameterObj.signText = smUtil.md5Encrypt(channelCode + signTime + sign)
  //签名参数
  parameterObj.sign = sign
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
      if (obj != 'channelCode') {
        value = smUtil.sm4Encrypt(value, ivKey)
      }
    }
    newParameterObj[obj] = value
  }
  newParameterObj.signTime = smUtil.sm4Encrypt(signTime, ivKey)
  newParameterObj.ivKey = smUtil.sm2Encrypt(ivKey, publicKey)
  return newParameterObj
}

//加密  加签  时间戳
function mixParam(parameterObj, publicKey, channelCode) {
  if (typeof parameterObj === 'string') {
    Modal.error({
      title: '提示',
      content: '加密只支持对象形式{}',
    })
    return
  }
  parameterObj = signParam(parameterObj)
  let sign = JSON.stringify(parameterObj)
  let signTime = Date.now()
  parameterObj.signText = smUtil.md5Encrypt(channelCode + signTime + sign)
  parameterObj.sign = sign
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
      if (obj != 'channelCode') {
        value = smUtil.sm4Encrypt(value, ivKey)
      }
    }
    newParameterObj[obj] = value
  }
  newParameterObj.signTime = smUtil.sm4Encrypt(signTime, ivKey)
  newParameterObj.ivKey = smUtil.sm2Encrypt(ivKey, publicKey)
  return newParameterObj
}

//验签前处理参数
function signParam(parameterObj) {
  let newParameterObj = {}
  for (let item in parameterObj) {
    if (parameterObj[item] || parameterObj[item] === 0) {
      newParameterObj[item] = parameterObj[item]
    }
  }
  return newParameterObj
}

function getRandomKey() {
  const random = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ]
  let key = ''
  for (let i = 0; i < 16; i++) {
    const index = Math.floor(Math.random() * 62)
    key += random[index]
  }
  return key
}

export default {
  cryptoData,
  decryptedParam,
}
