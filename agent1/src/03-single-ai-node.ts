import 'dotenv/config'

import { ChatDeepSeek } from '@langchain/deepseek'

import {
  HumanMessage,
} from '@langchain/core/messages'

import {
  START,
  END,
  StateGraph,
  StateSchema,
  MessagesValue,
  type GraphNode,
} from '@langchain/langgraph'


// 创建模型
const model = new ChatDeepSeek({
  model: 'deepseek-chat',
  temperature: 0,
})


// 定义工作流状态
const ChatState = new StateSchema({
  messages: MessagesValue,
})


// 定义唯一的 AI 节点
const agentNode: GraphNode<typeof ChatState> = async state => {
  console.log('进入 agentNode')

  console.log('节点收到的 messages：')
  console.dir(state.messages, { depth: null })

  // 和前面学过的一模一样
  const aiMessage = await model.invoke(state.messages)

  console.log('AI 返回的 aiMessage：')
  console.dir(aiMessage, { depth: null })

  // 返回“状态更新”
  return {
    messages: [aiMessage],
  }
}


// 创建工作流
const workflow = new StateGraph(ChatState)
  .addNode('agent', agentNode)
  .addEdge(START, 'agent')
  .addEdge('agent', END)


// 编译成可以执行的 graph
const graph = workflow.compile()


async function main() {
  const result = await graph.invoke({
    messages: [
      new HumanMessage('你好，请用一句话介绍你自己'),
    ],
  })

  console.log('工作流最终结果：')

  result.messages.forEach((message, index) => {
    console.log(`消息 ${index + 1}`)
    console.log('类型：', message.constructor.name)
    console.log('内容：', message.content)
  })
}


main().catch(console.error)