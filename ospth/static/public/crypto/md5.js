import CryptoJS from 'crypto-js';
/**
 * rsa 签名
 * @param data 明文
 * @return  密文 hex
 * */
function md5Sign(data) {
    try {
        let rs = CryptoJS.MD5(data).toString();
        return rs;
    }
    catch (e) {
        return false;
    }
}
//console.log('MD5 hash测试:md5Sign("银海")', md5Sign("银海"))
export default {
    md5Sign
};
