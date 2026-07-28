/**
 * 根据身份证号 获取出生日期
 * @param {String} idCard 身份证号
 */
const getBirthday = (idCard) => {
    if (!idCard) {
        return '暂无'
    }
    // 格式化身份证的值 去除空格 将 X 转化为 x
    idCard = (idCard + '').trim().toUpperCase()
    const len = idCard.length

    let birthday = "";
    if (len === 15) {
        birthday = "19" + idCard.slice(6, 12);
    } else if (len === 18) {
        birthday = idCard.slice(6, 14);
    }
    birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
    // 通过正则表达式来指定输出格式为: 1990-01-01	
    return birthday;
}

export {
    getBirthday
}