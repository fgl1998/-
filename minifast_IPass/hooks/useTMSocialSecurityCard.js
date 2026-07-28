const useTMSocialSecurityCard = (value) => {
  if (!value) {
    return ''
  }
  const pat = /^(.{3}).+(.)/
  const str = value.replace(pat, '$1*****$2')
  return str
}

export { useTMSocialSecurityCard }
