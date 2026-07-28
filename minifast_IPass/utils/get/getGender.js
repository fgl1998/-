/**
 * 根据身份证号 获取性别
 * @param {String} idCard 身份证号
 */
const getGender = (idCard) => {
    if (!idCard) {
        return '暂无'
    }
    // 格式化身份证的值 去除空格 将 X 转化为 x
    idCard = (idCard + '').trim().toUpperCase()
    let genderStr = '';
    if (parseInt(idCard.slice(-2, -1)) % 2 == 1) {
        genderStr = '男';
    }
    else {
        genderStr = '女';
    }
    return genderStr;
}

export {
    getGender
}