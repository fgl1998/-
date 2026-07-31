import Hex from './hex'
import SM4 from './sm4'
import SM2 from './sm2'
import MD5 from './md5'

/**
 * sm4加密
 * @param data 明文
 * @param keyStr 秘钥key base64
 * @param ivStr iv base64
 * @return  base64格式
 * */
function sm4Encrypt (data, rk) {
	var keyStr = Hex.BAtob64(Hex.utf8StrToBytes(encodeURIComponent(rk.substr(0, 16))))
    let value = Hex.utf8StrToBytes(data) // uft-8=>编码=>byte
    let key = Hex.b64toBA(keyStr)
    let sm4 = new SM4()
    // 入参全部为byte 返回的值为byte
    let rs = sm4.encrypt_cbc(key, key, value)
    return Hex.BAtob64(rs)
}
/**
 * sm4 解密
 * @param data 密文
 * @param keyStr 秘钥key base64
 * @param ivStr iv base64
 * @return  明文
 * */
function sm4Decrypt (data, keyStr, ivStr) {
    let value = Hex.b64toBA(data)
    let key = Hex.b64toBA(keyStr)
    let iv = Hex.b64toBA(ivStr)
    let sm4 = new SM4()
    let rs = sm4.decrypt_cbc(key, iv, value)
    return Hex.bytesToUtf8Str(rs)
}

/**
 * sm2加密
 * @param data 明文
 * @param pubKey 公钥 base64
 * @return  密文 base64
 * */
function sm2Encrypt (data, pubKey) {
    let pk= Hex.b64tohex(pubKey)
    // 获取加密过后的密文
    const rs = SM2(data, pk, 0);
    return Hex.hextob64(rs)
}

/**
 * md5加密
 * @param data 明文
 * @return  密文
 * */
function md5Encrypt (data) {
	return MD5.md5Sign(data)
}

function test () {
  let key = 'xi68urbYpXnSlj2RLxHsug=='
  let iv = 'xi68urbYpXnSlj2RLxHsug=='
  let value = '银海'
  let pubKey = "BDs0bYE6n6+0IAhLeWqdpHRou1hnlLZZ8OVvHFTjbWYWj1gysKYKw+IBCOgZ5UOsCNdAOP0aTzWuuA1XWhvq19E="
}

// test()

export default {
  sm4Encrypt,
  sm4Decrypt,
  sm2Encrypt,
  md5Encrypt
}
