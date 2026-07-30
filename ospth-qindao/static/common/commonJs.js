import { Decimal, } from 'decimal.js'
export default {
  // 敏感数据的处理
  // 15812342345 =》158****2345
  format (start, end, value) {
    start = Number(start)
    end = Number(end)
    if (value && value.length < 2) {
      return value
    }
    if (value && start + end >= value.length) {
      const desensitizedLength = Math.floor(value.length / 2)
      const startNum = Math.floor((value.length - desensitizedLength) / 2)
      const endNum = value.length - startNum - desensitizedLength
      const startStr = value.slice(0, startNum)
      const endStr = value.split('').reverse().join('').slice(0, endNum).split('').reverse().join('')
      const fillStr = new Array(value.length - endNum - startNum).fill('*').join('')
      return startStr + fillStr + endStr
    }
    if (value) {
      const startStr = value.slice(0, start)
      const endStr = value.split('').reverse().join('').slice(0, end).split('').reverse().join('')
      const fillStr = new Array(value.length - end - start).fill('*').join('')
      return startStr + fillStr + endStr
    } else {
      return '--'
    }
  },
  
  /**
     * 带小数进行计算
     * @param numArr 需要计算的数字组成的数组,
     * @param type 需要计算的数字组成的数组
     * @returns  相加后的计算结果
     */
    calculateMoney (numArr = [0, 0], type = '+') {
      if (Object.prototype.toString.call([]) !== '[object Array]' || numArr.length === 0) {
        return '0.00'
      }
      let sum = 0
      if (type === '+') {
        for (let i = 0; i < numArr.length; i++) {
          if (numArr[i]) {
            numArr[i] = (numArr[i] + '').replace(/,/g, '')
            sum = new Decimal(sum).add(new Decimal(numArr[i])).toNumber()
          }
        }
        return sum
      }
  
      if (numArr.length !== 2) {
        return '0.00'
      }
      if (!numArr[0] && numArr[0] !== 0 || !numArr[1] && numArr[1] !== 0) {
        return '0.00'
      }
      numArr[0] = (numArr[0] + '').replace(/,/g, '')
      numArr[1] = (numArr[1] + '').replace(/,/g, '')
      sum = new Decimal(numArr[0]).sub(new Decimal(numArr[1])).toNumber()
      return sum
    },
  // 问好提示语
  getTheSayHello (date) {
    let text = ''
    if (date > 5 && (date < 11 || date === 11)) {
      text = '早上好'
    } else if (date > 11 && (date < 1 || date === 1)) {
      text = '中午好'
    } else if (date > 1 && (date < 18 || date === 18)) {
      text = '下午好'
    } else {
      text = '晚上好'
    }
    return text
  },

  maskIdCard (id) {
    if (!id || id.length !== 18) {
      return ''
    }
    return `${id.slice(0, 6)}********${id.slice(-4)}`
  },
  isValidIDCard (id) {
    // 1. 长度校验
    if (id.length !== 15 && id.length !== 18) {
      return false
    }

    // 2. 格式校验
    const regex = /^\d{17}(\d|X)$/ // 18位身份证正则
    if (id.length === 18 && !regex.test(id)) {
      return false
    }
    if (id.length === 15 && !/^\d{15}$/.test(id)) {
      return false
    }

    // 3. 校验位计算（仅适用于18位身份证）
    if (id.length === 18) {
      const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      const checkDigits = '10X98765432'
      let sum = 0

      for (let i = 0; i < 17; i++) {
        sum += parseInt(id[i]) * weights[i]
      }

      const checkIndex = sum % 11
      const checkDigit = checkDigits[checkIndex]

      return checkDigit === id[17].toUpperCase()
    }

    return true // 15位身份证直接返回true
  },
  validateID (id, callback) {
    // 1 "验证通过!", 0 //校验不通过 // id为身份证号码
    const format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/
    // 号码规则校验
    if (!format.test(id)) {
      callback('请输入正确的18位二代身份证号码')
      return
    }
    // 区位码校验
    // 出生年月日校验  前正则限制起始年份为1900;
    const year = id.substr(6, 4); const // 身份证年
      month = id.substr(10, 2); const // 身份证月
      date = id.substr(12, 2); const // 身份证日
      time = Date.parse(month + '-' + date + '-' + year); const // 身份证日期时间戳date
      now_time = Date.parse(new Date()); const // 当前时间戳
      dates = (new Date(year, month, 0)).getDate()// 身份证当月天数
    if (time > now_time || date > dates) {
      callback('请输入正确的18位二代身份证号码')
      return
    }
    // 校验码判断
    const c = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 系数
    const b = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'] // 校验码对照表
    const id_array = id.split('')
    let sum = 0
    for (let k = 0; k < 17; k++) {
      sum += parseInt(id_array[k], 10) * parseInt(c[k], 10)
    }
    if (id_array[17].toUpperCase() !== b[sum % 11].toUpperCase()) {
      callback('请输入正确的18位二代身份证号码')
      return
    }
    callback()
  },
  validate15ID (id, callback) {
    // 1 "验证通过!", 0 //校验不通过 // id为身份证号码
    const format = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/
    // 号码规则校验
    if (!format.test(id)) {
      callback('请输入正确的15位身份证号码')
      return
    }
    callback()
  },
  /**
   * 用于 指定长度 触发校验
   * reg:校验规则 (当校验18位身份证时正则表达式可传空字符串)
   * length: 校验长度（多少个字符时校验）
   * text1: 长度满足时的校验错误提示
   * text2: 长度不满足时的校验错误提示
   * */
  fnValidate (rule, value, callback, reg, length, text1, text2) {
    if (value !== undefined && value !== '') {
      if (length === 18) {
        this.validateID(value, callback)
        return
      }
      if (length === 15) {
        this.validate15ID(value, callback)
        return
      }
      callback(text1)
    } else {
      callback()
    }
  },
}
