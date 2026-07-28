import config from '@/config/index'
/**
 * 从config文件中获取页面分享配置内容
 */
const getShareConfig = (context) => {
  const { name } = context.$options
  const { configSharePages } = config
  let result = null
  if (configSharePages) {
    const shareConfig = configSharePages[name]
    if (shareConfig) {
      result = { ...shareConfig }
    }
  }
  return result
}

export { getShareConfig }
