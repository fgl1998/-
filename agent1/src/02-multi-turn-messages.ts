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


function printMessages(messages: BaseMessage[]) {
  console.log('\n========== 当前 messages ==========')

  messages.forEach((message, index) => {
    console.log(`消息 ${index + 1}`)
    console.log('类型：', message.constructor.name)
    console.log('内容：', message.content)
  })

  console.log('===================================\n')
}


async function main() {
  // 用来保存完整对话
  const messages: BaseMessage[] = []


  // ================= 第一轮 =================

  const firstHumanMessage = new HumanMessage(
    '请记住：我的名字叫小林。你只回复“记住了”'
  )

  // 把用户消息放进对话记录
  messages.push(firstHumanMessage)

  console.log('第一轮调用 AI 之前')
  printMessages(messages)

  // AI 读取当前全部消息
  const firstAiMessage = await model.invoke(messages)

  console.log('第一轮 AI 回答：')
  console.log(firstAiMessage.content)

  // 把 AI 的回答也放进对话记录
  messages.push(firstAiMessage)

  
  // ================= 第二轮 =================

  const secondHumanMessage = new HumanMessage(
    '我叫什么名字？'
  )

  // 把第二轮用户问题放进对话记录
  messages.push(secondHumanMessage)

  console.log('第二轮调用 AI 之前')
  printMessages(messages)

  // 再次把完整消息数组交给 AI
  const secondAiMessage = await model.invoke(messages)

  console.log('第二轮 AI 回答：')
  console.log(secondAiMessage.content)

  // 保存第二轮 AI 回答
  messages.push(secondAiMessage)


  console.log('两轮对话全部完成')
  printMessages(messages)
}


main().catch(console.error)