import SM3 from '../sm3'
const { BigInteger } = require('./jsbn')
const {ECCurveFp} = require('./ec')

const C1C2C3 = 0

/**
 * 转成字节数组
 */
function hexToArray(hexStr) {
  const words = []
  let hexStrLength = hexStr.length

  if (hexStrLength % 2 !== 0) {
    hexStr = leftPad(hexStr, hexStrLength + 1)
  }

  hexStrLength = hexStr.length

  for (let i = 0; i < hexStrLength; i += 2) {
    words.push(parseInt(hexStr.substr(i, 2), 16))
  }
  return words
}

/**
 * 补全16进制字符串
 */
function leftPad(input, num) {
  if (input.length >= num) return input
  return (new Array(num - input.length + 1)).join('0') + input
}

/**
 * 转成16进制串
 */
function arrayToHex(arr) {
  return arr.map(item => {
    item = item.toString(16)
    return item.length === 1 ? '0' + item : item
  }).join('')
}

/**
 * 获取公共椭圆曲线
 */
function getGlobalCurve() {
  return generateEcparam().curve
}

/**
 * 生成ecparam
 */
function generateEcparam() {
  // 椭圆曲线
  const p = new BigInteger('FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000FFFFFFFFFFFFFFFF', 16)
  const a = new BigInteger('FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000FFFFFFFFFFFFFFFC', 16)
  const b = new BigInteger('28E9FA9E9D9F5E344D5A9E4BCF6509A7F39789F515AB8F92DDBCBD414D940E93', 16)
  const curve = new ECCurveFp(p, a, b)

  // 基点
  const gxHex = '32C4AE2C1F1981195F9904466A39C9948FE30BBFF2660BE1715A4589334C74C7'
  const gyHex = 'BC3736A2F4F6779C59BDCEE36B692153D0A9877CC62A474002DF32E52139F0A0'
  const G = curve.decodePointHex('04' + gxHex + gyHex)

  const n = new BigInteger('FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFF7203DF6B21C6052B53BBF40939D54123', 16)

  return {curve, G, n}
}

/**
 * 转成utf8串
 */
function arrayToUtf8(arr) {
  const words = []
  let j = 0
  for (let i = 0; i < arr.length * 2; i += 2) {
    words[i >>> 3] |= parseInt(arr[j], 10) << (24 - (i % 8) * 4)
    j++
  }

  try {
    const latin1Chars = []

    for (let i = 0; i < arr.length; i++) {
      const bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
      latin1Chars.push(String.fromCharCode(bite))
    }

    return decodeURIComponent(escape(latin1Chars.join('')))
  } catch (e) {
    throw new Error('Malformed UTF-8 data')
  }
}

function doDecrypt(encryptData, privateKey, cipherMode = 1, {
  output = 'string',
} = {}) {
  privateKey = new BigInteger(privateKey, 16)
  if(encryptData.startsWith('04')) {
    encryptData = encryptData.substring(2)
  }
  let c3 = encryptData.substr(128, 64)
  let c2 = encryptData.substr(128 + 64)

  if (cipherMode === C1C2C3) {
    c3 = encryptData.substr(encryptData.length - 64)
    c2 = encryptData.substr(128, encryptData.length - 128 - 64)
  }

  const msg = hexToArray(c2)
  const c1 = getGlobalCurve().decodePointHex('04' + encryptData.substr(0, 128))

  const p = c1.multiply(privateKey)
  const x2 = hexToArray(leftPad(p.getX().toBigInteger().toRadix(16), 64))
  const y2 = hexToArray(leftPad(p.getY().toBigInteger().toRadix(16), 64))

  let ct = 1
  let offset = 0
  let t = [] // 256 位
  const z = [].concat(x2, y2)
  const nextT = () => {
    // (1) Hai = hash(z || ct)
    // (2) ct++
    t = sm3([...z, ct >> 24 & 0x00ff, ct >> 16 & 0x00ff, ct >> 8 & 0x00ff, ct & 0x00ff])
    ct++
    offset = 0
  }
  nextT() // 先生成 Ha1

  for (let i = 0, len = msg.length; i < len; i++) {
    // t = Ha1 || Ha2 || Ha3 || Ha4
    if (offset === t.length) nextT()

    // c2 = msg ^ t
    msg[i] ^= t[offset++] & 0xff
  }

  // c3 = hash(x2 || msg || y2)
  const checkC3 = arrayToHex(sm3([].concat(x2, msg, y2)))

  if (checkC3 === c3.toLowerCase()) {
    return output === 'array' ? msg : arrayToUtf8(msg)
  } else {
    return output === 'array' ? [] : ''
  }
}

function sm3(data) {
  const sm3 = new SM3()
  sm3.update(data, 0, data.length)// 数据很多的话，可以分多次update
  return sm3.doFinal()// 得到的数据是个byte数组
}

export default doDecrypt;
