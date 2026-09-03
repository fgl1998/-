const BASE_URL = 'http://127.0.0.1:3000'
const AGENT_BASE_URL = 'http://127.0.0.1:3002'

// 真机联调时把两个地址都改为开发机的局域网 IP，分别保留业务和 Agent 的端口。
module.exports = {
  BASE_URL,
  AGENT_BASE_URL,
}
