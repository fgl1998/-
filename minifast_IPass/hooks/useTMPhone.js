const useTMPhone = (value) => {
  if (!value) {
    return ''
  }
  const pat = /(\d{3})\d*(\d{4})/
  const str = value.replace(pat, '$1****$2')
  return str
}

export { useTMPhone }
