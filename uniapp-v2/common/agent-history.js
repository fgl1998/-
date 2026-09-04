function formatContent(content) {
  if (typeof content === 'string') return content.trim()
  if (content == null) return ''
  if (!Array.isArray(content)) return JSON.stringify(content, null, 2)
  return content.map((block) => {
    if (block && block.type === 'text' && typeof block.text === 'string') return block.text
    return formatContent(block)
  }).filter(Boolean).join('\n').trim()
}

function messageLabel(message) {
  if (message.type === 'human') return '你 · human'
  if (message.type === 'tool') return '工具结果 · tool'
  if (message.type === 'system') return '系统消息 · system'
  if (message.type === 'ai') {
    if (Array.isArray(message.toolCalls) && message.toolCalls.length) return '工具调用 · ai'
    return message.isFinalAnswer ? '最终回答 · ai' : '执行过程 · ai'
  }
  return `消息 · ${message.type || 'unknown'}`
}

function normalizeHistory(result) {
  if (!result || !Array.isArray(result.messages)) {
    throw new Error('历史记录格式异常，请重试')
  }

  // 保留后台返回的每个执行阶段，空文本的工具调用也必须占一条消息。
  return result.messages.map((message, position) => ({ message, position }))
    .filter(({ message }) => message && typeof message === 'object')
    .sort((a, b) => {
      const left = Number.isFinite(a.message.index) ? a.message.index : a.position
      const right = Number.isFinite(b.message.index) ? b.message.index : b.position
      return left - right || a.position - b.position
    })
    .map(({ message, position }) => ({
      // 服务端 ID 可空或包含特殊字符，单独生成适合 scroll-into-view 的 ID。
      id: `history-message-${position}`,
      role: message.type === 'human' ? 'user' : (message.type === 'ai' ? 'assistant' : message.type),
      type: message.type || 'unknown',
      label: messageLabel(message),
      // 保留完整数据，仅把过程消息的详情默认收起。
      collapsed: message.type !== 'human' && !(message.type === 'ai' && message.isFinalAnswer === true && !(Array.isArray(message.toolCalls) && message.toolCalls.length)),
      name: message.name || '',
      toolNames: Array.isArray(message.toolCalls) ? message.toolCalls.map((call) => call && (call.name || (call.function && call.function.name))).filter(Boolean).join('、') : '',
      toolCallId: message.toolCallId || '',
      toolCallsText: Array.isArray(message.toolCalls) && message.toolCalls.length ? JSON.stringify(message.toolCalls, null, 2) : '',
      content: formatContent(message.content) || '（无文本内容）',
      status: 'sent',
      error: '',
    }))
}

module.exports = { normalizeHistory }
