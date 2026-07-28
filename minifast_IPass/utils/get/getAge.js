/**
 * 根据身份证号 获取年龄
 * @param {String} idCard 身份证号
 */
const getAge = (idCard) => {
    if (!idCard) {
        return '暂无'
    }
    // 格式化身份证的值 去除空格 将 X 转化为 x
    idCard = (idCard + '').trim().toUpperCase()
    const len = idCard.length
    if (len == 0) {
        return 0
    } else {
        if (len != 15 && len != 18) {
            // 身份证号码只能为15位或18位其它不合法
            return 0
        }
    }
    let strBirthday = ''
    if (len == 18) {
        // 处理18位的身份证号码从号码中得到生日和性别代码
        strBirthday =
            idCard.substr(6, 4) +
            '/' +
            idCard.substr(10, 2) +
            '/' +
            idCard.substr(12, 2)
    }
    if (len == 15) {
        strBirthday =
            '19' +
            idCard.substr(6, 2) +
            '/' +
            idCard.substr(8, 2) +
            '/' +
            idCard.substr(10, 2)
    }
    // 时间字符串里，必须是“/”
    let birthDate = new Date(strBirthday)
    let nowDateTime = new Date()
    let age = nowDateTime.getFullYear() - birthDate.getFullYear()
    // 再考虑月、天的因素; .getMonth()获取的是从0开始的，这里进行比较，不需要加1
    if (
        nowDateTime.getMonth() < birthDate.getMonth() ||
        (nowDateTime.getMonth() == birthDate.getMonth() &&
            nowDateTime.getDate() < birthDate.getDate())
    ) {
        age--
    }
    return age
}

export {
    getAge
}