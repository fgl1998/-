import config from '@/config/index'
/**
 * 从config文件中获取补贴项目配置内容
 * @param {string} chi031 补贴项目编码
 */
const getDeclareConfig = (chi031) => {
  let result = {}
  const { configDeclarePages } = config
  if (configDeclarePages) {
    const declareConfig = configDeclarePages['declare_' + chi031]
    if (declareConfig) {
      result = { ...declareConfig }
    }
  }
  return result
}

export { getDeclareConfig }
