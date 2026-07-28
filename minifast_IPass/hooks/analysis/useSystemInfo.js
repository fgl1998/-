import { getSystemInfoSync } from '@/utils/uni-api'

const useSystemInfo = () => {
  const systemInfo = getSystemInfoSync()

  console.log(systemInfo, 999)

  return systemInfo
}

export { useSystemInfo }
