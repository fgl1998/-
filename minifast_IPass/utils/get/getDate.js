/**
 * 获取当前时间
 * @param {String} fileds 日期粒度 day（默认）、 month、 year
 */
const getDate = (fileds = 'day') => {
  const date = new Date()
  let str = ''
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  let d = date.getDate()
  if (m < 10) {
    m = '0' + m
  }
  if (d < 10) {
    d = '0' + d
  }
  switch (fileds) {
    case 'day':
      str = `${y}-${m}-${d}`
      break
    case 'month':
      str = `${y}-${m}`
      break
    case 'year':
      str = `${y}`
      break
    case 'yearInterval':
      str = `${y - 1}-${m}-${d}`
      break
    default:
      str = `${y}-${m}-${d}`
      break
  }
  return str
}

export { getDate }
