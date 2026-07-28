/* 注意：vue3.0 不再支持过滤函数 */
import Vue from 'vue'

// 脱敏姓名
Vue.filter('TMUserName', (value) => {
  if (!value) {
    return ''
  }
  let len = value.length
  let str = '*'.repeat(len - 1) + value.substr(len - 1, len)
  return str
})
// 脱敏身份证号
Vue.filter('TMIdcard', (value) => {
  if (!value) {
    return ''
  }
  let len = value.length
  let str =
    value.substr(0, 1) + '*'.repeat(len - 2) + value.substr(len - 1, len)
  return str
})
// 脱敏银行卡卡号
Vue.filter('TMBankCard', (value) => {
  if (!value) {
    return ''
  }
  let len = value.length
  let str =
    value.substr(0, 1) + '*'.repeat(len - 2) + value.substr(len - 1, len)
  return str
})
// 脱敏手机号码
Vue.filter('TMPhone', (value) => {
  if (!value) {
    return ''
  }
  const pat = /(\d{3})\d*(\d{4})/
  const str = value.replace(pat, '$1****$2')
  return str
})

// 格式化年月 将 20213 转化为 2021年07年03月
Vue.filter('FormatYM', function (value) {
  // 如果为空 则返回空字符串
  if (!value) {
    return ''
  }
  let len = value.length
  let y = value.substr(0, 4)
  let m = value.substr(len - 2, len)
  return `${y}年${m}月`
})

export default Vue
