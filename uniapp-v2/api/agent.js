const { createHttpClient } = require('../common/http')
const { AGENT_BASE_URL } = require('../config/env')

function createAgentApi(client) {
  return {
    history() {
      return client.request('/api/agent/history', {}, { timeout: 30000 })
    },
    chat(message) {
      // 当前接口只接收本次问题，页面里的历史气泡不随请求发送。
      return client.request('/api/agent/chat', { message }, { timeout: 120000 })
    },
  }
}

const agentApi = createAgentApi(createHttpClient({ baseUrl: AGENT_BASE_URL }))

module.exports = {
  createAgentApi,
  ...agentApi,
}
