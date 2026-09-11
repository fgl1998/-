import 'dotenv/config'

import { ChatDeepSeek } from '@langchain/deepseek'

import {
  HumanMessage,
  type BaseMessage,
} from '@langchain/core/messages'


const model = new ChatDeepSeek({
  model: 'deepseek-chat',
  temperature: 0,
})


async function main() {
  // ① 创建一条用户消息
  const humanMessage = new HumanMessage(
    '你好，请用一句话介绍你自己'
  )

  // ② 准备交给 AI 的消息数组
  const messages: BaseMessage[] = [
    humanMessage,
  ]

  console.log('调用 AI 之前：')
  console.dir(messages, { depth: null })

  // ③ 把完整的 messages 交给 AI
  const aiMessage = await model.invoke(messages)

  console.log('AI 返回的消息：')
  console.dir(aiMessage, { depth: null })

  console.log('AI 回答的正文：')
  console.log(aiMessage.content)

  // ④ 注意：model.invoke 不会修改原数组
  console.log('调用结束后 messages 长度：')
  console.log(messages.length) // 仍然是 1

  // ⑤ 如果需要保存 AI 回答，要自己追加
  messages.push(aiMessage)

  console.log('手动追加后 messages：')
  console.dir(messages, { depth: null })
}

main().catch(console.error)