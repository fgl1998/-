import config from '@/config/index'
/**
 * 从config文件中获取页面配置内容
 * @param {Object} context 身份证号
 */
const getClosePageModule = (context) => {
  const { name } = context.$options
  const { configClosePageModule } = config
  let result = {}
  if (configClosePageModule) {
    const closePageModule = configClosePageModule[name]
    if (closePageModule) {
      result = { ...closePageModule }
    }
  }
  return result
}

export { getClosePageModule }
