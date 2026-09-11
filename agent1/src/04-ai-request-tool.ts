import 'dotenv/config'

import { z } from 'zod'

import { ChatDeepSeek } from '@langchain/deepseek'

import { HumanMessage } from '@langchain/core/messages'

import { tool } from '@langchain/core/tools'

import {
  START,
  END,
  StateGraph,
  StateSchema,
  MessagesValue,
  type GraphNode,
} from '@langchain/langgraph'


// ==================== 1. 创建模型 ====================

const model = new ChatDeepSeek({
  model: 'deepseek-chat',
  temperature: 0,
})


// ==================== 2. 定义 Tool ====================

const multiplyTool = tool(
  async ({ a, b }) => {
    console.log('multiplyTool 真正执行了')

    return a * b
  },
  {
    name: 'multiply',

    description: '计算两个数字的乘积',

    schema: z.object({
      a: z.number().describe('第一个数字'),
      b: z.number().describe('第二个数字'),
    }),
  }
)


// ==================== 3. 把 Tool 说明交给模型 ====================

const modelWithTools = model.bindTools([
  multiplyTool,
])


// ==================== 4. 定义状态 ====================

const ChatState = new StateSchema({
  messages: MessagesValue,
})


// ==================== 5. 定义 AI 节点 ====================

const agentNode: GraphNode<typeof ChatState> = async state => {
  console.log('进入 agentNode')

  const aiMessage = await modelWithTools.invoke(
    state.messages
  )

  console.log('AI 的普通文本：')
  console.log(aiMessage.content)

  console.log('AI 提出的工具调用：')
  console.dir(aiMessage.tool_calls, {
    depth: null,
  })

  return {
    messages: [aiMessage],
  }
}


// ==================== 6. 创建工作流 ====================

const workflow = new StateGraph(ChatState)
  .addNode('agent', agentNode)
  .addEdge(START, 'agent')
  .addEdge('agent', END)

const graph = workflow.compile()


// ==================== 7. 执行 ====================

async function main() {
  const result = await graph.invoke({
    messages: [
      new HumanMessage(
        '请调用 multiply 工具计算 12 乘以 8'
      ),
    ],
  })

  console.log('最终 messages：')

  result.messages.forEach((message, index) => {
    console.log(`消息 ${index + 1}`)
    console.log('类型：', message.constructor.name)
    console.log('内容：', message.content)
  })
}


main().catch(console.error)