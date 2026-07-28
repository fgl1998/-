const useTMIDCard = (value) => {
  if (!value) {
    return ''
  }
  let len = value.length
  let str =
    value.substr(0, 1) + '*'.repeat(len - 2) + value.substr(len - 1, len)
  return str
}

export { useTMIDCard }
