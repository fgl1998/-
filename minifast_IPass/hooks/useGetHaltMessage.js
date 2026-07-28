import { requestB257 } from '@/service/api'
import { showModal } from '@/utils/uni-api'
const useGetHaltMessage = () => {
  requestB257().then((res) => {
    const { ht58_msg = '' } = res
    if (ht58_msg) {
      const msg = ht58_msg.replaceAll('br', '\r\n')
      showModal(msg, '温馨提示')
    }
  })
}

export { useGetHaltMessage }
