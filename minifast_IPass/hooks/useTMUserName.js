const useTMUserName = (value) => {
  if (!value) {
    return ''
  }
  let len = value.length
  let str = ''
  if (len == 2) {
    str = value.substring(0, 1) + '*'
  } else if (len == 3) {
    str = value.substring(0, 1) + '*' + value.substring(2, 3)
  } else if (len > 3) {
    str = value.substring(0, 1) + '*' + '*' + value.substring(3, len)
  }

  return str
}

export { useTMUserName }
